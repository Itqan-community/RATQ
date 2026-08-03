'use client';

import useSWR from 'swr';
import { api } from '@/lib/api-client';
import type { APIKey } from '@/types/resource';

export function useDeveloperAPIKeys() {
  return useSWR<APIKey[], Error>(
    ['developer', 'api-keys'],
    () => api.developer.apiKeys.list()
  );
}
