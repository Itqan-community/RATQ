import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { toDesignRequest, toDesignStatus, submitRequest, decideRequest, requestsFor } from '@/lib/payloadRequests';

const API = 'http://payload.test/api';
const ok = (body: unknown) => Promise.resolve(new Response(JSON.stringify(body), { status: 200 }));
const fail = (status: number, message: string) =>
  Promise.resolve(new Response(JSON.stringify({ errors: [{ message }] }), { status }));

beforeEach(() => vi.stubEnv('NEXT_PUBLIC_PAYLOAD_API_URL', API));
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('toDesignStatus', () => {
  it('maps payload vocabulary to the design vocabulary', () => {
    expect(toDesignStatus('pending')).toBe('under_review'); // the only state the publisher UI offers decisions for
    expect(toDesignStatus('approved')).toBe('approved');
    expect(toDesignStatus('denied')).toBe('rejected');
    expect(toDesignStatus('revoked')).toBe('cancelled');
  });
  it('treats unknown statuses as not granted (never approved)', () => {
    expect(toDesignStatus('weird')).toBe('under_review');
  });
});

describe('toDesignRequest', () => {
  it('maps ids, applicant and message; accepts populated or bare relations', () => {
    const populated = toDesignRequest({
      id: 9, status: 'pending', message: 'research use',
      resource: { id: 7, name: 'Tafsir API' }, applicant: { id: 3 },
      createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-02T00:00:00.000Z',
    });
    expect(populated).toMatchObject({
      id: 'payload_req_9', resource_id: 'payload_7', requester_profile_id: 'payload_user_3',
      purpose_ar: 'research use', status: 'under_review',
    });
    const named = toDesignRequest({
      id: 11, status: 'pending', message: 'm', resource: 7, applicant: { id: 3, display_name: 'Ada' },
      createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-02T00:00:00.000Z',
    });
    expect(named.requester?.display_name).toBe('Ada'); // not the demo developer, and no email exposed
    expect(named.requester?.handle).toBe('user3');
    const bare = toDesignRequest({
      id: 10, status: 'approved', message: 'm', resource: 7, applicant: 3,
      createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-02T00:00:00.000Z',
    });
    expect(bare.resource_id).toBe('payload_7');
    expect(bare.status).toBe('approved');
  });
});

describe('requestsFor (view scoping in live mode)', () => {
  const mk = (id: string, requester: string) => ({ id, requester_profile_id: requester }) as never;
  const list = [mk('payload_req_1', 'payload_user_1'), mk('payload_req_2', 'payload_user_2'), mk('req_001', 'user_dev_001')];

  it('mine = my own requests, inbound = everyone else\'s (server already limited the set)', () => {
    expect(requestsFor(list, 'mine', 'payload_user_1').map((r) => r.id)).toEqual(['payload_req_1']);
    expect(requestsFor(list, 'inbound', 'payload_user_1').map((r) => r.id)).toEqual(['payload_req_2']);
  });

  it('never shows demo requests in live mode (they would be actionable but fake)', () => {
    const ids = [...requestsFor(list, 'mine', 'x'), ...requestsFor(list, 'inbound', 'x')].map((r) => r.id);
    expect(ids).not.toContain('req_001');
  });

  it('returns everything in mock mode', () => {
    vi.stubEnv('NEXT_PUBLIC_PAYLOAD_API_URL', '');
    expect(requestsFor(list, 'mine', 'x')).toHaveLength(list.length);
    expect(requestsFor(list, 'inbound', 'x')).toHaveLength(list.length);
  });
});

describe('submitRequest', () => {
  it('posts only resource + message with the session cookie (applicant/status are server-set)', async () => {
    const f = vi.fn(() => ok({ doc: { id: 1 } }));
    vi.stubGlobal('fetch', f);
    expect(await submitRequest('payload_7', 'I need this for research')).toBeNull();
    const [url, init] = f.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(`${API}/access-requests`);
    expect(init.method).toBe('POST');
    expect(init.credentials).toBe('include');
    expect(JSON.parse(init.body as string)).toEqual({ resource: 7, message: 'I need this for research' });
  });

  it('returns the server message for a duplicate pending request', async () => {
    vi.stubGlobal('fetch', vi.fn(() => fail(400, 'You already have a pending access request for this resource.')));
    expect(await submitRequest('payload_7', 'again')).toBe('You already have a pending access request for this resource.');
  });

  it('rejects non-payload resources without touching the network', async () => {
    const f = vi.fn();
    vi.stubGlobal('fetch', f);
    expect(await submitRequest('res_b_100027', 'x')).toBeTruthy();
    expect(f).not.toHaveBeenCalled();
  });

  it('returns an error instead of throwing when the network is down', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new TypeError('network'))));
    expect(await submitRequest('payload_7', 'x')).toBeTruthy();
  });
});

describe('decideRequest', () => {
  it('uses the server vocabulary (rejected -> denied) and sends the note as publisher_notes', async () => {
    const f = vi.fn(() => ok({ doc: { id: 9 } }));
    vi.stubGlobal('fetch', f);
    expect(await decideRequest('payload_req_9', 'rejected', 'not eligible')).toBeNull();
    const [url, init] = f.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(`${API}/access-requests/9`);
    expect(init.method).toBe('PATCH');
    expect(JSON.parse(init.body as string)).toEqual({ status: 'denied', publisher_notes: 'not eligible' });
  });

  it('surfaces the server refusal when a decided request is changed again', async () => {
    vi.stubGlobal('fetch', vi.fn(() => fail(400, 'Access request status cannot be changed once decided.')));
    expect(await decideRequest('payload_req_9', 'approved', '')).toBe('Access request status cannot be changed once decided.');
  });
});
