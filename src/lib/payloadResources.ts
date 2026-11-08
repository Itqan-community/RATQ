// Live Payload `resources` -> design Resource. Active only when NEXT_PUBLIC_PAYLOAD_API_URL is set;
// unset = the in-memory mock. Only the beta deploy build sets it (inline at build time, never committed).
import { DEMO_LICENSES, DEMO_PUBLISHERS } from './mockData';
import { mockRepo } from './supabase';
import type { License, Resource } from '@/types';

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
  license: string;
  itqan_badge: boolean;
  status: 'draft' | 'published' | 'archived';
  version: string | null;
  createdAt: string;
  updatedAt: string;
}

export const PAYLOAD_API_URL = process.env.NEXT_PUBLIC_PAYLOAD_API_URL || '';

// Payload resource type -> design category id (same grouping the beta snapshot in betaResources.ts uses).
const TYPE_CATEGORY: Record<string, string> = {
  library: 'cat_dev', sdk: 'cat_dev', api: 'cat_dev', program: 'cat_dev', search: 'cat_dev',
  dataset: 'cat_datasets', json: 'cat_datasets', linguistic: 'cat_datasets',
  tafsir: 'cat_tafsir',
  audio: 'cat_recitations', recitation: 'cat_recitations',
  mushaf: 'cat_quran_sources', tajweed: 'cat_quran_sources', pdf: 'cat_quran_sources',
  translation: 'cat_translations',
  font: 'cat_fonts',
};

// "CC-BY-NC-ND-4.0" -> "cc-by-nc-nd" (design license ids). Unknown licenses (MIT, Apache...) get a
// neutral synthesized entry so the UI never claims CC terms the resource doesn't have.
function licenseFor(raw: string): License {
  const id = raw.toLowerCase().replace(/-\d+(\.\d+)*$/, '');
  return (
    DEMO_LICENSES.find((l) => l.id === id) ?? {
      id: `spdx-${id}`,
      name_ar: raw,
      name_en: raw,
      url: '',
      allows_commercial: false,
      requires_attribution: false,
      requires_share_alike: false,
      allows_modification: false,
      is_osi_approved: false,
    }
  );
}

export function toDesignResource(doc: PayloadResourceDoc): Resource {
  const license = licenseFor(doc.license);
  // Payload has no publisher entity (owner is a user); attribute to the community publisher.
  const publisher = DEMO_PUBLISHERS.find((p) => p.id === 'pub_ratq') ?? DEMO_PUBLISHERS[0];
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
    license_spdx: doc.license,
    access_level: 'open',
    status: doc.status,
    itqan_level: doc.itqan_badge ? 'verified' : 'none',
    repo_url: doc.github_url ?? undefined,
    docs_url: doc.documentation_url ?? undefined,
    homepage_url: doc.website_url ?? undefined,
    tech_stack: [],
    languages: ['ar'],
    categories: TYPE_CATEGORY[doc.type] ? [TYPE_CATEGORY[doc.type]] : [],
    tags: [],
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
    publisher,
    license,
  };
}

// Fetch published resources once at boot and merge them into the repo.
// Returns false when the live API is unreachable so the caller can show an error instead of silently serving mock data.
export async function hydrateFromPayload(): Promise<boolean> {
  if (!PAYLOAD_API_URL) return true;
  try {
    const res = await fetch(`${PAYLOAD_API_URL}/resources?limit=200&depth=1&where[status][equals]=published`);
    if (!res.ok) return false;
    const { docs } = (await res.json()) as { docs: PayloadResourceDoc[] };
    mockRepo.setLiveResources(docs.map(toDesignResource));
    return true;
  } catch {
    return false; // network/CORS failure
  }
}
