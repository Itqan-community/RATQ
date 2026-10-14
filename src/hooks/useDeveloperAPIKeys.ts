'use client';

import useSWR from 'swr';
import { listApiKeys } from '@/modules/developer/application/use-cases/list-api-keys';
import { useAuth } from '@/hooks/useAuth';
import type { APIKey } from '@/types/resource';

export function useDeveloperAPIKeys() {
  const { user } = useAuth();
  return useSWR<APIKey[], Error>(
    user ? ['developer', 'api-keys', user.id] : null,
    () => listApiKeys()
  );
}
