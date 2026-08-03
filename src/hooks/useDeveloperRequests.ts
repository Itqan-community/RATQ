'use client';

import useSWR from 'swr';
import { api } from '@/lib/api-client';
import type { AccessRequest } from '@/types/resource';

export function useDeveloperRequests() {
  return useSWR<AccessRequest[], Error>(
    ['developer', 'requests'],
    () => api.requests.myRequests()
  );
}
