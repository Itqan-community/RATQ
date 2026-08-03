import useSWR from 'swr';
import { listResources } from '@/modules/resources/application/use-cases/list-resources';
import { getResource } from '@/modules/resources/application/use-cases/get-resource';
import { listComments } from '@/modules/resources/application/use-cases/list-comments';
import { useAuth } from '@/hooks/useAuth';
import type { Resource, Comment, PaginatedResponse, ResourceListParams } from '@/types/resource';

export function useResources(params: ResourceListParams = {}) {
  return useSWR<PaginatedResponse<Resource>, Error>(
    ['resources', params],
    () => listResources(params)
  );
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
