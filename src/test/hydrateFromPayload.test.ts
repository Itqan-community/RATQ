import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

const load = async (api: string) => {
  vi.resetModules();
  vi.stubEnv('NEXT_PUBLIC_PAYLOAD_API_URL', api);
  return await import('@/lib/payloadResources');
};
const hydrate = async (api: string) => (await load(api)).hydrateFromPayload;

beforeEach(() => vi.unstubAllGlobals());
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });
const liveDoc = (id: number, over: Record<string, unknown> = {}) => ({
  id, name: `R${id}`, slug: `r${id}`, type: 'sdk', description: 'd', short_description: 's', image: null,
  documentation_url: null, github_url: null, website_url: null, license: 'MIT', itqan_badge: false,
  status: 'published', version: null, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z', ...over,
});
const cmsAsset = (id: number) => ({
  id, category: 'recitation', tags: [], name: `C${id}`, description: 'd', publisher: { id: 1, name: 'P' },
  reciter: null, license: 'CC-BY-ND', is_open_access: true,
});

interface Backends { payload?: (url: URL) => Response; cms?: (url: URL) => Response }
// Routes fetches by host so each call gets a fresh (single-use) Response. A missing backend behaves as unreachable.
function stub({ payload, cms }: Backends) {
  const f = vi.fn(async (u: string) => {
    const url = new URL(u);
    const handler = url.host === 'payload.test' ? payload : url.host === 'api.cms.itqan.dev' ? cms : undefined;
    if (!handler) throw new TypeError('Failed to fetch');
    return handler(url);
  });
  vi.stubGlobal('fetch', f);
  return f;
}
const payloadOk = (docs: unknown[]) => (): Response => json({ docs, totalDocs: docs.length, totalPages: 1 });
const cmsOk = (ids: number[]) => (): Response => json({ count: ids.length, results: ids.map(cmsAsset) });
const repo = async () => (await import('@/lib/supabase')).mockRepo;
const API = 'http://payload.test/api';

describe('hydrateFromPayload', () => {
  it('hydrateFromPayload_MockMode_ReturnsTrueWithoutFetching', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    expect(await (await hydrate(''))()).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('hydrateFromPayload_MockMode_KeepsDemoResources', async () => {
    await (await hydrate(''))();
    expect((await repo()).getResources().length).toBeGreaterThan(20);
  });

  it('hydrateFromPayload_LiveMode_MergesCmsAndPayload', async () => {
    stub({ payload: payloadOk([liveDoc(1), liveDoc(2)]), cms: cmsOk([4]) });
    expect(await (await hydrate(API))()).toBe(true);
    expect((await repo()).getResources().map((r) => r.id).sort()).toEqual(['cms_4', 'payload_1', 'payload_2']);
  });

  it('hydrateFromPayload_LiveMode_NoDemoOrSnapshotResourcesBeforeOrAfter', async () => {
    const { hydrateFromPayload } = await load(API);
    // Even before the first fetch resolves, nothing from the demo/beta snapshot is served.
    expect((await repo()).getResources()).toEqual([]);
    stub({ payload: payloadOk([]), cms: cmsOk([]) });
    await hydrateFromPayload();
    expect((await repo()).getResources()).toEqual([]);
    expect((await import('@/lib/mockData')).DEMO_RESOURCES).toEqual([]);
  });

  it('hydrateFromPayload_LiveMode_DemoAndSnapshotSlugsAreNotReachable', async () => {
    // Slugs come from the mock-mode build, which is the only one that has them.
    const demoSlugs = (await (async () => {
      await load('');
      return (await import('@/lib/mockData')).DEMO_RESOURCES.slice(0, 3).map((r) => r.slug);
    })());
    expect(demoSlugs.length).toBe(3);
    const { hydrateFromPayload } = await load(API);
    stub({ payload: payloadOk([]), cms: cmsOk([]) });
    await hydrateFromPayload();
    const r = await repo();
    for (const s of [...demoSlugs, 'cms-4', 'nope-unknown']) expect(r.getResourceBySlug(s)).toBeUndefined();
  });

  it('hydrateFromPayload_CmsDown_DegradesToPayloadOnly', async () => {
    stub({ payload: payloadOk([liveDoc(1)]) }); // cms unreachable
    expect(await (await hydrate(API))()).toBe(true);
    expect((await repo()).getResources().map((r) => r.id)).toEqual(['payload_1']);
  });

  it('hydrateFromPayload_PayloadDown_DegradesToCmsOnly', async () => {
    stub({ payload: () => new Response('boom', { status: 500 }), cms: cmsOk([4, 5]) });
    expect(await (await hydrate(API))()).toBe(true);
    expect((await repo()).getResources().map((r) => r.id)).toEqual(['cms_4', 'cms_5']);
  });

  it('hydrateFromPayload_BothDown_ReturnsFalseAndKeepsRepoEmptyNotMock', async () => {
    stub({ payload: () => new Response('boom', { status: 500 }), cms: () => new Response('boom', { status: 502 }) });
    expect(await (await hydrate(API))()).toBe(false);
    expect((await repo()).getResources()).toEqual([]);
  });

  it('hydrateFromPayload_NetworkOrCorsFailure_ReturnsFalse', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    expect(await (await hydrate(API))()).toBe(false);
  });

  it('hydrateFromPayload_RetryAfterTotalFailure_RecoversWithoutReload', async () => {
    const { hydrateFromPayload } = await load(API);
    stub({});
    expect(await hydrateFromPayload()).toBe(false);
    stub({ payload: payloadOk([liveDoc(1)]), cms: cmsOk([]) });
    expect(await hydrateFromPayload()).toBe(true);
    expect((await repo()).getResources().map((r) => r.id)).toEqual(['payload_1']);
  });

  it('hydrateFromPayload_MoreThanOnePage_FetchesEveryPage', async () => {
    const pages = new Map<string, unknown[]>([
      ['1', Array.from({ length: 100 }, (_, i) => liveDoc(i + 1))],
      ['2', Array.from({ length: 5 }, (_, i) => liveDoc(101 + i))],
    ]);
    stub({
      payload: (u) => json({ docs: pages.get(u.searchParams.get('page') ?? '1'), totalDocs: 105, totalPages: 2 }),
      cms: cmsOk([]),
    });
    await (await hydrate(API))();
    expect((await repo()).getResources()).toHaveLength(105);
  });

  it('hydrateFromPayload_RequestsOnlyPublishedPayloadResources', async () => {
    const f = stub({ payload: payloadOk([]), cms: cmsOk([]) });
    await (await hydrate(API))();
    const payloadCall = f.mock.calls.map((c) => String(c[0])).find((u) => u.includes('payload.test'))!;
    expect(decodeURIComponent(payloadCall)).toContain('where[status][equals]=published');
  });

  it('hydrateFromPayload_CmsAssetsAreDerivedIntoPublishers', async () => {
    stub({ payload: payloadOk([]), cms: cmsOk([4]) });
    await (await hydrate(API))();
    expect((await repo()).getPublishers().map((p) => p.id)).toEqual(['cms_pub_1']);
  });
});

describe('fetchResourceBySlug', () => {
  it('fetchResourceBySlug_CmsSlugNotInList_ResolvesFromDetailEndpoint', async () => {
    const { fetchResourceBySlug } = await load(API);
    stub({ cms: () => json({ ...cmsAsset(77), long_description: 'long', snapshots: [] }) });
    expect((await fetchResourceBySlug('cms-77'))?.slug).toBe('cms-77');
  });

  it('fetchResourceBySlug_PayloadSlug_QueriesPublishedOnlyBySlug', async () => {
    const { fetchResourceBySlug } = await load(API);
    const f = stub({ payload: payloadOk([liveDoc(3, { slug: 'tanzil' })]) });
    expect((await fetchResourceBySlug('payload-tanzil'))?.slug).toBe('payload-tanzil');
    const u = decodeURIComponent(String(f.mock.calls[0][0]));
    expect(u).toContain('where[slug][equals]=tanzil');
    expect(u).toContain('where[status][equals]=published');
  });

  it.each(['quran-flutter-audio-sdk', 'res_001', 'cms-', 'cms-0'])('fetchResourceBySlug_UnknownSlug_%s_ReturnsNullWithoutFetching', async (slug) => {
    const { fetchResourceBySlug } = await load(API);
    const f = stub({});
    expect(await fetchResourceBySlug(slug)).toBeNull();
    expect(f).not.toHaveBeenCalled();
  });

  it('fetchResourceBySlug_MockMode_ReturnsNullWithoutFetching', async () => {
    const { fetchResourceBySlug } = await load('');
    const f = stub({});
    expect(await fetchResourceBySlug('cms-4')).toBeNull();
    expect(f).not.toHaveBeenCalled();
  });
});

// Server shell (SEO pages) reads the list without touching the process-wide mockRepo singleton.
describe('fetchAllResources', () => {
  it('fetchAllResources_LiveMode_ReturnsMergedListAndLeavesRepoUntouched', async () => {
    const { fetchAllResources } = await load(API);
    stub({ payload: payloadOk([liveDoc(1)]), cms: cmsOk([4]) });
    const before = (await repo()).getResources().length;
    const r = await fetchAllResources();
    expect(r.ok).toBe(true);
    expect(r.resources.map((x) => x.id).sort()).toEqual(['cms_4', 'payload_1']);
    expect((await repo()).getResources().length).toBe(before);
  });

  it('fetchAllResources_OneSourceDown_ReturnsOtherWithFailedList', async () => {
    const { fetchAllResources } = await load(API);
    stub({ payload: payloadOk([liveDoc(1)]) });
    const r = await fetchAllResources();
    expect(r.ok).toBe(true);
    expect(r.failed).toEqual(['cms']);
    expect(r.resources.map((x) => x.id)).toEqual(['payload_1']);
  });

  it('fetchAllResources_BothDown_NotOk', async () => {
    const { fetchAllResources } = await load(API);
    stub({});
    expect((await fetchAllResources()).ok).toBe(false);
  });

  it('fetchAllResources_MockMode_EmptyWithoutFetching', async () => {
    const { fetchAllResources } = await load('');
    const f = stub({});
    expect(await fetchAllResources()).toEqual({ ok: true, failed: [], resources: [] });
    expect(f).not.toHaveBeenCalled();
  });
});
