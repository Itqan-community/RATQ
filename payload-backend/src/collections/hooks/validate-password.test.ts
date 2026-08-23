import { describe, expect, it } from 'vitest'
import { APIError } from 'payload'
import { passwordValidation } from './validate-password'

const lengthError = 'Password must be between 8 and 64 characters long'

async function runHook(data: Record<string, unknown> | undefined) {
  return passwordValidation({ data } as Parameters<typeof passwordValidation>[0])
}

describe('passwordValidation', () => {
  it('returns without throwing when no data is provided', async () => {
    await expect(runHook(undefined)).resolves.toBeUndefined()
  })

  it('allows an update with no password field', async () => {
    const data = { email: 'dev@example.com' }
    await expect(runHook(data)).resolves.toEqual(data)
  })

  it('rejects an empty password string', async () => {
    await expect(runHook({ password: '' })).rejects.toMatchObject({
      message: lengthError,
      status: 422,
    })
    await expect(runHook({ password: '' })).rejects.toBeInstanceOf(APIError)
  })

  it('rejects a password shorter than 8 characters', async () => {
    await expect(runHook({ password: 'short' })).rejects.toMatchObject({
      message: lengthError,
      status: 422,
    })
  })

  it('rejects a password longer than 64 characters', async () => {
    await expect(runHook({ password: 'a'.repeat(65) })).rejects.toMatchObject({
      message: lengthError,
      status: 422,
    })
  })

  it('returns the data when the password is between 8 and 64 characters', async () => {
    const data = { password: 'validpass', email: 'dev@example.com' }
    await expect(runHook(data)).resolves.toEqual(data)
  })
})
