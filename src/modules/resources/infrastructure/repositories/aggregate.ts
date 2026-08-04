import type { PaginatedResponse, Resource, ResourceListParams } from '@/types/resource';
import { SOURCES } from './registry';

// Each source returns its full filtered set (see ratq-native.ts /
// cms.ts) and pagination happens once here, over the merged list. Fine at the
// current scale (dozens to low hundreds of resources per source); upgrade to
// per-source server-side pagination + merge-sort if any source grows large
// enough that fetching its full list becomes expensive.
async function listAllResources(params: ResourceListParams): Promise<PaginatedResponse<Resource>> {
  const settled = await Promise.allSettled(SOURCES.map((s) => s.list(params)));
  settled.forEach((r, i) => {
    if (r.status === 'rejected') console.error(`Source "${SOURCES[i].id}" failed:`, r.reason);
  });
  let merged = settled.flatMap((r) => (r.status === 'fulfilled' ? r.value.results : []));

  if (params.sort) {
    const sorted = [...merged];
    switch (params.sort) {
      case 'downloads':
        sorted.sort((a, b) => b.total_downloads - a.total_downloads);
        break;
      case 'newest':
        sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'oldest':
        sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'name_asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      // 'relevance' - no sorting needed
    }
    merged = sorted;
  }

  const page = params.page || 1;
  const pageSize = params.page_size || 12;
  const start = (page - 1) * pageSize;
  const results = merged.slice(start, start + pageSize);

  return {
    count: merged.length,
    next: start + pageSize < merged.length ? String(page + 1) : null,
    previous: page > 1 ? String(page - 1) : null,
    results,
  };
}

async function getResource(slug: string): Promise<Resource | undefined> {
  const { results } = await listAllResources({ page_size: 10_000 });
  const resource = results.find((r) => r.slug === slug);
  if (!resource) return undefined;

  const source = SOURCES.find((s) => s.id === resource.source);
  const detail = await source?.getDetail?.(resource).catch((e) => {
    console.error(`Source "${resource.source}" getDetail failed:`, e);
    return null;
  });
  return detail ? { ...resource, ...detail } : resource;
}

export const resourceAggregator = { list: listAllResources, get: getResource };
