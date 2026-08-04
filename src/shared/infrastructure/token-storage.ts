import type { User } from '@/types/resource';

// Owns the auth token localStorage keys in one place.
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('ratq_access_token');
}

export function setAuthTokens(access: string, refresh: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('ratq_access_token', access);
  localStorage.setItem('ratq_refresh_token', refresh);
}

export function clearAuth() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('ratq_access_token');
  localStorage.removeItem('ratq_refresh_token');
}

// The current user's numeric Payload id, needed to scope "my
// requests/reports/api-keys" queries by owner.
export function getCurrentUserId(): number | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('ratq_user');
  if (!stored) return null;
  try {
    return (JSON.parse(stored) as { id: number }).id;
  } catch {
    return null;
  }
}

export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('ratq_user');
  if (!stored) return null;
  try {
    return JSON.parse(stored) as User;
  } catch {
    return null;
  }
}

export function setStoredUser(user: User) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('ratq_user', JSON.stringify(user));
}

export function clearStoredUser() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('ratq_user');
}
