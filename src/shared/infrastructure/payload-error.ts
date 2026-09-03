import { PAYLOAD_API_BASE } from '@/shared/infrastructure/payload-config';
import { notifySessionExpired } from '@/shared/infrastructure/session-expiry';

const SESSION_PROBE_TIMEOUT_MS = 5_000;

interface PayloadErrorOptions {
  // True only when the failed request relied on the HttpOnly session cookie.
  authenticated?: boolean;
}

// Single copy of the Payload error-shape parser. Shared across modules
// since every Payload-backed write endpoint needs the same fallback logic.
export async function payloadErrorMessage(
  res: Response,
  fallback: string,
  options: PayloadErrorOptions = {}
): Promise<string> {
  const data = await res.json().catch(() => null);

  if (
    options.authenticated &&
    (res.status === 401 || res.status === 403) &&
    (await sessionCookieInvalid())
  ) {
    notifySessionExpired();
  }

  return data?.errors?.[0]?.data?.errors?.[0]?.message || data?.errors?.[0]?.message || fallback;
}

// The session lives in an HttpOnly cookie that JS cannot read, so after a
// 401/403 on an authenticated call the only way to tell an expired session
// apart from a genuine permission error is to ask Payload who the cookie
// belongs to. /users/me resolving to no user means the session is gone.
async function sessionCookieInvalid(): Promise<boolean> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), SESSION_PROBE_TIMEOUT_MS);

  try {
    const res = await fetch(`${PAYLOAD_API_BASE}/users/me`, {
      cache: 'no-store',
      credentials: 'include',
      signal: controller.signal,
    });
    if (!res.ok) return false;

    const data: unknown = await res.json();
    return isRecord(data) && data.user === null;
  } catch {
    return false;
  } finally {
    clearTimeout(timeoutId);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
