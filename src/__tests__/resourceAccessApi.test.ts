import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  fetchResourceAccessGrants,
  fetchRevokeAccessRequest,
  RESOURCE_ACCESS_PAGE_SIZE,
} from '@/modules/resources/infrastructure/access-requests-api';
import { PAYLOAD_API_BASE } from '@/shared/infrastructure/payload-config';

function okJson(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

const payloadDoc = {
  id: 77,
  status: 'approved',
  message: 'Please grant access.',
  createdAt: '2026-08-01T10:00:00Z',
  updatedAt: '2026-08-02T10:00:00Z',
  applicant: { id: 42, display_name: 'Sara Ahmed', email: 'sara@example.com' },
  resource: { id: 1, slug: 'verse-search', name: 'Verse Search API' },
};

describe('fetchResourceAccessGrants', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('ratq_access_token', 'test-token');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('undoes the 200_000 aggregator offset so it queries the real Payload resource', async () => {
    // Getting this wrong would list a different resource's grants entirely.
    const fetchMock = vi.fn().mockResolvedValue(okJson({ docs: [] }));
    vi.stubGlobal('fetch', fetchMock);

    await fetchResourceAccessGrants(200_001);

    const url = fetchMock.mock.calls[0][0] as string;
    expect(url).toContain('where[resource][equals]=1');
    expect(url).not.toContain('where[resource][equals]=200001');
  });

  it('asks only for approved requests, so revoked access never appears as current', async () => {
    const fetchMock = vi.fn().mockResolvedValue(okJson({ docs: [] }));
    vi.stubGlobal('fetch', fetchMock);

    await fetchResourceAccessGrants(200_001);

    const url = fetchMock.mock.calls[0][0] as string;
    expect(url).toContain('where[status][equals]=approved');
    expect(url).toContain(`${PAYLOAD_API_BASE}/access-requests?`);
  });

  it('sends the stored token so Payload can scope the read to this publisher', async () => {
    const fetchMock = vi.fn().mockResolvedValue(okJson({ docs: [] }));
    vi.stubGlobal('fetch', fetchMock);

    await fetchResourceAccessGrants(200_001);

    const init = fetchMock.mock.calls[0][1] as RequestInit;
    expect((init.headers as Record<string, string>).Authorization).toBe('JWT test-token');
  });

  it('maps Payload docs onto the shape the UI renders', async () => {
    const fetchMock = vi.fn().mockResolvedValue(okJson({ docs: [payloadDoc], totalDocs: 1 }));
    vi.stubGlobal('fetch', fetchMock);

    const { grants } = await fetchResourceAccessGrants(200_001);

    expect(grants).toHaveLength(1);
    expect(grants[0].id).toBe(77);
    expect(grants[0].applicant_display_name).toBe('Sara Ahmed');
    expect(grants[0].status).toBe('approved');
    expect(grants[0].updated_at).toBe('2026-08-02T10:00:00Z');
  });

  it('reports the true total so a capped list can say it is capped', async () => {
    // The query asks for at most RESOURCE_ACCESS_PAGE_SIZE. Without the total
    // the UI cannot tell "these are all of them" from "these are the first 100".
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(okJson({ docs: [payloadDoc], totalDocs: 137 })),
    );

    const { grants, total } = await fetchResourceAccessGrants(200_001);

    expect(grants).toHaveLength(1);
    expect(total).toBe(137);
  });

  it('requests at most one page of grants', async () => {
    const fetchMock = vi.fn().mockResolvedValue(okJson({ docs: [], totalDocs: 0 }));
    vi.stubGlobal('fetch', fetchMock);

    await fetchResourceAccessGrants(200_001);

    expect(fetchMock.mock.calls[0][0]).toContain(`limit=${RESOURCE_ACCESS_PAGE_SIZE}`);
  });

  it('throws rather than returning an empty list when the request fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('nope', { status: 403 })));

    await expect(fetchResourceAccessGrants(200_001)).rejects.toThrow(
      'Failed to fetch resource access',
    );
  });
});

describe('fetchRevokeAccessRequest', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('ratq_access_token', 'test-token');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('PATCHes the request to revoked by its own id', async () => {
    const fetchMock = vi.fn().mockResolvedValue(okJson({ doc: { ...payloadDoc, status: 'revoked' } }));
    vi.stubGlobal('fetch', fetchMock);

    await fetchRevokeAccessRequest(77);

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(`${PAYLOAD_API_BASE}/access-requests/77`);
    expect(init.method).toBe('PATCH');
    expect(JSON.parse(init.body as string)).toEqual({ status: 'revoked' });
  });

  it('does not send any other field alongside the status change', async () => {
    const fetchMock = vi.fn().mockResolvedValue(okJson({ doc: { ...payloadDoc, status: 'revoked' } }));
    vi.stubGlobal('fetch', fetchMock);

    await fetchRevokeAccessRequest(77);

    const init = fetchMock.mock.calls[0][1] as RequestInit;
    expect(Object.keys(JSON.parse(init.body as string))).toEqual(['status']);
  });

  it('surfaces a rejection rather than resolving on a non-ok response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ errors: [{ message: 'Forbidden' }] }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );

    await expect(fetchRevokeAccessRequest(77)).rejects.toThrow();
  });
});
