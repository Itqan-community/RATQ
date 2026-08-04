'use client';

import useSWR from 'swr';
import type { Announcement } from '@/types/announcement';
import { listAnnouncements } from '@/modules/resources/application/use-cases/list-announcements';

export interface UseAnnouncementsReturn {
  announcements: Announcement[];
  isLoading: boolean;
  error: Error | null;
}

export function useAnnouncements(): UseAnnouncementsReturn {
  const { data, error, isLoading } = useSWR<Announcement[], Error>(
    ['announcements'],
    () => listAnnouncements()
  );

  return {
    announcements: data ?? [],
    isLoading,
    error: error ?? null,
  };
}
