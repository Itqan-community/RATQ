import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import config from '@payload-config'
import { signSessionJWT, verifyExchangeToken } from '@/lib/oauth/github'

// Redeems the one-time ticket the GitHub callback put in the redirect
// fragment for the real session token (issue #229). The session token is
// returned in the response body so it never travels through a URL, where it
// would land in browser history, access logs and Referer headers.
//
// Unlike Payload's own /api/* routes, this one is a plain Next route outside
// the (payload) catch-all, so nothing applies config.cors for us - the
// preflight and the allow-origin header below are this route's own job.

function allowedOrigin(request: Request, cors: unknown): string | null {
  const origin = request.headers.get('origin')
  if (!origin) return null
  if (cors === '*') return origin
  const list = Array.isArray(cors) ? cors : (cors as { origins?: string[] })?.origins
  return list?.includes(origin) ? origin : null
}

function corsHeaders(origin: string | null): Record<string, string> {
  // Vary matters even when the origin isn't allowed: the response differs per
  // origin, so a shared cache must not reuse one origin's response for another.
  const headers: Record<string, string> = { Vary: 'Origin' }
  if (origin) {
    headers['Access-Control-Allow-Origin'] = origin
    headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
    headers['Access-Control-Allow-Headers'] = 'Content-Type'
  }
  return headers
}

export async function OPTIONS(request: Request) {
  const payload = await getPayload({ config })
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(allowedOrigin(request, payload.config.cors)),
  })
}

export async function POST(request: Request) {
  const payload = await getPayload({ config })
  const headers = {
    ...corsHeaders(allowedOrigin(request, payload.config.cors)),
    // The body carries a live credential - no proxy or browser cache should
    // ever keep a copy of it.
    'Cache-Control': 'no-store',
  }

  const fail = (status: number, error: string) => NextResponse.json({ error }, { status, headers })

  let code: unknown
  try {
    code = (await request.json())?.code
  } catch {
    return fail(400, 'invalid_body')
  }
  if (typeof code !== 'string') return fail(400, 'invalid_body')

  const claims = await verifyExchangeToken({ token: code, secret: payload.secret })
  if (!claims) return fail(401, 'invalid_code')

  const user = await payload.findByID({ collection: 'users', id: claims.userId }).catch(() => null)
  if (!user) return fail(401, 'invalid_code')

  const now = new Date()
  const sessions = (user.sessions as { id: string; expiresAt: string }[]) || []

  // Single-use, without a table of spent tickets: the callback deliberately
  // does NOT create the session, so this sid existing can only mean this
  // ticket was already redeemed. Creating the session IS spending the ticket.
  if (sessions.some((session) => session.id === claims.sid)) {
    return fail(401, 'code_already_used')
  }

  const tokenExpiration = payload.collections.users.config.auth.tokenExpiration
  await payload.update({
    collection: 'users',
    id: user.id,
    data: {
      sessions: [
        ...sessions.filter((session) => new Date(session.expiresAt) > now),
        {
          id: claims.sid,
          createdAt: now.toISOString(),
          expiresAt: new Date(now.getTime() + tokenExpiration * 1000).toISOString(),
        },
      ],
    },
  })

  const token = await signSessionJWT({
    id: user.id,
    email: user.email,
    secret: payload.secret,
    sid: claims.sid,
    tokenExpiration,
  })

  return NextResponse.json({ token }, { headers })
}
