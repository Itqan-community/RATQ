import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
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

describe('fetchGithubRepoPreview', () => {
  const originalToken = process.env.GITHUB_API_TOKEN;

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
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
