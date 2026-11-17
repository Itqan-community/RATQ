import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('mockRepo in a live build', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv('NEXT_PUBLIC_PAYLOAD_API_URL', 'https://api.example.test/api');
  });

  it('MockRepository_LiveBuild_StartsWithNoDemoPortalData', async () => {
    const { mockRepo } = await import('@/lib/supabase');
    expect(mockRepo.getRequests()).toEqual([]);
    expect(mockRepo.getKeys()).toEqual([]);
    expect(mockRepo.getNotifications()).toEqual([]);
    expect(mockRepo.getReviews('res_any')).toEqual([]);
    expect(mockRepo.getReports()).toEqual([]);
    expect(mockRepo.getAuditLogs()).toEqual([]);
  });

  it('setLive_ReplacesInsteadOfMerging', async () => {
    const { mockRepo } = await import('@/lib/supabase');
    mockRepo.setLiveKeys([{ id: 'payload_key_1' } as any]);
    mockRepo.setLiveKeys([{ id: 'payload_key_2' } as any]);
    expect(mockRepo.getKeys().map((k) => k.id)).toEqual(['payload_key_2']);
  });

  it('MockRepository_LocalBuild_KeepsDemoData', async () => {
    vi.unstubAllEnvs();
    vi.stubEnv('NEXT_PUBLIC_PAYLOAD_API_URL', '');
    const { mockRepo } = await import('@/lib/supabase');
    expect(mockRepo.getRequests().length).toBeGreaterThan(0);
  });
});
