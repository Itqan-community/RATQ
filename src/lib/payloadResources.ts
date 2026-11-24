// Live resources (Payload + Itqan CMS) -> design Resource. Active only when NEXT_PUBLIC_PAYLOAD_API_URL is set;
// unset = the in-memory mock (local/test builds). Production builds always set it (.env.production).
import { DEMO_PUBLISHERS } from './mockData';
import { mockRepo } from './supabase';
import { cmsIdFromSlug, fetchCmsDetail, fetchCmsResources } from './cmsResources';
import { categoriesFor, isHttpUrl, isLicenseId, licenseFor, safeUrl } from './resourceMapping';
import { mediaUrl } from './resourceDetail';
import type { Bilingual, Publisher, Resource } from '@/types';

export { isHttpUrl };

// Mirrors payload-backend/src/collections/Resources.ts (same shape live's payload-resource-mapper.ts reads).
export interface PayloadResourceDoc {
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
  license?: string | null;
  itqan_badge: boolean;
  status: 'draft' | 'published' | 'archived';
  version: string | null;
  audio_url?: string | null;
  audio_thumbnail?: string | null;
  reciter_name?: string | null;
  audio_quality?: string | null;
  // Public-safe owner (the users collection itself is private).
  publisher?: { id: number; name: string } | null;
  github_stats?: { stars: number | null; forks: number | null; open_issues: number | null; last_commit: string | null } | null;
  github_commits?: { sha: string; message: string; author: string; date: string; url: string }[] | null;
  github_topics?: unknown[] | null;
  github_stats_fetched_at?: string | null;
  // Sources-sheet import (see Resources.ts sheetFields). Arabic text lives in the bare name, English in `_en`.
  sheet_id?: string | null;
  name_en?: string | null;
  short_description_en?: string | null;
  description_en?: string | null;
  content_domain?: string | null; content_domain_en?: string | null;
  riwayah?: string | null; riwayah_en?: string | null;
  smallest_unit?: string | null; smallest_unit_en?: string | null;
  query_units?: string | null; query_units_en?: string | null;
  numbering_reference?: string | null; numbering_reference_en?: string | null;
  authentication?: string | null; authentication_en?: string | null;
  rate_limits?: string | null; rate_limits_en?: string | null;
  attribution?: string | null; attribution_en?: string | null;
  scholarly_review?: string | null; scholarly_review_en?: string | null;
  license_en?: string | null;
  sample_request?: string | null;
  source_status?: string | null;
  source_type?: string | null;
  source_last_updated?: string | null;
  verified_on?: string | null;
  base_url?: string | null;
  api_key_url?: string | null;
  playground_url?: string | null;
  download_url?: string | null;
  repository?: string | null;
  // json columns: untrusted, so read through strings()
  languages?: unknown;
  tags?: unknown;
  data_formats?: unknown;
  has_api?: string | null;
  createdAt: string;
  updatedAt: string;
}

const HAS_API = ['yes', 'no', 'planned', 'iframe'] as const;
const text = (v?: string | null) => v?.trim() || undefined;
const bilingual = (ar?: string | null, en?: string | null): Bilingual | undefined => {
  const b = { ar: text(ar), en: text(en) };
  return b.ar || b.en ? b : undefined;
};
const strings = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string' && x.trim() !== '').map((x) => x.trim()) : [];

// API block only when the doc carries any API data.
function apiFor(doc: PayloadResourceDoc): Resource['api'] {
  const api = {
    base_url: safeUrl(doc.base_url),
    api_key_url: safeUrl(doc.api_key_url),
    playground_url: safeUrl(doc.playground_url),
    sample_request: text(doc.sample_request),
    authentication: bilingual(doc.authentication, doc.authentication_en),
    rate_limits: bilingual(doc.rate_limits, doc.rate_limits_en),
    data_formats: strings(doc.data_formats).length ? strings(doc.data_formats) : undefined,
  };
  return Object.values(api).some(Boolean) ? api : undefined;
}

export const PAYLOAD_API_URL = process.env.NEXT_PUBLIC_PAYLOAD_API_URL || '';

// Docs without a publisher (older rows) are attributed to the community publisher.
function publisherFor(doc: PayloadResourceDoc): Publisher {
  const community = DEMO_PUBLISHERS.find((p) => p.id === 'pub_ratq') ?? DEMO_PUBLISHERS[0];
  if (!doc.publisher) return community;
  return {
    ...community,
    id: `payload_pub_${doc.publisher.id}`,
    slug: `payload-publisher-${doc.publisher.id}`,
    name_ar: doc.publisher.name,
    name_en: doc.publisher.name,
    kind: 'individual',
    description_ar: '',
    verification_status: 'unverified',
  };
}

// The cron writes an all-null group when a repo has not been fetched yet; show nothing rather than zeros.
function githubStats(doc: PayloadResourceDoc): Resource['github_stats'] {
  const s = doc.github_stats;
  if (!s || [s.stars, s.forks, s.open_issues, s.last_commit].every((v) => v == null)) return undefined;
  return { ...s, fetched_at: doc.github_stats_fetched_at };
}

export function toDesignResource(doc: PayloadResourceDoc): Resource {
  const spdx = isLicenseId(doc.license?.trim()) ? doc.license!.trim() : undefined;
  const license = licenseFor(spdx);
  const publisher = publisherFor(doc);
  return {
    id: `payload_${doc.id}`,
    slug: `payload-${doc.slug}`,
    title_ar: doc.name,
    summary_ar: doc.short_description,
    description_ar: doc.description,
    resource_type: doc.type,
    publisher_id: publisher.id,
    created_by: 'payload',
    license_id: license.id,
    license_spdx: spdx,
    license_custom_text: spdx ? undefined : text(doc.license),
    access_level: 'open',
    status: doc.status,
    itqan_level: doc.itqan_badge ? 'verified' : 'none',
    repo_url: safeUrl(doc.github_url),
    docs_url: safeUrl(doc.documentation_url),
    homepage_url: safeUrl(doc.website_url),
    image_url: mediaUrl(typeof doc.image === 'object' && doc.image ? doc.image.url : undefined, PAYLOAD_API_URL),
    tech_stack: [],
    languages: [doc.content_language ?? 'ar'],
    content_language: doc.content_language ?? undefined,
    categories: categoriesFor(doc.type),
    tags: strings(doc.tags),
    contains_quranic_text: false,
    latest_version: doc.version ?? undefined,
    downloads_count: 0,
    views_count: 0,
    rating_avg: 0,
    rating_count: 0,
    is_featured: false,
    featured_rank: 0,
    created_at: doc.createdAt,
    updated_at: doc.updatedAt,
    source: 'payload',
    audio_url: safeUrl(doc.audio_url),
    audio_thumbnail: safeUrl(doc.audio_thumbnail),
    reciter_name: doc.reciter_name ?? undefined,
    audio_quality: doc.audio_quality ?? undefined,
    github_stats: githubStats(doc),
    github_commits: doc.github_commits?.length ? doc.github_commits : undefined,
    github_topics: doc.github_topics?.filter((t): t is string => typeof t === 'string'),
    publisher,
    license,
    sheet_id: text(doc.sheet_id),
    title_en: text(doc.name_en),
    summary_en: text(doc.short_description_en),
    description_en: text(doc.description_en),
    content_domain: bilingual(doc.content_domain, doc.content_domain_en),
    riwayah: bilingual(doc.riwayah, doc.riwayah_en),
    source_languages: strings(doc.languages).length ? strings(doc.languages) : undefined,
    smallest_unit: bilingual(doc.smallest_unit, doc.smallest_unit_en),
    query_units: bilingual(doc.query_units, doc.query_units_en),
    numbering_reference: bilingual(doc.numbering_reference, doc.numbering_reference_en),
    has_api: HAS_API.find((v) => v === doc.has_api),
    api: apiFor(doc),
    download_url: safeUrl(doc.download_url),
    repository_url: safeUrl(doc.repository),
    license_en: text(doc.license_en),
    attribution: bilingual(doc.attribution, doc.attribution_en),
    scholarly_review: bilingual(doc.scholarly_review, doc.scholarly_review_en),
    source_status: text(doc.source_status),
    source_type: text(doc.source_type),
    source_last_updated: text(doc.source_last_updated),
    verified_on: text(doc.verified_on),
  };
}

// Payload paginates itself (default 10/page). Live caps at 15 pages of 100; same 100/page, cap raised so the
// catalog never silently truncates before ~5000 docs.
const PAGE_SIZE = 100;
const MAX_PAGES = 50;

interface PayloadList { docs: PayloadResourceDoc[]; totalDocs?: number; totalPages?: number }

async function fetchPayloadPage(page: number): Promise<PayloadList | null> {
  const res = await fetch(
    `${PAYLOAD_API_URL}/resources?limit=${PAGE_SIZE}&page=${page}&depth=1&where[status][equals]=published`,
    { signal: AbortSignal.timeout(15_000) }, // a hung API must degrade to "source down", not hold the boot screen
  );
  return res.ok ? res.json() : null;
}

async function fetchPayloadResources(): Promise<Resource[]> {
  const first = await fetchPayloadPage(1);
  if (!first) throw new Error('Payload list failed');
  const totalPages = Math.min(MAX_PAGES, first.totalPages ?? Math.ceil((first.totalDocs ?? first.docs.length) / PAGE_SIZE));
  const rest = await Promise.all(
    Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => fetchPayloadPage(i + 2).catch(() => null)),
  );
  // One malformed doc must not reject the whole source.
  return [first, ...rest].filter((p): p is PayloadList => p !== null).flatMap((p) =>
    p.docs.flatMap((d) => {
      try {
        return [toDesignResource(d)];
      } catch (e) {
        console.error(`Skipping payload doc ${d?.id}:`, e);
        return [];
      }
    }),
  );
}

// Fetch every source once at boot and merge into the repo (CMS first, like live's SOURCES order). Each source
// fails on its own: one down degrades to the other, only both down is a failure the caller must show with a retry.
// Pure fetch of every source (no repo mutation): shared by the browser boot below and the server SEO pages.
export async function fetchAllResources(): Promise<{ ok: boolean; failed: ('cms' | 'payload')[]; resources: Resource[] }> {
  if (!PAYLOAD_API_URL) return { ok: true, failed: [], resources: [] };
  const [cms, payload] = await Promise.allSettled([fetchCmsResources(), fetchPayloadResources()]);
  const failed: ('cms' | 'payload')[] = [];
  if (cms.status === 'rejected') { failed.push('cms'); console.error('Source "cms" failed:', cms.reason); }
  if (payload.status === 'rejected') { failed.push('payload'); console.error('Source "payload" failed:', payload.reason); }
  return {
    ok: failed.length < 2,
    failed,
    resources: [...(cms.status === 'fulfilled' ? cms.value : []), ...(payload.status === 'fulfilled' ? payload.value : [])],
  };
}

export async function hydrateResources(): Promise<{ ok: boolean; failed: ('cms' | 'payload')[] }> {
  if (!PAYLOAD_API_URL) return { ok: true, failed: [] };
  const { ok, failed, resources } = await fetchAllResources();
  if (ok) mockRepo.setLiveResources(resources);
  return { ok, failed };
}

// Returns false only when no source could be reached, so the caller can show an error instead of mock data.
export const hydrateFromPayload = async (): Promise<boolean> => (await hydrateResources()).ok;

// Direct lookup for slugs the boot list does not hold (CMS asset added since boot, one source down at boot) and
// CMS detail enrichment. null = unknown slug or mock mode (demo slugs are never resolved); throws = source unreachable.
export async function fetchResourceBySlug(slug: string): Promise<Resource | null> {
  if (!PAYLOAD_API_URL) return null;
  const cmsId = cmsIdFromSlug(slug);
  if (cmsId) return fetchCmsDetail(cmsId);
  if (!slug.startsWith('payload-')) return null;
  const res = await fetch(
    `${PAYLOAD_API_URL}/resources?where[slug][equals]=${encodeURIComponent(slug.slice('payload-'.length))}&where[status][equals]=published&limit=1&depth=1`,
  );
  if (!res.ok) throw new Error(`Payload lookup failed (${res.status})`);
  const doc = ((await res.json()) as PayloadList).docs[0];
  return doc ? toDesignResource(doc) : null;
}
