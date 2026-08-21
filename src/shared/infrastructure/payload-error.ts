import { PAYLOAD_API_BASE } from '@/shared/infrastructure/payload-config';
import { notifySessionExpired } from '@/shared/infrastructure/session-expiry';
import { getAccessToken } from '@/shared/infrastructure/token-storage';

const SESSION_PROBE_TIMEOUT_MS = 5_000;

interface PayloadErrorOptions {
  // True only when the failed request sent the stored Payload JWT.
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
  const invalidToken =
    options.authenticated && (res.status === 401 || res.status === 403)
      ? await invalidStoredSessionToken()
      : null;

  if (invalidToken && getAccessToken() === invalidToken) {
    notifySessionExpired();
  }

  return data?.errors?.[0]?.data?.errors?.[0]?.message || data?.errors?.[0]?.message || fallback;
}

async function invalidStoredSessionToken(): Promise<string | null> {
  const token = getAccessToken();
  if (!token) return null;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), SESSION_PROBE_TIMEOUT_MS);

  try {
    const res = await fetch(`${PAYLOAD_API_BASE}/users/me`, {
      cache: 'no-store',
      headers: { Authorization: `JWT ${token}` },
      signal: controller.signal,
    });
    if (!res.ok) return null;

    const data: unknown = await res.json();
    return isRecord(data) && data.user === null ? token : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
