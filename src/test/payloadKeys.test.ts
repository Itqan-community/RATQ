import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { toDesignKey, createKey, revokeKey, rotateKey } from '@/lib/payloadKeys';

const API = 'http://payload.test/api';
const ok = (body: unknown) => Promise.resolve(new Response(JSON.stringify(body), { status: 200 }));
const fail = (status: number, message: string) =>
  Promise.resolve(new Response(JSON.stringify({ errors: [{ message }] }), { status }));
const keyDoc = { id: 4, name: 'CI key', resource: 7, key_prefix: 'ratq_live_ab12cd34', scope: 'read,write', createdAt: '2026-01-01T00:00:00.000Z' };

beforeEach(() => vi.stubEnv('NEXT_PUBLIC_PAYLOAD_API_URL', API));
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('toDesignKey', () => {
  it('maps a payload key; scope list split; only the prefix is ever present', () => {
    const k = toDesignKey({ ...keyDoc, key_hash: 'should-never-be-here', key: 'ratq_live_full_secret' } as never);
    expect(k).toMatchObject({
      id: 'payload_key_4', resource_id: 'payload_7', name_ar: 'CI key',
      key_prefix: 'ab12cd34', // KeyTable renders "ratq_live_" + prefix, so the server's own prefix is stripped
      scopes: ['read', 'write'], status: 'active',
    });
    expect(JSON.stringify(k)).not.toContain('should-never-be-here');
    expect(JSON.stringify(k)).not.toContain('full_secret');
  });

  it('accepts a populated resource relation', () => {
    expect(toDesignKey({ ...keyDoc, resource: { id: 9, name: 'x' } }).resource_id).toBe('payload_9');
  });
});

describe('createKey', () => {
  it('posts name/resource/scope only and returns the one-time key from the server', async () => {
    const f = vi.fn(() => ok({ doc: { ...keyDoc, key: 'ratq_live_abc' } }));
    vi.stubGlobal('fetch', f);
    expect(await createKey('payload_7', 'CI key')).toEqual({ key: 'ratq_live_abc', error: null });
    const [url, init] = f.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(`${API}/api-keys`);
    expect(init.credentials).toBe('include');
    expect(JSON.parse(init.body as string)).toEqual({ name: 'CI key', resource: 7, scope: 'read' });
  });

  it('returns the server refusal (no approved request) and no key', async () => {
    vi.stubGlobal('fetch', vi.fn(() => fail(403, 'You do not have permission to generate an API key for this resource.')));
    expect(await createKey('payload_7', 'k')).toEqual({
      key: null,
      error: 'You do not have permission to generate an API key for this resource.',
    });
  });

  it('refuses non-payload resources without a request', async () => {
    const f = vi.fn();
    vi.stubGlobal('fetch', f);
    expect((await createKey('res_b_1', 'k')).error).toBeTruthy();
    expect(f).not.toHaveBeenCalled();
  });

  it('survives a network failure', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new TypeError('network'))));
    expect((await createKey('payload_7', 'k')).key).toBeNull();
  });
});

describe('revokeKey', () => {
  it('deletes by id with the session cookie', async () => {
    const f = vi.fn(() => ok({ doc: {} }));
    vi.stubGlobal('fetch', f);
    expect(await revokeKey('payload_key_4')).toBeNull();
    const [url, init] = f.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(`${API}/api-keys/4`);
    expect(init.method).toBe('DELETE');
    expect(init.credentials).toBe('include');
  });

  it('returns the error when the server refuses', async () => {
    vi.stubGlobal('fetch', vi.fn(() => fail(403, 'Forbidden')));
    expect(await revokeKey('payload_key_4')).toBe('Forbidden');
  });
});

describe('rotateKey (create new, then delete old)', () => {
  it('creates first, then deletes the old key', async () => {
    const f = vi
      .fn()
      .mockImplementationOnce(() => ok({ doc: { ...keyDoc, id: 5, key: 'ratq_live_new' } }))
      .mockImplementationOnce(() => ok({ doc: {} }));
    vi.stubGlobal('fetch', f);
    expect(await rotateKey('payload_key_4', 'payload_7', 'CI key')).toEqual({ key: 'ratq_live_new', error: null });
    expect((f.mock.calls[0] as unknown as [string, RequestInit])[1].method).toBe('POST');
    expect((f.mock.calls[1] as unknown as [string, RequestInit])[0]).toBe(`${API}/api-keys/4`);
  });

  it('keeps the old key if creating the new one fails (never deletes)', async () => {
    const f = vi.fn(() => fail(403, 'nope'));
    vi.stubGlobal('fetch', f);
    expect(await rotateKey('payload_key_4', 'payload_7', 'CI key')).toEqual({ key: null, error: 'nope' });
    expect(f).toHaveBeenCalledTimes(1);
  });

  it('still reveals the new key and reports the error if deleting the old one fails', async () => {
    const f = vi
      .fn()
      .mockImplementationOnce(() => ok({ doc: { ...keyDoc, id: 5, key: 'ratq_live_new' } }))
      .mockImplementationOnce(() => fail(500, 'delete failed'));
    vi.stubGlobal('fetch', f);
    expect(await rotateKey('payload_key_4', 'payload_7', 'CI key')).toEqual({ key: 'ratq_live_new', error: 'delete failed' });
  });
});
