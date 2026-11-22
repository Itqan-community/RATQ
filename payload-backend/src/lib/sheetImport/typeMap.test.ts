import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { RESOURCE_TYPES } from '../../collections/Resources'
import { parseSheet } from './parse'
import { mapResourceType } from './typeMap'

const rows = parseSheet(readFileSync(new URL('./__fixtures__/sheet.csv', import.meta.url), 'utf8'))

describe('mapResourceType', () => {
  it('maps every fixture row onto a RESOURCE_TYPES value', () => {
    expect(rows).toHaveLength(246)
    for (const row of rows) expect(RESOURCE_TYPES).toContain(mapResourceType(row))
  })

  // Pins the current mapping table, which the user has not yet approved: a remap changes these counts on purpose and must be re-confirmed.
  it('maps the 246 fixture rows to the expected count per type', () => {
    const counts: Record<string, number> = {}
    for (const row of rows) counts[mapResourceType(row)] = (counts[mapResourceType(row)] ?? 0) + 1
    expect(counts).toEqual({
      translation: 160, tafsir: 32, linguistic: 10, program: 9, dataset: 8, api: 8,
      mushaf: 6, recitation: 5, font: 4, tajweed: 3, search: 1,
    })
  })

  it('maps the common API pairs by content domain', () => {
    const pair = (content_domain_en: string, resource_type_en: string) =>
      mapResourceType({ id: 'x', content_domain_en, resource_type_en })
    expect(pair("Translation of the Quran's meanings", 'API (REST)')).toBe('translation')
    expect(pair('Tafsir', 'API (REST)')).toBe('tafsir')
    expect(pair('Tajweed', 'API (REST)')).toBe('tajweed')
    expect(pair('Arabic fonts', 'Fonts')).toBe('font')
  })

  it('throws naming the sheet id for an unknown pair', () => {
    expect(() =>
      mapResourceType({ id: 'S-999', content_domain_en: 'Astrology', resource_type_en: 'API (REST)' }),
    ).toThrow(/S-999/)
  })
})
