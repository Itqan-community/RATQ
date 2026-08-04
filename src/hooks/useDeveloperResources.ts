'use client';

import useSWR from 'swr';
import { listDeveloperResources } from '@/modules/developer/application/use-cases/list-developer-resources';
import { useAuth } from '@/hooks/useAuth';
import type { Resource } from '@/types/resource';

export function useDeveloperResources() {
  const { user } = useAuth();

  return useSWR<Resource[], Error>(
    user ? ['developer', 'resources', user.id] : null,
    () => listDeveloperResources(user!.id)
  );
}

export function useDeleteResource() {
  // Placeholder: components should use SWR mutate for optimistic updates
  return null;
}
