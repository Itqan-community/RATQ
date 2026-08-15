import { describe, expect, it } from 'vitest'

import { Notifications } from './Notifications'

interface ReqUser {
  id: number
  role?: string
}

interface AccessArgs {
  req: { user: ReqUser | null }
}

interface NotificationField {
  name: string
  access?: { update?: (args: AccessArgs) => unknown }
}

function makeReq(user: ReqUser | null): AccessArgs {
  return { req: { user } }
}

describe('Notifications read access', () => {
  const readAccess = Notifications.access!.read as (args: AccessArgs) => unknown

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
  const createAccess = Notifications.access!.create as (args: AccessArgs) => unknown

  it('no client - including an authenticated one - can create a notification directly', () => {
    expect(createAccess(makeReq({ id: 1, role: 'developer' }))).toBe(false)
    expect(createAccess(makeReq({ id: 99, role: 'admin' }))).toBe(false)
    expect(createAccess(makeReq(null))).toBe(false)
  })
})

describe('Notifications update access', () => {
  const updateAccess = Notifications.access!.update as (args: AccessArgs) => unknown

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
  const lockedFieldNames = [
    'recipient',
    'type',
    'message',
    'resource',
    'resource_name',
    'related_access_request',
    'related_report',
    'related_comment',
  ]

  it('message/type/resource/related fields cannot be updated by anyone, even a recipient', () => {
    for (const fieldName of lockedFieldNames) {
      const field = Notifications.fields.find((f) => (f as NotificationField).name === fieldName) as NotificationField
      expect(field.access?.update?.(makeReq({ id: 1, role: 'developer' }))).toBe(false)
    }
  })

  it('read field has no update restriction (recipient can toggle it)', () => {
    const field = Notifications.fields.find((f) => (f as NotificationField).name === 'read') as NotificationField
    expect(field.access).toBeUndefined()
  })
})
