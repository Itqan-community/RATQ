import type { PaginatedResponse, Resource, ResourceListParams } from '@/types/resource';
import { mockResources } from '../mock-data';
import type { ResourceSource } from './types';
import { normalizeArabic } from '@/shared/utils/utils';

const resources: Resource[] = mockResources.map((r) => ({ ...r, source: 'ratq', source_url: null }));

// Returns all matching resources unpaginated - the aggregator paginates the
// merged, cross-source result set. See aggregate.ts for why.
async function list(params: ResourceListParams): Promise<PaginatedResponse<Resource>> {
  const filtered = resources.filter((r) => {
    if (params.type && r.type !== params.type) return false;
    if (params.license && r.license !== params.license) return false;
    if (params.itqan_badge === 'true' && !r.itqan_badge) return false;
    if (params.itqan_badge === 'false' && r.itqan_badge) return false;
    if (params.search) {
      const q = normalizeArabic(params.search);
      if (!normalizeArabic(r.name).includes(q) && !normalizeArabic(r.description).includes(q)) return false;
    }
    return true;
  });

  return { count: filtered.length, next: null, previous: null, results: filtered };
}

export const ratqNativeSource: ResourceSource = { id: 'ratq', label: 'RATQ', list };
