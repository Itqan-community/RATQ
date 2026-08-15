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

describe('Comments access.update (isOwner)', () => {
  const isOwner = Comments.access!.update as (args: { req: { user: unknown } }) => unknown

  it('allows the comment author to update', () => {
    expect(isOwner({ req: { user: { id: 'user-1' } } })).toEqual({
      author: { equals: 'user-1' },
    })
  })

  it('scopes the query to the caller, not to an arbitrary owner', () => {
    expect(isOwner({ req: { user: { id: 'user-2' } } })).toEqual({
      author: { equals: 'user-2' },
    })
  })

  it('denies when there is no logged-in user', () => {
    expect(isOwner({ req: { user: null } })).toBe(false)
  })
})

describe('Comments access.delete (isOwner)', () => {
  const isOwner = Comments.access!.delete as (args: { req: { user: unknown } }) => unknown

  it('scopes deletes to the caller', () => {
    expect(isOwner({ req: { user: { id: 'user-1' } } })).toEqual({
      author: { equals: 'user-1' },
    })
  })

  it('denies when there is no logged-in user', () => {
    expect(isOwner({ req: { user: null } })).toBe(false)
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

interface NotificationCreateCall {
  collection: string
  data: Record<string, unknown>
}

interface ExistingComment {
  id: number
  author: string
}

interface CommentsPayloadStub {
  find: (args: unknown) => Promise<{ docs: ExistingComment[] }>
  findByID: (args: { collection: string; id: unknown; depth?: number }) => Promise<{ id: number; name: string }>
  create: (args: NotificationCreateCall) => Promise<Record<string, unknown>>
}

interface CommentAfterChangeArgs {
  req: { payload: CommentsPayloadStub }
  doc: Record<string, unknown>
  operation: string
}

interface NotificationCreateCall {
  collection: string
  data: Record<string, unknown>
}

interface ExistingComment {
  id: number
  author: string
}

interface CommentsPayloadStub {
  find: (args: unknown) => Promise<{ docs: ExistingComment[] }>
  findByID: (args: { collection: string; id: unknown; depth?: number }) => Promise<{ id: number; name: string }>
  create: (args: NotificationCreateCall) => Promise<Record<string, unknown>>
}

interface CommentAfterChangeArgs {
  req: { payload: CommentsPayloadStub }
  doc: Record<string, unknown>
  operation: string
}

describe('Comments afterChange hook', () => {
  const hook = Comments.hooks!.afterChange![0] as (
    args: CommentAfterChangeArgs,
  ) => Promise<Record<string, unknown>>

  function makePayload({
    existingComments,
    resource,
    createCalls,
  }: {
    existingComments: ExistingComment[]
    resource: { id: number; name: string }
    createCalls: NotificationCreateCall[]
  }): CommentsPayloadStub {
    return {
      find: async () => ({ docs: existingComments }),
      findByID: async () => resource,
      create: async (args) => {
        createCalls.push(args)
        return { id: 900, ...args.data }
      },
    }
  }

  it('notifies a previous distinct commenter on the same resource', async () => {
    const createCalls: NotificationCreateCall[] = []
    const payload = makePayload({
      existingComments: [{ id: 1, author: 'user-1' }],
      resource: { id: 200, name: 'Quranic Text Toolkit' },
      createCalls,
    })
    const doc = { id: 2, resource: 200, author: 'user-2' }

    await hook({ req: { payload }, doc, operation: 'create' })

    expect(createCalls).toHaveLength(1)
    expect(createCalls[0].collection).toBe('notifications')
    expect(createCalls[0].data.recipient).toBe('user-1')
    expect(createCalls[0].data.type).toBe('comment_reply')
    expect(createCalls[0].data.related_comment).toBe(2)
  })

  it('notifies each distinct previous commenter only once', async () => {
    const createCalls: NotificationCreateCall[] = []
    const payload = makePayload({
      existingComments: [
        { id: 1, author: 'user-1' },
        { id: 3, author: 'user-1' },
        { id: 4, author: 'user-3' },
      ],
      resource: { id: 200, name: 'Quranic Text Toolkit' },
      createCalls,
    })
    const doc = { id: 5, resource: 200, author: 'user-2' }

    await hook({ req: { payload }, doc, operation: 'create' })

    expect(createCalls).toHaveLength(2)
    const recipients = createCalls.map((c) => c.data.recipient).sort()
    expect(recipients).toEqual(['user-1', 'user-3'])
  })

  it('notifies every distinct commenter even when there are more than one page worth (100+) of prior comments', async () => {
    const createCalls: NotificationCreateCall[] = []
    const manyComments: ExistingComment[] = []
    for (let i = 0; i < 150; i++) {
      manyComments.push({ id: i, author: `user-${i}` })
    }
    const payload = makePayload({
      existingComments: manyComments,
      resource: { id: 200, name: 'Quranic Text Toolkit' },
      createCalls,
    })
    const doc = { id: 999, resource: 200, author: 'user-original-poster' }

    await hook({ req: { payload }, doc, operation: 'create' })

    expect(createCalls).toHaveLength(150)
  })

  it('does not notify the commenter themselves', async () => {
    const createCalls: NotificationCreateCall[] = []
    const payload = makePayload({
      existingComments: [],
      resource: { id: 200, name: 'Quranic Text Toolkit' },
      createCalls,
    })
    const doc = { id: 2, resource: 200, author: 'user-2' }

    await hook({ req: { payload }, doc, operation: 'create' })

    expect(createCalls).toHaveLength(0)
  })

  it('does not run on update, only on create', async () => {
    const createCalls: NotificationCreateCall[] = []
    const payload = makePayload({
      existingComments: [{ id: 1, author: 'user-1' }],
      resource: { id: 200, name: 'Quranic Text Toolkit' },
      createCalls,
    })
    const doc = { id: 2, resource: 200, author: 'user-2' }

    await hook({ req: { payload }, doc, operation: 'update' })

    expect(createCalls).toHaveLength(0)
  })
})
