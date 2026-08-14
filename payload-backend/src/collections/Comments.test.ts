import { describe, expect, it } from 'vitest'
import { Comments } from './Comments'

describe('Comments access.create', () => {
  const create = Comments.access!.create as (args: { req: { user: unknown } }) => unknown

  it('allows an authenticated user', () => {
    expect(create({ req: { user: { id: 'user-1' } } })).toBe(true)
  })

  it('denies an anonymous caller', () => {
    expect(create({ req: { user: null } })).toBe(false)
  })
})

describe('Comments access.update (canModifyComment)', () => {
  const canModifyComment = Comments.access!.update as (
    args: { req: { user: unknown } },
  ) => unknown

  it('allows an admin to update any comment', () => {
    expect(
      canModifyComment({
        req: { user: { id: 'admin-1', role: 'admin' } },
      }),
    ).toBe(true)
  })

  it('allows the comment author to update their own comment', () => {
    expect(
      canModifyComment({
        req: { user: { id: 'user-1', role: 'user' } },
      }),
    ).toEqual({
      author: { equals: 'user-1' },
    })
  })

  it('scopes updates to the caller for non-admin users', () => {
    expect(
      canModifyComment({
        req: { user: { id: 'user-2', role: 'user' } },
      }),
    ).toEqual({
      author: { equals: 'user-2' },
    })
  })

  it('denies when there is no logged-in user', () => {
    expect(canModifyComment({ req: { user: null } })).toBe(false)
  })
})

describe('Comments access.delete (canModifyComment)', () => {
  const canModifyComment = Comments.access!.delete as (
    args: { req: { user: unknown } }
  ) => unknown

  it('allows an admin to delete any comment', () => {
    expect(
      canModifyComment({
        req: { user: { id: 'admin-1', role: 'admin' } },
      }),
    ).toBe(true)
  })

  it('allows the comment author to delete their own comment', () => {
    expect(
      canModifyComment({
        req: { user: { id: 'user-1', role: 'user' } },
      }),
    ).toEqual({
      author: { equals: 'user-1' },
    })
  })

  it('scopes deletes to the caller for non-admin users', () => {
    expect(
      canModifyComment({
        req: { user: { id: 'user-2', role: 'user' } },
      }),
    ).toEqual({
      author: { equals: 'user-2' },
    })
  })

  it('denies when there is no logged-in user', () => {
    expect(canModifyComment({ req: { user: null } })).toBe(false)
  })
})

describe('Comments beforeChange hook', () => {
  const hook = Comments.hooks!.beforeChange![0] as (args: {
    req: { user: unknown }
    data: Record<string, unknown>
  }) => Record<string, unknown>

  it('overwrites a client-supplied author with the caller id', () => {
    const result = hook({
      req: { user: { id: 'user-1', email: 'user1@example.com' } },
      data: { author: 'user-2', content: 'x' },
    })
    expect(result.author).toBe('user-1')
  })

  it('leaves data untouched when there is no logged-in user', () => {
    const result = hook({ req: { user: null }, data: { author: 'user-2', content: 'x' } })
    expect(result.author).toBe('user-2')
  })

  it('denormalizes author_name from display_name when set', () => {
    const result = hook({
      req: { user: { id: 'user-1', display_name: 'Ahmad', email: 'ahmad@example.com' } },
      data: { content: 'x' },
    })
    expect(result.author_name).toBe('Ahmad')
  })

  it('falls back to the email local-part when display_name is missing, never the full email', () => {
    const result = hook({
      req: { user: { id: 'user-1', display_name: null, email: 'ahmad@example.com' } },
      data: { content: 'x' },
    })
    expect(result.author_name).toBe('ahmad')
    expect(result.author_name).not.toContain('@')
  })
})
