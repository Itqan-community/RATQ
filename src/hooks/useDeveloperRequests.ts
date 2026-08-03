'use client';

import useSWR from 'swr';
import { listMyAccessRequests } from '@/modules/resources/application/use-cases/list-my-access-requests';
import type { AccessRequest } from '@/types/resource';

export function useDeveloperRequests() {
  return useSWR<AccessRequest[], Error>(
    ['developer', 'requests'],
    () => listMyAccessRequests()
  );
}
