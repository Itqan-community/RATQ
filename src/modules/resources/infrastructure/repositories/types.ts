import type { PaginatedResponse, Resource, ResourceListParams, ResourceSourceId } from '@/types/resource';

// A ResourceSource adapts one external (or native) content source into RATQ's
// common Resource shape. Adding a new source (e.g. Quran Apps Directory) means
// writing one of these and registering it - no changes to the aggregator,
// api-client, or UI.
export interface ResourceSource {
  id: ResourceSourceId;
  label: string;
  // Prefix that namespaces this source's slugs (e.g. 'cms-', 'payload-'). The
  // aggregator routes a detail slug to the source whose prefix it carries.
  // Sources with no prefix (ratq-native) omit it and act as the fallback.
  slugPrefix?: string;
  list(params: ResourceListParams): Promise<PaginatedResponse<Resource>>;
  // Single-resource lookup used by the detail route so the aggregator never has
  // to fetch the full catalog to resolve one slug. Receives the full namespaced
  // slug and returns a complete Resource, or null when the source has no match.
  getBySlug?(slug: string): Promise<Resource | null>;
  // Optional per-resource enrichment fetched lazily on the detail page only
  // (e.g. CMS's richer /assets/{id}/ endpoint). Sources that have nothing
  // extra to add omit this. Kept as the aggregator's fallback path.
  getDetail?(resource: Resource): Promise<Partial<Resource> | null>;
}
