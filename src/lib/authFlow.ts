// Pure auth-flow helpers mirrored from live RATQ's LoginForm / utils (kept in one place so views stay thin).

export const DEFAULT_AFTER_LOGIN = '/app';

/**
 * Post-login destination from `?redirect=`: same-origin paths only. Anything else (missing, external,
 * protocol-relative, backslash/tab tricks, dot-segment collapse) falls back to the portal so a crafted link
 * cannot bounce users off-site. Live's `/dashboard` default maps to beta's `/app`.
 */
export function safeRedirectPath(value: string | null | undefined): string {
  if (!value || !value.startsWith('/')) return DEFAULT_AFTER_LOGIN;
  let url: URL;
  try {
    url = new URL(value, 'http://local');
  } catch {
    return DEFAULT_AFTER_LOGIN;
  }
  if (url.origin !== 'http://local') return DEFAULT_AFTER_LOGIN;
  const out = url.pathname + url.search + url.hash;
  // Dot-segment collapse can turn a same-origin parse back into a protocol-relative target (`/.//evil.example/x`).
  if (out.startsWith('//')) return DEFAULT_AFTER_LOGIN;
  if (out === '/dashboard' || out.startsWith('/dashboard/')) return DEFAULT_AFTER_LOGIN;
  return out;
}

/** Link to sign-in/sign-up that returns the visitor to `returnTo` afterwards. */
export function signInHref(returnTo: string | null | undefined, page: 'sign-in' | 'sign-up' = 'sign-in'): string {
  const base = `/auth/${page}`;
  // Re-run the allow-list so a tampered value is never forwarded; the default means "nothing to return to".
  const safe = returnTo ? safeRedirectPath(returnTo) : DEFAULT_AFTER_LOGIN;
  return returnTo && safe === returnTo ? `${base}?redirect=${encodeURIComponent(safe)}` : base;
}

// Backend enforces 8-64 (422); this just avoids the round trip and the raw English error.
export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 64;
export const validatePassword = (p: string): boolean => p.length >= PASSWORD_MIN && p.length <= PASSWORD_MAX;

export const SESSION_EXPIRED_REASON = 'session_expired';

/** Backend auth failures in the visitor's language; anything unrecognised passes through. */
export function mapAuthError(
  error: string | null,
  t: { sessionExpired: string; invalidCredentials: string; accountLocked: string },
): string | null {
  if (!error) return null;
  if (error === SESSION_EXPIRED_REASON) return t.sessionExpired;
  if (/locked/i.test(error)) return t.accountLocked;
  if (/invalid login|invalid credentials|incorrect|unauthorized|401/i.test(error)) return t.invalidCredentials;
  return error;
}

export const AUTH_ERRORS = {
  en: {
    sessionExpired: 'Your session has expired. Please sign in again.',
    invalidCredentials: 'Incorrect email or password.',
    accountLocked: 'This account is temporarily locked after too many failed attempts. Try again later.',
  },
  ar: {
    sessionExpired: 'انتهت جلستك. يرجى تسجيل الدخول مرة أخرى.',
    invalidCredentials: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
    accountLocked: 'تم إيقاف الحساب مؤقتاً بسبب كثرة المحاولات الفاشلة. حاول مرة أخرى لاحقاً.',
  },
} as const;
