import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('fetchTrendingResources (live mode)', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv('NEXT_PUBLIC_DATA_MODE', 'live');
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('fetchTrendingResources_liveMode_ranksFromResourceListNotMissingEndpoint', async () => {
    const list = [
      { id: 'a', name: 'A', slug: 'a', type: 'api', downloads: 5, total_downloads: 9 },
      { id: 'b', name: 'B', slug: 'b', type: 'api', downloads: 0, total_downloads: 0 },
    ];
    vi.mocked(fetch).mockResolvedValue({ ok: true, json: async () => ({ results: list }) } as Response);
    const { fetchTrendingResources } = await import('@/modules/resources/infrastructure/trending-api');

    const result = await fetchTrendingResources('7d');

    expect(result.map((r) => r.id)).toEqual(['a']);
    for (const [url] of vi.mocked(fetch).mock.calls) {
      expect(String(url)).not.toContain('/trending');
    }
  });
});
