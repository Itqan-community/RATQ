import useSWR from 'swr';
import { fetchResources, buildResourcesUrl } from '@/modules/resources/infrastructure/resources-api';
import { getResource } from '@/modules/resources/application/use-cases/get-resource';
import { listComments } from '@/modules/resources/application/use-cases/list-comments';
import { useAuth } from '@/hooks/useAuth';
import type { Resource, Comment, PaginatedResponse, ResourceListParams } from '@/types/resource';

export function useResources(params: ResourceListParams = {}) {
  // Use the fully-built URL string as the SWR cache key instead of the params
  // object. This gives SWR an unambiguous, primitive string key that changes
  // exactly when the request URL changes — no object-serialization edge cases
  // with array values (e.g. license: string[]) or undefined properties.
  const key = buildResourcesUrl(params);
  return useSWR<PaginatedResponse<Resource>, Error>(key, () => fetchResources(params));
}

export function useResource(slug: string) {
  const { user } = useAuth();
  return useSWR<Resource, Error>(
    slug ? ['resource', slug, user?.id] : null,
    () => getResource(slug, user)
  );
}

export function useComments(resourceId: number) {
  return useSWR<Comment[], Error>(
    resourceId ? ['comments', resourceId] : null,
    () => listComments(resourceId)
  );
}
