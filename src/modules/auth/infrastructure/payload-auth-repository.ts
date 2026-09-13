// Backed by Payload's built-in auth API (staging.api.ratq.itqan.dev/api/users).
// Payload issues a single JWT (no separate refresh token), so it's stored as
// both access and refresh to keep the existing token-storage shape.

import type { User } from '@/types/resource';
import { payloadErrorMessage } from '@/shared/infrastructure/payload-error';
import { PAYLOAD_API_BASE } from '@/shared/infrastructure/payload-config';

// The OAuth routes are custom Next.js routes on the payload backend, not
// part of Payload's own REST API - they live outside the /api prefix (see
// payload-backend/src/app/oauth for why).
const PAYLOAD_ORIGIN = PAYLOAD_API_BASE.replace(/\/api\/?$/, '');
export const githubOAuthUrl = `${PAYLOAD_ORIGIN}/oauth/github`;

interface PayloadUserDoc {
  id: number;
  email: string;
  display_name?: string | null;
  role?: 'developer' | 'publisher' | 'admin' | null;
  createdAt: string;
}

function toUser(doc: PayloadUserDoc): User {
  return {
    id: doc.id,
    email: doc.email,
    display_name: doc.display_name || doc.email.split('@')[0],
    role: doc.role || 'developer',
    created_at: doc.createdAt,
  };
}

export async function login(email: string, password: string) {
  const res = await fetch(`${PAYLOAD_API_BASE}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(await payloadErrorMessage(res, 'Login failed'));
  const data: { token: string; user: PayloadUserDoc } = await res.json();
  return { access: data.token, refresh: data.token, user: toUser(data.user) };
}

// Redeems the one-time code the OAuth callback leaves in the URL fragment for
// the real session token (issue #229). The token comes back in the response
// body, so unlike the old ?token= redirect it never touches a URL.
export async function exchangeOAuthCode(code: string) {
  const res = await fetch(`${PAYLOAD_ORIGIN}/oauth/github/exchange`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
    credentials: 'include',
  });
  if (!res.ok) throw new Error(await payloadErrorMessage(res, 'Login failed'));
}

export async function logout() {
  const res = await fetch(`${PAYLOAD_API_BASE}/users/logout`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) throw new Error(await payloadErrorMessage(res, 'Logout failed'));
}

/* Fetching user details */
export async function fetchUserDetails() {
  const res = await fetch(`${PAYLOAD_API_BASE}/users/me`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to load user');
  const data: { user: PayloadUserDoc | null } = await res.json();
  if (!data.user) throw new Error('Failed to load user');
  return toUser(data.user);
}


export async function register(
  email: string,
  password: string,
  display_name: string,
  role: 'developer' | 'publisher' = 'developer'
) {
  const res = await fetch(`${PAYLOAD_API_BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, display_name, role }),
  });
  if (!res.ok) throw new Error(await payloadErrorMessage(res, 'Registration failed'));
  return login(email, password);
}

export async function forgotPassword(email: string){
  const res = await fetch(`${PAYLOAD_API_BASE}/users/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error(await payloadErrorMessage(res, 'Forgot password request failed'));
  return { success: true };
}

export async function resetPassword(token: string, password: string) {
  const res = await fetch(`${PAYLOAD_API_BASE}/users/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password }),
  });
  if (!res.ok) throw new Error(await payloadErrorMessage(res, 'Reset password failed'));
  return { success: true };
}

export async function verifyEmail(token: string) {
  const res = await fetch(`${PAYLOAD_API_BASE}/users/verify/${encodeURIComponent(token)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error(await payloadErrorMessage(res, 'Email verification failed'));
  return { success: true };
}
