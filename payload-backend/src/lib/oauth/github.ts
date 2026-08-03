import { SignJWT } from 'jose'

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
