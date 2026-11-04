// Payload cookie-session auth (same endpoints live's payload-auth-repository.ts uses).
// The session is an httpOnly cookie set by Payload: no token or password is ever held or stored in JS.
import { DEMO_PROFILES } from './mockData';
import type { Profile, UserRole } from '@/types';

// Read at call time so tests can stub it; unset = mock mode.
export const payloadBase = (): string => process.env.NEXT_PUBLIC_PAYLOAD_API_URL || '';
export const isLive = (): boolean => Boolean(payloadBase());

interface PayloadUserDoc {
  id: number;
  email: string;
  display_name?: string | null;
  role?: string | null;
  createdAt: string;
}

// Least privilege: anything unrecognized is a plain developer, never admin.
export function toRole(role?: string | null): UserRole {
  if (role === 'admin') return 'admin';
  if (role === 'publisher') return 'publisher_owner';
  return 'developer';
}

export function toProfile(doc: PayloadUserDoc): Profile {
  const handle = doc.email.split('@')[0];
  return {
    ...DEMO_PROFILES.developer,
    id: `payload_user_${doc.id}`,
    handle,
    display_name: doc.display_name || handle,
    created_at: doc.createdAt,
    updated_at: doc.createdAt,
  };
}

export async function errorMessage(res: Response, fallback: string): Promise<string> {
  try {
    const body = await res.json();
    return body?.errors?.[0]?.message || fallback;
  } catch {
    return fallback;
  }
}

const post = (path: string, body: unknown) =>
  fetch(`${payloadBase()}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });

export async function login(email: string, password: string): Promise<PayloadUserDoc> {
  const res = await post('/users/login', { email, password });
  if (!res.ok) throw new Error(await errorMessage(res, 'Login failed'));
  return (await res.json()).user;
}

export async function register(email: string, password: string, display_name: string): Promise<void> {
  // No `role`: the server defaults it and only admins may set it.
  const res = await post('/users', { email, password, display_name });
  if (!res.ok) throw new Error(await errorMessage(res, 'Registration failed'));
}

export async function fetchMe(): Promise<PayloadUserDoc | null> {
  const res = await fetch(`${payloadBase()}/users/me`, { credentials: 'include' });
  if (!res.ok) return null;
  return (await res.json()).user ?? null;
}

export async function logout(): Promise<void> {
  await post('/users/logout', {});
}

export async function forgotPassword(email: string): Promise<void> {
  const res = await post('/users/forgot-password', { email });
  if (!res.ok) throw new Error(await errorMessage(res, 'Request failed'));
}

const origin = () => payloadBase().replace(/\/api\/?$/, '');
const NET_ERR = 'Network error, please try again.';

async function submit(url: string, body: unknown, fallback: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
    });
    return res.ok ? null : await errorMessage(res, fallback);
  } catch {
    return NET_ERR;
  }
}

export async function resetPassword(token: string, password: string): Promise<string | null> {
  if (!token) return 'Missing reset token.';
  return submit(`${payloadBase()}/users/reset-password`, { token, password }, 'Reset failed');
}

export async function verifyEmail(token: string): Promise<string | null> {
  if (!token) return 'Missing verification token.';
  return submit(`${payloadBase()}/users/verify/${encodeURIComponent(token)}`, {}, 'Verification failed');
}

// GitHub OAuth is a custom route on the Payload server, outside the /api prefix.
export const githubOAuthUrl = (): string => `${origin()}/oauth/github`;

// The one-time code arrives in the URL fragment so it never reaches server logs or Referer headers.
export function parseOAuthCode(hash: string): string | null {
  return hash.startsWith('#') ? new URLSearchParams(hash.slice(1)).get('code') : null;
}

export async function exchangeOAuthCode(code: string): Promise<string | null> {
  return submit(`${origin()}/oauth/github/exchange`, { code }, 'Login failed');
}
