import { SignJWT, jwtVerify } from 'jose'
import { describe, expect, it } from 'vitest'

import { createHash } from 'crypto'

import {
  buildGitHubAuthorizeUrl,
  pickVerifiedEmail,
  signExchangeToken,
  signSessionJWT,
  verifyExchangeToken,
} from './github'

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

describe('exchange tokens', () => {
  const secret = 'payload-secret'
  // Mirrors exchangeKey() in github.ts - tests that need to forge a token
  // have to sign it with the same derived key the verifier uses.
  const key = createHash('sha256').update(`${secret}:oauth-exchange`).digest()

  it('round-trips the claims it was given', async () => {
    const token = await signExchangeToken({ userId: 7, sid: 'session-abc', secret })
    expect(await verifyExchangeToken({ token, secret })).toEqual({
      userId: 7,
      sid: 'session-abc',
    })
  })

  it('expires within a minute', async () => {
    const token = await signExchangeToken({ userId: 7, sid: 'session-abc', secret })
    const { payload } = await jwtVerify(token, key)
    expect(payload.exp! - payload.iat!).toBe(60)
  })

  it('rejects a token signed with a different secret', async () => {
    const token = await signExchangeToken({ userId: 7, sid: 'session-abc', secret })
    expect(await verifyExchangeToken({ token, secret: 'other-secret' })).toBeNull()
  })

  it('rejects a tampered token', async () => {
    const token = await signExchangeToken({ userId: 7, sid: 'session-abc', secret })
    expect(await verifyExchangeToken({ token: `${token.slice(0, -3)}aaa`, secret })).toBeNull()
  })

  it('rejects a token with the wrong purpose', async () => {
    const token = await new SignJWT({ userId: 7, sid: 'session-abc', purpose: 'something_else' })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuedAt()
      .setExpirationTime('5m')
      .sign(key)
    expect(await verifyExchangeToken({ token, secret })).toBeNull()
  })

  it('rejects an expired token', async () => {
    const past = Math.floor(Date.now() / 1000) - 120
    const token = await new SignJWT({ userId: 7, sid: 'session-abc', purpose: 'oauth_exchange' })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuedAt(past)
      .setExpirationTime(past + 60)
      .sign(key)
    expect(await verifyExchangeToken({ token, secret })).toBeNull()
  })

  it('rejects a token missing the claims the exchange route relies on', async () => {
    const token = await new SignJWT({ purpose: 'oauth_exchange' })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuedAt()
      .setExpirationTime('5m')
      .sign(key)
    expect(await verifyExchangeToken({ token, secret })).toBeNull()
  })

  // The whole reason exchange tokens use a key derived from payload.secret
  // rather than payload.secret itself: a session token must never be
  // redeemable as an exchange code, and vice versa.
  it('does not accept a session token as an exchange token', async () => {
    const sessionToken = await signSessionJWT({
      id: 7,
      email: 'dev@example.com',
      secret,
      sid: 'session-abc',
      tokenExpiration: 7200,
    })
    expect(await verifyExchangeToken({ token: sessionToken, secret })).toBeNull()
  })

  it('does not let an exchange token pass as a session token', async () => {
    const token = await signExchangeToken({ userId: 7, sid: 'session-abc', secret })
    await expect(jwtVerify(token, new TextEncoder().encode(secret))).rejects.toThrow()
  })
})
