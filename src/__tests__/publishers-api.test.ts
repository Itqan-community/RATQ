import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchPublishers } from '@/modules/resources/infrastructure/publishers-api';

describe('fetchPublishers', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns the parsed publisher list for a successful response', async () => {
    const publishers = [{ id: 1, name: 'Publisher One' }];
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(publishers),
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(fetchPublishers()).resolves.toEqual(publishers);
    expect(fetchMock).toHaveBeenCalledWith('/api/resources/publishers');
  });

  it('throws when the API response is not successful', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false });
    vi.stubGlobal('fetch', fetchMock);

    await expect(fetchPublishers()).rejects.toThrow('Failed to fetch publishers');
  });
});
