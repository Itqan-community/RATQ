import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import { fetchAllPages } from '@/modules/developer/infrastructure/payload-paging';
import { fetchDeveloperAPIKeys } from '@/modules/developer/infrastructure/api-keys-api';
import { fetchDeveloperResources } from '@/modules/developer/infrastructure/resources-api';

function okJson(body: unknown) {
  return { ok: true, json: () => Promise.resolve(body) } as Response;
}

describe('fetchAllPages', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('aggregates every page', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(okJson({ docs: [1, 2], totalPages: 3 }))
      .mockResolvedValueOnce(okJson({ docs: [3, 4], totalPages: 3 }))
      .mockResolvedValueOnce(okJson({ docs: [5], totalPages: 3 }));
    vi.stubGlobal('fetch', fetchMock);

    const out = await fetchAllPages<number>(
      (page) => `https://x.test/items?page=${page}`,
      () => new Error('nope'),
    );

    expect(out).toEqual([1, 2, 3, 4, 5]);
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it('stops after one page when the backend names no total', async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(okJson({ docs: [1] }));
    vi.stubGlobal('fetch', fetchMock);

    expect(
      await fetchAllPages<number>(() => 'https://x.test/items', () => new Error('nope')),
    ).toEqual([1]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('throws the caller error on a bad status', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce({ ok: false }));
    await expect(
      fetchAllPages<number>(() => 'https://x.test/items', () => new Error('boom')),
    ).rejects.toThrow('boom');
  });
});

vi.mock('@/shared/infrastructure/token-storage', () => ({
  getCurrentUserId: vi.fn(() => 7),
}));

describe('dashboard fetchers paginate (#359 follow-up)', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('fetchDeveloperResources combines all pages', async () => {
    const doc = (id: number) => ({
      id,
      name: `r${id}`,
      slug: `r${id}`,
      type: 'library',
      description: 'd',
      short_description: 's',
      image: null,
      documentation_url: null,
      github_url: null,
      website_url: null,
      license: 'MIT',
      itqan_badge: false,
      status: 'published',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    });
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(okJson({ docs: [doc(1)], totalPages: 2 }))
      .mockResolvedValueOnce(okJson({ docs: [doc(2)], totalPages: 2 }));
    vi.stubGlobal('fetch', fetchMock);

    const out = await fetchDeveloperResources(7);

    expect(out.map((r) => r.slug)).toEqual(['payload-r1', 'payload-r2']);
    expect(fetchMock.mock.calls[1][0]).toContain('page=2');
  });

  it('fetchDeveloperAPIKeys combines all pages', async () => {
    const doc = (id: number) => ({
      id,
      name: `k${id}`,
      resource: 3,
      scope: 'read',
      createdAt: '2024-01-01T00:00:00Z',
      last_used_at: null,
    });
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(okJson({ docs: [doc(1)], totalPages: 2 }))
      .mockResolvedValueOnce(okJson({ docs: [doc(2)], totalPages: 2 }));
    vi.stubGlobal('fetch', fetchMock);

    const out = await fetchDeveloperAPIKeys();

    expect(out.map((k) => k.id)).toEqual([1, 2]);
    expect(fetchMock.mock.calls[1][0]).toContain('page=2');
  });
});
