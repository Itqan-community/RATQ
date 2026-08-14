import { describe, expect, it } from 'vitest'

import { Notifications } from './Notifications'

type ReqUser = { id: number; role?: string } | null

function makeReq(user: ReqUser) {
  return { req: { user } } as any
}

describe('Notifications read access', () => {
  const readAccess = Notifications.access!.read as (args: any) => unknown

  it('recipient sees their own notifications', () => {
    const result = readAccess(makeReq({ id: 1, role: 'developer' }))
    expect(result).toEqual({ recipient: { equals: 1 } })
  })

  it('admin sees any notification', () => {
    const result = readAccess(makeReq({ id: 99, role: 'admin' }))
    expect(result).toBe(true)
  })

  it('unauthenticated user sees nothing', () => {
    const result = readAccess(makeReq(null))
    expect(result).toBe(false)
  })
})

describe('Notifications create access', () => {
  const createAccess = Notifications.access!.create as (args: any) => unknown

  it('no client - including an authenticated one - can create a notification directly', () => {
    expect(createAccess(makeReq({ id: 1, role: 'developer' }))).toBe(false)
    expect(createAccess(makeReq({ id: 99, role: 'admin' }))).toBe(false)
    expect(createAccess(makeReq(null))).toBe(false)
  })
})

describe('Notifications update access', () => {
  const updateAccess = Notifications.access!.update as (args: any) => unknown

  it('recipient can update (mark read) their own notifications', () => {
    const result = updateAccess(makeReq({ id: 1, role: 'developer' }))
    expect(result).toEqual({ recipient: { equals: 1 } })
  })

  it('admin can update any notification', () => {
    const result = updateAccess(makeReq({ id: 99, role: 'admin' }))
    expect(result).toBe(true)
  })

  it('unauthenticated user cannot update', () => {
    expect(updateAccess(makeReq(null))).toBe(false)
  })
})

describe('Notifications field-level access', () => {
  it('message/type/resource/related fields cannot be updated by anyone, even a recipient', () => {
    const lockedFields = ['recipient', 'type', 'message', 'resource', 'resource_name', 'related_access_request', 'related_report', 'related_comment']
    for (const fieldName of lockedFields) {
      const field = Notifications.fields.find((f: any) => f.name === fieldName) as any
      expect(field.access.update(makeReq({ id: 1, role: 'developer' }))).toBe(false)
    }
  })

  it('read field has no update restriction (recipient can toggle it)', () => {
    const field = Notifications.fields.find((f: any) => f.name === 'read') as any
    expect(field.access).toBeUndefined()
  })
})
