// Detail-page resource: the boot list entry, enriched live (CMS long description, gallery, reciter), or fetched by
// slug when the boot list does not hold it (new CMS asset, a source that was down at boot).
import { useQuery } from '@tanstack/react-query';
import { queryClient } from './queryClient';
import { mockRepo } from './supabase';
import { fetchResourceBySlug } from './payloadResources';
import { isLive } from './payloadAuth';
import type { Resource } from '@/types';

export function useResourceDetail(slug: string): { resource: Resource | undefined; loading: boolean } {
  const base = mockRepo.getResourceBySlug(slug);
  // Payload list entries are already complete; only CMS entries need the detail endpoint.
  const enabled = isLive() && Boolean(slug) && (!base || base.source === 'cms');
  const { data, isLoading } = useQuery({
    queryKey: ['resource-detail', slug],
    queryFn: () => fetchResourceBySlug(slug),
    enabled,
    staleTime: 5 * 60 * 1000, // CMS gallery links are presigned and expire in ~1h
  }, queryClient); // explicit client: works with or without a provider (tests render views bare)
  const resource = data ? { ...base, ...data } : base;
  return { resource, loading: !resource && enabled && isLoading };
}
