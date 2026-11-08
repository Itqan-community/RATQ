import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

const load = async (api: string) => {
  vi.resetModules();
  vi.stubEnv('NEXT_PUBLIC_PAYLOAD_API_URL', api);
  return (await import('@/lib/payloadResources')).hydrateFromPayload;
};

beforeEach(() => vi.unstubAllGlobals());
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('hydrateFromPayload', () => {
  it('hydrateFromPayload_MockMode_ReturnsTrueWithoutFetching', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    expect(await (await load(''))()).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('hydrateFromPayload_ApiOk_ReturnsTrue', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ docs: [] }), { status: 200 })));
    expect(await (await load('http://payload.test/api'))()).toBe(true);
  });

  const liveDoc = (id: number) => ({
    id, name: `R${id}`, slug: `r${id}`, type: 'sdk', description: 'd', short_description: 's', image: null,
    documentation_url: null, github_url: null, website_url: null, license: 'MIT', itqan_badge: false,
    status: 'published', version: null, createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z',
  });
  const repo = async () => (await import('@/lib/supabase')).mockRepo;

  it('hydrateFromPayload_LiveMode_OnlyPayloadResources', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ docs: [liveDoc(1), liveDoc(2)] }), { status: 200 })));
    await (await load('http://payload.test/api'))();
    const ids = (await repo()).getResources().map((r) => r.id);
    expect(ids).toEqual(['payload_1', 'payload_2']);
  });

  it('hydrateFromPayload_LiveModeEmptyApi_NoDemoResources', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ docs: [] }), { status: 200 })));
    await (await load('http://payload.test/api'))();
    expect((await repo()).getResources()).toEqual([]);
  });

  it('hydrateFromPayload_LiveMode_DemoSlugStillResolvesByDirectUrl', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ docs: [] }), { status: 200 })));
    const demoSlug = (await import('@/lib/mockData')).DEMO_RESOURCES[0].slug;
    await (await load('http://payload.test/api'))();
    const r = await repo();
    expect(r.getResourceBySlug(demoSlug)?.slug).toBe(demoSlug);
    expect(r.getResourceBySlug('nope-unknown')).toBeUndefined();
  });

  it('hydrateFromPayload_MockMode_KeepsDemoResources', async () => {
    await (await load(''))();
    expect((await repo()).getResources().length).toBeGreaterThan(20);
  });

  it('hydrateFromPayload_Http500_ReturnsFalse', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('boom', { status: 500 })));
    expect(await (await load('http://payload.test/api'))()).toBe(false);
  });

  it('hydrateFromPayload_NetworkOrCorsFailure_ReturnsFalse', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    expect(await (await load('http://payload.test/api'))()).toBe(false);
  });
});
