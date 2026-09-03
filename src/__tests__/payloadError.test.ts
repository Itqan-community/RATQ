import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { payloadErrorMessage } from '@/shared/infrastructure/payload-error';
import { PAYLOAD_API_BASE } from '@/shared/infrastructure/payload-config';
import { subscribeToSessionExpiry } from '@/shared/infrastructure/session-expiry';

const permissionMessage = 'You are not allowed to perform this action.';

function errorResponse(status: number, message: string): Response {
  return new Response(JSON.stringify({ errors: [{ message }] }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function meResponse(user: unknown): Response {
  return new Response(JSON.stringify({ user }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('payloadErrorMessage session validation', () => {
  const onSessionExpired = vi.fn();
  let unsubscribe: (() => void) | undefined;

  beforeEach(() => {
    onSessionExpired.mockClear();
    unsubscribe = subscribeToSessionExpiry(onSessionExpired);
  });

  afterEach(() => {
    unsubscribe?.();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it.each([401, 403])(
    'signals session expiry when Payload rejects an authenticated request with %i and the session cookie is gone',
    async (status) => {
      const fetchMock = vi.fn().mockResolvedValue(meResponse(null));
      vi.stubGlobal('fetch', fetchMock);

      await payloadErrorMessage(
        errorResponse(status, permissionMessage),
        'Failed to publish resource',
        { authenticated: true }
      );

      expect(fetchMock).toHaveBeenCalledWith(`${PAYLOAD_API_BASE}/users/me`, {
        cache: 'no-store',
        credentials: 'include',
        signal: expect.any(AbortSignal),
      });
      expect(onSessionExpired).toHaveBeenCalledOnce();
    }
  );

  it('preserves a genuine permission error while the cookie session is valid', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(meResponse({ id: 42 })));

    const message = await payloadErrorMessage(
      errorResponse(403, permissionMessage),
      'Failed to delete resource',
      { authenticated: true }
    );

    expect(message).toBe(permissionMessage);
    expect(onSessionExpired).not.toHaveBeenCalled();
  });

  it('does not probe the session for validation errors', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const message = await payloadErrorMessage(
      errorResponse(400, 'Name is required'),
      'Failed to publish resource',
      { authenticated: true }
    );

    expect(message).toBe('Name is required');
    expect(fetchMock).not.toHaveBeenCalled();
    expect(onSessionExpired).not.toHaveBeenCalled();
  });

  it('does not probe the session when the failing request was not authenticated', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const message = await payloadErrorMessage(
      errorResponse(401, 'Invalid credentials'),
      'Login failed'
    );

    expect(message).toBe('Invalid credentials');
    expect(fetchMock).not.toHaveBeenCalled();
    expect(onSessionExpired).not.toHaveBeenCalled();
  });

  it('preserves the original error when the session probe is inconclusive', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network unavailable')));

    const message = await payloadErrorMessage(
      errorResponse(403, permissionMessage),
      'Failed to delete resource',
      { authenticated: true }
    );

    expect(message).toBe(permissionMessage);
    expect(onSessionExpired).not.toHaveBeenCalled();
  });

  it('preserves the original error when the session probe itself is rejected', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(errorResponse(401, 'Session cookie is missing'))
    );

    const message = await payloadErrorMessage(
      errorResponse(403, permissionMessage),
      'Failed to publish resource',
      { authenticated: true }
    );

    expect(message).toBe(permissionMessage);
    expect(onSessionExpired).not.toHaveBeenCalled();
  });

  it('preserves the original error when session verification times out', async () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(
        (_url: string, init?: RequestInit) =>
          new Promise<Response>((_resolve, reject) => {
            init?.signal?.addEventListener('abort', () => {
              reject(new DOMException('Aborted', 'AbortError'));
            });
          })
      )
    );

    const messagePromise = payloadErrorMessage(
      errorResponse(403, permissionMessage),
      'Failed to delete resource',
      { authenticated: true }
    );
    await vi.runAllTimersAsync();

    await expect(
      Promise.race([messagePromise, Promise.resolve('probe-still-pending')])
    ).resolves.toBe(permissionMessage);
    expect(onSessionExpired).not.toHaveBeenCalled();
  });
});
