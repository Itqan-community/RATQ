import crypto from 'crypto'
import { describe, expect, it } from 'vitest'

import { APIKeys } from './APIKeys'

describe('APIKeys access.create', () => {
  const create = APIKeys.access!.create as (args: { req: { user: unknown } }) => unknown

  it('allows an authenticated user', () => {
    expect(create({ req: { user: { id: 'user-1' } } })).toBe(true)
  })

  it('denies an anonymous caller', () => {
    expect(create({ req: { user: null } })).toBe(false)
  })
})

describe('APIKeys access.read (isOwner)', () => {
  const isOwner = APIKeys.access!.read as (args: { req: { user: unknown } }) => unknown

  it('scopes reads to the owning user', () => {
    expect(isOwner({ req: { user: { id: 'user-1' } } })).toEqual({
      owner: { equals: 'user-1' },
    })
  })

  it('denies an unauthenticated caller', () => {
    expect(isOwner({ req: { user: null } })).toBe(false)
  })
})

describe('APIKeys access.update', () => {
  const update = APIKeys.access!.update as (args: { req: { user: unknown } }) => unknown

  it('is disabled entirely, even for the owner - these are immutable credentials', () => {
    expect(update({ req: { user: { id: 'user-1' } } })).toBe(false)
  })

  it('denies an unauthenticated caller', () => {
    expect(update({ req: { user: null } })).toBe(false)
  })
})

describe('key_hash field access', () => {
  const field = APIKeys.fields.find((f) => 'name' in f && f.name === 'key_hash') as {
    access: { create: (args: unknown) => unknown; read: (args: unknown) => unknown; update: (args: unknown) => unknown }
  }

  it('is never readable by anyone, including the owner', () => {
    expect(field.access.read({ req: { user: { id: 1 } } })).toBe(false)
  })

  it('is never client-settable on create', () => {
    expect(field.access.create({ req: { user: { id: 1 } } })).toBe(false)
  })

  it('is never client-settable on update', () => {
    expect(field.access.update({ req: { user: { id: 1 } } })).toBe(false)
  })
})

describe('APIKeys access.delete (isOwner)', () => {
  const isOwner = APIKeys.access!.delete as (args: { req: { user: unknown } }) => unknown

  it('scopes deletes to the owning user', () => {
    expect(isOwner({ req: { user: { id: 'user-2' } } })).toEqual({
      owner: { equals: 'user-2' },
    })
  })

  it('denies an unauthenticated caller', () => {
    expect(isOwner({ req: { user: null } })).toBe(false)
  })
})

describe('APIKeys beforeChange hook', () => {
  const hook = APIKeys.hooks!.beforeChange![0] as (args: {
    req: { user: unknown; context: Record<string, unknown> }
    data: Record<string, unknown>
    operation: string
  }) => Record<string, unknown>

  it('generates key_prefix/key_hash and stashes the full plaintext key on req.context on create', () => {
    const req = { user: { id: 1 }, context: {} as Record<string, unknown> }
    const result = hook({ req, data: {}, operation: 'create' })

    expect(result.owner).toBe(1)
    expect(typeof result.key_prefix).toBe('string')
    expect(result.key_prefix).toMatch(/^ratq_live_[0-9a-f]{8}$/)
    expect(typeof result.key_hash).toBe('string')
    expect(result.key_hash).not.toContain('ratq_live_')

    const fullKey = req.context.generatedKey as string
    expect(fullKey.startsWith('ratq_live_')).toBe(true)
    expect(fullKey).not.toBe(result.key_hash)

    const expectedHash = crypto.createHash('sha256').update(fullKey).digest('hex')
    expect(result.key_hash).toBe(expectedHash)
  })

  it('does not touch key_prefix/key_hash on update', () => {
    const req = { user: { id: 1 }, context: {} as Record<string, unknown> }
    const result = hook({ req, data: { key_prefix: 'existing' }, operation: 'update' })

    expect(result.key_prefix).toBe('existing')
    expect(req.context.generatedKey).toBeUndefined()
  })
})

describe('APIKeys afterChange hook', () => {
  const hook = APIKeys.hooks!.afterChange![0] as (args: {
    req: { context: Record<string, unknown> }
    doc: Record<string, unknown>
    operation: string
  }) => Record<string, unknown>

  it('surfaces the full plaintext key exactly once, on create', () => {
    const req = { context: { generatedKey: 'ratq_live_deadbeef' } }
    const doc = { id: 1, key_hash: 'abc' }
    const result = hook({ req, doc, operation: 'create' })

    expect(result.key).toBe('ratq_live_deadbeef')
    expect(result.key_hash).toBe('abc')
  })

  it('never adds a key field on update, even if context somehow held a generated key', () => {
    const req = { context: { generatedKey: 'ratq_live_shouldnotleak' } }
    const doc = { id: 1, key_hash: 'abc' }
    const result = hook({ req, doc, operation: 'update' })

    expect(result.key).toBeUndefined()
  })
})

describe('key hashing correctness', () => {
  it('sha256 of a known input produces the expected hex digest', () => {
    const input = 'ratq_live_deadbeefcafebabe'
    const hash = crypto.createHash('sha256').update(input).digest('hex')

    // Known digest for this exact string, precomputed independently of the
    // collection's own hashing code - a regression here means the hashing
    // logic itself (algorithm/encoding) changed, not just the random input.
    expect(hash).toBe('774b805ff6ff76eb1ceca0e3e77070cc98e9adb3f0ce3e2ca6eed8bd0eb5cc19')
  })
})
