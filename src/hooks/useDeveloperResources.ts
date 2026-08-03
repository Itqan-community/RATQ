'use client';

import useSWR from 'swr';
import { api } from '@/lib/api-client';
import { useAuth } from '@/hooks/useAuth';
import type { Resource } from '@/types/resource';

export function useDeveloperResources() {
  const { user } = useAuth();

  return useSWR<Resource[], Error>(
    user ? ['developer', 'resources', user.id] : null,
    () => api.developer.resources.list(user!.id)
  );
}

export function useDeleteResource() {
  // Placeholder: components should use SWR mutate for optimistic updates
  return null;
}
