export type SheetRow = Record<string, string>

// Cells the sheet uses for "no data". Stored as empty, never as text. "Not required" (authentication) is a real answer, so it is not listed.
const PLACEHOLDERS = new Set([
  'not stated', 'not available', 'not applicable', 'to be completed', 'not specified',
  'غير مذكورة', 'غير مذكور', 'غير متوفر', 'غير منطبق', 'يُستكمل', 'غير محدد',
])

// Columns the importer reads; a sheet missing any of them is the wrong shape and must not be imported.
export const REQUIRED_COLUMNS = [
  'id', 'source_ar', 'source_en', 'name_ar', 'name_en', 'description_ar', 'description_en', 'main_url',
  'resource_type_en', 'content_domain_en', 'has_api_en', 'status_en', 'license_ar', 'license_en',
]

export function cleanCell(value: string): string | null {
  const v = value.trim()
  return v === '' || PLACEHOLDERS.has(v.toLowerCase()) ? null : v
}

// Splits on , ; and the Arabic comma, but not inside parentheses ("Turkish (tr, left-to-right)").
export function splitMulti(value: string): string[] {
  const v = cleanCell(value)
  if (!v) return []
  const out: string[] = []
  let depth = 0
  let cur = ''
  for (const ch of v) {
    if (ch === '(') depth++
    if (ch === ')') depth = Math.max(0, depth - 1)
    if (depth === 0 && (ch === ',' || ch === ';' || ch === '،')) {
      out.push(cur)
      cur = ''
    } else cur += ch
  }
  out.push(cur)
  return out.map((s) => s.trim()).filter(Boolean)
}

// RFC 4180: quoted fields may hold commas, doubled quotes and newlines.
function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let cur = ''
  let quoted = false
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { cur += '"'; i++ }
      else if (ch === '"') quoted = false
      else cur += ch
    } else if (ch === '"') quoted = true
    else if (ch === ',') { row.push(cur); cur = '' }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++
      row.push(cur); rows.push(row); row = []; cur = ''
    } else cur += ch
  }
  if (cur !== '' || row.length) { row.push(cur); rows.push(row) }
  return rows
}

export function parseSheet(csv: string, required: string[] = REQUIRED_COLUMNS): SheetRow[] {
  const [header, ...body] = parseCsv(csv.replace(/^﻿/, ''))
  const missing = required.filter((c) => !header?.includes(c))
  if (missing.length) throw new Error(`Sheet is missing column(s): ${missing.join(', ')}`)
  return body
    .filter((cells) => cells.some((c) => c.trim() !== ''))
    .map((cells) => Object.fromEntries(header.map((h, i) => [h, cells[i] ?? ''])))
}
