import { describe, expect, it } from 'vitest'
import { Resources } from './Resources'

type ReqUser = { id: number | string; role?: string } | null

function makeReq(user: ReqUser) {
  return { req: { user } }
}

describe('Resources collection access', () => {
  const access = Resources.access!

  describe('read access', () => {
    const readAccess = access.read as (args: { req: { user: ReqUser } }) => unknown

    it('scopes anonymous callers to published resources only', () => {
      expect(readAccess(makeReq(null))).toEqual({
        status: { equals: 'published' },
      })
    })

    it('allows authenticated owner to see published resources or their own draft/archived resources', () => {
      expect(readAccess(makeReq({ id: 'user-1', role: 'developer' }))).toEqual({
        or: [
          { status: { equals: 'published' } },
          { owner: { equals: 'user-1' } },
        ],
      })
    })

    it('ensures non-owner authenticated callers are scoped to their own resources and cannot access others drafts', () => {
      const result = readAccess(makeReq({ id: 'user-2', role: 'developer' }))
      expect(result).toEqual({
        or: [
          { status: { equals: 'published' } },
          { owner: { equals: 'user-2' } },
        ],
      })
      expect(result).not.toEqual({
        or: [
          { status: { equals: 'published' } },
          { owner: { equals: 'user-1' } },
        ],
      })
    })

    it('allows admin users full bypass to view all resources', () => {
      expect(readAccess(makeReq({ id: 'admin-1', role: 'admin' }))).toBe(true)
    })
  })

  describe('create access', () => {
    const createAccess = access.create as (args: { req: { user: ReqUser } }) => boolean

    it('allows authenticated users (developers/publishers) to create resources', () => {
      expect(createAccess(makeReq({ id: 1, role: 'developer' }))).toBe(true)
      expect(createAccess(makeReq({ id: 2, role: 'publisher' }))).toBe(true)
    })

    it('denies unauthenticated users from creating resources', () => {
      expect(createAccess(makeReq(null))).toBe(false)
    })
  })

  describe('update access (isOwner)', () => {
    const updateAccess = access.update as (args: { req: { user: ReqUser } }) => unknown

    it('denies when there is no logged-in user', () => {
      expect(updateAccess(makeReq(null))).toBe(false)
    })

    it('scopes the update query to the resource owner', () => {
      expect(updateAccess(makeReq({ id: 'user-1' }))).toEqual({
        owner: { equals: 'user-1' },
      })
    })
  })

  describe('delete access (isOwner)', () => {
    const deleteAccess = access.delete as (args: { req: { user: ReqUser } }) => unknown

    it('denies when there is no logged-in user', () => {
      expect(deleteAccess(makeReq(null))).toBe(false)
    })

    it('scopes the delete query to the resource owner', () => {
      expect(deleteAccess(makeReq({ id: 'user-42' }))).toEqual({
        owner: { equals: 'user-42' },
      })
    })
  })
})

describe('Resources field access (itqan_badge security)', () => {
  const badgeField = Resources.fields.find(
    (f) => 'name' in f && f.name === 'itqan_badge',
  ) as { access: { create: (args: { req: { user: ReqUser } }) => boolean; update: (args: { req: { user: ReqUser } }) => boolean } }

  describe('itqan_badge create access', () => {
    it('denies non-admin developer from self-awarding the Itqan badge on create', () => {
      expect(badgeField.access.create(makeReq({ id: 1, role: 'developer' }))).toBe(false)
    })

    it('denies non-admin publisher from self-awarding the Itqan badge on create', () => {
      expect(badgeField.access.create(makeReq({ id: 2, role: 'publisher' }))).toBe(false)
    })

    it('allows platform admin to award the Itqan badge on create', () => {
      expect(badgeField.access.create(makeReq({ id: 99, role: 'admin' }))).toBe(true)
    })

    it('denies unauthenticated user from setting the Itqan badge', () => {
      expect(badgeField.access.create(makeReq(null))).toBe(false)
    })
  })

  describe('itqan_badge update access', () => {
    it('denies resource owner developer from granting themselves the badge on update', () => {
      expect(badgeField.access.update(makeReq({ id: 1, role: 'developer' }))).toBe(false)
    })

    it('allows platform admin to toggle or assign the Itqan badge on update', () => {
      expect(badgeField.access.update(makeReq({ id: 99, role: 'admin' }))).toBe(true)
    })
  })
})

interface BeforeChangeArgs {
  req: { user: ReqUser }
  data: Record<string, unknown>
  operation: string
}

describe('Resources beforeChange hook (owner-spoofing prevention)', () => {
  const beforeChangeHook = Resources.hooks!.beforeChange![0] as (args: BeforeChangeArgs) => Record<string, unknown>

  it('forces owner to match the authenticated user id, overwriting client-supplied spoofed owner', () => {
    const data = { name: 'New Dataset', owner: 999 } // Spoofed owner id 999
    const result = beforeChangeHook({
      req: { user: { id: 42, role: 'developer' } },
      data,
      operation: 'create',
    })

    expect(result.owner).toBe(42)
    expect(result.owner).not.toBe(999)
  })

  it('preserves existing data when req.user is absent', () => {
    const data = { name: 'System Resource', owner: 10 }
    const result = beforeChangeHook({
      req: { user: null },
      data,
      operation: 'create',
    })

    expect(result.owner).toBe(10)
  })
})

interface CountSlugArgs {
  collection?: string
  where: { slug: { equals: string } }
}

interface BeforeValidateSlugArgs {
  req: { payload: { count: (args: CountSlugArgs) => Promise<{ totalDocs: number }> } }
  data: Record<string, unknown>
  operation: string
}

describe('Resources beforeValidate hook (slugification and uniqueness)', () => {
  const beforeValidateHook = Resources.hooks!.beforeValidate![0] as (args: BeforeValidateSlugArgs) => Promise<Record<string, unknown>>

  it('generates a clean ASCII slug for English resource names', async () => {
    const payload = { count: async () => ({ totalDocs: 0 }) }
    const data = { name: 'Quranic Search API' }
    const result = await beforeValidateHook({
      req: { payload },
      data,
      operation: 'create',
    })

    expect(result.slug).toBe('quranic-search-api')
  })

  it('supports Unicode Arabic names and converts them to valid slugs', async () => {
    const payload = { count: async () => ({ totalDocs: 0 }) }
    const data = { name: 'معجم ألفاظ القرآن الكريم' }
    const result = await beforeValidateHook({
      req: { payload },
      data,
      operation: 'create',
    })

    expect(result.slug).toBe('معجم-ألفاظ-القرآن-الكريم')
  })

  it('appends incrementing numerical suffix when slug collision occurs', async () => {
    let callCount = 0
    const payload = {
      count: async (args: CountSlugArgs) => {
        callCount += 1
        // First check ('tafsir-api') collides, second check ('tafsir-api-1') collides, third is free
        if (args.where.slug.equals === 'tafsir-api' || args.where.slug.equals === 'tafsir-api-1') {
          return { totalDocs: 1 }
        }
        return { totalDocs: 0 }
      },
    }

    const data = { name: 'Tafsir API' }
    const result = await beforeValidateHook({
      req: { payload },
      data,
      operation: 'create',
    })

    expect(result.slug).toBe('tafsir-api-2')
    expect(callCount).toBe(3)
  })

  it('does not recalculate slug on update operations', async () => {
    const payload = { count: async () => ({ totalDocs: 0 }) }
    const data = { name: 'Updated Name', slug: 'existing-slug' }
    const result = await beforeValidateHook({
      req: { payload },
      data,
      operation: 'update',
    })

    expect(result.slug).toBe('existing-slug')
  })
})

describe('Resources status field (draft protection & defaults)', () => {
  const statusField = Resources.fields.find(
    (f) => 'name' in f && f.name === 'status',
  ) as { defaultValue: string; options: string[] }

  it('defaults new resources to draft status', () => {
    expect(statusField.defaultValue).toBe('draft')
  })

  it('supports valid resource lifecycle statuses (draft, published, archived)', () => {
    expect(statusField.options).toEqual(['draft', 'published', 'archived'])
  })
})
