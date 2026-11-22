import { describe, expect, it } from 'vitest'
import { shortDescription } from './shortDescription'

describe('shortDescription', () => {
  it('returns the first sentence', () => {
    expect(shortDescription('First one. Second one.')).toBe('First one.')
  })

  it('stops at the Arabic question mark', () => {
    expect(shortDescription('ما هذا؟ نص آخر.')).toBe('ما هذا؟')
  })

  it('does not split on a dot inside a version or abbreviation', () => {
    expect(shortDescription('Uses v1.5 of the font. More text.')).toBe('Uses v1.5 of the font.')
  })

  it('keeps text without a terminator whole and collapses whitespace', () => {
    expect(shortDescription('one\n  two')).toBe('one two')
  })

  it('keeps a text of exactly 160 characters unchanged', () => {
    const text = 'a'.repeat(160)
    expect(shortDescription(text)).toBe(text)
  })

  it('cuts a long sentence at a word boundary, within 160 characters, with an ellipsis', () => {
    const text = 'abcdefghi '.repeat(40).trim()
    const out = shortDescription(text)
    expect(out.length).toBeLessThanOrEqual(160)
    expect(out.endsWith('…')).toBe(true)
    const body = out.slice(0, -1)
    expect(text.startsWith(body)).toBe(true)
    expect(text[body.length]).toBe(' ')
  })

  it('hard-cuts a single word longer than the limit', () => {
    const out = shortDescription('x'.repeat(200))
    expect(out).toHaveLength(160)
    expect(out.endsWith('…')).toBe(true)
  })

  it('returns an empty string for empty input', () => {
    expect(shortDescription('  ')).toBe('')
  })
})
