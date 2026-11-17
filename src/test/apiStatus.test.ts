import { describe, it, expect, vi, beforeEach } from 'vitest';

const hydrateResources = vi.fn();
vi.mock('@/lib/payloadResources', () => ({ hydrateResources }));

const load = async () => (await import('@/store/useApiStatus')).useApiStatus;

beforeEach(() => {
  hydrateResources.mockReset();
  vi.resetModules();
});

describe('useApiStatus', () => {
  it('retry_StillDown_StaysDownAndStopsRetrying', async () => {
    hydrateResources.mockResolvedValue({ ok: false, failed: ['cms', 'payload'] });
    const s = await load();
    s.getState().set({ ok: false, failed: ['cms', 'payload'] });
    await s.getState().retry();
    expect(s.getState()).toMatchObject({ down: true, retrying: false, failed: ['cms', 'payload'] });
  });

  it('retry_SourcesRecovered_ClearsDown', async () => {
    hydrateResources.mockResolvedValue({ ok: true, failed: [] });
    const s = await load();
    s.getState().set({ ok: false, failed: ['cms', 'payload'] });
    await s.getState().retry();
    expect(s.getState()).toMatchObject({ down: false, failed: [] });
  });

  it('retry_OnePartialRecovery_KeepsSiteUpButRemembersFailedSource', async () => {
    hydrateResources.mockResolvedValue({ ok: true, failed: ['cms'] });
    const s = await load();
    await s.getState().retry();
    expect(s.getState()).toMatchObject({ down: false, failed: ['cms'] });
  });

  it('retry_HydrateThrows_ResetsRetryingFlag', async () => {
    hydrateResources.mockRejectedValue(new Error('x'));
    const s = await load();
    await expect(s.getState().retry()).rejects.toThrow();
    expect(s.getState().retrying).toBe(false);
  });
});
