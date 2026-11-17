import { describe, it, expect, afterEach, vi } from 'vitest';
import { cmsIdFromSlug, fetchCmsDetail, fetchCmsResources, toCmsResource } from '@/lib/cmsResources';

const asset = (id: number, over: Record<string, unknown> = {}) => ({
  id,
  category: 'recitation',
  tags: [],
  name: `Asset ${id}`,
  description: `Desc ${id}`,
  publisher: { id: 7, name: 'Tafsir Center' },
  reciter: null,
  license: 'CC-BY-NC-ND',
  is_open_access: true,
  ...over,
});

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });

// Routes by ?page= and Accept-Language so each call gets its own (single-use) Response.
function stubCms(pages: Record<string, unknown[] | 'fail'>, count: number) {
  const calls: string[] = [];
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string, init?: RequestInit) => {
      const lang = (init?.headers as Record<string, string> | undefined)?.['Accept-Language'] === 'ar' ? 'ar' : 'en';
      const page = new URL(url).searchParams.get('page') ?? '1';
      calls.push(`${lang}:${page}`);
      const r = pages[`${lang}:${page}`] ?? pages[page];
      if (r === 'fail' || r === undefined) return new Response('boom', { status: 500 });
      return json({ count, results: r });
    }),
  );
  return calls;
}

afterEach(() => vi.unstubAllGlobals());

describe('toCmsResource', () => {
  it('namespaces slug cms-<id> and takes Arabic title/summary from the Arabic fetch', () => {
    const r = toCmsResource(asset(4, { name: 'Tafsir Altabari' }), asset(4, { name: 'تفسير الطبري', description: 'وصف' }));
    expect(r.slug).toBe('cms-4');
    expect(r.id).toBe('cms_4');
    expect(r.title_ar).toBe('تفسير الطبري');
    expect(r.title_en).toBe('Tafsir Altabari');
    expect(r.summary_ar).toBe('وصف');
    expect(r.summary_en).toBe('Desc 4');
    expect(r.source).toBe('cms');
    expect(r.source_url).toBe('https://cms.itqan.dev/gallery/asset/4');
  });

  it('falls back to the English name when no Arabic counterpart exists', () => {
    expect(toCmsResource(asset(9)).title_ar).toBe('Asset 9');
  });

  it.each([
    ['text', 'tafsir', 'tafsir'],
    ['text', 'translation', 'translation'],
    ['recitation', undefined, 'recitation'],
    ['mushaf', undefined, 'mushaf'],
    ['font', undefined, 'font'],
    ['tajweed', undefined, 'tajweed'],
  ])('maps CMS category %s (tag %s) to resource_type %s', (category, tag, type) => {
    const r = toCmsResource(asset(1, { category, tags: tag ? [{ slug: tag, name: tag }] : [] }));
    expect(r.resource_type).toBe(type);
    expect(r.categories.length).toBe(1);
  });

  it('builds a CMS publisher (unverified, no invented claims) shared by id', () => {
    const r = toCmsResource(asset(1), asset(1, { publisher: { id: 7, name: 'مركز التفسير' } }));
    expect(r.publisher_id).toBe('cms_pub_7');
    expect(r.publisher?.name_en).toBe('Tafsir Center');
    expect(r.publisher?.name_ar).toBe('مركز التفسير');
    expect(r.publisher?.verification_status).toBe('unverified');
  });

  it('keeps zero counters and no invented dates/version', () => {
    const r = toCmsResource(asset(1));
    expect([r.downloads_count, r.views_count, r.rating_count]).toEqual([0, 0, 0]);
    expect(r.latest_version).toBeUndefined();
    expect(r.created_at).toBe('');
  });

  it('handles an asset without a publisher', () => {
    const r = toCmsResource(asset(1, { publisher: null }));
    expect(r.publisher).toBeUndefined();
    expect(r.publisher_id).toBe('');
  });
});

describe('fetchCmsResources', () => {
  it('fetchCmsResources_MultiplePages_FetchesAllPagesInBothLanguages', async () => {
    const calls = stubCms(
      { '1': [asset(1), asset(2)], '2': [asset(3), asset(4)], '3': [asset(5)] },
      5,
    );
    const out = await fetchCmsResources();
    expect(out.map((r) => r.slug)).toEqual(['cms-1', 'cms-2', 'cms-3', 'cms-4', 'cms-5']);
    expect(calls.sort()).toEqual(['ar:1', 'ar:2', 'ar:3', 'en:1', 'en:2', 'en:3']);
  });

  it('fetchCmsResources_FirstPageFails_Throws', async () => {
    stubCms({ '1': 'fail' }, 0);
    await expect(fetchCmsResources()).rejects.toThrow();
  });

  it('fetchCmsResources_NetworkFailure_Throws', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    await expect(fetchCmsResources()).rejects.toThrow();
  });

  it('fetchCmsResources_ArabicFetchFails_StillReturnsEnglishCatalog', async () => {
    stubCms({ 'en:1': [asset(1)], 'ar:1': 'fail' }, 1);
    const out = await fetchCmsResources();
    expect(out).toHaveLength(1);
    expect(out[0].title_ar).toBe('Asset 1');
  });

  it('fetchCmsResources_LaterPageFails_KeepsTheRest', async () => {
    stubCms({ '1': [asset(1), asset(2)], '2': 'fail', '3': [asset(5)] }, 5);
    const out = await fetchCmsResources();
    expect(out.map((r) => r.slug)).toEqual(['cms-1', 'cms-2', 'cms-5']);
  });

  it('fetchCmsResources_RequestsOnlyOpenAccessAssets', async () => {
    const f = vi.fn(async () => json({ count: 0, results: [] }));
    vi.stubGlobal('fetch', f);
    await fetchCmsResources();
    expect(String((f.mock.calls as unknown[][])[0][0])).toContain('is_open_access=true');
  });
});

describe('cmsIdFromSlug', () => {
  it.each([
    ['cms-4', 4],
    ['cms-123', 123],
    ['cms-0', null],
    ['cms-04', null],
    ['cms-4x', null],
    ['payload-4', null],
    ['cms-', null],
  ])('%s -> %s', (slug, id) => expect(cmsIdFromSlug(slug)).toBe(id));
});

describe('fetchCmsDetail', () => {
  const detail = (over: Record<string, unknown> = {}) => ({
    ...asset(4),
    long_description: 'Long English',
    snapshots: [
      { image_url: 'https://r2.test/a.png', title: 'a', description: '' },
      { image_url: 'javascript:alert(1)', title: 'bad', description: '' },
    ],
    reciter: { id: 2, name: 'Reciter X' },
    ...over,
  });

  it('fetchCmsDetail_Ok_ReturnsLongDescriptionImagesAndReciter', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (_u: string, init?: RequestInit) => {
        const ar = (init?.headers as Record<string, string> | undefined)?.['Accept-Language'] === 'ar';
        return json(ar ? detail({ name: 'اسم', long_description: 'وصف طويل' }) : detail());
      }),
    );
    const r = await fetchCmsDetail(4);
    expect(r?.description_en).toBe('Long English');
    expect(r?.description_ar).toBe('وصف طويل');
    expect(r?.title_ar).toBe('اسم');
    expect(r?.reciter_name).toBe('Reciter X');
    expect(r?.preview_images).toEqual(['https://r2.test/a.png']); // non-http(s) dropped
  });

  it('fetchCmsDetail_NotFound_ReturnsNull', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('nope', { status: 404 })));
    expect(await fetchCmsDetail(999)).toBeNull();
  });

  // A CMS outage must not read as "asset does not exist": the server shell would answer a real 404 for a live resource.
  it('fetchCmsDetail_ServerError_Throws', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('boom', { status: 500 })));
    await expect(fetchCmsDetail(4)).rejects.toThrow();
  });

  it('fetchCmsDetail_NetworkFailure_Throws', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    await expect(fetchCmsDetail(4)).rejects.toThrow();
  });
});
