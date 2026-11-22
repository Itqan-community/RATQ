// Itqan CMS assets -> design Resource. Port of live's repositories/cms.ts (same endpoints, same cms-<id> slugs).
// The CMS answers browsers with CORS for quran.tech and beta.ratq.itqan.dev (verified), so it is fetched directly.
import { categoriesFor, detectLang, isHttpUrl, licenseFor } from './resourceMapping';
import type { Publisher, Resource } from '@/types';

const API_BASE = () => process.env.NEXT_PUBLIC_CMS_API_URL || 'https://api.cms.itqan.dev/cms-api';
const GALLERY_BASE = process.env.NEXT_PUBLIC_CMS_GALLERY_URL || 'https://cms.itqan.dev/gallery/asset';

// The list endpoint paginates at a fixed ~20/page and ignores ?limit. Live caps at 15 pages (300 assets);
// 50 keeps the cap well above the 102 assets today without an unbounded loop.
const MAX_PAGES = 50;
const TIMEOUT_MS = 15_000;

export interface CmsAsset {
  id: number;
  category: string;
  tags?: { slug: string; name: string }[];
  name: string;
  description: string;
  publisher: { id: number; name: string } | null;
  reciter: { id: number; name: string } | null;
  license: string;
}
interface CmsListResponse { count: number; results: CmsAsset[] }
export interface CmsAssetDetail extends CmsAsset {
  long_description?: string;
  snapshots?: { image_url: string }[];
  publisher: { id: number; name: string; description?: string | null } | null;
}
export type Lang = 'ar' | 'en';

// Accept-Language is a CORS-safelisted header (no preflight). ?lang= is ignored by the CMS and only gives
// each language its own URL so HTTP caches never serve one language's body for the other.
export const get = (path: string, lang: Lang) =>
  fetch(`${API_BASE()}${path}${path.includes('?') ? '&' : '?'}lang=${lang}`, {
    headers: lang === 'ar' ? { 'Accept-Language': 'ar' } : undefined,
    signal: AbortSignal.timeout(TIMEOUT_MS), // a hung CMS must degrade to "source down", not hold the boot screen forever
  });

async function fetchPage(page: number, lang: Lang): Promise<CmsListResponse | null> {
  const res = await get(`/assets/?is_open_access=true&page=${page}`, lang);
  return res.ok ? res.json() : null;
}

// First page tells us `count`; the rest fetch in parallel. First-page failure throws (source down); a later
// page that fails only drops that page so the rest of the catalog still shows.
export async function fetchAllAssets(lang: Lang): Promise<CmsAsset[]> {
  const first = await fetchPage(1, lang);
  if (!first) throw new Error(`CMS list failed (${lang})`);
  const pageSize = first.results.length || 20;
  const totalPages = Math.min(MAX_PAGES, Math.ceil(first.count / pageSize));
  const rest = await Promise.all(
    Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => fetchPage(i + 2, lang).catch(() => null)),
  );
  return [first, ...rest].filter((p): p is CmsListResponse => p !== null).flatMap((p) => p.results);
}

// CMS "text" assets are tafsir/translation by tag; every other category already matches a design type.
function typeFor(a: CmsAsset): string {
  if (a.category !== 'text') return a.category;
  const slugs = (a.tags ?? []).map((t) => t.slug);
  return slugs.includes('tafsir') ? 'tafsir' : slugs.includes('translation') ? 'translation' : 'text';
}

function publisherFor(en: CmsAsset['publisher'], ar?: CmsAsset['publisher']): Publisher | undefined {
  if (!en) return undefined;
  return {
    id: `cms_pub_${en.id}`,
    slug: `cms-publisher-${en.id}`,
    name_ar: ar?.name || en.name,
    name_en: en.name,
    kind: 'organization',
    description_ar: '',
    verification_status: 'unverified', // the CMS exposes no verification state
    access_policy: 'open',
    default_sla_days: 0,
    is_active: true,
    created_at: '',
    owner_profile_id: '',
  };
}

export function toCmsResource(asset: CmsAsset, ar?: CmsAsset): Resource {
  const type = typeFor(asset);
  const license = licenseFor(asset.license);
  const publisher = publisherFor(asset.publisher, ar?.publisher);
  const lang = detectLang(asset.description);
  return {
    id: `cms_${asset.id}`,
    slug: `cms-${asset.id}`,
    title_ar: ar?.name || asset.name,
    title_en: asset.name,
    summary_ar: ar?.description || asset.description,
    summary_en: asset.description,
    description_ar: ar?.description || asset.description,
    description_en: asset.description,
    resource_type: type,
    publisher_id: publisher?.id ?? '',
    created_by: 'cms',
    license_id: license.id,
    license_spdx: asset.license,
    access_level: 'open',
    status: 'published',
    itqan_level: 'none',
    tech_stack: [],
    languages: [lang],
    content_language: lang,
    categories: categoriesFor(type),
    tags: [],
    contains_quranic_text: false,
    downloads_count: 0,
    views_count: 0,
    rating_avg: 0,
    rating_count: 0,
    is_featured: false,
    featured_rank: 0,
    created_at: '', // the CMS exposes no dates; none are invented
    updated_at: '',
    source: 'cms',
    source_url: `${GALLERY_BASE}/${asset.id}`,
    reciter_name: asset.reciter?.name,
    publisher,
    license,
  };
}

// Arabic is optional: a failed Arabic fetch only means Arabic names fall back to English.
export async function fetchCmsResources(): Promise<Resource[]> {
  const [assets, arAssets] = await Promise.all([fetchAllAssets('en'), fetchAllAssets('ar').catch(() => [] as CmsAsset[])]);
  const ar = new Map(arAssets.map((a) => [a.id, a]));
  return assets.map((a) => toCmsResource(a, ar.get(a.id)));
}

export function cmsIdFromSlug(slug: string): number | null {
  const m = slug.match(/^cms-([1-9]\d*)$/);
  return m ? Number(m[1]) : null;
}

// Detail endpoint: long description, gallery snapshots (presigned R2 links that expire in ~1h, so never persist
// them), reciter. null = the asset does not exist (or is not open access); a thrown error = source unreachable.
export async function fetchCmsDetail(id: number): Promise<Resource | null> {
  const [res, arRes] = await Promise.all([get(`/assets/${id}/`, 'en'), get(`/assets/${id}/`, 'ar').catch(() => null)]);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`CMS detail failed (${res.status})`);
  const detail: CmsAssetDetail = await res.json();
  const ar: CmsAssetDetail | null = arRes?.ok ? await arRes.json().catch(() => null) : null;
  const base = toCmsResource(detail, ar ?? undefined);
  const lang = detectLang(detail.long_description || detail.description);
  return {
    ...base,
    description_en: detail.long_description || base.description_en,
    description_ar: ar?.long_description || ar?.description || base.description_ar,
    content_language: lang,
    preview_images: (detail.snapshots ?? []).map((s) => s.image_url).filter(isHttpUrl),
  };
}
