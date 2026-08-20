import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockAnnouncements } from '@/modules/resources/infrastructure/mock-data';
import type { Announcement } from '@/types/announcement';

type FetchAnnouncements = typeof import('@/modules/resources/infrastructure/announcements-api').fetchAnnouncements;

const pageUrl = (page: number) =>
  `https://api.test/api/announcements/?depth=1&limit=100&sort=-createdAt&page=${page}`;

function jsonResponse(body: unknown, ok = true): Response {
  return { ok, json: async () => body } as Response;
}

function doc(id: number, title: string, overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    id,
    type: 'release',
    title,
    description: `description ${id}`,
    createdAt: '2026-08-20T00:00:00Z',
    is_active: true,
    ...overrides,
  };
}

describe('fetchAnnouncements (live mode)', () => {
  let fetchAnnouncements: FetchAnnouncements;

  beforeEach(async () => {
    vi.resetModules();
    vi.stubEnv('NEXT_PUBLIC_DATA_MODE', 'live');
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://api.test');
    vi.stubGlobal('fetch', vi.fn());
    fetchAnnouncements = (await import('@/modules/resources/infrastructure/announcements-api'))
      .fetchAnnouncements;
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('fetches a single page and maps docs to the frontend contract', async () => {
    vi.mocked(fetch).mockResolvedValue(
      jsonResponse({ docs: [doc(1, 'First')], hasNextPage: false, page: 1 }),
    );

    const result = await fetchAnnouncements();

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(pageUrl(1));
    expect(result).toEqual([
      expect.objectContaining({
        id: '1',
        type: 'release',
        title: 'First',
        description: 'description 1',
        created_at: '2026-08-20T00:00:00Z',
        is_active: true,
      }),
    ]);
  });

  it('pages through until hasNextPage is false and preserves order', async () => {
    vi.mocked(fetch).mockImplementation(async (input) => {
      const url = String(input);
      if (url === pageUrl(1)) {
        return jsonResponse({
          docs: [doc(1, 'First'), doc(2, 'Second')],
          hasNextPage: true,
          nextPage: 2,
          page: 1,
        });
      }
      return jsonResponse({ docs: [doc(3, 'Third')], hasNextPage: false, page: 2 });
    });

    const result = await fetchAnnouncements();

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenCalledWith(pageUrl(1));
    expect(fetch).toHaveBeenCalledWith(pageUrl(2));
    expect(result.map((a) => a.title)).toEqual(['First', 'Second', 'Third']);
  });

  it('stops when hasNextPage is true but nextPage is missing (malformed metadata)', async () => {
    vi.mocked(fetch).mockResolvedValue(
      jsonResponse({ docs: [doc(1, 'First')], hasNextPage: true, page: 1 }),
    );

    const result = await fetchAnnouncements();

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(1);
  });

  it('stops when nextPage does not move forward (no infinite loop)', async () => {
    vi.mocked(fetch).mockResolvedValue(
      jsonResponse({ docs: [doc(1, 'First')], hasNextPage: true, nextPage: 1, page: 1 }),
    );

    const result = await fetchAnnouncements();

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(1);
  });

  it('stops at totalPages even if nextPage claims more (no infinite loop)', async () => {
    vi.mocked(fetch).mockImplementation(async (input) => {
      const url = String(input);
      if (url === pageUrl(1)) {
        return jsonResponse({
          docs: [doc(1, 'First')],
          hasNextPage: true,
          nextPage: 2,
          page: 1,
          totalPages: 1,
        });
      }
      return jsonResponse({
        docs: [doc(2, 'Second')],
        hasNextPage: true,
        nextPage: 3,
        page: 2,
        totalPages: 2,
      });
    });

    const result = await fetchAnnouncements();

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(1);
  });

  it('rejects when a page is not ok', async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse({}, false));

    await expect(fetchAnnouncements()).rejects.toThrow('Failed to fetch announcements');
  });

  it('maps a populated resource relationship to payload-{slug}', async () => {
    vi.mocked(fetch).mockResolvedValue(
      jsonResponse({
        docs: [
          doc(1, 'Deprecation', {
            type: 'breaking_change',
            resource_id: { id: 42, slug: 'quran-api' },
          }),
        ],
        hasNextPage: false,
        page: 1,
      }),
    );

    const [announcement] = await fetchAnnouncements();

    expect(announcement.resource_id).toBe('payload-quran-api');
  });

  it('omits resource_id when the relationship is null', async () => {
    vi.mocked(fetch).mockResolvedValue(
      jsonResponse({ docs: [doc(1, 'Plain', { resource_id: null })], hasNextPage: false, page: 1 }),
    );

    const [announcement] = await fetchAnnouncements();

    expect(announcement.resource_id).toBeUndefined();
  });
});

describe('fetchAnnouncements (mock mode)', () => {
  let fetchAnnouncements: FetchAnnouncements;

  beforeEach(async () => {
    vi.resetModules();
    vi.stubEnv('NEXT_PUBLIC_DATA_MODE', 'mock');
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://api.test');
    vi.stubGlobal('fetch', vi.fn());
    fetchAnnouncements = (await import('@/modules/resources/infrastructure/announcements-api'))
      .fetchAnnouncements;
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('does not call the network and returns only active, non-expired mock announcements', async () => {
    const now = new Date();
    const expected: Announcement[] = mockAnnouncements.filter((a) => {
      if (!a.is_active) return false;
      if (a.expires_at && new Date(a.expires_at) < now) return false;
      return true;
    });

    const result = await fetchAnnouncements();

    expect(fetch).not.toHaveBeenCalled();
    expect(result).toEqual(expected);
  });
});