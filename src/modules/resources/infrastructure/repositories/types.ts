import type { PaginatedResponse, Resource, ResourceListParams, ResourceSourceId } from '@/types/resource';

// A ResourceSource adapts one external (or native) content source into RATQ's
// common Resource shape. Adding a new source (e.g. Quran Apps Directory) means
// writing one of these and registering it - no changes to the aggregator,
// api-client, or UI.
export interface ResourceSource {
  id: ResourceSourceId;
  label: string;
  list(params: ResourceListParams): Promise<PaginatedResponse<Resource>>;
  // Optional per-resource enrichment fetched lazily on the detail page only
  // (e.g. CMS's richer /assets/{id}/ endpoint). Sources that have nothing
  // extra to add omit this.
  getDetail?(resource: Resource): Promise<Partial<Resource> | null>;
}
