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
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(await payloadErrorMessage(res, 'Login failed'));
  const data: { token: string; user: PayloadUserDoc } = await res.json();
  return { access: data.token, refresh: data.token, user: toUser(data.user) };
}

export async function loginWithToken(token: string) {
  const res = await fetch(`${PAYLOAD_API_BASE}/users/me`, {
    headers: { Authorization: `JWT ${token}` },
  });
  if (!res.ok) throw new Error('Failed to load user');
  const data: { user: PayloadUserDoc | null } = await res.json();
  if (!data.user) throw new Error('Failed to load user');
  return { access: token, refresh: token, user: toUser(data.user) };
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
