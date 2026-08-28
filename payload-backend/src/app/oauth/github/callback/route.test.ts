import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('payload', () => ({
  getPayload: vi.fn(),
}))

vi.mock('@payload-config', () => ({ default: {} }))

vi.mock('@/lib/oauth/github', () => ({
  pickVerifiedEmail: vi.fn(),
  signSessionJWT: vi.fn(),
  signExchangeToken: vi.fn().mockResolvedValue('fake-exchange-token'),
}))

const { getPayload } = await import('payload')
const { pickVerifiedEmail, signSessionJWT } = await import('@/lib/oauth/github')

const mockedGetPayload = vi.mocked(getPayload)
const mockedPickVerifiedEmail = vi.mocked(pickVerifiedEmail)
const mockedSignSessionJWT = vi.mocked(signSessionJWT)

// GitHub OAuth issue #263: the route previously generated passwords by
// concatenating two UUIDs (36+36=72 chars), which exceeded the 64-char max
// enforced by the passwordValidation beforeValidate hook landing in PR #259.
// Without the fix, first-time GitHub signups threw an unhandled error -> HTTP 500.
// This regression test asserts the password constraint directly (8-64 chars) so
// the route stays forward-compatible once that hook is wired in.

describe('GitHub OAuth callback - first-time signup', () => {
  const mockPayload = {
    find: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    secret: 'test-payload-secret',
    collections: {
      users: {
        config: { auth: { tokenExpiration: 7200 } },
      },
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()

    process.env.GITHUB_CLIENT_ID = 'gh-client-id'
    process.env.GITHUB_CLIENT_SECRET = 'gh-client-secret'
    process.env.OAUTH_CALLBACK_URL = 'https://api.beta.ratq.itqan.dev/oauth/github/callback'
    process.env.FRONTEND_URL = 'https://beta.ratq.itqan.dev'

    mockedGetPayload.mockResolvedValue(mockPayload as unknown as Awaited<ReturnType<typeof getPayload>>)
    mockedPickVerifiedEmail.mockReturnValue('test@example.com')
    mockedSignSessionJWT.mockResolvedValue('fake-jwt-token')

    mockPayload.find.mockResolvedValue({ docs: [] })
    mockPayload.create.mockResolvedValue({ id: 1, email: 'test@example.com', sessions: [] })
  })

  afterEach(() => {
    delete process.env.GITHUB_CLIENT_ID
    delete process.env.GITHUB_CLIENT_SECRET
    delete process.env.OAUTH_CALLBACK_URL
    delete process.env.FRONTEND_URL
  })

  function buildFetchMock() {
    return vi.fn().mockImplementation(async (url: string | URL | RequestInfo) => {
      const urlString = typeof url === 'string' ? url : String(url)
      if (urlString.includes('/login/oauth/access_token')) {
        return {
          ok: true,
          json: async () => ({ access_token: 'gh-access-token' }),
        }
      }
      if (urlString.includes('api.github.com/user') && !urlString.includes('/emails')) {
        return {
          ok: true,
          json: async () => ({ id: 999, login: 'testuser', name: 'Test User' }),
        }
      }
      if (urlString.includes('api.github.com/user/emails')) {
        return {
          ok: true,
          json: async () => [{ email: 'test@example.com', primary: true, verified: true }],
        }
      }
      throw new Error(`unexpected fetch to ${urlString}`)
    })
  }

  it('creates a user with a password <= 64 chars on first-time GitHub signup', async () => {
    global.fetch = buildFetchMock()

    const request = new Request(
      'https://beta.ratq.itqan.dev/oauth/github/callback?code=auth-code&state=test-state',
      {
        headers: { cookie: 'oauth_state=test-state' },
      },
    )

    const { GET } = await import('./route')
    const response = await GET(request)

    expect(response.status).toBe(307)
    expect(mockPayload.find).toHaveBeenCalledWith(
      expect.objectContaining({ collection: 'users' }),
    )
    expect(mockPayload.create).toHaveBeenCalledTimes(1)

    const createArgs = mockPayload.create.mock.calls[0][0] as {
      collection: string
      data: { email: string; password: string; display_name: string }
    }
    expect(createArgs.collection).toBe('users')
    expect(createArgs.data.email).toBe('test@example.com')
    expect(createArgs.data.display_name).toBe('Test User')

    const password = createArgs.data.password
    expect(typeof password).toBe('string')
    expect(password.length).toBeGreaterThanOrEqual(8)
    expect(password.length).toBeLessThanOrEqual(64)
  })

  it('uses the existing user and does not call create on subsequent logins', async () => {
    global.fetch = buildFetchMock()

    const existingUser = { id: 1, email: 'test@example.com', sessions: [] }
    mockPayload.find.mockResolvedValue({ docs: [existingUser] })
    mockPayload.create.mockClear()

    const request = new Request(
      'https://beta.ratq.itqan.dev/oauth/github/callback?code=auth-code&state=test-state',
      {
        headers: { cookie: 'oauth_state=test-state' },
      },
    )

    const { GET } = await import('./route')
    await GET(request)

    expect(mockPayload.create).not.toHaveBeenCalled()
    expect(mockPayload.update).toHaveBeenCalledTimes(1)
  })
})
