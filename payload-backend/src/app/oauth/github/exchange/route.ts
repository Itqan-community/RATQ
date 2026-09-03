import { sql } from '@payloadcms/db-postgres'
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
    headers['Access-Control-Allow-Credentials'] = 'true'
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
  const tokenExpiration = payload.collections.users.config.auth.tokenExpiration
  const expiresAt = new Date(now.getTime() + tokenExpiration * 1000)

  // Single-use, without a table of spent tickets: the callback deliberately
  // does NOT create the session, so this sid existing can only mean this
  // ticket was already redeemed. Creating the session IS spending the ticket.
  //
  // Written as a conditional INSERT rather than read-then-payload.update
  // because those are two separate operations, and two requests carrying the
  // same code could both pass the read before either wrote. users_sessions.id
  // is the primary key, so ON CONFLICT DO NOTHING makes Postgres itself the
  // arbiter: concurrent redemptions of one code yield exactly one insert, and
  // an empty RETURNING is how the loser finds out.
  const inserted = await payload.db.drizzle.execute(sql`
    INSERT INTO users_sessions (_order, _parent_id, id, created_at, expires_at)
    SELECT COALESCE(MAX(_order), 0) + 1, ${user.id}, ${claims.sid}, ${now}, ${expiresAt}
    FROM users_sessions WHERE _parent_id = ${user.id}
    ON CONFLICT (id) DO NOTHING
    RETURNING id
  `)
  if (inserted.rows.length === 0) return fail(401, 'code_already_used')

  // payload.update used to drop expired sessions as a side effect of rewriting
  // the whole array; the targeted insert above doesn't, so prune them here.
  await payload.db.drizzle.execute(sql`
    DELETE FROM users_sessions WHERE _parent_id = ${user.id} AND expires_at <= ${now}
  `)

  const token = await signSessionJWT({
    id: user.id,
    email: user.email,
    secret: payload.secret,
    sid: claims.sid,
    tokenExpiration,
  })

  const response = NextResponse.json(
    {
      message: 'Authenticated',
      user: {
        id: user.id,
        email: user.email,
        display_name: user.display_name,
        role: user.role,
      },
      exp: Math.floor(expiresAt.getTime() / 1000),
    },
    { headers },
  )

  response.cookies.set('payload-token',token,{
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: tokenExpiration,
      expires: expiresAt,
      domain: process.env.NODE_ENV === 'production' ? '.itqan.dev' : undefined,
    })

  return response;

}
