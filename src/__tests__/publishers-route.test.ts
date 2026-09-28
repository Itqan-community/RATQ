import { describe, expect, it, vi, beforeEach } from 'vitest';

const mockList = vi.fn();

vi.mock('@/modules/resources/infrastructure/repositories/aggregate', () => ({
  resourceAggregator: { list: mockList },
}));

vi.mock('@/shared/infrastructure/edge-cache', () => ({
  withEdgeCache: (_request: Request, compute: () => Promise<Response>) => compute(),
}));

const { GET } = await import('@/app/api/resources/publishers/route');

describe('GET /api/resources/publishers', () => {
  beforeEach(() => {
    mockList.mockReset();
  });

  it('loads resources with the publisher page size', async () => {
    mockList.mockResolvedValue({ results: [] });

    await GET(new Request('https://ratq.test/api/resources/publishers'));

    expect(mockList).toHaveBeenCalledWith({ page: 1, page_size: 10_000 });
  });

  it('returns unique publishers sorted alphabetically', async () => {
    mockList.mockResolvedValue({
      results: [
        { publisher: { id: 2, name: 'Zayd Labs' } },
        { publisher: { id: 1, name: 'Alpha Studio' } },
        { publisher: { id: 2, name: 'Zayd Labs' } },
        { publisher: null },
      ],
    });

    const response = await GET(new Request('https://ratq.test/api/resources/publishers'));

    await expect(response.json()).resolves.toEqual([
      { id: 1, name: 'Alpha Studio' },
      { id: 2, name: 'Zayd Labs' },
    ]);
  });

  it('returns the Arabic name alongside the English one', async () => {
    mockList.mockResolvedValue({
      results: [{ publisher: { id: 1, name: 'Tahbeer Center', name_ar: 'مركز تحبير' } }],
    });

    const response = await GET(new Request('https://ratq.test/api/resources/publishers'));

    await expect(response.json()).resolves.toEqual([
      { id: 1, name: 'Tahbeer Center', name_ar: 'مركز تحبير' },
    ]);
  });

  it('keys publishers by id, so one publisher with two spellings is listed once', async () => {
    mockList.mockResolvedValue({
      results: [
        { publisher: { id: 1, name: 'Tahbeer' } },
        { publisher: { id: 1, name: 'Tahbeer Center', name_ar: 'مركز تحبير' } },
      ],
    });

    const response = await GET(new Request('https://ratq.test/api/resources/publishers'));
    const body = await response.json();

    expect(body).toHaveLength(1);
    expect(body[0].id).toBe(1);
  });

  it('ignores resources without a publisher', async () => {
    mockList.mockResolvedValue({
      results: [{ publisher: null }, {}],
    });

    const response = await GET(new Request('https://ratq.test/api/resources/publishers'));

    await expect(response.json()).resolves.toEqual([]);
  });
});
