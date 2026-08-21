import { describe, expect, it } from 'vitest'
import { Users } from './Users'

type ReqUser = { id: number | string; role?: string } | null

function makeReq(user: ReqUser) {
  return { req: { user } } as any
}

describe('Users collection access', () => {
  const access = Users.access!

  describe('create access', () => {
    const createAccess = access.create as () => boolean

    it('allows public self-registration (unauthenticated user can create an account)', () => {
      expect(createAccess()).toBe(true)
    })
  })

  describe('read access', () => {
    const readAccess = access.read as (args: any) => boolean

    it('allows authenticated users to read users', () => {
      expect(readAccess(makeReq({ id: 1, role: 'developer' }))).toBe(true)
    })

    it('denies unauthenticated users from reading users', () => {
      expect(readAccess(makeReq(null))).toBe(false)
    })
  })

  describe('update access', () => {
    const updateAccess = access.update as (args: any) => boolean

    it('allows user to update their own profile', () => {
      expect(updateAccess({ req: { user: { id: 10 } }, id: 10 })).toBe(true)
    })

    it('denies user from updating another user profile', () => {
      expect(updateAccess({ req: { user: { id: 10 } }, id: 20 })).toBe(false)
    })

    it('denies unauthenticated user from updating any profile', () => {
      expect(updateAccess({ req: { user: null }, id: 10 })).toBe(false)
    })
  })

  describe('delete access', () => {
    const deleteAccess = access.delete as (args: any) => boolean

    it('allows user to delete their own profile', () => {
      expect(deleteAccess({ req: { user: { id: 10 } }, id: 10 })).toBe(true)
    })

    it('denies user from deleting another user profile', () => {
      expect(deleteAccess({ req: { user: { id: 10 } }, id: 20 })).toBe(false)
    })

    it('denies unauthenticated user from deleting any profile', () => {
      expect(deleteAccess({ req: { user: null }, id: 10 })).toBe(false)
    })
  })
})

describe('Users role field access (privilege escalation prevention)', () => {
  const roleField = Users.fields.find(
    (f) => 'name' in f && f.name === 'role',
  ) as { access: { create: (args: any) => boolean; update: (args: any) => boolean } }

  describe('role field create access', () => {
    it('denies non-admin (developer) from setting role to admin on create', () => {
      expect(roleField.access.create(makeReq({ id: 1, role: 'developer' }))).toBe(false)
    })

    it('denies non-admin (publisher) from setting role to admin on create', () => {
      expect(roleField.access.create(makeReq({ id: 2, role: 'publisher' }))).toBe(false)
    })

    it('denies unauthenticated user from setting role on create', () => {
      expect(roleField.access.create(makeReq(null))).toBe(false)
    })

    it('allows an existing admin to set role on create', () => {
      expect(roleField.access.create(makeReq({ id: 99, role: 'admin' }))).toBe(true)
    })
  })

  describe('role field update access', () => {
    it('denies non-admin (developer) from upgrading their role to admin on update', () => {
      expect(roleField.access.update(makeReq({ id: 1, role: 'developer' }))).toBe(false)
    })

    it('denies non-admin (publisher) from upgrading their role to admin on update', () => {
      expect(roleField.access.update(makeReq({ id: 2, role: 'publisher' }))).toBe(false)
    })

    it('denies unauthenticated user from updating role', () => {
      expect(roleField.access.update(makeReq(null))).toBe(false)
    })

    it('allows an existing admin to update role on a user', () => {
      expect(roleField.access.update(makeReq({ id: 99, role: 'admin' }))).toBe(true)
    })
  })
})
