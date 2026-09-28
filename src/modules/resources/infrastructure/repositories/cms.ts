import type { PaginatedResponse, Publisher, Resource, ResourceListParams, ResourceType } from '@/types/resource';
import type { ResourceSource } from './types';
import { normalizeArabic } from '@/shared/utils/utils';
import { matchesLicenseFilter } from '@/shared/utils/license-filter';
import { matchesPublisherFilter, publisherKey } from '@/shared/utils/publisher-filter';

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
  publisher: { id: number; name: string,  } | null;
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
  publisher: Publisher
}

type Lang = 'ar' | 'en';

// The CMS returns every text field in Arabic when asked with Accept-Language
// (verified against the live API); English is its default.
const langHeaders = (lang: Lang): HeadersInit | undefined =>
  lang === 'ar' ? { 'Accept-Language': 'ar' } : undefined;

// The extra ?lang= param is ignored by the CMS (the header decides); it only
// gives each language its own URL, because some runtimes key the fetch cache
// on the URL alone and would otherwise serve one language's response to both.
async function fetchPage(page: number, lang: Lang): Promise<CmsListResponse | null> {
  const res = await fetch(`${API_BASE}/assets/?is_open_access=true&page=${page}&lang=${lang}`, {
    headers: langHeaders(lang),
    next: { revalidate: 300 },
  });
  return res.ok ? res.json() : null;
}

// First page tells us `count`, so the remaining pages fetch in parallel
// instead of one round-trip at a time - matters on a cache miss, since this
// whole chain used to run serially behind every uncached request.
async function fetchAllAssets(lang: Lang): Promise<CmsAsset[]> {
  const first = await fetchPage(1, lang);
  if (!first) return [];

  const pageSize = first.results.length || 20;
  const totalPages = Math.min(MAX_PAGES, Math.ceil(first.count / pageSize));
  const rest = await Promise.all(
    Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => fetchPage(i + 2, lang)),
  );

  return [first, ...rest].filter((p): p is CmsListResponse => p !== null).flatMap((p) => p.results);
}

// Arabic assets are matched to English ones by id; a failed Arabic fetch just
// yields an empty map so the catalog still renders in English.
async function fetchArabicAssets(): Promise<Map<number, CmsAsset>> {
  const assets = await fetchAllAssets('ar').catch(() => [] as CmsAsset[]);
  return new Map(assets.map((a) => [a.id, a]));
}

function withArabicPublisher(publisher: Publisher | null, arPublisher?: { name: string } | null) {
  return publisher && arPublisher?.name ? { ...publisher, name_ar: arPublisher.name } : publisher;
}

// CMS category names are used as-is as RATQ ResourceType values (see
// ResourceType in @/types/resource) - no mapping table needed.
function toResource(asset: CmsAsset, arAsset?: CmsAsset): Resource {
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
    // CMS has no publisher-website field today (source_url is the CMS gallery
    // page, not the publisher's site), so CMS resources stay without a
    // visit-site CTA - see issue #299.
    website_url: null,
    license: asset.license,
    publisher: withArabicPublisher(asset.publisher as Publisher | null, arAsset?.publisher),
    // name/description are the English fetch; the Arabic fetch rides along in
    // name_ar/description_ar and the client picks by locale (localizeResource).
    content_language: 'en',
    title_language: 'en',
    name_ar: arAsset?.name || undefined,
    description_ar: arAsset?.description || undefined,
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
  const [assets, arAssets] = await Promise.all([fetchAllAssets('en'), fetchArabicAssets()]);
  const resources = assets.map((a) => toResource(a, arAssets.get(a.id)));

  const filtered = resources.filter((r) => {
    if (params.type && r.type !== params.type) return false;
    if (!matchesLicenseFilter(r.license, params.license)) return false;
    if (!matchesPublisherFilter(publisherKey(r), params.publisherKeys)) return false;
    if (params.itqan_badge === 'true') return false; // CMS assets never carry the itqan badge
    if (params.search) {
      const q = normalizeArabic(params.search);
      const searchable = [r.name, r.description, r.name_ar, r.description_ar];
      if (!searchable.some((text) => text && normalizeArabic(text).includes(q))) return false;
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

  const fetchDetail = (lang: Lang) =>
    fetch(`${API_BASE}/assets/${id}/?lang=${lang}`, { headers: langHeaders(lang), next: { revalidate: 300 } });
  const [res, arRes] = await Promise.all([fetchDetail('en'), fetchDetail('ar').catch(() => null)]);
  if (!res.ok) return null;
  const detail: CmsAssetDetail = await res.json();
  const arDetail: CmsAssetDetail | null = arRes?.ok ? await arRes.json().catch(() => null) : null;

  return {
    description: detail.long_description || resource.description,
    description_ar: arDetail?.long_description || arDetail?.description || resource.description_ar,
    name_ar: arDetail?.name || resource.name_ar,
    preview_images: detail.snapshots?.map((s) => s.image_url) ?? [],
    publisher: withArabicPublisher(detail.publisher, arDetail?.publisher),
    reciter_name: detail.reciter?.name ?? null,
  };
}

export const cmsSource: ResourceSource = { id: 'cms', label: 'CMS', list, getDetail };
