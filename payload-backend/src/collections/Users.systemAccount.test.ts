import { describe, expect, it } from 'vitest'
import { Users } from './Users'

type F = { name?: string; type?: string; access?: { create?: (a: unknown) => boolean; update?: (a: unknown) => boolean } }
const field = (Users.fields as F[]).find((f) => f.name === 'system_account')

describe('Users.system_account', () => {
  it('is a checkbox only admins can set, so a public sign-up can never claim an importer account', () => {
    expect(field?.type).toBe('checkbox')
    for (const op of ['create', 'update'] as const) {
      expect(field?.access?.[op]?.({ req: { user: { role: 'admin' } } })).toBe(true)
      expect(field?.access?.[op]?.({ req: { user: { role: 'publisher' } } })).toBe(false)
      expect(field?.access?.[op]?.({ req: {} })).toBe(false)
    }
  })
})
