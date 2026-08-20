import { describe, expect, it } from 'vitest'

import { Announcements } from './Announcements'

interface ReqUser {
  id: number
  role?: string
}

interface AccessArgs {
  req: { user: ReqUser | null }
}

function makeReq(user: ReqUser | null): AccessArgs {
  return { req: { user } }
}

describe('Announcements read access', () => {
  const readAccess = Announcements.access!.read as (args: AccessArgs) => unknown

  it('public unauthenticated readers only see active, non-expired announcements', () => {
    const result = readAccess(makeReq(null)) as { and: Record<string, unknown>[] }
    const activeFilter = result.and.find((c) => 'is_active' in c)
    expect(activeFilter).toEqual({ is_active: { equals: true } })
  })

  it('filters out expired announcements (only future expires_at allowed)', () => {
    const result = readAccess(makeReq(null)) as { and: Record<string, unknown>[] }
    const expiryFilter = result.and.find((c) => 'or' in c) as { or: Record<string, unknown>[] }
    expect(expiryFilter.or).toContainEqual({
      expires_at: { greater_than: expect.any(String) },
    })
  })

  it('allows announcements with no expires_at (never expiring)', () => {
    const result = readAccess(makeReq(null)) as { and: Record<string, unknown>[] }
    const expiryFilter = result.and.find((c) => 'or' in c) as { or: Record<string, unknown>[] }
    expect(expiryFilter.or).toContainEqual({ expires_at: { exists: false } })
  })

  it('admin sees any announcement regardless of active/expiry state', () => {
    const result = readAccess(makeReq({ id: 99, role: 'admin' }))
    expect(result).toBe(true)
  })

  it('non-admin authenticated readers are scoped like public readers', () => {
    const result = readAccess(makeReq({ id: 1, role: 'developer' }))
    expect(result).toEqual(expect.objectContaining({ and: expect.any(Array) }))
  })
})

describe('Announcements create access', () => {
  const createAccess = Announcements.access!.create as (args: AccessArgs) => unknown

  it('denies unauthenticated callers', () => {
    expect(createAccess(makeReq(null))).toBe(false)
  })

  it('denies non-admin authenticated users', () => {
    expect(createAccess(makeReq({ id: 1, role: 'developer' }))).toBe(false)
    expect(createAccess(makeReq({ id: 2, role: 'publisher' }))).toBe(false)
  })

  it('allows an admin', () => {
    expect(createAccess(makeReq({ id: 99, role: 'admin' }))).toBe(true)
  })
})

describe('Announcements update access', () => {
  const updateAccess = Announcements.access!.update as (args: AccessArgs) => unknown

  it('denies unauthenticated callers', () => {
    expect(updateAccess(makeReq(null))).toBe(false)
  })

  it('denies non-admin authenticated users', () => {
    expect(updateAccess(makeReq({ id: 1, role: 'developer' }))).toBe(false)
    expect(updateAccess(makeReq({ id: 2, role: 'publisher' }))).toBe(false)
  })

  it('allows an admin', () => {
    expect(updateAccess(makeReq({ id: 99, role: 'admin' }))).toBe(true)
  })
})

describe('Announcements delete access', () => {
  const deleteAccess = Announcements.access!.delete as (args: AccessArgs) => unknown

  it('denies unauthenticated callers', () => {
    expect(deleteAccess(makeReq(null))).toBe(false)
  })

  it('denies non-admin authenticated users', () => {
    expect(deleteAccess(makeReq({ id: 1, role: 'developer' }))).toBe(false)
    expect(deleteAccess(makeReq({ id: 2, role: 'publisher' }))).toBe(false)
  })

  it('allows an admin', () => {
    expect(deleteAccess(makeReq({ id: 99, role: 'admin' }))).toBe(true)
  })
})