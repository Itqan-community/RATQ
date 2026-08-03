'use client';

import useSWR from 'swr';
import { listApiKeys } from '@/modules/developer/application/use-cases/list-api-keys';
import type { APIKey } from '@/types/resource';

export function useDeveloperAPIKeys() {
  return useSWR<APIKey[], Error>(
    ['developer', 'api-keys'],
    () => listApiKeys()
  );
}
