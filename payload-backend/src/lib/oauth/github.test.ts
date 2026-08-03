import { jwtVerify } from 'jose'
import { describe, expect, it } from 'vitest'

import { buildGitHubAuthorizeUrl, pickVerifiedEmail, signSessionJWT } from './github'

describe('buildGitHubAuthorizeUrl', () => {
  it('builds the GitHub authorize URL with client_id/redirect_uri/scope/state', () => {
    const url = buildGitHubAuthorizeUrl({
      clientId: 'abc123',
      redirectUri: 'https://api.beta.ratq.itqan.dev/oauth/github/callback',
      state: 'xyz',
    })
    const parsed = new URL(url)
    expect(parsed.origin + parsed.pathname).toBe('https://github.com/login/oauth/authorize')
    expect(parsed.searchParams.get('client_id')).toBe('abc123')
    expect(parsed.searchParams.get('redirect_uri')).toBe('https://api.beta.ratq.itqan.dev/oauth/github/callback')
    expect(parsed.searchParams.get('scope')).toBe('read:user user:email')
    expect(parsed.searchParams.get('state')).toBe('xyz')
  })
})

describe('pickVerifiedEmail', () => {
  it('prefers the primary verified email', () => {
    const emails = [
      { email: 'secondary@example.com', primary: false, verified: true },
      { email: 'primary@example.com', primary: true, verified: true },
    ]
    expect(pickVerifiedEmail(emails)).toBe('primary@example.com')
  })

  it('falls back to any verified email if none is primary', () => {
    const emails = [
      { email: 'unverified@example.com', primary: true, verified: false },
      { email: 'verified@example.com', primary: false, verified: true },
    ]
    expect(pickVerifiedEmail(emails)).toBe('verified@example.com')
  })

  it('returns null when no email is verified', () => {
    expect(pickVerifiedEmail([{ email: 'unverified@example.com', primary: true, verified: false }])).toBeNull()
  })

  it('returns null for an empty list', () => {
    expect(pickVerifiedEmail([])).toBeNull()
  })
})

describe('signSessionJWT', () => {
  it('produces a JWT verifiable with the same secret, carrying id/collection/email/sid', async () => {
    const secret = 'test-secret'
    const token = await signSessionJWT({
      id: 42,
      email: 'dev@example.com',
      secret,
      sid: 'session-abc',
      tokenExpiration: 7200,
    })
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret))
    expect(payload.id).toBe(42)
    expect(payload.collection).toBe('users')
    expect(payload.email).toBe('dev@example.com')
    expect(payload.sid).toBe('session-abc')
    expect(typeof payload.exp).toBe('number')
  })

  it('rejects verification with the wrong secret', async () => {
    const token = await signSessionJWT({
      id: 1,
      email: 'a@b.com',
      secret: 'right',
      sid: 'session-1',
      tokenExpiration: 7200,
    })
    await expect(jwtVerify(token, new TextEncoder().encode('wrong'))).rejects.toThrow()
  })
})
