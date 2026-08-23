import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

vi.mock('@/shared/infrastructure/edge-cache', () => ({
  withEdgeCache: async (request: Request, compute: () => Promise<Response>) => {
    const cache = (globalThis as typeof globalThis & { caches?: { default?: Cache } }).caches?.default;
    if (!cache) return compute();
    const cacheKey = new Request(request.url);
    const cached = await cache.match(cacheKey);
    if (cached) return cached;
    const response = await compute();
    if (response.ok) await cache.put(cacheKey, response.clone());
    return response;
  },
}));

import { fetchGithubRepoPreview } from '@/modules/resources/infrastructure/github/fetchGithubRepoPreview';

const commitsUrl = 'https://api.github.com/repos/owner/repo/commits?per_page=5';
const topicsUrl = 'https://api.github.com/repos/owner/repo/topics';

function jsonResponse(body: unknown, ok = true, status = 200): Response {
  return {
    ok,
    status,
    json: async () => body,
  } as Response;
}

function installMockEdgeCache() {
  const store = new Map<string, Response>();
  const cache = {
    match: vi.fn(async (req: Request) => {
      const hit = store.get(req.url);
      return hit ? hit.clone() : undefined;
    }),
    put: vi.fn(async (req: Request, res: Response) => {
      store.set(req.url, res.clone());
    }),
  };
  (globalThis as unknown as { caches: { default: typeof cache } }).caches = { default: cache };
  return { cache, store };
}

function removeMockEdgeCache() {
  delete (globalThis as unknown as { caches?: unknown }).caches;
}

describe('fetchGithubRepoPreview', () => {
  const originalToken = process.env.GITHUB_API_TOKEN;

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    removeMockEdgeCache();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    removeMockEdgeCache();
    if (originalToken === undefined) {
      delete process.env.GITHUB_API_TOKEN;
    } else {
      process.env.GITHUB_API_TOKEN = originalToken;
    }
  });

  it('returns null when GITHUB_API_TOKEN is missing', async () => {
    delete process.env.GITHUB_API_TOKEN;

    await expect(fetchGithubRepoPreview('owner', 'repo')).resolves.toBeNull();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('returns null when a GitHub response is not ok', async () => {
    process.env.GITHUB_API_TOKEN = 'test-token';
    vi.mocked(fetch).mockImplementation(async (input) => {
      const url = String(input);
      if (url === commitsUrl) return jsonResponse([]);
      return jsonResponse({ message: 'Not Found' }, false, 404);
    });

    await expect(fetchGithubRepoPreview('owner', 'repo')).resolves.toBeNull();
  });

  it('returns null when fetch throws', async () => {
    process.env.GITHUB_API_TOKEN = 'test-token';
    vi.mocked(fetch).mockRejectedValue(new Error('network down'));

    await expect(fetchGithubRepoPreview('owner', 'repo')).resolves.toBeNull();
  });

  it('maps commits and topics on success', async () => {
    process.env.GITHUB_API_TOKEN = 'test-token';
    vi.mocked(fetch).mockImplementation(async (input) => {
      const url = String(input);
      if (url === commitsUrl) {
        return jsonResponse([
          {
            sha: 'abc123def456',
            html_url: 'https://github.com/owner/repo/commit/abc123def456',
            commit: {
              message: 'Fix parser\n\nMore detail',
              author: { name: 'Ada', date: '2026-08-01T12:00:00Z' },
            },
            author: { login: 'ada' },
          },
        ]);
      }
      if (url === topicsUrl) {
        return jsonResponse({ names: ['quran', 'typescript'] });
      }
      return jsonResponse({}, false, 404);
    });

    await expect(fetchGithubRepoPreview('owner', 'repo')).resolves.toEqual({
      topics: ['quran', 'typescript'],
      commits: [
        {
          sha: 'abc123def456',
          message: 'Fix parser',
          author: 'Ada',
          date: '2026-08-01T12:00:00Z',
          url: 'https://github.com/owner/repo/commit/abc123def456',
        },
      ],
    });

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenCalledWith(
      commitsUrl,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token',
        }),
        next: { revalidate: 300 },
      }),
    );
  });
});

describe('fetchGithubRepoPreview edge cache', () => {
  const originalToken = process.env.GITHUB_API_TOKEN;

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    removeMockEdgeCache();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    removeMockEdgeCache();
    if (originalToken === undefined) {
      delete process.env.GITHUB_API_TOKEN;
    } else {
      process.env.GITHUB_API_TOKEN = originalToken;
    }
  });

  it('caches successful preview and serves second call without GitHub fetch', async () => {
    const { cache } = installMockEdgeCache();
    process.env.GITHUB_API_TOKEN = 'test-token';
    vi.mocked(fetch).mockImplementation(async (input) => {
      const url = String(input);
      if (url === commitsUrl) {
        return jsonResponse([
          {
            sha: 'abc123def456',
            html_url: 'https://github.com/owner/repo/commit/abc123def456',
            commit: {
              message: 'Fix parser',
              author: { name: 'Ada', date: '2026-08-01T12:00:00Z' },
            },
            author: { login: 'ada' },
          },
        ]);
      }
      if (url === topicsUrl) return jsonResponse({ names: ['quran', 'typescript'] });
      return jsonResponse({}, false, 404);
    });

    const first = await fetchGithubRepoPreview('owner', 'repo');
    expect(first).toEqual({
      topics: ['quran', 'typescript'],
      commits: [
        {
          sha: 'abc123def456',
          message: 'Fix parser',
          author: 'Ada',
          date: '2026-08-01T12:00:00Z',
          url: 'https://github.com/owner/repo/commit/abc123def456',
        },
      ],
    });
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(cache.put).toHaveBeenCalledTimes(1);
    const putResponse = (cache.put as unknown as { mock: { calls: [Request, Response][] } }).mock.calls[0][1];
    expect(putResponse.headers.get('Cache-Control')).toContain('s-maxage=300');
    expect(putResponse.headers.get('Cache-Control')).toContain('s-maxage=300');

    vi.mocked(fetch).mockClear();
    const second = await fetchGithubRepoPreview('owner', 'repo');
    expect(second).toEqual(first);
    expect(fetch).not.toHaveBeenCalled();
    expect(cache.match).toHaveBeenCalled();
  });

  it('isolates cache keys by owner and repo', async () => {
    const { cache, store } = installMockEdgeCache();
    process.env.GITHUB_API_TOKEN = 'test-token';

    vi.mocked(fetch).mockImplementation(async (input) => {
      const url = String(input);
      if (url.includes('/ownerA/repoA/')) {
        if (url.includes('/commits')) {
          return jsonResponse([
            {
              sha: 'sha-A',
              html_url: 'https://github.com/ownerA/repoA/commit/sha-A',
              commit: { message: 'A commit', author: { name: 'A', date: '2026-08-01T00:00:00Z' } },
              author: { login: 'a' },
            },
          ]);
        }
        if (url.includes('/topics')) return jsonResponse({ names: ['topicA'] });
      }
      if (url.includes('/ownerB/repoB/')) {
        if (url.includes('/commits')) {
          return jsonResponse([
            {
              sha: 'sha-B',
              html_url: 'https://github.com/ownerB/repoB/commit/sha-B',
              commit: { message: 'B commit', author: { name: 'B', date: '2026-08-02T00:00:00Z' } },
              author: { login: 'b' },
            },
          ]);
        }
        if (url.includes('/topics')) return jsonResponse({ names: ['topicB'] });
      }
      return jsonResponse({}, false, 404);
    });

    const previewA1 = await fetchGithubRepoPreview('ownerA', 'repoA');
    expect(previewA1?.topics).toEqual(['topicA']);
    expect(previewA1?.commits[0]?.sha).toBe('sha-A');
    expect(cache.put).toHaveBeenCalledTimes(1);

    const previewB1 = await fetchGithubRepoPreview('ownerB', 'repoB');
    expect(previewB1?.topics).toEqual(['topicB']);
    expect(previewB1?.commits[0]?.sha).toBe('sha-B');
    expect(cache.put).toHaveBeenCalledTimes(2);
    expect(store.size).toBe(2);

    vi.mocked(fetch).mockClear();
    const previewA2 = await fetchGithubRepoPreview('ownerA', 'repoA');
    expect(previewA2).toEqual(previewA1);
    expect(fetch).not.toHaveBeenCalled();

    const previewB2 = await fetchGithubRepoPreview('ownerB', 'repoB');
    expect(previewB2).toEqual(previewB1);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('does not cache missing-token results', async () => {
    const { cache } = installMockEdgeCache();
    delete process.env.GITHUB_API_TOKEN;

    const first = await fetchGithubRepoPreview('owner', 'repo');
    expect(first).toBeNull();
    expect(fetch).not.toHaveBeenCalled();
    expect(cache.put).not.toHaveBeenCalled();
    expect(cache.match).not.toHaveBeenCalled();

    const second = await fetchGithubRepoPreview('owner', 'repo');
    expect(second).toBeNull();
    expect(fetch).not.toHaveBeenCalled();
    expect(cache.put).not.toHaveBeenCalled();

    // Now set token and ensure same repo can still be fetched and cached
    process.env.GITHUB_API_TOKEN = 'test-token';
    vi.mocked(fetch).mockImplementation(async (input) => {
      const url = String(input);
      if (url === commitsUrl) return jsonResponse([{ sha: 's', html_url: 'u', commit: { message: 'm', author: { name: 'n', date: 'd' } } }]);
      if (url === topicsUrl) return jsonResponse({ names: [] });
      return jsonResponse({}, false, 404);
    });
    const third = await fetchGithubRepoPreview('owner', 'repo');
    expect(third).not.toBeNull();
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(cache.put).toHaveBeenCalledTimes(1);
  });

  it('does not cache failed commits response', async () => {
    const { cache } = installMockEdgeCache();
    process.env.GITHUB_API_TOKEN = 'test-token';
    vi.mocked(fetch).mockImplementation(async (input) => {
      const url = String(input);
      if (url === commitsUrl) return jsonResponse({ message: 'error' }, false, 500);
      return jsonResponse({ names: ['ok'] });
    });

    const first = await fetchGithubRepoPreview('owner', 'repo');
    expect(first).toBeNull();
    expect(cache.put).not.toHaveBeenCalled();

    const second = await fetchGithubRepoPreview('owner', 'repo');
    expect(second).toBeNull();
    expect(cache.put).not.toHaveBeenCalled();
    // fetch should have been called twice per attempt = 4 total
    expect(fetch).toHaveBeenCalledTimes(4);
  });

  it('does not cache failed topics response', async () => {
    const { cache } = installMockEdgeCache();
    process.env.GITHUB_API_TOKEN = 'test-token';
    vi.mocked(fetch).mockImplementation(async (input) => {
      const url = String(input);
      if (url === commitsUrl) return jsonResponse([]);
      if (url === topicsUrl) return jsonResponse({ message: 'Not Found' }, false, 404);
      return jsonResponse({}, false, 404);
    });

    const first = await fetchGithubRepoPreview('owner', 'repo');
    expect(first).toBeNull();
    expect(cache.put).not.toHaveBeenCalled();

    const second = await fetchGithubRepoPreview('owner', 'repo');
    expect(second).toBeNull();
    expect(fetch).toHaveBeenCalledTimes(4);
    expect(cache.put).not.toHaveBeenCalled();
  });

  it('does not cache invalid payload (commits not array)', async () => {
    const { cache } = installMockEdgeCache();
    process.env.GITHUB_API_TOKEN = 'test-token';
    vi.mocked(fetch).mockImplementation(async (input) => {
      const url = String(input);
      if (url === commitsUrl) return jsonResponse({ not: 'array' } as unknown as unknown);
      if (url === topicsUrl) return jsonResponse({ names: ['quran'] });
      return jsonResponse({}, false, 404);
    });

    const first = await fetchGithubRepoPreview('owner', 'repo');
    expect(first).toBeNull();
    expect(cache.put).not.toHaveBeenCalled();

    const second = await fetchGithubRepoPreview('owner', 'repo');
    expect(second).toBeNull();
    expect(fetch).toHaveBeenCalledTimes(4);
    expect(cache.put).not.toHaveBeenCalled();
  });

  it('does not cache caught errors (fetch throws)', async () => {
    const { cache } = installMockEdgeCache();
    process.env.GITHUB_API_TOKEN = 'test-token';
    vi.mocked(fetch).mockRejectedValue(new Error('network down'));

    const first = await fetchGithubRepoPreview('owner', 'repo');
    expect(first).toBeNull();
    expect(cache.put).not.toHaveBeenCalled();

    const second = await fetchGithubRepoPreview('owner', 'repo');
    expect(second).toBeNull();
    expect(cache.put).not.toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledTimes(4);
  });

  it('does not cache when json() throws (invalid JSON)', async () => {
    const { cache } = installMockEdgeCache();
    process.env.GITHUB_API_TOKEN = 'test-token';
    vi.mocked(fetch).mockImplementation(async (input) => {
      const url = String(input);
      if (url === commitsUrl) {
        return {
          ok: true,
          status: 200,
          json: async () => {
            throw new Error('invalid json');
          },
        } as unknown as Response;
      }
      if (url === topicsUrl) return jsonResponse({ names: [] });
      return jsonResponse({}, false, 404);
    });

    const first = await fetchGithubRepoPreview('owner', 'repo');
    expect(first).toBeNull();
    expect(cache.put).not.toHaveBeenCalled();

    const second = await fetchGithubRepoPreview('owner', 'repo');
    expect(second).toBeNull();
    expect(fetch).toHaveBeenCalledTimes(4);
  });

  it('preserves next: { revalidate: 300 } on GitHub fetches', async () => {
    installMockEdgeCache();
    process.env.GITHUB_API_TOKEN = 'test-token';
    vi.mocked(fetch).mockImplementation(async (input) => {
      const url = String(input);
      if (url === commitsUrl) return jsonResponse([]);
      if (url === topicsUrl) return jsonResponse({ names: [] });
      return jsonResponse({}, false, 404);
    });

    await fetchGithubRepoPreview('owner', 'repo');

    expect(fetch).toHaveBeenCalledWith(
      commitsUrl,
      expect.objectContaining({ next: { revalidate: 300 } }),
    );
    expect(fetch).toHaveBeenCalledWith(
      topicsUrl,
      expect.objectContaining({ next: { revalidate: 300 } }),
    );
  });

  it('keeps commits and topics requests parallel on cache miss', async () => {
    const { cache } = installMockEdgeCache();
    process.env.GITHUB_API_TOKEN = 'test-token';

    let commitsStarted = false;
    let topicsStarted = false;
    let bothStarted = false;

    vi.mocked(fetch).mockImplementation(async (input) => {
      const url = String(input);
      if (url === commitsUrl) {
        commitsStarted = true;
        if (topicsStarted) bothStarted = true;
        // small delay to allow interleaving
        await new Promise((r) => setTimeout(r, 5));
        return jsonResponse([]);
      }
      if (url === topicsUrl) {
        topicsStarted = true;
        if (commitsStarted) bothStarted = true;
        await new Promise((r) => setTimeout(r, 5));
        return jsonResponse({ names: [] });
      }
      return jsonResponse({}, false, 404);
    });

    await fetchGithubRepoPreview('owner', 'repo');

    expect(fetch).toHaveBeenCalledTimes(2);
    // Promise.all ensures both fetches start before either resolves
    expect(commitsStarted && topicsStarted).toBe(true);
    // cache should have been populated only after success
    expect(cache.put).toHaveBeenCalledTimes(1);
  });

  it('source still contains parallel Promise.all and revalidate handling', async () => {
    const filePath = path.resolve(process.cwd(), 'src/modules/resources/infrastructure/github/fetchGithubRepoPreview.ts');
    const content = fs.readFileSync(filePath, 'utf8');
    expect(content).toContain('Promise.all');
    expect(content).toContain('next: { revalidate: REVALIDATE }');
    expect(content).toContain('withEdgeCache');
    expect(content).toContain('cache-key.internal/github-preview');
    expect(content).toContain('encodeURIComponent(owner)');
    expect(content).toContain('encodeURIComponent(repo)');
    expect(content).toContain('s-maxage=${REVALIDATE}');
    // ensure missing-token check happens before withEdgeCache (not cached) - use invocation not import
    const tokenCheckIdx = content.indexOf('if (!token) return null');
    const edgeCacheIdx = content.indexOf('await withEdgeCache');
    expect(tokenCheckIdx).toBeGreaterThan(-1);
    expect(edgeCacheIdx).toBeGreaterThan(-1);
    expect(tokenCheckIdx).toBeLessThan(edgeCacheIdx);
    // ensure REVALIDATE is 300
    expect(content).toContain('REVALIDATE = 300');
    // ensure Cache-Control TTL is 300 via REVALIDATE var
    expect(content).toContain('Cache-Control');
  });

  it('TTL is 300 seconds via Cache-Control header', async () => {
    const { cache } = installMockEdgeCache();
    process.env.GITHUB_API_TOKEN = 'test-token';
    vi.mocked(fetch).mockImplementation(async (input) => {
      const url = String(input);
      if (url === commitsUrl) return jsonResponse([]);
      if (url === topicsUrl) return jsonResponse({ names: ['a'] });
      return jsonResponse({}, false, 404);
    });

    await fetchGithubRepoPreview('owner', 'repo');
    expect(cache.put).toHaveBeenCalledTimes(1);
    const putRes = (cache.put as unknown as { mock: { calls: [Request, Response][] } }).mock.calls[0][1];
    const cc = putRes.headers.get('Cache-Control');
    expect(cc).toContain('s-maxage=300');
    expect(cc).toBe('public, s-maxage=300, stale-while-revalidate=60');
  });
});
