// Imports the quran.tech sources sheet (CSV export) as published resources, or rolls that import back.
//
//   pnpm payload run scripts/import-sheet.ts -- --file sheet.csv --dry-run
//   pnpm payload run scripts/import-sheet.ts -- --file sheet.csv
//   pnpm payload run scripts/import-sheet.ts -- --rollback
//
// The `--` matters: `payload run` drops flags that come before it.
import { readFileSync } from 'node:fs'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { parseCliArgs } from '../src/lib/sheetImport/cliArgs'
import { importSheet, rollbackImport } from '../src/lib/sheetImport/importSheet'
import { parseSheet } from '../src/lib/sheetImport/parse'
import { mapResourceType } from '../src/lib/sheetImport/typeMap'

const values = parseCliArgs(process.argv.slice(2))

const payload = await getPayload({ config })

if (values.rollback) {
  const { deleted, archived } = await rollbackImport(payload)
  console.log(`Rollback: deleted ${deleted}, archived ${archived.length} (still referenced by comments, access requests, reports or API keys; id and old sheet_id below)`)
  if (archived.length) console.log(archived.map((a) => `${a.id}\t${a.sheet_id}`).join('\n'))
} else {
  if (!values.file) throw new Error('Pass --file <csv>, or --rollback')
  const rows = parseSheet(readFileSync(values.file, 'utf8'))

  const table: Record<string, { type: string; rows: number }> = {}
  for (const row of rows) {
    const pair = `${row.content_domain_en} | ${row.resource_type_en}`
    table[pair] ??= { type: mapResourceType(row), rows: 0 }
    table[pair].rows++
  }
  console.table(table)

  const result = await importSheet(payload, rows, { dryRun: values['dry-run'] })
  console.log(`${values['dry-run'] ? 'Dry run (nothing written)' : 'Imported'}: ${rows.length} rows`, result)
}
