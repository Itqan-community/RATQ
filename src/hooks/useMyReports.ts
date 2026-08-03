'use client';

import useSWR from 'swr';
import { listMyReports } from '@/modules/resources/application/use-cases/list-my-reports';
import type { Report } from '@/types/resource';

export function useMyReports() {
  return useSWR<Report[], Error>(
    ['developer', 'reports'],
    () => listMyReports()
  );
}
