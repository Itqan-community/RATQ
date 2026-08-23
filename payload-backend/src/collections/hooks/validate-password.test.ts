import { describe, expect, it } from 'vitest'
import { APIError } from 'payload'
import { passwordValidation } from './validate-password'

async function runHook(data: Record<string, unknown> | undefined) {
  return passwordValidation({ data } as Parameters<typeof passwordValidation>[0])
}

describe('passwordValidation', () => {
  it('returns without throwing when no data is provided', async () => {
    await expect(runHook(undefined)).resolves.toBeUndefined()
  })

  it('rejects a missing password', async () => {
    await expect(runHook({ email: 'dev@example.com' })).rejects.toMatchObject({
      message: 'Password is required',
      status: 422,
    })
    await expect(runHook({ email: 'dev@example.com' })).rejects.toBeInstanceOf(APIError)
  })

  it('rejects a password shorter than 8 characters', async () => {
    await expect(runHook({ password: 'short' })).rejects.toMatchObject({
      message: 'Password must be at least 8 characters long',
      status: 422,
    })
  })

  it('rejects a password longer than 64 characters', async () => {
    await expect(runHook({ password: 'a'.repeat(65) })).rejects.toMatchObject({
      message: 'Password must be less than 64 characters long',
      status: 422,
    })
  })

  it('returns the data when the password is between 8 and 64 characters', async () => {
    const data = { password: 'validpass', email: 'dev@example.com' }
    await expect(runHook(data)).resolves.toEqual(data)
  })
})
