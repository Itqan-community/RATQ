import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cmsSource } from '@/modules/resources/infrastructure/repositories/cms';

const enAsset = {
  id: 27,
  category: 'mushaf',
  name: 'Ad-Douri Mushaf',
  description: 'English description',
  publisher: { id: 3, name: 'Tahbeer Center' },
  reciter: null,
  license: 'CC0',
  is_open_access: true,
};

const arAsset = {
  ...enAsset,
  name: 'المصحف المرتل برواية الدوري',
  description: 'وصف عربي',
  publisher: { id: 3, name: 'مركز تحبير' },
};

function json(body: unknown, ok = true) {
  return Promise.resolve({ ok, json: () => Promise.resolve(body) } as Response);
}

function langOf(init: RequestInit | undefined) {
  return (init?.headers as Record<string, string> | undefined)?.['Accept-Language'];
}

const fetchMock = vi.fn();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('cms source list', () => {
  it('requests both locales and merges the Arabic fields onto each resource by id', async () => {
    fetchMock.mockImplementation((_url: string, init?: RequestInit) =>
      json({ count: 1, results: [langOf(init) === 'ar' ? arAsset : enAsset] }),
    );

    const { results } = await cmsSource.list({});

    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({
      name: 'Ad-Douri Mushaf',
      description: 'English description',
      name_ar: 'المصحف المرتل برواية الدوري',
      description_ar: 'وصف عربي',
      content_language: 'en',
      title_language: 'en',
    });
    expect(results[0].publisher).toEqual({ id: 3, name: 'Tahbeer Center', name_ar: 'مركز تحبير' });
  });

  it('falls back to English-only resources when the Arabic request fails', async () => {
    fetchMock.mockImplementation((_url: string, init?: RequestInit) =>
      langOf(init) === 'ar' ? json(null, false) : json({ count: 1, results: [enAsset] }),
    );

    const { results } = await cmsSource.list({});

    expect(results[0].name).toBe('Ad-Douri Mushaf');
    expect(results[0].name_ar).toBeUndefined();
    expect(results[0].publisher).toEqual({ id: 3, name: 'Tahbeer Center' });
  });

  it('matches a search typed in Arabic against the Arabic name', async () => {
    fetchMock.mockImplementation((_url: string, init?: RequestInit) =>
      json({ count: 1, results: [langOf(init) === 'ar' ? arAsset : enAsset] }),
    );

    const hit = await cmsSource.list({ search: 'الدوري' });
    const miss = await cmsSource.list({ search: 'حفص' });

    expect(hit.results).toHaveLength(1);
    expect(miss.results).toHaveLength(0);
  });
});

describe('cms source detail', () => {
  it('adds the Arabic long description and publisher from the Arabic detail response', async () => {
    fetchMock.mockImplementation((_url: string, init?: RequestInit) =>
      json(
        langOf(init) === 'ar'
          ? { ...arAsset, long_description: 'وصف عربي مفصل', snapshots: [] }
          : { ...enAsset, long_description: 'Long English', snapshots: [] },
      ),
    );

    const detail = await cmsSource.getDetail!({ slug: 'cms-27', description: 'x' } as never);

    expect(detail).toMatchObject({
      description: 'Long English',
      description_ar: 'وصف عربي مفصل',
      name_ar: 'المصحف المرتل برواية الدوري',
    });
    expect(detail?.publisher).toEqual({ id: 3, name: 'Tahbeer Center', name_ar: 'مركز تحبير' });
  });
});
