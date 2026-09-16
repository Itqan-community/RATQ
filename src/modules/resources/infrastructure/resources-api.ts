import type { Resource, PaginatedResponse, ResourceListParams } from '@/types/resource';

/**
 * Builds the query string for a resource list request.
 * Used as both the SWR cache key and the actual fetch URL so they are
 * always in sync — no object-serialization ambiguity with array values.
 */
export function buildResourcesUrl(params: ResourceListParams = {}): string {
  const qs = new URLSearchParams();
  if (params.type) qs.set('type', params.type);
  // license is multi-value: append each as a separate ?license= param
  if (params.license && params.license.length > 0) {
    params.license.forEach((l) => qs.append('license', l));
  }
  if (params.itqan_badge !== undefined) qs.set('itqan_badge', params.itqan_badge);
  if (params.search) qs.set('search', params.search);
  if (params.sort) qs.set('sort', params.sort);
  if (params.page) qs.set('page', String(params.page));
  if (params.page_size) qs.set('page_size', String(params.page_size));
  return `/api/resources?${qs}`;
}

export async function fetchResources(
  params: ResourceListParams = {}
): Promise<PaginatedResponse<Resource>> {
  const res = await fetch(buildResourcesUrl(params));
  if (!res.ok) throw new Error('Failed to fetch resources');
  return res.json();
}

export async function fetchResource(slug: string): Promise<Resource> {
  const res = await fetch(`/api/resources/${slug}`);
  if (!res.ok) throw new Error('Resource not found');
  return res.json();
}
