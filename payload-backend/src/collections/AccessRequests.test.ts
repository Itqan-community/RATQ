import { describe, expect, it } from 'vitest'

import { AccessRequests } from './AccessRequests'

type ReqUser = { id: number; role?: string } | null

function makeReq(user: ReqUser) {
  return { req: { user } } as any
}

describe('AccessRequests read access', () => {
  const readAccess = AccessRequests.access!.read as (args: any) => unknown

  it('applicant sees their own request', () => {
    const result = readAccess(makeReq({ id: 1, role: 'developer' }))
    expect(result).toEqual({
      or: [{ applicant: { equals: 1 } }, { 'resource.owner': { equals: 1 } }],
    })
  })

  it('admin sees any request', () => {
    const result = readAccess(makeReq({ id: 99, role: 'admin' }))
    expect(result).toBe(true)
  })

  it('non-admin user is scoped to their own applicant/resource-owner filter', () => {
    const result = readAccess(makeReq({ id: 2, role: 'developer' }))
    expect(result).toEqual({
      or: [{ applicant: { equals: 2 } }, { 'resource.owner': { equals: 2 } }],
    })
    expect(result).not.toEqual({
      or: [{ applicant: { equals: 1 } }, { 'resource.owner': { equals: 1 } }],
    })
  })

  it('unauthenticated user sees nothing', () => {
    const result = readAccess(makeReq(null))
    expect(result).toBe(false)
  })
})

describe('AccessRequests update access', () => {
  const updateAccess = AccessRequests.access!.update as (args: any) => unknown

  it('admin can update any request', () => {
    expect(updateAccess(makeReq({ id: 99, role: 'admin' }))).toBe(true)
  })

  it('non-admin is scoped to requests on resources they own (the publisher)', () => {
    const result = updateAccess(makeReq({ id: 5, role: 'publisher' }))
    expect(result).toEqual({ 'resource.owner': { equals: 5 } })
  })

  it('unauthenticated user cannot update', () => {
    expect(updateAccess(makeReq(null))).toBe(false)
  })
})

describe('publisher_notes field access', () => {
  const fieldAccess = (AccessRequests.fields.find(
    (f) => 'name' in f && f.name === 'publisher_notes',
  ) as { access: NonNullable<unknown> }).access as {
    create: (args: any) => unknown
    read: (args: any) => unknown
  }

  it('is never client-settable on create, even for a publisher', () => {
    expect((fieldAccess.create as (args: any) => unknown)(makeReq({ id: 5, role: 'publisher' }))).toBe(
      false,
    )
  })

  it('is hidden from a publisher (read is admin-only)', () => {
    // Not "any publisher": an applicant can themselves hold the publisher
    // role on a different resource, so a role check alone would leak the
    // notes to that applicant on their own request. Read must be strictly
    // admin-only, not role-based.
    expect((fieldAccess.read as (args: any) => unknown)(makeReq({ id: 5, role: 'publisher' }))).toBe(
      false,
    )
  })

  it('is hidden from an applicant (developer role)', () => {
    expect((fieldAccess.read as (args: any) => unknown)(makeReq({ id: 1, role: 'developer' }))).toBe(
      false,
    )
  })

  it('is readable by an admin', () => {
    expect((fieldAccess.read as (args: any) => unknown)(makeReq({ id: 99, role: 'admin' }))).toBe(
      true,
    )
  })

  it('is writable by a publisher', () => {
    const update = (
      AccessRequests.fields.find((f) => 'name' in f && f.name === 'publisher_notes') as {
        access: { update: (args: any) => unknown }
      }
    ).access.update
    expect(update(makeReq({ id: 5, role: 'publisher' }))).toBe(true)
  })
})

describe('AccessRequests create access', () => {
  const createAccess = AccessRequests.access!.create as (args: any) => unknown

  it('anonymous user cannot create a request', () => {
    const result = createAccess(makeReq(null))
    expect(result).toBe(false)
  })

  it('authenticated user can create a request', () => {
    const result = createAccess(makeReq({ id: 1, role: 'developer' }))
    expect(result).toBe(true)
  })
})

describe('AccessRequests beforeChange hook', () => {
  const hook = AccessRequests.hooks!.beforeChange![0] as (args: any) => unknown

  it('overwrites a spoofed applicant id with the authenticated user id', () => {
    const data: Record<string, unknown> = { applicant: 999, message: 'please' }
    const result = hook({
      req: { user: { id: 1, role: 'developer' } },
      data,
      operation: 'create',
    }) as Record<string, unknown>

    expect(result.applicant).toBe(1)
    expect(result.applicant).not.toBe(999)
  })

  it('forces status to pending on create for a non-admin, ignoring a client-supplied status', () => {
    const data: Record<string, unknown> = { status: 'approved' }
    const result = hook({
      req: { user: { id: 1, role: 'developer' } },
      data,
      operation: 'create',
    }) as Record<string, unknown>

    expect(result.status).toBe('pending')
  })

  it('forces status to pending on create even for an admin', () => {
    const data: Record<string, unknown> = { status: 'approved' }
    const result = hook({
      req: { user: { id: 99, role: 'admin' } },
      data,
      operation: 'create',
    }) as Record<string, unknown>

    expect(result.status).toBe('pending')
  })

  it('does not overwrite applicant when an admin updates status', () => {
    const data: Record<string, unknown> = { status: 'approved' }
    const result = hook({
      req: { user: { id: 99, role: 'admin' } },
      data,
      operation: 'update',
    }) as Record<string, unknown>

    expect(result.applicant).toBeUndefined()
  })

  it('rejects switching status once a request has already been decided', () => {
    const data: Record<string, unknown> = { status: 'denied' }
    expect(() =>
      hook({
        req: { user: { id: 5, role: 'publisher' } },
        data,
        operation: 'update',
        originalDoc: { status: 'approved' },
      }),
    ).toThrow('Access request status cannot be changed once decided.')
  })

  it('allows deciding a pending request', () => {
    const data: Record<string, unknown> = { status: 'approved' }
    const result = hook({
      req: { user: { id: 5, role: 'publisher' } },
      data,
      operation: 'update',
      originalDoc: { status: 'pending' },
    }) as Record<string, unknown>

    expect(result.status).toBe('approved')
  })
})

describe('AccessRequests beforeValidate hook (duplicate-request guard)', () => {
  const hook = AccessRequests.hooks!.beforeValidate![0] as (args: any) => unknown

  it('queries by resource, applicant, and pending status, and rejects when one already exists', async () => {
    let capturedArgs: any
    const payload = {
      count: async (args: any) => {
        capturedArgs = args
        return { totalDocs: 1 }
      },
    }
    await expect(
      hook({
        req: { user: { id: 1, role: 'developer' }, payload },
        data: { resource: 10, message: 'again' },
        operation: 'create',
      }),
    ).rejects.toThrow('You already have a pending access request for this resource.')

    expect(capturedArgs.collection).toBe('access-requests')
    expect(capturedArgs.where).toEqual({
      and: [
        { resource: { equals: 10 } },
        { applicant: { equals: 1 } },
        { status: { equals: 'pending' } },
      ],
    })
  })

  it('allows a new request when no pending one exists for the resource', async () => {
    const payload = { count: async () => ({ totalDocs: 0 }) }
    const data = { resource: 10, message: 'please' }
    const result = await hook({
      req: { user: { id: 1, role: 'developer' }, payload },
      data,
      operation: 'create',
    })
    expect(result).toBe(data)
  })
})

interface NotificationCreateCall {
  collection: string
  data: Record<string, unknown>
}

interface AccessRequestsPayloadStub {
  findByID: (args: { collection: string; id: unknown; depth?: number }) => Promise<{ id: number; name: string }>
  create: (args: NotificationCreateCall) => Promise<Record<string, unknown>>
}

interface AccessRequestAfterChangeArgs {
  req: { payload: AccessRequestsPayloadStub }
  doc: Record<string, unknown>
  previousDoc?: Record<string, unknown>
  operation: string
}

describe('AccessRequests afterChange hook', () => {
  const hook = AccessRequests.hooks!.afterChange![0] as (
    args: AccessRequestAfterChangeArgs,
  ) => Promise<Record<string, unknown>>

  function makePayload({
    findByIDResult,
    createCalls,
  }: {
    findByIDResult: { id: number; name: string }
    createCalls: NotificationCreateCall[]
  }): AccessRequestsPayloadStub {
    return {
      findByID: async () => findByIDResult,
      create: async (args) => {
        createCalls.push(args)
        return { id: 900, ...args.data }
      },
    }
  }

  it('creates an access_approved notification for the applicant when status changes to approved', async () => {
    const createCalls: NotificationCreateCall[] = []
    const payload = makePayload({
      findByIDResult: { id: 200, name: 'Quranic Text Toolkit' },
      createCalls,
    })
    const doc = { id: 5, status: 'approved', applicant: 42, resource: 200 }
    const previousDoc = { id: 5, status: 'pending', applicant: 42, resource: 200 }

    await hook({ req: { payload }, doc, previousDoc, operation: 'update' })

    expect(createCalls).toHaveLength(1)
    expect(createCalls[0].collection).toBe('notifications')
    expect(createCalls[0].data.recipient).toBe(42)
    expect(createCalls[0].data.type).toBe('access_approved')
    expect(createCalls[0].data.related_access_request).toBe(5)
    expect(createCalls[0].data.resource_name).toBe('Quranic Text Toolkit')
  })

  it('creates an access_denied notification when status changes to denied', async () => {
    const createCalls: NotificationCreateCall[] = []
    const payload = makePayload({
      findByIDResult: { id: 200, name: 'Quranic Text Toolkit' },
      createCalls,
    })
    const doc = { id: 5, status: 'denied', applicant: 42, resource: 200 }
    const previousDoc = { id: 5, status: 'pending', applicant: 42, resource: 200 }

    await hook({ req: { payload }, doc, previousDoc, operation: 'update' })

    expect(createCalls[0].data.type).toBe('access_denied')
  })

  it('does not create a notification on create (only status transitions on update)', async () => {
    const createCalls: NotificationCreateCall[] = []
    const payload = makePayload({ findByIDResult: { id: 0, name: '' }, createCalls })
    const doc = { id: 5, status: 'pending', applicant: 42, resource: 200 }

    await hook({ req: { payload }, doc, previousDoc: undefined, operation: 'create' })

    expect(createCalls).toHaveLength(0)
  })

  it('does not create a notification when status is unchanged', async () => {
    const createCalls: NotificationCreateCall[] = []
    const payload = makePayload({ findByIDResult: { id: 0, name: '' }, createCalls })
    const doc = { id: 5, status: 'approved', applicant: 42, resource: 200 }
    const previousDoc = { id: 5, status: 'approved', applicant: 42, resource: 200 }

    await hook({ req: { payload }, doc, previousDoc, operation: 'update' })

    expect(createCalls).toHaveLength(0)
  })

  it('does not create a notification for a status change back to pending', async () => {
    const createCalls: NotificationCreateCall[] = []
    const payload = makePayload({ findByIDResult: { id: 0, name: '' }, createCalls })
    const doc = { id: 5, status: 'pending', applicant: 42, resource: 200 }
    const previousDoc = { id: 5, status: 'approved', applicant: 42, resource: 200 }

    await hook({ req: { payload }, doc, previousDoc, operation: 'update' })

    expect(createCalls).toHaveLength(0)
  })
})

describe('AccessRequests status field', () => {
  it('offers revoked alongside the original three states', () => {
    const status = AccessRequests.fields.find(
      (f) => 'name' in f && f.name === 'status',
    ) as { options: string[] }
    expect(status.options).toEqual(['pending', 'approved', 'denied', 'revoked'])
  })
})

interface StatusTransitionArgs {
  req: { user: { id: number; role?: string } }
  data: Record<string, unknown>
  operation: string
  originalDoc: { status: string }
}

describe('AccessRequests beforeChange hook (revoke transitions)', () => {
  const hook = AccessRequests.hooks!.beforeChange![0] as (
    args: StatusTransitionArgs,
  ) => Record<string, unknown>

  function transition(from: string, to: string, user: { id: number; role?: string }) {
    return () =>
      hook({
        req: { user },
        data: { status: to },
        operation: 'update',
        originalDoc: { status: from },
      })
  }

  const publisher = { id: 5, role: 'publisher' }
  const admin = { id: 99, role: 'admin' }

  it('lets the publisher revoke an approved request', () => {
    expect(transition('approved', 'revoked', publisher)().status).toBe('revoked')
  })

  it('lets an admin revoke an approved request', () => {
    expect(transition('approved', 'revoked', admin)().status).toBe('revoked')
  })

  it('refuses to revoke a request that is still pending (deny it instead)', () => {
    expect(transition('pending', 'revoked', publisher)).toThrow(
      'Only an approved access request can be revoked.',
    )
  })

  it('refuses to revoke a denied request', () => {
    expect(transition('denied', 'revoked', publisher)).toThrow(
      'Only an approved access request can be revoked.',
    )
  })

  it('treats re-revoking an already-revoked request as a no-op, not an error', () => {
    // Same status in and out, so the transition block never runs. Worth
    // pinning: a double-click on Revoke must not surface an error.
    expect(transition('revoked', 'revoked', publisher)().status).toBe('revoked')
  })

  it('treats revoked as terminal - it cannot go back to approved', () => {
    expect(transition('revoked', 'approved', publisher)).toThrow(
      'Access request status cannot be changed once decided.',
    )
  })

  it('treats revoked as terminal - it cannot become denied', () => {
    expect(transition('revoked', 'denied', publisher)).toThrow(
      'Access request status cannot be changed once decided.',
    )
  })

  it('still refuses approved -> denied, the invariant revoking does not relax', () => {
    expect(transition('approved', 'denied', publisher)).toThrow(
      'Access request status cannot be changed once decided.',
    )
  })

  it('still refuses denied -> approved', () => {
    expect(transition('denied', 'approved', publisher)).toThrow(
      'Access request status cannot be changed once decided.',
    )
  })

  it('still allows deciding a pending request either way', () => {
    expect(transition('pending', 'approved', publisher)().status).toBe('approved')
    expect(transition('pending', 'denied', publisher)().status).toBe('denied')
  })
})

interface DeleteCall {
  collection: string
  where: Record<string, unknown>
}

interface RevokePayloadStub extends AccessRequestsPayloadStub {
  delete: (args: DeleteCall) => Promise<{ docs: unknown[]; errors: unknown[] }>
}

interface RevokeAfterChangeArgs {
  req: { payload: RevokePayloadStub }
  doc: Record<string, unknown>
  previousDoc?: Record<string, unknown>
  operation: string
}

describe('AccessRequests afterChange hook (revoking)', () => {
  const hook = AccessRequests.hooks!.afterChange![0] as (
    args: RevokeAfterChangeArgs,
  ) => Promise<Record<string, unknown>>

  function makePayload(createCalls: NotificationCreateCall[], deleteCalls: DeleteCall[]) {
    return {
      findByID: async () => ({ id: 200, name: 'Verse Search API' }),
      create: async (args: NotificationCreateCall) => {
        createCalls.push(args)
        return { id: 900, ...args.data }
      },
      delete: async (args: DeleteCall) => {
        deleteCalls.push(args)
        return { docs: [], errors: [] }
      },
    }
  }

  function revoke(createCalls: NotificationCreateCall[], deleteCalls: DeleteCall[]) {
    return hook({
      req: { payload: makePayload(createCalls, deleteCalls) },
      doc: { id: 5, status: 'revoked', applicant: 42, resource: 200 },
      previousDoc: { id: 5, status: 'approved', applicant: 42, resource: 200 },
      operation: 'update',
    })
  }

  it('notifies the applicant with access_revoked, like approved/denied do', async () => {
    const createCalls: NotificationCreateCall[] = []
    await revoke(createCalls, [])

    expect(createCalls).toHaveLength(1)
    expect(createCalls[0].collection).toBe('notifications')
    expect(createCalls[0].data.recipient).toBe(42)
    expect(createCalls[0].data.type).toBe('access_revoked')
    expect(createCalls[0].data.related_access_request).toBe(5)
    expect(createCalls[0].data.resource_name).toBe('Verse Search API')
    expect(createCalls[0].data.message).toContain('Verse Search API')
  })

  it('clears the applicant api-keys for that resource, scoped to both', async () => {
    // Without this the revoke is cosmetic: APIKeys.beforeValidate only
    // checks for an approved request when a key is created, so a key issued
    // earlier would keep working.
    const deleteCalls: DeleteCall[] = []
    await revoke([], deleteCalls)

    expect(deleteCalls).toHaveLength(1)
    expect(deleteCalls[0].collection).toBe('api-keys')
    expect(deleteCalls[0].where).toEqual({
      and: [{ owner: { equals: 42 } }, { resource: { equals: 200 } }],
    })
  })

  it('does not touch api-keys belonging to anyone else or any other resource', async () => {
    const deleteCalls: DeleteCall[] = []
    await revoke([], deleteCalls)

    const where = deleteCalls[0].where as { and: Array<Record<string, { equals: number }>> }
    expect(where.and.find((c) => 'owner' in c)!.owner.equals).toBe(42)
    expect(where.and.find((c) => 'resource' in c)!.resource.equals).toBe(200)
  })

  it('does not delete any api-keys when a request is approved', async () => {
    const deleteCalls: DeleteCall[] = []
    await hook({
      req: { payload: makePayload([], deleteCalls) },
      doc: { id: 5, status: 'approved', applicant: 42, resource: 200 },
      previousDoc: { id: 5, status: 'pending', applicant: 42, resource: 200 },
      operation: 'update',
    })

    expect(deleteCalls).toHaveLength(0)
  })

  it('does not delete any api-keys when a request is denied', async () => {
    const deleteCalls: DeleteCall[] = []
    await hook({
      req: { payload: makePayload([], deleteCalls) },
      doc: { id: 5, status: 'denied', applicant: 42, resource: 200 },
      previousDoc: { id: 5, status: 'pending', applicant: 42, resource: 200 },
      operation: 'update',
    })

    expect(deleteCalls).toHaveLength(0)
  })

  it('resolves the applicant and resource when they arrive as populated objects', async () => {
    const createCalls: NotificationCreateCall[] = []
    const deleteCalls: DeleteCall[] = []
    await hook({
      req: { payload: makePayload(createCalls, deleteCalls) },
      doc: {
        id: 5,
        status: 'revoked',
        applicant: { id: 42, email: 'dev@example.com' },
        resource: { id: 200, slug: 'verse-search' },
      },
      previousDoc: { id: 5, status: 'approved', applicant: 42, resource: 200 },
      operation: 'update',
    })

    expect(deleteCalls[0].where).toEqual({
      and: [{ owner: { equals: 42 } }, { resource: { equals: 200 } }],
    })
    expect(createCalls[0].data.recipient).toBe(42)
  })
})

describe('AccessRequests afterChange hook (api-key deletion failures)', () => {
  const hook = AccessRequests.hooks!.afterChange![0] as (
    args: RevokeAfterChangeArgs,
  ) => Promise<Record<string, unknown>>

  function payloadWithDeleteErrors(
    errors: unknown[],
    createCalls: NotificationCreateCall[] = [],
  ): RevokePayloadStub {
    return {
      findByID: async () => ({ id: 200, name: 'Verse Search API' }),
      create: async (args: NotificationCreateCall) => {
        createCalls.push(args)
        return { id: 900 }
      },
      // Payload reports per-document delete failures here instead of throwing.
      delete: async () => ({ docs: [], errors }),
    }
  }

  const revoking = (payload: RevokePayloadStub) =>
    hook({
      req: { payload },
      doc: { id: 5, status: 'revoked', applicant: 42, resource: 200 },
      previousDoc: { id: 5, status: 'approved', applicant: 42, resource: 200 },
      operation: 'update',
    })

  it('fails the revoke when a key could not be deleted, rather than reporting success', async () => {
    await expect(
      revoking(payloadWithDeleteErrors([{ id: 7, message: 'locked' }])),
    ).rejects.toThrow('Could not revoke access')
  })

  it('does not notify the applicant when the keys survived', async () => {
    // Telling someone their access is gone while their key still works is
    // the worst of the two failure modes.
    const createCalls: NotificationCreateCall[] = []
    await expect(
      revoking(payloadWithDeleteErrors([{ id: 7, message: 'locked' }], createCalls)),
    ).rejects.toThrow()
    expect(createCalls).toHaveLength(0)
  })

  it('proceeds normally when the delete reports no errors', async () => {
    const createCalls: NotificationCreateCall[] = []
    await revoking(payloadWithDeleteErrors([], createCalls))
    expect(createCalls).toHaveLength(1)
    expect(createCalls[0].data.type).toBe('access_revoked')
  })

  it('treats a delete that matched nothing as success, not failure', async () => {
    // A developer holding no keys is normal, not an error.
    const createCalls: NotificationCreateCall[] = []
    await revoking({
      findByID: async () => ({ id: 200, name: 'Verse Search API' }),
      create: async (args: NotificationCreateCall) => {
        createCalls.push(args)
        return { id: 900 }
      },
      delete: async () => ({ docs: [], errors: [] }),
    })
    expect(createCalls).toHaveLength(1)
  })
})
