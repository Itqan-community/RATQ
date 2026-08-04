import { NextResponse } from 'next/server'

import { buildGitHubAuthorizeUrl } from '@/lib/oauth/github'

// Lives outside the (payload) route group on purpose - Payload's own
// (payload)/api/[...slug]/route.ts catch-all owns the entire /api/* subtree,
// so a sibling /api/oauth/* route here would collide with it. Must match the
// callback path registered on the GitHub OAuth App exactly.
export function GET() {
  const clientId = process.env.GITHUB_CLIENT_ID
  const callbackUrl = process.env.OAUTH_CALLBACK_URL

  if (!clientId || !callbackUrl) {
    return NextResponse.json({ error: 'GitHub OAuth is not configured' }, { status: 500 })
  }

  const state = crypto.randomUUID()
  const authorizeUrl = buildGitHubAuthorizeUrl({ clientId, redirectUri: callbackUrl, state })

  const response = NextResponse.redirect(authorizeUrl)
  response.cookies.set('oauth_state', state, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 600,
    path: '/oauth/github',
  })
  return response
}
