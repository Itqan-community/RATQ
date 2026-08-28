import crypto from 'crypto'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import config from '@payload-config'
import { pickVerifiedEmail, signSessionJWT } from '@/lib/oauth/github'

interface GitHubTokenResponse {
  access_token?: string
  error?: string
}

interface GitHubUser {
  id: number
  login: string
  name: string | null
  email: string | null
}

interface GitHubEmail {
  email: string
  primary: boolean
  verified: boolean
}

function loginFailure(frontendUrl: string, reason: string) {
  return NextResponse.redirect(`${frontendUrl}/login?error=${reason}`)
}

export async function GET(request: Request) {
  const frontendUrl = process.env.FRONTEND_URL || 'https://beta.ratq.itqan.dev'
  const clientId = process.env.GITHUB_CLIENT_ID
  const clientSecret = process.env.GITHUB_CLIENT_SECRET
  const callbackUrl = process.env.OAUTH_CALLBACK_URL

  if (!clientId || !clientSecret || !callbackUrl) {
    return loginFailure(frontendUrl, 'oauth_not_configured')
  }

  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const cookieState = request.headers
    .get('cookie')
    ?.split('; ')
    .find((c) => c.startsWith('oauth_state='))
    ?.split('=')[1]

  if (!code || !state || !cookieState || state !== cookieState) {
    return loginFailure(frontendUrl, 'oauth_state_mismatch')
  }

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code, redirect_uri: callbackUrl }),
  })
  const tokenData: GitHubTokenResponse = await tokenRes.json()
  if (!tokenRes.ok || !tokenData.access_token) {
    return loginFailure(frontendUrl, 'oauth_exchange_failed')
  }

  const githubHeaders = {
    Authorization: `Bearer ${tokenData.access_token}`,
    'User-Agent': 'RATQ',
    Accept: 'application/vnd.github+json',
  }
  const [userRes, emailsRes] = await Promise.all([
    fetch('https://api.github.com/user', { headers: githubHeaders }),
    fetch('https://api.github.com/user/emails', { headers: githubHeaders }),
  ])
  if (!userRes.ok || !emailsRes.ok) {
    return loginFailure(frontendUrl, 'oauth_profile_fetch_failed')
  }
  const githubUser: GitHubUser = await userRes.json()
  const emails: GitHubEmail[] = await emailsRes.json()
  // No fallback to githubUser.email here - only a *verified* email is safe to
  // auto-link an existing RATQ account to (see pickVerifiedEmail).
  const email = pickVerifiedEmail(emails)

  if (!email) {
    return loginFailure(frontendUrl, 'oauth_no_verified_email')
  }

  const payload = await getPayload({ config })
  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
  })

  const user = existing.docs[0]
    ? existing.docs[0]
    : await payload.create({
        collection: 'users',
        data: {
          email,
          // Never used for login - this account only ever authenticates via
          // GitHub. Payload's auth:true collections require some password.
          // crypto.randomBytes(32).toString('hex') yields exactly 64
          // hex chars, staying within the max length enforced by the
          // passwordValidation beforeValidate hook (PR #259).
          password: crypto.randomBytes(32).toString('hex'),
          display_name: githubUser.name || githubUser.login,
        },
      })

  const usersConfig = payload.collections.users.config
  const tokenExpiration = usersConfig.auth.tokenExpiration

  // Users has useSessions: true (Payload's default) - the JWT strategy
  // (node_modules/payload/dist/auth/strategies/jwt.js) rejects any token
  // whose sid doesn't match a session stored on the user doc, so a session
  // record must exist before the token is usable.
  const sid = crypto.randomUUID()
  const now = new Date()
  const existingSessions = ((user.sessions as { id: string; expiresAt: string }[]) || []).filter(
    (session) => new Date(session.expiresAt) > now
  )
  await payload.update({
    collection: 'users',
    id: user.id,
    data: {
      sessions: [
        ...existingSessions,
        { id: sid, createdAt: now.toISOString(), expiresAt: new Date(now.getTime() + tokenExpiration * 1000).toISOString() },
      ],
    },
  })

  // payload.secret is NOT process.env.PAYLOAD_SECRET - Payload derives it as
  // sha256(config.secret).hex.slice(0, 32) (node_modules/payload/dist/index.js)
  // and that derived value is what its own JWT strategy verifies against.
  const token = await signSessionJWT({
    id: user.id,
    email: user.email,
    secret: payload.secret,
    sid,
    tokenExpiration,
  })

  const response = NextResponse.redirect(`${frontendUrl}/oauth/callback?token=${token}`)
  response.cookies.set('oauth_state', '', { path: '/oauth/github', maxAge: 0 })
  return response
}
