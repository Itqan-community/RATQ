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

describe('AccessRequests afterChange hook', () => {
  const hook = AccessRequests.hooks!.afterChange![0] as (args: any) => unknown

  function makePayload({ findByIDResult, createCalls }: { findByIDResult: any; createCalls: any[] }) {
    return {
      findByID: async (_args: any) => findByIDResult,
      create: async (args: any) => {
        createCalls.push(args)
        return { id: 900, ...args.data }
      },
    }
  }

  it('creates an access_approved notification for the applicant when status changes to approved', async () => {
    const createCalls: any[] = []
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
    const createCalls: any[] = []
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
    const createCalls: any[] = []
    const payload = makePayload({ findByIDResult: {}, createCalls })
    const doc = { id: 5, status: 'pending', applicant: 42, resource: 200 }

    await hook({ req: { payload }, doc, previousDoc: undefined, operation: 'create' })

    expect(createCalls).toHaveLength(0)
  })

  it('does not create a notification when status is unchanged', async () => {
    const createCalls: any[] = []
    const payload = makePayload({ findByIDResult: {}, createCalls })
    const doc = { id: 5, status: 'approved', applicant: 42, resource: 200 }
    const previousDoc = { id: 5, status: 'approved', applicant: 42, resource: 200 }

    await hook({ req: { payload }, doc, previousDoc, operation: 'update' })

    expect(createCalls).toHaveLength(0)
  })

  it('does not create a notification for a status change back to pending', async () => {
    const createCalls: any[] = []
    const payload = makePayload({ findByIDResult: {}, createCalls })
    const doc = { id: 5, status: 'pending', applicant: 42, resource: 200 }
    const previousDoc = { id: 5, status: 'approved', applicant: 42, resource: 200 }

    await hook({ req: { payload }, doc, previousDoc, operation: 'update' })

    expect(createCalls).toHaveLength(0)
  })
})
