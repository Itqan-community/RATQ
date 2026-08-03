'use client';

import useSWR from 'swr';
import { api } from '@/lib/api-client';
import type { Report } from '@/types/resource';

export function useMyReports() {
  return useSWR<Report[], Error>(
    ['developer', 'reports'],
    () => api.reports.myReports()
  );
}
