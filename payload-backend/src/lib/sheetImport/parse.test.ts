import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { cleanCell, parseSheet, splitMulti } from './parse'

const fixture = readFileSync(new URL('./__fixtures__/sheet.csv', import.meta.url), 'utf8')

describe('cleanCell', () => {
  it.each(['Not stated', 'Not available', 'Not applicable', 'To be completed', 'Not specified', '  Not stated  '])(
    'turns placeholder %j into null',
    (v) => expect(cleanCell(v)).toBeNull(),
  )

  it('keeps real values trimmed', () => {
    expect(cleanCell('  MIT ')).toBe('MIT')
  })

  it('turns empty into null', () => {
    expect(cleanCell('')).toBeNull()
  })
})

describe('splitMulti', () => {
  it('splits on comma and semicolon and trims', () => {
    expect(splitMulti('Arabic, Urdu; English')).toEqual(['Arabic', 'Urdu', 'English'])
  })

  it('returns [] for placeholders', () => {
    expect(splitMulti('Not stated')).toEqual([])
  })

  it('does not split inside parentheses', () => {
    expect(splitMulti('Turkish (tr, left-to-right), Arabic')).toEqual(['Turkish (tr, left-to-right)', 'Arabic'])
  })
})

describe('parseSheet', () => {
  it('reads all 246 fixture rows keyed by header', () => {
    const rows = parseSheet(fixture)
    expect(rows).toHaveLength(246)
    expect(rows[0]).toHaveProperty('name_en')
  })

  it('has a unique id per row', () => {
    const ids = parseSheet(fixture).map((r) => r.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('handles quoted commas, doubled quotes and newlines', () => {
    const rows = parseSheet('id,name_en\n1,"a, ""b""\nc"\n2,d\n', ['id', 'name_en'])
    expect(rows).toEqual([
      { id: '1', name_en: 'a, "b"\nc' },
      { id: '2', name_en: 'd' },
    ])
  })

  it('fails fast naming the missing column', () => {
    expect(() => parseSheet('id,name_en\n1,a\n', ['id', 'name_ar'])).toThrow(/name_ar/)
  })
})
