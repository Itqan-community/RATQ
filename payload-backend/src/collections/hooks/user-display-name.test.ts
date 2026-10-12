import { describe, expect, it, vi } from 'vitest'
import { publicDisplayName, userNameAfterRead } from './user-display-name'
import { AccessRequests } from '../AccessRequests'
import { Reports } from '../Reports'

describe('display-name fields are wired and read-only', () => {
  const field = (fields: any[], name: string) => fields.find((f) => f.name === name)

  it.each([
    ['access-requests', AccessRequests.fields, 'applicant_name'],
    ['reports', Reports.fields, 'reporter_name'],
  ])('%s exposes a virtual %s that clients cannot write', (_slug, fields, name) => {
    const f = field(fields as any[], name)
    expect(f.virtual).toBe(true)
    expect(f.hooks.afterRead).toHaveLength(1)
    expect(f.access.create()).toBe(false)
    expect(f.access.update()).toBe(false)
  })
})

describe('publicDisplayName', () => {
  it('prefers display_name', () => {
    expect(publicDisplayName({ display_name: 'Aisha', email: 'aisha@example.com' })).toBe('Aisha')
  })

  it('falls back to the email local part, never the full address', () => {
    expect(publicDisplayName({ display_name: null, email: 'aisha@example.com' })).toBe('aisha')
  })

  it('returns null when there is nothing to show', () => {
    expect(publicDisplayName({})).toBeNull()
  })
})

describe('userNameAfterRead', () => {
  const makeReq = (findByID: ReturnType<typeof vi.fn>) =>
    ({ context: {}, payload: { findByID } }) as any

  it('uses an already populated user without a lookup', async () => {
    const findByID = vi.fn()
    const hook = userNameAfterRead('applicant')
    const name = await hook({
      data: { applicant: { id: 4, display_name: 'Omar', email: 'omar@example.com' } },
      req: makeReq(findByID),
    } as any)
    expect(name).toBe('Omar')
    expect(findByID).not.toHaveBeenCalled()
  })

  it('looks a bare id up with overrideAccess so a non-admin viewer still gets a name', async () => {
    const findByID = vi.fn().mockResolvedValue({ id: 4, display_name: null, email: 'omar@example.com' })
    const hook = userNameAfterRead('applicant')
    const name = await hook({ data: { applicant: 4 }, req: makeReq(findByID) } as any)
    expect(name).toBe('omar')
    expect(findByID).toHaveBeenCalledWith(
      expect.objectContaining({ collection: 'users', id: 4, depth: 0, overrideAccess: true }),
    )
  })

  it('looks each user up once per request even when a list is read in parallel', async () => {
    // Payload runs afterRead hooks for every doc of a find() concurrently, so
    // the cache has to hold the in-flight promise, not the finished value.
    const findByID = vi.fn().mockResolvedValue({ id: 4, display_name: 'Omar', email: 'o@example.com' })
    const req = makeReq(findByID)
    const hook = userNameAfterRead('reporter')
    const names = await Promise.all([
      hook({ data: { reporter: 4 }, req } as any),
      hook({ data: { reporter: 4 }, req } as any),
      hook({ data: { reporter: 4 }, req } as any),
    ])
    expect(names).toEqual(['Omar', 'Omar', 'Omar'])
    expect(findByID).toHaveBeenCalledTimes(1)
  })

  it('returns null instead of throwing when the user no longer exists', async () => {
    const findByID = vi.fn().mockRejectedValue(new Error('Not Found'))
    const hook = userNameAfterRead('applicant')
    await expect(hook({ data: { applicant: 404 }, req: makeReq(findByID) } as any)).resolves.toBeNull()
  })

  it('returns null when the source field is empty', async () => {
    const hook = userNameAfterRead('applicant')
    await expect(hook({ data: {}, req: makeReq(vi.fn()) } as any)).resolves.toBeNull()
  })
})
