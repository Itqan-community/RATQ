import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { toPayloadBody, toPayloadType, createResource, fetchMyResources, deleteResource } from '@/lib/payloadOwnResources';

const API = 'http://payload.test/api';
const ok = (body: unknown = {}) => Promise.resolve(new Response(JSON.stringify(body), { status: 200 }));
const fail = (status: number, message: string) =>
  Promise.resolve(new Response(JSON.stringify({ errors: [{ message }] }), { status }));
const form = {
  title_ar: 'مكتبة اختبار', summary_ar: 'نبذة', readme_ar: '', resource_type: 'library',
  license_spdx: 'MIT', version: '1.0.0', repository_url: 'https://github.com/x/y',
  // design-only fields that must never reach Payload
  checksum_sha256: 'abc', zero_ai_hallucination_pledge: true, has_test_suite: true,
};

beforeEach(() => vi.stubEnv('NEXT_PUBLIC_PAYLOAD_API_URL', API));
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('toPayloadType', () => {
  it('keeps valid Payload types and falls back to library for design-only ones', () => {
    expect(toPayloadType('dataset')).toBe('dataset');
    expect(toPayloadType('font')).toBe('font');
    expect(toPayloadType('something-new')).toBe('library');
  });
});

describe('toPayloadBody', () => {
  it('maps wizard fields, creates a DRAFT, and drops design-only/privileged fields', () => {
    const b = toPayloadBody(form);
    expect(b).toEqual({
      name: 'مكتبة اختبار', type: 'library', short_description: 'نبذة', description: 'نبذة',
      license: 'MIT', version: '1.0.0', github_url: 'https://github.com/x/y', status: 'draft',
    });
    expect(b).not.toHaveProperty('itqan_badge');
    expect(b).not.toHaveProperty('owner');
    expect(b).not.toHaveProperty('slug');
  });

  it('prefers the readme for description and omits an empty repo url', () => {
    const b = toPayloadBody({ ...form, readme_ar: 'تفاصيل', repository_url: '' });
    expect(b.description).toBe('تفاصيل');
    expect(b).not.toHaveProperty('github_url');
  });
});

describe('createResource', () => {
  it('posts the mapped body with the session cookie', async () => {
    const f = vi.fn(() => ok({ doc: { id: 1 } }));
    vi.stubGlobal('fetch', f);
    expect(await createResource(form)).toBeNull();
    const [url, init] = f.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(`${API}/resources`);
    expect(init.credentials).toBe('include');
    expect(JSON.parse(init.body as string).status).toBe('draft');
  });

  it('returns the server validation error and survives network failure', async () => {
    vi.stubGlobal('fetch', vi.fn(() => fail(400, 'The following field is invalid: license')));
    expect(await createResource(form)).toBe('The following field is invalid: license');
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new TypeError('network'))));
    expect(await createResource(form)).toBeTruthy();
  });
});

describe('fetchMyResources', () => {
  const doc = (id: number, status: string) => ({
    id, name: `R${id}`, slug: `r${id}`, type: 'sdk', description: 'd', short_description: 's',
    documentation_url: null, github_url: null, license: 'MIT', itqan_badge: false, status, version: null,
    createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z',
  });

  it('queries by owner (incl. drafts) and maps results', async () => {
    const f = vi.fn(() => ok({ docs: [doc(1, 'draft'), doc(2, 'published')] }));
    vi.stubGlobal('fetch', f);
    const out = await fetchMyResources('payload_user_5');
    expect(out.map((r) => r.status)).toEqual(['draft', 'published']);
    const url = decodeURIComponent((f.mock.calls[0] as unknown as [string])[0]);
    expect(url).toContain('where[owner][equals]=5');
  });

  it('returns [] for a non-live profile (no request) and on failure', async () => {
    const f = vi.fn();
    vi.stubGlobal('fetch', f);
    expect(await fetchMyResources('user_pub_001')).toEqual([]);
    expect(f).not.toHaveBeenCalled();
    vi.stubGlobal('fetch', vi.fn(() => fail(500, 'x')));
    expect(await fetchMyResources('payload_user_5')).toEqual([]);
  });
});

describe('deleteResource', () => {
  it('DELETEs by numeric id', async () => {
    const f = vi.fn(() => ok());
    vi.stubGlobal('fetch', f);
    expect(await deleteResource('payload_7')).toBeNull();
    const [url, init] = f.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(`${API}/resources/7`);
    expect(init.method).toBe('DELETE');
    expect(init.credentials).toBe('include');
  });

  it('returns the refusal (not the owner) and rejects non-live ids without a request', async () => {
    vi.stubGlobal('fetch', vi.fn(() => fail(403, 'Forbidden')));
    expect(await deleteResource('payload_7')).toBe('Forbidden');
    const f = vi.fn();
    vi.stubGlobal('fetch', f);
    expect(await deleteResource('res_001')).toBeTruthy();
    expect(f).not.toHaveBeenCalled();
  });
});
