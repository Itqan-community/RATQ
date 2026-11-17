import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { errorMessage } from '@/lib/payloadAuth';
import { subscribeToSessionExpiry } from '@/lib/sessionExpiry';
import { useAuthStore } from '@/store/useAuthStore';
import { mockRepo } from '@/lib/supabase';

const API = 'http://payload.test/api';
const json = (status: number, body: unknown) => Promise.resolve(new Response(JSON.stringify(body), { status }));

let expired: ReturnType<typeof vi.fn>;
let unsub: () => void;
beforeEach(() => {
  vi.stubEnv('NEXT_PUBLIC_PAYLOAD_API_URL', API);
  expired = vi.fn();
  unsub = subscribeToSessionExpiry(expired);
});
afterEach(() => {
  unsub();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('errorMessage', () => {
  it('prefers the nested field-level reason over the generic message', async () => {
    const res = new Response(
      JSON.stringify({ errors: [{ message: 'The following field is invalid: email', data: { errors: [{ message: 'Email already in use' }] } }] }),
      { status: 400 },
    );
    expect(await errorMessage(res, 'x')).toBe('Email already in use');
  });

  it('falls back to the top-level message, then the fallback', async () => {
    expect(await errorMessage(new Response(JSON.stringify({ errors: [{ message: 'top' }] }), { status: 400 }), 'x')).toBe('top');
    expect(await errorMessage(new Response('nope', { status: 500 }), 'fb')).toBe('fb');
  });

  it('notifies expiry when an authenticated 401 is confirmed by /users/me returning no user', async () => {
    const f = vi.fn(() => json(200, { user: null }));
    vi.stubGlobal('fetch', f);
    const msg = await errorMessage(new Response('{}', { status: 401 }), 'fb', { authenticated: true });
    expect(msg).toBe('fb');
    expect((f.mock.calls[0] as unknown as [string])[0]).toBe(`${API}/users/me`);
    expect(expired).toHaveBeenCalledTimes(1);
  });

  it('does not notify on a genuine 403 permission error (session still valid)', async () => {
    vi.stubGlobal('fetch', vi.fn(() => json(200, { user: { id: 1 } })));
    await errorMessage(new Response('{}', { status: 403 }), 'fb', { authenticated: true });
    expect(expired).not.toHaveBeenCalled();
  });

  it('does not probe unauthenticated calls or non-auth statuses', async () => {
    const f = vi.fn(() => json(200, { user: null }));
    vi.stubGlobal('fetch', f);
    await errorMessage(new Response('{}', { status: 401 }), 'fb');
    await errorMessage(new Response('{}', { status: 500 }), 'fb', { authenticated: true });
    expect(f).not.toHaveBeenCalled();
    expect(expired).not.toHaveBeenCalled();
  });

  it('stays silent when the probe fails (network error or non-ok)', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new TypeError('network'))));
    await errorMessage(new Response('{}', { status: 401 }), 'fb', { authenticated: true });
    vi.stubGlobal('fetch', vi.fn(() => json(500, {})));
    await errorMessage(new Response('{}', { status: 401 }), 'fb', { authenticated: true });
    expect(expired).not.toHaveBeenCalled();
  });
});

describe('session expiry handling in the auth store', () => {
  it('handleSessionExpired drops auth state, flags the expiry once, and logs out server-side', async () => {
    const f = vi.fn(() => json(200, {}));
    vi.stubGlobal('fetch', f);
    useAuthStore.setState({ isAuthenticated: true, currentRole: 'developer', sessionExpired: false });
    await useAuthStore.getState().handleSessionExpired();
    const s = useAuthStore.getState();
    expect(s.isAuthenticated).toBe(false);
    expect(s.currentRole).toBe('guest');
    expect(s.sessionExpired).toBe(true);
    s.clearSessionExpired();
    expect(useAuthStore.getState().sessionExpired).toBe(false);
  });

  it('ignores an expiry event when nobody is signed in (no spurious banner)', async () => {
    vi.stubGlobal('fetch', vi.fn(() => json(200, {})));
    useAuthStore.setState({ isAuthenticated: false, currentRole: 'guest', sessionExpired: false });
    await useAuthStore.getState().handleSessionExpired();
    expect(useAuthStore.getState().sessionExpired).toBe(false);
  });
});

describe('per-user data on login/logout', () => {
  it('signInLive hydrates keys, requests and notifications; signOutLive clears them', async () => {
    const urls: string[] = [];
    vi.stubGlobal(
      'fetch',
      vi.fn((url: string) => {
        urls.push(url);
        if (url.endsWith('/users/login')) return json(200, { user: { id: 5, email: 'a@b.test', createdAt: '2026-01-01T00:00:00.000Z' } });
        return json(200, { docs: [] });
      }),
    );
    const spies = [vi.spyOn(mockRepo, 'setLiveRequests'), vi.spyOn(mockRepo, 'setLiveKeys'), vi.spyOn(mockRepo, 'setLiveNotifications')];
    useAuthStore.setState({ isAuthenticated: false, currentRole: 'guest' });
    expect(await useAuthStore.getState().signInLive('a@b.test', 'password1')).toBeNull();
    expect(urls.some((u) => u.includes('/api-keys') || u.includes('/keys'))).toBe(true);
    expect(urls.some((u) => u.includes('equest'))).toBe(true);
    expect(urls.some((u) => u.includes('otification'))).toBe(true);

    const before = urls.length;
    spies.forEach((s) => s.mockClear());
    await useAuthStore.getState().signOutLive();
    expect(urls.length).toBeGreaterThan(before); // logout call
    expect(spies.every((s) => s.mock.calls.at(-1)?.[0].length === 0)).toBe(true); // last write to each list is a clear
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});
