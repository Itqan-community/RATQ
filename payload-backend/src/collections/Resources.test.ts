import { describe, expect, it } from 'vitest'
import { Resources } from './Resources'

// Smoke test proving the vitest harness can unit-test a Payload Access
// function against a mocked {req:{user}} object, no live Payload/Postgres.
describe('Resources access.update (isOwner)', () => {
  const isOwner = Resources.access!.update as (args: { req: { user: unknown } }) => unknown

  it('denies when there is no logged-in user', () => {
    expect(isOwner({ req: { user: null } })).toBe(false)
  })

  it('scopes the query to the requesting user when logged in', () => {
    expect(isOwner({ req: { user: { id: 'user-1' } } })).toEqual({
      owner: { equals: 'user-1' },
    })
  })
})
