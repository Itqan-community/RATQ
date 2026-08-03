import type { PaginatedResponse, Resource, ResourceListParams, ResourceType } from '@/types/resource';
import type { ResourceSource } from './types';

const API_BASE = process.env.NEXT_PUBLIC_CMS_API_URL || 'https://api.cms.itqan.dev/cms-api';
const CMS_GALLERY_BASE = process.env.NEXT_PUBLIC_CMS_GALLERY_URL || 'https://cms.itqan.dev/gallery/asset';

// CMS list endpoint ignores ?limit and paginates at a fixed 20/page
// server-side; we page through until exhausted (capped) rather than relying
// on a configurable page size. Upgrade path: ask CMS for a bulk export/higher
// page-size param if the catalog grows past a few hundred assets.
const MAX_PAGES = 15;

interface CmsAsset {
  id: number;
  category: string;
  name: string;
  description: string;
  publisher: { id: number; name: string } | null;
  reciter: { id: number; name: string } | null;
  license: string;
  is_open_access: boolean;
}

interface CmsListResponse {
  count: number;
  results: CmsAsset[];
}

interface CmsAssetDetail extends CmsAsset {
  long_description: string;
  thumbnail_url: string | null;
  snapshots: { image_url: string; title: string; description: string }[];
  access_status: string | null;
  publisher: { id: number; name: string; description?: string | null } | null;
}

async function fetchPage(page: number): Promise<CmsListResponse | null> {
  const res = await fetch(`${API_BASE}/assets/?is_open_access=true&page=${page}`, {
    next: { revalidate: 300 },
  });
  return res.ok ? res.json() : null;
}

// First page tells us `count`, so the remaining pages fetch in parallel
// instead of one round-trip at a time - matters on a cache miss, since this
// whole chain used to run serially behind every uncached request.
async function fetchAllAssets(): Promise<CmsAsset[]> {
  const first = await fetchPage(1);
  if (!first) return [];

  const pageSize = first.results.length || 20;
  const totalPages = Math.min(MAX_PAGES, Math.ceil(first.count / pageSize));
  const rest = await Promise.all(
    Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => fetchPage(i + 2)),
  );

  return [first, ...rest].filter((p): p is CmsListResponse => p !== null).flatMap((p) => p.results);
}

// CMS category names are used as-is as RATQ ResourceType values (see
// ResourceType in @/types/resource) - no mapping table needed.
function toResource(asset: CmsAsset): Resource {
  return {
    id: 100_000 + asset.id, // offset to avoid colliding with RATQ-native mock ids
    name: asset.name,
    slug: `cms-${asset.id}`,
    source: 'cms',
    source_url: `${CMS_GALLERY_BASE}/${asset.id}`,
    type: asset.category as ResourceType,
    description: asset.description,
    short_description: asset.description,
    documentation_url: null,
    github_url: null,
    license: asset.license,
    itqan_badge: false,
    status: 'published',
    created_at: '',
    updated_at: '',
    version: null,
    github_stats: null,
    total_downloads: 0,
    downloads: 0,
  };
}

async function list(params: ResourceListParams): Promise<PaginatedResponse<Resource>> {
  const assets = await fetchAllAssets();
  const resources = assets.map(toResource);

  const filtered = resources.filter((r) => {
    if (params.type && r.type !== params.type) return false;
    if (params.license && r.license !== params.license) return false;
    if (params.itqan_badge === 'true') return false; // CMS assets never carry the itqan badge
    if (params.search) {
      const q = params.search.toLowerCase();
      if (!r.name.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return { count: filtered.length, next: null, previous: null, results: filtered };
}

// Detail endpoint's snapshot image_url is a presigned R2 link that expires in
// ~1hr - fetched fresh per ISR revalidation window (10min, see [slug]/page.tsx),
// never cached longer than that.
async function getDetail(resource: Resource): Promise<Partial<Resource> | null> {
  const id = Number(resource.slug.replace('cms-', ''));
  if (!Number.isFinite(id)) return null;

  const res = await fetch(`${API_BASE}/assets/${id}/`, { next: { revalidate: 300 } });
  if (!res.ok) return null;
  const detail: CmsAssetDetail = await res.json();

  return {
    description: detail.long_description || resource.description,
    preview_images: detail.snapshots?.map((s) => s.image_url) ?? [],
    publisher_name: detail.publisher?.name ?? null,
    publisher_description: detail.publisher?.description ?? null,
    reciter_name: detail.reciter?.name ?? null,
  };
}

export const cmsSource: ResourceSource = { id: 'cms', label: 'CMS', list, getDetail };
