import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { SWRConfig } from 'swr';
import { useAnnouncements } from '@/hooks/useAnnouncements';

const mockAnnouncementsList = vi.fn();

vi.mock('@/lib/api-client', () => ({
  api: {
    announcements: {
      list: (...args: unknown[]) => mockAnnouncementsList(...args),
    },
  },
  DATA_MODE: 'mock',
}));

function SWRWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        provider: () => new Map(),
        dedupingInterval: 0,
      }}
    >
      {children}
    </SWRConfig>
  );
}

describe('useAnnouncements', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  it('returns empty array initially before SWR resolves', async () => {
    mockAnnouncementsList.mockImplementation(
      () => new Promise<never>(() => {})
    );

    const { result } = renderHook(() => useAnnouncements(), {
      wrapper: SWRWrapper,
    });

    expect(result.current.announcements).toEqual([]);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('returns announcements when fetched', async () => {
    const mockData = [
      {
        id: '1',
        type: 'release',
        title: 'Test',
        description: 'Desc',
        created_at: new Date().toISOString(),
        is_active: true,
      },
    ];
    mockAnnouncementsList.mockResolvedValue(mockData);

    const { result } = renderHook(() => useAnnouncements(), {
      wrapper: SWRWrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.announcements).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  it('returns error on fetch failure', async () => {
    mockAnnouncementsList.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useAnnouncements(), {
      wrapper: SWRWrapper,
    });

    await waitFor(() => {
      expect(result.current.error).not.toBeNull();
    });

    expect(result.current.error?.message).toBe('Network error');
    expect(result.current.announcements).toEqual([]);
  });

  it('calls api.announcements.list to fetch data', async () => {
    mockAnnouncementsList.mockResolvedValue([]);

    renderHook(() => useAnnouncements(), {
      wrapper: SWRWrapper,
    });

    await waitFor(() => {
      expect(mockAnnouncementsList).toHaveBeenCalled();
    });
  });

 });
