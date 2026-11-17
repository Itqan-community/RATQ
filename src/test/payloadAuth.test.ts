import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { toRole } from '@/lib/payloadAuth';
import { useAuthStore } from '@/store/useAuthStore';

const API = 'http://payload.test/api';
const userDoc = (role?: string) => ({ id: 5, email: 'a@b.test', display_name: 'Ada', role, createdAt: '2026-01-01T00:00:00.000Z' });
const ok = (body: unknown) => Promise.resolve(new Response(JSON.stringify(body), { status: 200 }));
const fail = (status: number, message: string) =>
  Promise.resolve(new Response(JSON.stringify({ errors: [{ message }] }), { status }));

beforeEach(() => {
  vi.stubEnv('NEXT_PUBLIC_PAYLOAD_API_URL', API);
  useAuthStore.setState({ isAuthenticated: false, currentRole: 'guest' });
  localStorage.clear();
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('toRole (least privilege)', () => {
  it('maps payload roles and never escalates unknown values', () => {
    expect(toRole('developer')).toBe('developer');
    expect(toRole('publisher')).toBe('publisher_owner');
    expect(toRole('admin')).toBe('admin');
    expect(toRole(undefined)).toBe('developer');
    expect(toRole('superuser')).toBe('developer');
  });
});

describe('signInLive', () => {
  it('sends credentials with cookie session and takes the role from the server', async () => {
    const f = vi.fn(() => ok({ token: 't', user: userDoc('publisher') }));
    vi.stubGlobal('fetch', f);
    expect(await useAuthStore.getState().signInLive('a@b.test', 'pw')).toBeNull();
    const [url, init] = f.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(`${API}/users/login`);
    expect(init.credentials).toBe('include');
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().currentRole).toBe('publisher_owner');
    expect(useAuthStore.getState().profile.display_name).toBe('Ada');
  });

  it('stays signed out and returns the server message on bad credentials', async () => {
    vi.stubGlobal('fetch', vi.fn(() => fail(401, 'The email or password provided is incorrect.')));
    expect(await useAuthStore.getState().signInLive('a@b.test', 'bad')).toBe('The email or password provided is incorrect.');
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().currentRole).toBe('guest');
  });

  it('returns an error (not a throw) when the network is down', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new TypeError('network'))));
    expect(await useAuthStore.getState().signInLive('a@b.test', 'pw')).toBeTruthy();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('never persists the password or a token in localStorage', async () => {
    vi.stubGlobal('fetch', vi.fn(() => ok({ token: 'secret-jwt', user: userDoc('developer') })));
    await useAuthStore.getState().signInLive('a@b.test', 'super-secret-pw');
    const dump = JSON.stringify({ ...localStorage });
    expect(dump).not.toContain('super-secret-pw');
    expect(dump).not.toContain('secret-jwt');
  });
});

describe('signUpLive', () => {
  it('does not send a role (server decides; no self-escalation) then signs in', async () => {
    const f = vi
      .fn()
      .mockImplementationOnce(() => ok({ doc: userDoc('developer') }))
      .mockImplementationOnce(() => ok({ token: 't', user: userDoc('developer') }));
    vi.stubGlobal('fetch', f);
    expect(await useAuthStore.getState().signUpLive('a@b.test', 'pw', 'Ada')).toBeNull();
    const body = JSON.parse((f.mock.calls[0] as unknown as [string, RequestInit])[1].body as string);
    expect(body).toEqual({ email: 'a@b.test', password: 'pw', display_name: 'Ada' });
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });

  it('surfaces validation errors and does not sign in', async () => {
    vi.stubGlobal('fetch', vi.fn(() => fail(400, 'Password too weak')));
    expect(await useAuthStore.getState().signUpLive('a@b.test', 'x', 'Ada')).toBe('Password too weak');
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});

describe('hydrateAuth / signOutLive', () => {
  it('signs in from an existing cookie session', async () => {
    vi.stubGlobal('fetch', vi.fn(() => ok({ user: userDoc('admin') })));
    await useAuthStore.getState().hydrateAuth();
    expect(useAuthStore.getState().currentRole).toBe('admin');
  });

  it('treats an expired session (user:null) as signed out', async () => {
    useAuthStore.setState({ isAuthenticated: true, currentRole: 'admin' });
    vi.stubGlobal('fetch', vi.fn(() => ok({ user: null })));
    await useAuthStore.getState().hydrateAuth();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().currentRole).toBe('guest');
  });

  it('signs out locally even if the logout request fails', async () => {
    useAuthStore.setState({ isAuthenticated: true, currentRole: 'admin' });
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new TypeError('network'))));
    await useAuthStore.getState().signOutLive();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().currentRole).toBe('guest');
  });
});
