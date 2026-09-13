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

interface NotificationCreateCall {
  collection: string
  data: Record<string, unknown>
}

interface ReportsPayloadStub {
  findByID: (args: { collection: string; id: unknown; depth?: number }) => Promise<{ id: number; name: string }>
  create: (args: NotificationCreateCall) => Promise<Record<string, unknown>>
}

interface ReportAfterChangeArgs {
  req: { payload: ReportsPayloadStub }
  doc: Record<string, unknown>
  previousDoc?: Record<string, unknown>
  operation: string
}

describe('Reports afterChange hook', () => {
  const hook = Reports.hooks!.afterChange![0] as (
    args: ReportAfterChangeArgs,
  ) => Promise<Record<string, unknown>>

  function makePayload({
    findByIDResult,
    createCalls,
  }: {
    findByIDResult: { id: number; name: string }
    createCalls: NotificationCreateCall[]
  }): ReportsPayloadStub {
    return {
      findByID: async () => findByIDResult,
      create: async (args) => {
        createCalls.push(args)
        return { id: 900, ...args.data }
      },
    }
  }

  it('creates a report_resolved notification for the reporter when status changes to resolved', async () => {
    const createCalls: NotificationCreateCall[] = []
    const payload = makePayload({
      findByIDResult: { id: 200, name: 'Arabic Font Rendering Engine' },
      createCalls,
    })
    const doc = { id: 7, status: 'resolved', reporter: 42, resource: 200 }
    const previousDoc = { id: 7, status: 'open', reporter: 42, resource: 200 }

    await hook({ req: { payload }, doc, previousDoc, operation: 'update' })

    expect(createCalls).toHaveLength(1)
    expect(createCalls[0].collection).toBe('notifications')
    expect(createCalls[0].data.recipient).toBe(42)
    expect(createCalls[0].data.type).toBe('report_resolved')
    expect(createCalls[0].data.related_report).toBe(7)
  })

  it('creates a report_status_change notification for a status change that is not resolved', async () => {
    const createCalls: NotificationCreateCall[] = []
    const payload = makePayload({
      findByIDResult: { id: 200, name: 'Arabic Font Rendering Engine' },
      createCalls,
    })
    const doc = { id: 7, status: 'closed', reporter: 42, resource: 200 }
    const previousDoc = { id: 7, status: 'open', reporter: 42, resource: 200 }

    await hook({ req: { payload }, doc, previousDoc, operation: 'update' })

    expect(createCalls[0].data.type).toBe('report_status_change')
  })

  it('does not create a notification on create', async () => {
    const createCalls: NotificationCreateCall[] = []
    const payload = makePayload({ findByIDResult: { id: 0, name: '' }, createCalls })
    const doc = { id: 7, status: 'open', reporter: 42, resource: 200 }

    await hook({ req: { payload }, doc, previousDoc: undefined, operation: 'create' })

    expect(createCalls).toHaveLength(0)
  })

  it('does not create a notification when status is unchanged', async () => {
    const createCalls: NotificationCreateCall[] = []
    const payload = makePayload({ findByIDResult: { id: 0, name: '' }, createCalls })
    const doc = { id: 7, status: 'open', reporter: 42, resource: 200 }
    const previousDoc = { id: 7, status: 'open', reporter: 42, resource: 200 }

    await hook({ req: { payload }, doc, previousDoc, operation: 'update' })

    expect(createCalls).toHaveLength(0)
  })
})

describe('Reports beforeValidate hook (duplicate-report guard)', () => {
  const hook = Reports.hooks!.beforeValidate![0] as (args: {
    req: { user: ReqUser; payload: { count: (args: unknown) => Promise<{ totalDocs: number }> } }
    data: Record<string, unknown>
    operation: string
  }) => Promise<unknown>

  it('queries by resource, reporter, and open status, and rejects when an open report already exists', async () => {
    let capturedArgs: { collection?: string; where?: { and?: Array<Record<string, unknown>> } } = {}
    const payload = {
      count: async (args: unknown) => {
        capturedArgs = args as typeof capturedArgs
        return { totalDocs: 1 }
      },
    }
    await expect(
      hook({
        req: { user: { id: 1, role: 'developer' }, payload },
        data: { resource: 10, reason: 'spam' },
        operation: 'create',
      }),
    ).rejects.toThrow('You already have an open report for this resource.')

    expect(capturedArgs.collection).toBe('reports')
    expect(capturedArgs.where).toEqual({
      and: [
        { resource: { equals: 10 } },
        { reporter: { equals: 1 } },
        { status: { equals: 'open' } },
      ],
    })
  })

  it('allows a new report when no open report exists for the resource', async () => {
    const payload = { count: async () => ({ totalDocs: 0 }) }
    const data = { resource: 10, reason: 'spam' }
    const result = await hook({
      req: { user: { id: 1, role: 'developer' }, payload },
      data,
      operation: 'create',
    })
    expect(result).toBe(data)
  })

  it('allows a new report if previous reports on the same resource are resolved or closed', async () => {
    let capturedWhere: { and?: Array<Record<string, unknown>> } = {}
    const payload = {
      count: async (args: unknown) => {
        capturedWhere = (args as { where: typeof capturedWhere }).where
        return { totalDocs: 0 }
      },
    }
    await hook({
      req: { user: { id: 1, role: 'developer' }, payload },
      data: { resource: 10, reason: 'outdated' },
      operation: 'create',
    })
    expect(capturedWhere.and).toContainEqual({ status: { equals: 'open' } })
    expect(capturedWhere.and).toContainEqual({ reporter: { equals: 1 } })
  })

  it('handles populated resource objects gracefully ({ id: 10 })', async () => {
    let capturedWhere: { and?: Array<Record<string, unknown>> } = {}
    const payload = {
      count: async (args: unknown) => {
        capturedWhere = (args as { where: typeof capturedWhere }).where
        return { totalDocs: 0 }
      },
    }
    await hook({
      req: { user: { id: 1, role: 'developer' }, payload },
      data: { resource: { id: 10, name: 'Sample Resource' }, reason: 'spam' },
      operation: 'create',
    })
    expect(capturedWhere.and).toContainEqual({ resource: { equals: 10 } })
  })

  it('bypasses check on update operations', async () => {
    const payload = {
      count: async () => {
        throw new Error('count should not be called')
      },
    }
    const data = { status: 'resolved' }
    const result = await hook({
      req: { user: { id: 99, role: 'admin' }, payload },
      data,
      operation: 'update',
    })
    expect(result).toBe(data)
  })
})
