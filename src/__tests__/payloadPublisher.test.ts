import { afterEach, describe, expect, it, vi } from 'vitest';
import { toResource, type PayloadResourceDoc } from '@/shared/infrastructure/payload-resource-mapper';
import { payloadSource } from '@/modules/resources/infrastructure/repositories/payload';

function doc(id: number, publisher: PayloadResourceDoc['publisher']): PayloadResourceDoc {
  return {
    id,
    name: `Resource ${id}`,
    slug: `r-${id}`,
    type: 'dataset',
    description: 'd',
    short_description: 's',
    documentation_url: null,
    github_url: null,
    license: 'MIT',
    itqan_badge: false,
    status: 'published',
    version: null,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    publisher,
  };
}

describe('toResource publisher', () => {
  it('maps the public publisher onto the resource', () => {
    const r = toResource(doc(1, { id: 88, name: 'Tahbeer Center' }));
    expect(r.publisher).toEqual({ id: 88, name: 'Tahbeer Center' });
  });

  it('leaves publisher unset when the doc has none', () => {
    expect(toResource(doc(1, null)).publisher).toBeUndefined();
    expect(toResource(doc(2, undefined)).publisher).toBeUndefined();
  });
});

describe('payloadSource.list publisher filter', () => {
  afterEach(() => vi.unstubAllGlobals());

  const stubDocs = (docs: PayloadResourceDoc[]) =>
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ ok: true, json: async () => ({ docs, totalDocs: docs.length, hasNextPage: false }) })),
    );

  it('filters by the payload-namespaced publisher key', async () => {
    stubDocs([doc(1, { id: 88, name: 'A' }), doc(2, { id: 64, name: 'B' }), doc(3, null)]);
    const res = await payloadSource.list({ publisherKeys: ['payload:88'] });
    expect(res.results.map((r) => r.name)).toEqual(['Resource 1']);
  });
});

describe('payloadSource.getBySlug', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('resolves by slug in a single request without paging the catalog', async () => {
    const fetchMock = vi.fn(async (_url: string) => ({
      ok: true,
      json: async () => ({ docs: [doc(1, { id: 88, name: 'A' })], totalDocs: 1, hasNextPage: false }),
    }));
    vi.stubGlobal('fetch', fetchMock);

    const resource = await payloadSource.getBySlug!('payload-r-1');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toContain('where[slug][equals]=r-1');
    expect(resource).toMatchObject({ slug: 'payload-r-1', source: 'payload', name: 'Resource 1' });
  });

  it('returns null when the payload query has no match', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ ok: true, json: async () => ({ docs: [], totalDocs: 0, hasNextPage: false }) })),
    );

    expect(await payloadSource.getBySlug!('payload-missing')).toBeNull();
  });
});
