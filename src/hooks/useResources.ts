import useSWR from 'swr';
import { api } from '@/lib/api-client';
import type { Resource, Comment, PaginatedResponse, ResourceListParams } from '@/types/resource';

export function useResources(params: ResourceListParams = {}) {
  return useSWR<PaginatedResponse<Resource>, Error>(
    ['resources', params],
    () => api.resources.list(params)
  );
}

export function useResource(slug: string) {
  return useSWR<Resource, Error>(
    slug ? ['resource', slug] : null,
    () => api.resources.detail(slug)
  );
}

export function useComments(resourceId: number) {
  return useSWR<Comment[], Error>(
    resourceId ? ['comments', resourceId] : null,
    () => api.comments.list(resourceId)
  );
}
