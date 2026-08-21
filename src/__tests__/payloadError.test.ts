import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { payloadErrorMessage } from '@/shared/infrastructure/payload-error';
import { PAYLOAD_API_BASE } from '@/shared/infrastructure/payload-config';
import { subscribeToSessionExpiry } from '@/shared/infrastructure/session-expiry';

const permissionMessage = 'You are not allowed to perform this action.';

function jwtWithExp(exp: number): string {
  const header = btoa(JSON.stringify({ alg: 'HS256' }));
  const payload = btoa(JSON.stringify({ exp }));
  return `${header}.${payload}.signature`;
}

function errorResponse(status: number, message: string): Response {
  return new Response(JSON.stringify({ errors: [{ message }] }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('payloadErrorMessage session validation', () => {
  const onSessionExpired = vi.fn();
  let unsubscribe: (() => void) | undefined;

  beforeEach(() => {
    localStorage.clear();
    onSessionExpired.mockClear();
    unsubscribe = subscribeToSessionExpiry(onSessionExpired);
  });

  afterEach(() => {
    unsubscribe?.();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('signals session expiry when Payload rejects an expired stored token', async () => {
    const token = jwtWithExp(Math.floor(Date.now() / 1000) - 60);
    localStorage.setItem('ratq_access_token', token);
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ user: null }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );
    vi.stubGlobal('fetch', fetchMock);

    await payloadErrorMessage(errorResponse(403, permissionMessage), 'Failed to publish resource', {
      authenticated: true,
    });

    expect(fetchMock).toHaveBeenCalledWith(`${PAYLOAD_API_BASE}/users/me`, {
      cache: 'no-store',
      headers: { Authorization: `JWT ${token}` },
      signal: expect.any(AbortSignal),
    });
    expect(onSessionExpired).toHaveBeenCalledOnce();
  });

  it.each([401, 403])(
    'signals session expiry when Payload rejects a malformed stored token with %i',
    async (status) => {
      localStorage.setItem('ratq_access_token', 'invalid_access_token');
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue(
          new Response(JSON.stringify({ user: null }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        )
      );

      await payloadErrorMessage(
        errorResponse(status, permissionMessage),
        'Failed to publish resource',
        { authenticated: true }
      );

      expect(onSessionExpired).toHaveBeenCalledOnce();
    }
  );

  it('preserves a genuine permission error when the stored session is valid', async () => {
    localStorage.setItem(
      'ratq_access_token',
      jwtWithExp(Math.floor(Date.now() / 1000) + 3600)
    );
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ user: { id: 42 } }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      )
    );

    const message = await payloadErrorMessage(
      errorResponse(403, permissionMessage),
      'Failed to delete resource',
      { authenticated: true }
    );

    expect(message).toBe(permissionMessage);
    expect(onSessionExpired).not.toHaveBeenCalled();
  });

  it('does not probe the session for validation errors', async () => {
    localStorage.setItem('ratq_access_token', 'stored-token');
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

  it('does not probe an ambiguous failure when no token is stored', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const message = await payloadErrorMessage(
      errorResponse(403, permissionMessage),
      'Failed to publish resource',
      { authenticated: true }
    );

    expect(message).toBe(permissionMessage);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(onSessionExpired).not.toHaveBeenCalled();
  });

  it('preserves the original error when session verification is inconclusive', async () => {
    localStorage.setItem('ratq_access_token', 'stored-token');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network unavailable')));

    const message = await payloadErrorMessage(
      errorResponse(403, permissionMessage),
      'Failed to delete resource',
      { authenticated: true }
    );

    expect(message).toBe(permissionMessage);
    expect(onSessionExpired).not.toHaveBeenCalled();
  });

  it('does not validate a stale stored token for an unauthenticated request', async () => {
    localStorage.setItem('ratq_access_token', 'stale-token');
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ user: null }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );
    vi.stubGlobal('fetch', fetchMock);

    const message = await payloadErrorMessage(
      errorResponse(401, 'Invalid credentials'),
      'Login failed'
    );

    expect(message).toBe('Invalid credentials');
    expect(fetchMock).not.toHaveBeenCalled();
    expect(onSessionExpired).not.toHaveBeenCalled();
  });

  it('does not expire a replacement session when an older probe completes', async () => {
    localStorage.setItem('ratq_access_token', 'stale-token');
    let resolveProbe: ((response: Response) => void) | undefined;
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(
        () => new Promise<Response>((resolve) => {
          resolveProbe = resolve;
        })
      )
    );

    const messagePromise = payloadErrorMessage(
      errorResponse(403, permissionMessage),
      'Failed to publish resource',
      { authenticated: true }
    );
    await vi.waitFor(() => expect(resolveProbe).toBeTypeOf('function'));
    localStorage.setItem('ratq_access_token', 'replacement-token');
    expect(localStorage.getItem('ratq_access_token')).toBe('replacement-token');
    resolveProbe?.(
      new Response(JSON.stringify({ user: null }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    await messagePromise;

    expect(localStorage.getItem('ratq_access_token')).toBe('replacement-token');
    expect(onSessionExpired).not.toHaveBeenCalled();
  });

  it('preserves the original error when session verification times out', async () => {
    vi.useFakeTimers();
    localStorage.setItem('ratq_access_token', 'stored-token');
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
