'use client';

import useSWR from 'swr';
import type { Announcement } from '@/types/announcement';
import { api } from '@/lib/api-client';

export interface UseAnnouncementsReturn {
  announcements: Announcement[];
  isLoading: boolean;
  error: Error | null;
}

export function useAnnouncements(): UseAnnouncementsReturn {
  const { data, error, isLoading } = useSWR<Announcement[], Error>(
    ['announcements'],
    () => api.announcements.list()
  );

  return {
    announcements: data ?? [],
    isLoading,
    error: error ?? null,
  };
}
