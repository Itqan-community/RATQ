import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  cmsToApi,
  payloadToApi,
  listParamsFrom,
  listResources,
  publishersFrom,
  fetchApiResources,
  fetchApiResource,
  handle,
  type ApiResource,
} from '@/lib/publicApi';

const cms = (id: number, over: Record<string, unknown> = {}) => ({
  id,
  category: 'recitation',
  name: `Asset ${id}`,
  description: `Desc ${id}`,
  publisher: { id: 1, name: 'Tafsir Center' },
  reciter: null,
  license: 'CC-BY-ND',
  ...over,
});

const doc = (id: number, over: Record<string, unknown> = {}) => ({
  id,
  name: `Doc ${id}`,
  slug: `doc-${id}`,
  type: 'library',
  description: 'A library',
  short_description: 'short',
  image: null,
  documentation_url: null,
  github_url: null,
  license: 'MIT',
  itqan_badge: false,
  status: 'published',
  version: null,
  publisher: { id: 1, name: 'RATQ' },
  createdAt: '2026-08-02T13:08:08.022Z',
  updatedAt: '2026-10-05T07:45:54.201Z',
  ...over,
});

describe('cmsToApi', () => {
  it('keeps live shape: 100000 id offset, raw category as type, Arabic overlay, CMS-less dates', () => {
    const r = cmsToApi(
      cms(4, { category: 'text', name: 'Tafsir Altabari', description: "Jami' al-Bayan" }),
      cms(4, { name: 'تفسير الطبري', description: 'جامع البيان', publisher: { id: 1, name: 'مركز تفسير' } }),
    );
    expect(r).toMatchObject({
      id: 100004,
      slug: 'cms-4',
      source: 'cms',
      source_url: 'https://cms.itqan.dev/gallery/asset/4',
      type: 'text',
      short_description: "Jami' al-Bayan",
      name_ar: 'تفسير الطبري',
      description_ar: 'جامع البيان',
      publisher: { id: 1, name: 'Tafsir Center', name_ar: 'مركز تفسير' },
      content_language: 'en',
      title_language: 'en',
      created_at: '',
      version: null,
      github_stats: null,
      total_downloads: 0,
      downloads: 0,
      status: 'published',
      itqan_badge: false,
    });
  });

  it('omits name_ar when the Arabic fetch had no match, and detects Arabic content', () => {
    const r = cmsToApi(cms(5, { description: 'تلاوة قرآنية' }));
    expect(r.name_ar).toBeUndefined();
    expect(r.publisher).toEqual({ id: 1, name: 'Tafsir Center' });
    expect(r.content_language).toBe('ar');
  });
});

describe('payloadToApi', () => {
  it('offsets id by 200000 and namespaces the slug', () => {
    const r = payloadToApi(doc(56, { type: 'audio' }) as never);
    expect(r).toMatchObject({ id: 200056, slug: 'payload-doc-56', source: 'payload', source_url: null, type: 'audio', image_url: null });
    expect(r.publisher).toEqual({ id: 1, name: 'RATQ' });
  });

  it('resolves a relative upload url against the API origin and falls back to detected language', () => {
    const r = payloadToApi(doc(1, { image: { url: '/media/a.png' }, description: 'وصف عربي' }) as never);
    expect(r.image_url).toBe('https://api.quran.tech/media/a.png');
    expect(r.content_language).toBe('ar');
  });
});

const sample: ApiResource[] = [
  cmsToApi(cms(1, { name: 'B recitation', category: 'recitation', license: 'CC-BY-ND' })),
  cmsToApi(cms(2, { name: 'A tafsir', category: 'tafsir', license: 'CC0', publisher: { id: 2, name: 'IslamHouse' } })),
  cmsToApi(cms(3, { name: 'C translation', category: 'translation', license: 'MIT', publisher: null })),
  payloadToApi(doc(9, { name: 'Payload badge', itqan_badge: true, description: 'قرآن كريم' }) as never),
];

describe('listParamsFrom', () => {
  it('reads repeated license/publisher and clamps bad numbers to defaults', () => {
    const p = listParamsFrom(new URLSearchParams('license=a&license=b&publisher=cms:1&page=abc&page_size=-3&sort=bogus'));
    expect(p).toMatchObject({ license: ['a', 'b'], publisherKeys: ['cms:1'], page: 1, page_size: 12, sort: undefined });
  });
});

describe('listResources', () => {
  const ids = (p: Parameters<typeof listResources>[1]) => listResources(sample, p).results.map((r) => r.slug);

  it('filters by type, tracked license (untracked always passes) and publisher incl. no-publisher', () => {
    expect(ids({ type: 'tafsir' })).toEqual(['cms-2']);
    expect(ids({ license: ['CC0'] })).toEqual(['cms-2', 'cms-3', 'payload-doc-9']); // MIT/Unspecified never hidden
    expect(ids({ publisherKeys: ['cms:2'] })).toEqual(['cms-2']);
    expect(ids({ publisherKeys: ['__no_publisher__'] })).toEqual(['cms-3']);
  });

  it('itqan_badge true excludes every CMS asset, false excludes badged payload docs', () => {
    expect(ids({ itqan_badge: 'true' })).toEqual(['payload-doc-9']);
    expect(ids({ itqan_badge: 'false' })).toEqual(['cms-1', 'cms-2', 'cms-3']);
  });

  it('searches with Arabic normalisation across name/description (payload: name+description only)', () => {
    expect(ids({ search: 'قرآن' })).toEqual(['payload-doc-9']);
    expect(ids({ search: 'قُرآن' })).toEqual(['payload-doc-9']);
    expect(ids({ search: 'a tafsir' })).toEqual(['cms-2']);
  });

  it('sorts name_asc/name_desc and keeps undated items stable under newest', () => {
    expect(ids({ sort: 'name_asc' })).toEqual(['cms-2', 'cms-1', 'cms-3', 'payload-doc-9']);
    expect(ids({ sort: 'name_desc' })).toEqual(['payload-doc-9', 'cms-3', 'cms-1', 'cms-2']);
    expect(ids({ sort: 'newest' })[0]).toBe('payload-doc-9'); // dated beats undated ''
    expect(ids({ sort: 'oldest' })[3]).toBe('payload-doc-9');
  });

  it('paginates with live string cursors', () => {
    const p1 = listResources(sample, { page: 1, page_size: 3 });
    expect(p1).toMatchObject({ count: 4, next: '2', previous: null });
    expect(p1.results).toHaveLength(3);
    const p2 = listResources(sample, { page: 2, page_size: 3 });
    expect(p2).toMatchObject({ count: 4, next: null, previous: '1' });
    expect(p2.results).toHaveLength(1);
    expect(listResources(sample, { page: 9, page_size: 3 }).results).toEqual([]);
  });
});

describe('publishersFrom', () => {
  it('dedupes by source:id key, backfills name_ar, skips publisher-less, sorts by name', () => {
    const list = [
      cmsToApi(cms(1, { publisher: { id: 7, name: 'Zed' } })),
      cmsToApi(cms(2, { publisher: { id: 7, name: 'Zed' } }), cms(2, { publisher: { id: 7, name: 'زيد' } })),
      cmsToApi(cms(3, { publisher: null })),
      payloadToApi(doc(1) as never),
    ];
    expect(publishersFrom(list)).toEqual([
      { key: 'payload:1', id: 1, name: 'RATQ', name_ar: undefined },
      { key: 'cms:7', id: 7, name: 'Zed', name_ar: 'زيد' },
    ]);
  });
});

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });

afterEach(() => vi.unstubAllGlobals());

describe('fetchApiResources', () => {
  it('merges CMS then Payload, degrades when one source is down, throws when both are', async () => {
    const route = (down: 'cms' | 'payload' | 'both') =>
      vi.fn(async (url: string) => {
        const isCms = url.includes('/assets/');
        if (down === 'both' || down === (isCms ? 'cms' : 'payload')) return new Response('x', { status: 500 });
        return isCms ? json({ count: 1, results: [cms(4)] }) : json({ docs: [doc(1)], totalDocs: 1, totalPages: 1 });
      });

    vi.stubGlobal('fetch', route('payload'));
    expect((await fetchApiResources()).map((r) => r.slug)).toEqual(['cms-4']);
    vi.stubGlobal('fetch', route('cms'));
    expect((await fetchApiResources()).map((r) => r.slug)).toEqual(['payload-doc-1']);
    vi.stubGlobal('fetch', route('both'));
    await expect(fetchApiResources()).rejects.toThrow();
  });
});

describe('fetchApiResource', () => {
  it('overlays CMS detail (long description, snapshots, publisher blurb)', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (_u: string, init?: RequestInit) => {
        const ar = (init?.headers as Record<string, string> | undefined)?.['Accept-Language'] === 'ar';
        return json(
          cms(4, {
            category: 'text',
            name: ar ? 'تفسير' : 'Tafsir',
            description: 'short',
            long_description: ar ? 'طويل' : 'long',
            snapshots: [{ image_url: 'https://x/y.png' }],
            publisher: { id: 1, name: ar ? 'مركز' : 'Center', description: 'blurb' },
          }),
        );
      }),
    );
    const r = await fetchApiResource('cms-4');
    expect(r).toMatchObject({
      slug: 'cms-4',
      description: 'long',
      short_description: 'short',
      description_ar: 'طويل',
      name_ar: 'تفسير',
      preview_images: ['https://x/y.png'],
      publisher: { id: 1, name: 'Center', description: 'blurb', name_ar: 'مركز' },
    });
  });

  it('returns null for unknown / malformed slugs without calling a source, and for a 404', async () => {
    const f = vi.fn(async () => new Response('', { status: 404 }));
    vi.stubGlobal('fetch', f);
    expect(await fetchApiResource('nope')).toBeNull();
    expect(await fetchApiResource('cms-0')).toBeNull();
    expect(await fetchApiResource('cms-abc')).toBeNull();
    expect(f).not.toHaveBeenCalled();
    expect(await fetchApiResource('cms-9')).toBeNull();
  });

  it('looks a payload slug up by slug and null when absent', async () => {
    const f = vi.fn(async () => json({ docs: [doc(3)] }));
    vi.stubGlobal('fetch', f);
    expect((await fetchApiResource('payload-doc-3'))?.slug).toBe('payload-doc-3');
    expect((f.mock.calls[0] as unknown as [string])[0]).toContain('where[slug][equals]=doc-3');
    vi.stubGlobal('fetch', vi.fn(async () => json({ docs: [] })));
    expect(await fetchApiResource('payload-zzz')).toBeNull();
  });
});

describe('handle', () => {
  const req = new Request('https://ratq.itqan.dev/api/resources');

  it('200 carries CORS * and the live Cache-Control', async () => {
    const res = await handle(req, async () => ({ ok: 1 }));
    expect(res.status).toBe(200);
    expect(res.headers.get('access-control-allow-origin')).toBe('*');
    expect(res.headers.get('cache-control')).toBe('public, s-maxage=300, stale-while-revalidate=60');
    expect(await res.json()).toEqual({ ok: 1 });
  });

  it('null -> 404 resource-not-found (not cacheable), thrown -> 502 (not cacheable)', async () => {
    const nf = await handle(req, async () => null);
    expect(nf.status).toBe(404);
    expect(await nf.json()).toEqual({ error: 'Resource not found' });
    expect(nf.headers.get('access-control-allow-origin')).toBe('*');
    expect(nf.headers.get('cache-control')).not.toContain('s-maxage');
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const bad = await handle(req, async () => { throw new Error('down'); });
    expect(bad.status).toBe(502);
    expect(bad.headers.get('cache-control')).not.toContain('s-maxage');
  });
});
