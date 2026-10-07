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

  it('detects the language of each resource from its text instead of assuming English', async () => {
    const arabicEn = { ...enAsset, name: 'French Translation', description: 'اعتمد الطبري في تفسيره' };
    fetchMock.mockImplementation((_url: string, init?: RequestInit) =>
      json({ count: 1, results: [langOf(init) === 'ar' ? arAsset : arabicEn] }),
    );

    const { results } = await cmsSource.list({});

    expect(results[0].content_language).toBe('ar');
    expect(results[0].title_language).toBe('en');
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

describe('cms source cache keys', () => {
  // Some deployed runtimes key the fetch cache on the URL alone and ignore
  // headers, which would let the English and Arabic responses overwrite each
  // other. Each language therefore has to request its own URL.
  const urlsByLanguage = (calls: [string, RequestInit | undefined][]) => {
    const urls = { ar: new Set<string>(), en: new Set<string>() };
    calls.forEach(([url, init]) => urls[langOf(init) === 'ar' ? 'ar' : 'en'].add(url));
    return urls;
  };

  it('never requests the same list URL for both languages', async () => {
    fetchMock.mockImplementation((_url: string, init?: RequestInit) =>
      json({ count: 1, results: [langOf(init) === 'ar' ? arAsset : enAsset] }),
    );

    await cmsSource.list({});
    const urls = urlsByLanguage(fetchMock.mock.calls as [string, RequestInit | undefined][]);

    expect(urls.ar.size).toBeGreaterThan(0);
    expect(urls.en.size).toBeGreaterThan(0);
    expect([...urls.ar].filter((u) => urls.en.has(u))).toEqual([]);
  });

  it('never requests the same detail URL for both languages', async () => {
    fetchMock.mockImplementation(() => json({ ...enAsset, long_description: 'x', snapshots: [] }));

    await cmsSource.getDetail!({ slug: 'cms-27', description: 'x' } as never);
    const urls = urlsByLanguage(fetchMock.mock.calls as [string, RequestInit | undefined][]);

    expect([...urls.ar].filter((u) => urls.en.has(u))).toEqual([]);
    expect(urls.ar.size).toBe(1);
    expect(urls.en.size).toBe(1);
  });
});

describe('cms source detail', () => {  it('adds the Arabic long description and publisher from the Arabic detail response', async () => {
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

  it('getDetail_arabicLongDescriptionOverEnglishShortOne_reportsArabicContentLanguage', async () => {
    fetchMock.mockImplementation(() =>
      json({ ...enAsset, long_description: 'اعتمد الطبري في تفسيره', snapshots: [] }),
    );

    const detail = await cmsSource.getDetail!({
      slug: 'cms-27',
      description: 'English description',
      content_language: 'en',
      title_language: 'en',
    } as never);

    expect(detail?.content_language).toBe('ar');
    expect(detail).not.toHaveProperty('title_language');
  });

  it('getDetail_blankLongDescription_keepsListContentLanguage', async () => {
    fetchMock.mockImplementation(() => json({ ...enAsset, long_description: ' ', snapshots: [] }));

    const detail = await cmsSource.getDetail!({
      slug: 'cms-27',
      description: 'English description',
      content_language: 'en',
    } as never);

    expect(detail?.content_language).toBe('en');
  });
});

describe('cms source getBySlug', () => {
  it('resolves the detail endpoint directly and maps the full resource in one request per language', async () => {
    fetchMock.mockImplementation((_url: string, init?: RequestInit) =>
      json(
        langOf(init) === 'ar'
          ? { ...arAsset, long_description: 'وصف عربي مفصل', snapshots: [{ image_url: 'ar.png' }], reciter: null }
          : {
              ...enAsset,
              long_description: 'Long English',
              reciter: { id: 4, name: 'Reciter One' },
              snapshots: [{ image_url: 'a.png' }, { image_url: 'b.png' }],
            },
      ),
    );

    const resource = await cmsSource.getBySlug!('cms-27');

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(resource).toMatchObject({
      id: 100_027,
      slug: 'cms-27',
      source: 'cms',
      description: 'Long English',
      name_ar: 'المصحف المرتل برواية الدوري',
      description_ar: 'وصف عربي مفصل',
      preview_images: ['a.png', 'b.png'],
      reciter_name: 'Reciter One',
    });
    expect(resource?.publisher).toEqual({ id: 3, name: 'Tahbeer Center', name_ar: 'مركز تحبير' });
  });

  it('returns null for an unknown slug instead of throwing', async () => {
    fetchMock.mockImplementation(() => json(null, false));

    expect(await cmsSource.getBySlug!('cms-999')).toBeNull();
  });
});
