import { describe, expect, it } from 'vitest'

import { Reports } from './Reports'

type ReqUser = { id: number; role?: string } | null

function makeReq(user: ReqUser) {
  return { req: { user } } as any
}

describe('Reports read access', () => {
  const readAccess = Reports.access!.read as (args: any) => unknown

  it('reporter sees their own report', () => {
    const result = readAccess(makeReq({ id: 1, role: 'developer' }))
    expect(result).toEqual({
      or: [{ reporter: { equals: 1 } }, { 'resource.owner': { equals: 1 } }],
    })
  })

  it('admin sees any report', () => {
    const result = readAccess(makeReq({ id: 99, role: 'admin' }))
    expect(result).toBe(true)
  })

  it('another non-admin user does not see someone else\'s report (own-id filter only)', () => {
    const result = readAccess(makeReq({ id: 2, role: 'developer' }))
    expect(result).toEqual({
      or: [{ reporter: { equals: 2 } }, { 'resource.owner': { equals: 2 } }],
    })
    expect(result).not.toEqual({
      or: [{ reporter: { equals: 1 } }, { 'resource.owner': { equals: 1 } }],
    })
  })

  it('unauthenticated user sees nothing', () => {
    const result = readAccess(makeReq(null))
    expect(result).toBe(false)
  })
})

describe('Reports create access', () => {
  const createAccess = Reports.access!.create as (args: any) => unknown

  it('anonymous user cannot create a report', () => {
    const result = createAccess(makeReq(null))
    expect(result).toBe(false)
  })

  it('authenticated user can create a report', () => {
    const result = createAccess(makeReq({ id: 1, role: 'developer' }))
    expect(result).toBe(true)
  })
})

describe('Reports beforeChange hook', () => {
  const hook = Reports.hooks!.beforeChange![0] as (args: any) => unknown

  it('overwrites a spoofed reporter id with the authenticated user id', () => {
    const data: Record<string, unknown> = { reporter: 999, reason: 'spam', details: 'x' }
    const result = hook({
      req: { user: { id: 1, role: 'developer' } },
      data,
      operation: 'create',
    }) as Record<string, unknown>

    expect(result.reporter).toBe(1)
    expect(result.reporter).not.toBe(999)
  })

  it('forces status to open on create for a non-admin, ignoring a client-supplied status', () => {
    const data: Record<string, unknown> = { status: 'resolved' }
    const result = hook({
      req: { user: { id: 1, role: 'developer' } },
      data,
      operation: 'create',
    }) as Record<string, unknown>

    expect(result.status).toBe('open')
  })

  it('preserves a client-supplied status on create for an admin', () => {
    const data: Record<string, unknown> = { status: 'resolved' }
    const result = hook({
      req: { user: { id: 99, role: 'admin' } },
      data,
      operation: 'create',
    }) as Record<string, unknown>

    expect(result.status).toBe('resolved')
  })

  it('does not overwrite reporter when an admin updates status (update is admin-only)', () => {
    const data: Record<string, unknown> = { status: 'resolved' }
    const result = hook({
      req: { user: { id: 99, role: 'admin' } },
      data,
      operation: 'update',
    }) as Record<string, unknown>

    expect(result.reporter).toBeUndefined()
  })
})
