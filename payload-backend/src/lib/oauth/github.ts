import { createHash } from 'crypto'
import { SignJWT, jwtVerify } from 'jose'

export function buildGitHubAuthorizeUrl({
  clientId,
  redirectUri,
  state,
}: {
  clientId: string
  redirectUri: string
  state: string
}): string {
  const url = new URL('https://github.com/login/oauth/authorize')
  url.searchParams.set('client_id', clientId)
  url.searchParams.set('redirect_uri', redirectUri)
  url.searchParams.set('scope', 'read:user user:email')
  url.searchParams.set('state', state)
  return url.toString()
}

interface GitHubEmail {
  email: string
  primary: boolean
  verified: boolean
}

// GitHub's own email field on /user can be null if the user hasn't made it
// public - /user/emails is the reliable source, and only a verified one is
// safe to auto-link an existing Payload account to.
export function pickVerifiedEmail(emails: GitHubEmail[]): string | null {
  const primary = emails.find((e) => e.primary && e.verified)
  if (primary) return primary.email
  const anyVerified = emails.find((e) => e.verified)
  return anyVerified ? anyVerified.email : null
}

// Matches the exact claims shape/algorithm Payload's own local auth strategy
// signs (node_modules/payload/dist/auth/jwt.js + getFieldsToSign.js), so the
// resulting token is indistinguishable from a normal password-login token.
// sid is required here (not optional) because Users has useSessions: true by
// default (payload-backend/node_modules/payload/dist/collections/config/defaults.js) -
// the JWT strategy rejects any token without a sid matching a stored session
// (node_modules/payload/dist/auth/strategies/jwt.js).
export async function signSessionJWT({
  id,
  email,
  secret,
  sid,
  tokenExpiration,
}: {
  id: number | string
  email: string
  secret: string
  sid: string
  tokenExpiration: number
}): Promise<string> {
  const secretKey = new TextEncoder().encode(secret)
  const issuedAt = Math.floor(Date.now() / 1000)
  return new SignJWT({ id, collection: 'users', email, sid })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt(issuedAt)
    .setExpirationTime(issuedAt + tokenExpiration)
    .sign(secretKey)
}

// --- One-time exchange tokens (issue #229) -------------------------------
// The OAuth callback can only hand data back to the frontend through a
// redirect URL, and a session token in a URL leaks into browser history,
// access logs and Referer headers. So the callback hands over one of these
// instead: a short-lived ticket that is worthless on its own, which the
// frontend immediately POSTs to /oauth/github/exchange for the real token.

const EXCHANGE_PURPOSE = 'oauth_exchange'
const EXCHANGE_TTL_SECONDS = 60

interface ExchangeClaims {
  userId: number | string
  sid: string
}

// Deliberately NOT payload.secret: session tokens are verified against that
// key, so signing tickets with it would make every ticket a structurally
// valid session token, leaving a claim check as the only thing standing
// between the two. A separate key makes the confusion impossible instead -
// Payload's verification fails on a ticket, and ours fails on a session token.
function exchangeKey(secret: string): Uint8Array {
  return createHash('sha256').update(`${secret}:oauth-exchange`).digest()
}

// The ticket only has to survive one redirect and the POST that immediately
// follows it, hence the 60s TTL - compare that to a session token's days.
export async function signExchangeToken({
  userId,
  sid,
  secret,
}: {
  userId: number | string
  sid: string
  secret: string
}): Promise<string> {
  const issuedAt = Math.floor(Date.now() / 1000)
  return new SignJWT({ userId, sid, purpose: EXCHANGE_PURPOSE })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt(issuedAt)
    .setExpirationTime(issuedAt + EXCHANGE_TTL_SECONDS)
    .sign(exchangeKey(secret))
}

// Returns null rather than throwing: every failure here (bad signature,
// expired, wrong purpose, malformed) is the same non-event to the caller -
// this ticket is not valid, send the user back to /login.
export async function verifyExchangeToken({
  token,
  secret,
}: {
  token: string
  secret: string
}): Promise<ExchangeClaims | null> {
  try {
    const { payload } = await jwtVerify(token, exchangeKey(secret))
    if (payload.purpose !== EXCHANGE_PURPOSE) return null
    if (typeof payload.sid !== 'string') return null
    if (typeof payload.userId !== 'number' && typeof payload.userId !== 'string') return null
    return { userId: payload.userId, sid: payload.sid }
  } catch {
    return null
  }
}
