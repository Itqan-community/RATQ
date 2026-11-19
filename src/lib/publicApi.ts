// Public JSON API behind /api/resources*: the contract live (main) serves, kept so third-party consumers and old
// bookmarks keep working after the swap. Same shape (ids 100000+cms / 200000+payload, raw CMS category as `type`,
// string page cursors) and same filters as live's aggregator, but it reads the sources through the beta's fetchers.
// Fetch-only (runs in the Cloudflare Worker).
import { fetchAllAssets, get, type CmsAsset, type CmsAssetDetail } from './cmsResources';
import { matchesLicenseFilter, matchesPublisherFilter, SORT_OPTIONS, type SortOption } from './catalogQuery';
import { normalizeArabic } from './format';
import { isHttpUrl } from './resourceMapping';
import { mediaUrl } from './resourceDetail';

export interface ApiPublisher { id: number; name: string; description?: string | null; name_ar?: string }
export interface ApiResource {
  id: number;
  name: string;
  slug: string;
  source: 'cms' | 'payload';
  source_url: string | null;
  type: string;
  description: string;
  short_description: string;
  image_url?: string | null;
  documentation_url: string | null;
  github_url: string | null;
  website_url: string | null;
  license: string;
  content_language?: 'ar' | 'en';
  title_language?: 'ar' | 'en';
  name_ar?: string;
  description_ar?: string;
  itqan_badge: boolean;
  status: string;
  created_at: string;
  updated_at: string;
  version: string | null;
  audio_url?: string | null;
  audio_thumbnail?: string | null;
  reciter_name?: string | null;
  audio_quality?: string | null;
  preview_images?: string[];
  publisher?: ApiPublisher | null;
  github_stats: null;
  total_downloads: number;
  downloads: number;
}
export interface ApiPage<T> { count: number; next: string | null; previous: string | null; results: T[] }
export interface ApiListParams {
  type?: string;
  license?: string[];
  publisherKeys?: string[];
  itqan_badge?: string;
  search?: string;
  sort?: SortOption;
  page?: number;
  page_size?: number;
}
export interface ApiPublisherOption extends ApiPublisher { key: string }

// Mirrors the Payload `resources` collection (the doc shape live's payload-resource-mapper reads).
interface PayloadDoc {
  id: number | string;
  name: string;
  slug: string;
  type: string;
  description: string;
  short_description: string;
  image?: { url: string } | number | string | null;
  documentation_url: string | null;
  github_url: string | null;
  website_url?: string | null;
  content_language?: 'ar' | 'en' | null;
  title_language?: 'ar' | 'en' | null;
  license: string;
  itqan_badge: boolean;
  status: string;
  version: string | null;
  audio_url?: string | null;
  audio_thumbnail?: string | null;
  reciter_name?: string | null;
  audio_quality?: string | null;
  publisher?: { id: number; name: string } | null;
  createdAt: string;
  updatedAt: string;
}

const CMS_GALLERY_BASE = () => process.env.NEXT_PUBLIC_CMS_GALLERY_URL || 'https://cms.itqan.dev/gallery/asset';
const PAYLOAD_BASE = () => process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 'https://api.quran.tech/api';
const PAYLOAD_PAGE_SIZE = 100;
const PAYLOAD_MAX_PAGES = 50;
const TIMEOUT_MS = 15_000;
const DEFAULT_PAGE_SIZE = 12;

const ARABIC_LETTER = /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/g;
const LATIN_LETTER = /[A-Za-z]/g;
// Majority script, same as live's detectLanguage; undefined when there are no letters to judge by.
export function detectLanguage(text?: string | null): 'ar' | 'en' | undefined {
  if (!text) return undefined;
  const ar = text.match(ARABIC_LETTER)?.length ?? 0;
  const en = text.match(LATIN_LETTER)?.length ?? 0;
  if (!ar && !en) return undefined;
  return ar > en ? 'ar' : 'en';
}

const withArabicPublisher = (p: ApiPublisher | null, ar?: { name: string } | null): ApiPublisher | null =>
  p && ar?.name ? { ...p, name_ar: ar.name } : p;

export function cmsToApi(asset: CmsAsset, ar?: CmsAsset): ApiResource {
  return {
    id: 100_000 + asset.id,
    name: asset.name,
    slug: `cms-${asset.id}`,
    source: 'cms',
    source_url: `${CMS_GALLERY_BASE()}/${asset.id}`,
    type: asset.category,
    description: asset.description,
    short_description: asset.description,
    documentation_url: null,
    github_url: null,
    website_url: null,
    license: asset.license,
    publisher: withArabicPublisher(asset.publisher, ar?.publisher),
    content_language: detectLanguage(asset.description) ?? 'en',
    title_language: detectLanguage(asset.name) ?? 'en',
    name_ar: ar?.name || undefined,
    description_ar: ar?.description || undefined,
    itqan_badge: false,
    status: 'published',
    created_at: '', // the CMS exposes no dates; none are invented
    updated_at: '',
    version: null,
    github_stats: null,
    total_downloads: 0,
    downloads: 0,
  };
}

export function payloadToApi(doc: PayloadDoc): ApiResource {
  return {
    id: 200_000 + Number(doc.id),
    name: doc.name,
    slug: `payload-${doc.slug}`,
    source: 'payload',
    source_url: null,
    type: doc.type,
    description: doc.description,
    short_description: doc.short_description,
    image_url: mediaUrl(typeof doc.image === 'object' && doc.image ? doc.image.url : undefined, PAYLOAD_BASE()) ?? null,
    documentation_url: doc.documentation_url,
    github_url: doc.github_url,
    website_url: doc.website_url ?? null,
    license: doc.license,
    content_language: doc.content_language ?? detectLanguage(doc.description),
    title_language: doc.title_language ?? detectLanguage(doc.name),
    itqan_badge: doc.itqan_badge,
    status: doc.status,
    created_at: doc.createdAt,
    updated_at: doc.updatedAt,
    version: doc.version,
    audio_url: doc.audio_url ?? null,
    audio_thumbnail: doc.audio_thumbnail ?? null,
    reciter_name: doc.reciter_name ?? null,
    audio_quality: doc.audio_quality ?? null,
    publisher: doc.publisher ?? undefined,
    github_stats: null,
    total_downloads: 0,
    downloads: 0,
  };
}

// Source-namespaced key ("cms:17"): ids are only unique within one source. Same shape the catalog URL carries.
export const apiPublisherKey = (r: Pick<ApiResource, 'source' | 'publisher'>): string | null =>
  r.publisher ? `${r.source}:${r.publisher.id}` : null;

// ?license / ?publisher repeat; a bad page/page_size falls back to the defaults instead of slicing nonsense.
export function listParamsFrom(sp: URLSearchParams): ApiListParams {
  const positive = (k: string, d: number) => {
    const n = Number.parseInt(sp.get(k) ?? '', 10);
    return n >= 1 ? n : d;
  };
  const sort = sp.get('sort');
  return {
    type: sp.get('type') || undefined,
    license: sp.getAll('license').length ? sp.getAll('license') : undefined,
    publisherKeys: sp.getAll('publisher').length ? sp.getAll('publisher') : undefined,
    itqan_badge: sp.get('itqan_badge') || undefined,
    search: sp.get('search') || undefined,
    sort: SORT_OPTIONS.includes(sort as SortOption) ? (sort as SortOption) : undefined,
    page: positive('page', 1),
    page_size: positive('page_size', DEFAULT_PAGE_SIZE),
  };
}

// CMS searches Arabic + English name/description; Payload only the primary pair (live behaviour).
function matches(r: ApiResource, p: ApiListParams): boolean {
  if (p.type && r.type !== p.type) return false;
  if (!matchesLicenseFilter(r.license, p.license)) return false;
  if (!matchesPublisherFilter(apiPublisherKey(r), p.publisherKeys ?? [])) return false;
  if (p.itqan_badge === 'true' && !r.itqan_badge) return false;
  if (p.itqan_badge === 'false' && r.itqan_badge) return false;
  if (p.search) {
    const q = normalizeArabic(p.search);
    const fields = r.source === 'cms' ? [r.name, r.description, r.name_ar, r.description_ar] : [r.name, r.description];
    if (!fields.some((t) => t && normalizeArabic(t).includes(q))) return false;
  }
  return true;
}

// Undated (CMS) items count as time 0: they sink under 'newest' and lead under 'oldest'.
const time = (d: string) => (Number.isNaN(Date.parse(d)) ? 0 : Date.parse(d));

function sorted(list: ApiResource[], sort?: SortOption): ApiResource[] {
  const out = [...list];
  switch (sort) {
    case 'downloads': return out.sort((a, b) => b.total_downloads - a.total_downloads);
    case 'newest': return out.sort((a, b) => time(b.created_at) - time(a.created_at));
    case 'oldest': return out.sort((a, b) => time(a.created_at) - time(b.created_at));
    case 'name_asc': return out.sort((a, b) => a.name.localeCompare(b.name));
    case 'name_desc': return out.sort((a, b) => b.name.localeCompare(a.name));
    default: return out; // relevance / none: merged source order
  }
}

export function listResources(all: ApiResource[], p: ApiListParams): ApiPage<ApiResource> {
  const merged = sorted(all.filter((r) => matches(r, p)), p.sort);
  const page = p.page || 1;
  const size = p.page_size || DEFAULT_PAGE_SIZE;
  const start = (page - 1) * size;
  return {
    count: merged.length,
    next: start + size < merged.length ? String(page + 1) : null,
    previous: page > 1 ? String(page - 1) : null,
    results: merged.slice(start, start + size),
  };
}

export function publishersFrom(list: ApiResource[]): ApiPublisherOption[] {
  const byKey = new Map<string, ApiPublisherOption>();
  for (const r of list) {
    if (!r.publisher) continue;
    const key = apiPublisherKey(r) as string;
    const { id, name, name_ar } = r.publisher;
    const existing = byKey.get(key);
    if (!existing) byKey.set(key, { key, id, name, name_ar });
    // A resource whose Arabic fetch failed carries no name_ar; keep looking for one that has it.
    else if (!existing.name_ar && name_ar) existing.name_ar = name_ar;
  }
  return [...byKey.values()].sort((a, b) => a.name.localeCompare(b.name));
}

// ---- fetching -------------------------------------------------------------------------------------------

async function fetchCmsApi(): Promise<ApiResource[]> {
  const [assets, arAssets] = await Promise.all([fetchAllAssets('en'), fetchAllAssets('ar').catch(() => [] as CmsAsset[])]);
  const ar = new Map(arAssets.map((a) => [a.id, a]));
  return assets.map((a) => cmsToApi(a, ar.get(a.id)));
}

interface PayloadList { docs: PayloadDoc[]; totalDocs?: number; totalPages?: number }

async function payloadPage(page: number): Promise<PayloadList | null> {
  const res = await fetch(
    `${PAYLOAD_BASE()}/resources?where[status][equals]=published&limit=${PAYLOAD_PAGE_SIZE}&page=${page}&depth=1`,
    { signal: AbortSignal.timeout(TIMEOUT_MS) },
  );
  return res.ok ? res.json() : null;
}

async function fetchPayloadApi(): Promise<ApiResource[]> {
  const first = await payloadPage(1);
  if (!first) throw new Error('Payload list failed');
  const pages = Math.min(PAYLOAD_MAX_PAGES, first.totalPages ?? Math.ceil((first.totalDocs ?? first.docs.length) / PAYLOAD_PAGE_SIZE));
  const rest = await Promise.all(Array.from({ length: Math.max(0, pages - 1) }, (_, i) => payloadPage(i + 2).catch(() => null)));
  return [first, ...rest]
    .filter((p): p is PayloadList => p !== null)
    .flatMap((p) => p.docs)
    .filter((d) => Number.isFinite(Number(d.id)))
    .map(payloadToApi);
}

// CMS first, then Payload (live's source order). One source down degrades to the other; both down throws so the
// caller answers 502 instead of caching an empty catalog.
export async function fetchApiResources(): Promise<ApiResource[]> {
  const settled = await Promise.allSettled([fetchCmsApi(), fetchPayloadApi()]);
  const names = ['cms', 'payload'];
  settled.forEach((r, i) => r.status === 'rejected' && console.error(`Source "${names[i]}" failed:`, r.reason));
  if (settled.every((r) => r.status === 'rejected')) throw new Error('all resource sources failed');
  return settled.flatMap((r) => (r.status === 'fulfilled' ? r.value : []));
}

// Detail: asks only the source that owns the slug prefix. null = unknown slug; a thrown error = source unreachable.
export async function fetchApiResource(slug: string): Promise<ApiResource | null> {
  const cmsId = slug.match(/^cms-([1-9]\d*)$/)?.[1];
  if (cmsId) return fetchCmsDetailApi(Number(cmsId));
  if (!slug.startsWith('payload-') || slug === 'payload-') return null;
  const res = await fetch(
    `${PAYLOAD_BASE()}/resources?where[slug][equals]=${encodeURIComponent(slug.slice('payload-'.length))}&where[status][equals]=published&limit=1&depth=1`,
    { signal: AbortSignal.timeout(TIMEOUT_MS) },
  );
  if (!res.ok) throw new Error(`Payload lookup failed (${res.status})`);
  const doc = ((await res.json()) as PayloadList).docs?.[0];
  return doc ? payloadToApi(doc) : null;
}

async function fetchCmsDetailApi(id: number): Promise<ApiResource | null> {
  const [res, arRes] = await Promise.all([get(`/assets/${id}/`, 'en'), get(`/assets/${id}/`, 'ar').catch(() => null)]);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`CMS detail failed (${res.status})`);
  const detail: CmsAssetDetail = await res.json();
  const ar: CmsAssetDetail | null = arRes?.ok ? await arRes.json().catch(() => null) : null;
  const base = cmsToApi(detail, ar ?? undefined);
  return {
    ...base,
    description: detail.long_description || base.description,
    content_language: detectLanguage(detail.long_description) ?? base.content_language,
    description_ar: ar?.long_description || ar?.description || base.description_ar,
    name_ar: ar?.name || base.name_ar,
    // Snapshot links are presigned (~1h): returned fresh, never persisted.
    preview_images: (detail.snapshots ?? []).map((s) => s.image_url).filter(isHttpUrl),
    publisher: withArabicPublisher(detail.publisher, ar?.publisher),
    reciter_name: detail.reciter?.name ?? null,
  };
}

// ---- HTTP -----------------------------------------------------------------------------------------------

const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS' };
const CACHEABLE = 'public, s-maxage=300, stale-while-revalidate=60';

export const preflight = () => new Response(null, { status: 204, headers: { ...CORS, 'Access-Control-Max-Age': '86400' } });

const body = (data: unknown, status: number, cacheControl: string) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json', 'Cache-Control': cacheControl },
  });

// Workers do not cache dynamic responses on their own; the Cache API is the one mechanism that reliably does
// (live learned this on Pages). null from compute = 404. Errors and 404s are never cached.
export async function handle(request: Request, compute: () => Promise<unknown | null>): Promise<Response> {
  const cache = (globalThis as { caches?: { default?: Cache } }).caches?.default;
  const key = new Request(request.url);
  try {
    const hit = await cache?.match(key);
    if (hit) return hit;
    const data = await compute();
    if (data === null) return body({ error: 'Resource not found' }, 404, 'no-store');
    const res = body(data, 200, CACHEABLE);
    await cache?.put(key, res.clone());
    return res;
  } catch (e) {
    console.error('public api failed:', e);
    return body({ error: 'Upstream sources unavailable' }, 502, 'no-store');
  }
}
