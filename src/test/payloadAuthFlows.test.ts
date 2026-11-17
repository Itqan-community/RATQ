import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { resetPassword, verifyEmail, exchangeOAuthCode, githubOAuthUrl, parseOAuthCode } from '@/lib/payloadAuth';

const API = 'http://payload.test/api';
const ok = (body: unknown = {}) => Promise.resolve(new Response(JSON.stringify(body), { status: 200 }));
const fail = (status: number, message: string) =>
  Promise.resolve(new Response(JSON.stringify({ errors: [{ message }] }), { status }));

beforeEach(() => vi.stubEnv('NEXT_PUBLIC_PAYLOAD_API_URL', API));
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('resetPassword', () => {
  it('posts token + new password and returns null on success', async () => {
    const f = vi.fn(() => ok());
    vi.stubGlobal('fetch', f);
    expect(await resetPassword('tok123', 'N3w-Passw0rd!')).toBeNull();
    const [url, init] = f.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(`${API}/users/reset-password`);
    expect(JSON.parse(init.body as string)).toEqual({ token: 'tok123', password: 'N3w-Passw0rd!' });
  });

  it('returns the server message for an expired/invalid token', async () => {
    vi.stubGlobal('fetch', vi.fn(() => fail(403, 'Token is either invalid or has expired.')));
    expect(await resetPassword('bad', 'x')).toBe('Token is either invalid or has expired.');
  });

  it('survives a network failure and refuses an empty token without a request', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new TypeError('network'))));
    expect(await resetPassword('t', 'p')).toBeTruthy();
    const f = vi.fn();
    vi.stubGlobal('fetch', f);
    expect(await resetPassword('', 'p')).toBeTruthy();
    expect(f).not.toHaveBeenCalled();
  });
});

describe('verifyEmail', () => {
  it('URL-encodes the token in the path', async () => {
    const f = vi.fn(() => ok());
    vi.stubGlobal('fetch', f);
    expect(await verifyEmail('a/b c')).toBeNull();
    expect((f.mock.calls[0] as unknown as [string])[0]).toBe(`${API}/users/verify/a%2Fb%20c`);
  });

  it('returns the server error', async () => {
    vi.stubGlobal('fetch', vi.fn(() => fail(400, 'Verification token is invalid.')));
    expect(await verifyEmail('x')).toBe('Verification token is invalid.');
  });
});

describe('GitHub OAuth', () => {
  it('builds the start URL off the API origin (outside /api)', () => {
    expect(githubOAuthUrl()).toBe('http://payload.test/oauth/github');
  });

  it('parseOAuthCode reads the one-time code from the URL fragment only (never the query)', () => {
    expect(parseOAuthCode('#code=abc123')).toBe('abc123');
    expect(parseOAuthCode('?code=abc123')).toBeNull();
    expect(parseOAuthCode('')).toBeNull();
  });

  it('exchanges the code with the session cookie and returns null on success', async () => {
    const f = vi.fn(() => ok());
    vi.stubGlobal('fetch', f);
    expect(await exchangeOAuthCode('abc123')).toBeNull();
    const [url, init] = f.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('http://payload.test/oauth/github/exchange');
    expect(init.credentials).toBe('include');
    expect(JSON.parse(init.body as string)).toEqual({ code: 'abc123' });
  });

  it('returns the server error for a used/expired code', async () => {
    vi.stubGlobal('fetch', vi.fn(() => fail(400, 'Invalid or expired code.')));
    expect(await exchangeOAuthCode('abc123')).toBe('Invalid or expired code.');
  });
});
