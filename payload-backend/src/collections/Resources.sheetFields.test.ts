import { describe, expect, it } from 'vitest'
import { RESOURCE_TYPES, Resources, slugify } from './Resources'

type F = {
  name?: string
  type?: string
  required?: boolean
  unique?: boolean
  index?: boolean
  options?: Array<string | { value: string }>
  validate?: (value: unknown) => true | string
  access?: { create?: (a: unknown) => boolean; update?: (a: unknown) => boolean }
}
const fields = Resources.fields as F[]
const field = (name: string) => fields.find((f) => f.name === name)

const URL_FIELDS = [
  'website_url',
  'base_url',
  'api_key_url',
  'playground_url',
  'download_url',
  'repository',
]
const TWINNED = [
  'name',
  'description',
  'short_description',
  'content_domain',
  'riwayah',
  'smallest_unit',
  'query_units',
  'numbering_reference',
  'authentication',
  'rate_limits',
  'license',
  'attribution',
  'scholarly_review',
]
const PLAIN = [
  'sheet_id',
  'sample_request',
  'source_status',
  'source_type',
  'source_last_updated',
  'verified_on',
]

describe('Resources sheet-import fields', () => {
  it('exports RESOURCE_TYPES and slugify for the importer', () => {
    expect(RESOURCE_TYPES).toContain('tafsir')
    expect(slugify('  Quran Tech!  ')).toBe('quran-tech')
  })

  it.each([...PLAIN, ...URL_FIELDS, ...TWINNED.map((n) => `${n}_en`), 'content_domain', 'riwayah', 'smallest_unit', 'query_units', 'numbering_reference', 'authentication', 'rate_limits', 'attribution', 'scholarly_review'])(
    '%s exists and is optional',
    (name) => {
      expect(field(name)).toBeDefined()
      expect(field(name)?.required).toBeFalsy()
    },
  )

  it('sheet_id is unique and indexed', () => {
    expect(field('sheet_id')).toMatchObject({ unique: true, index: true })
  })

  it.each(['languages', 'tags', 'data_formats'])('%s is a json field', (name) => {
    expect(field(name)?.type).toBe('json')
  })

  it.each(['languages', 'tags', 'data_formats'])('%s validate_ArrayOfShortStrings_OnlyAccepted', (name) => {
    const validate = field(name)!.validate!
    for (const ok of [null, undefined, [], ['ar', 'en'], Array(100).fill('x'), ['x'.repeat(200)]]) {
      expect(validate(ok)).toBe(true)
    }
    for (const bad of ['ar', 5, { a: 1 }, [1], [{ a: 1 }], [['x']], [null], Array(101).fill('x'), ['x'.repeat(201)]]) {
      expect(validate(bad)).not.toBe(true)
    }
  })

  it('license is no longer required but stays a field', () => {
    expect(field('license')).toBeDefined()
    expect(field('license')?.required).toBeFalsy()
  })

  it.each(URL_FIELDS)('%s rejects javascript: and accepts https', (name) => {
    const validate = field(name)!.validate!
    expect(validate('javascript:alert(1)')).not.toBe(true)
    expect(validate('ftp://example.com')).not.toBe(true)
    expect(validate('not a url')).not.toBe(true)
    expect(validate('https://example.com/x')).toBe(true)
    expect(validate('')).toBe(true)
    expect(validate(undefined)).toBe(true)
  })

  // Provenance is importer-owned: only admins (or the importer, via overrideAccess) may write it.
  it.each(['sheet_id', 'verified_on', 'source_status', 'source_type', 'source_last_updated', 'scholarly_review', 'scholarly_review_en', 'attribution', 'attribution_en'])(
    '%s is writable by admins only',
    (name) => {
      const { access } = field(name)!
      const as = (role: string) => ({ req: { user: { role } } })
      for (const op of ['create', 'update'] as const) {
        expect(access?.[op]?.(as('admin'))).toBe(true)
        expect(access?.[op]?.(as('publisher'))).toBe(false)
        expect(access?.[op]?.({ req: {} })).toBe(false)
      }
    },
  )

  it('has_api offers yes/no/planned/iframe', () => {
    const values = (field('has_api')?.options ?? []).map((o) => (typeof o === 'string' ? o : o.value))
    expect(values).toEqual(['yes', 'no', 'planned', 'iframe'])
  })
})
