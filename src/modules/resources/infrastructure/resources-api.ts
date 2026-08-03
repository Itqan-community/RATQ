import type { Resource, PaginatedResponse, ResourceListParams } from '@/types/resource';

// Resource listing/detail is always backed by the multi-source aggregator
// (repositories/) - it includes RATQ's own mock resources as one source
// alongside live sources like CMS, independent of DATA_MODE (which still
// governs auth/requests/api-keys/reports).
//
// This client code calls RATQ's own /api/resources route rather than the
// aggregator directly, so source fetches (e.g. CMS) run server-side where
// Next's fetch cache/revalidate applies, instead of once per visitor's browser.
export async function fetchResources(
  params: ResourceListParams = {}
): Promise<PaginatedResponse<Resource>> {
  const qs = new URLSearchParams();
  if (params.type) qs.set('type', params.type);
  if (params.license) qs.set('license', params.license);
  if (params.itqan_badge !== undefined) qs.set('itqan_badge', params.itqan_badge);
  if (params.search) qs.set('search', params.search);
  if (params.sort) qs.set('sort', params.sort);
  if (params.page) qs.set('page', String(params.page));
  if (params.page_size) qs.set('page_size', String(params.page_size));

  const res = await fetch(`/api/resources?${qs}`);
  if (!res.ok) throw new Error('Failed to fetch resources');
  return res.json();
}

export async function fetchResource(slug: string): Promise<Resource> {
  const res = await fetch(`/api/resources/${slug}`);
  if (!res.ok) throw new Error('Resource not found');
  return res.json();
}
