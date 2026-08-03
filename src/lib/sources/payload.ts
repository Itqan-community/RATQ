import type { PaginatedResponse, Resource, ResourceListParams, ResourceType } from '@/types/resource';
import type { ResourceSource } from './types';

const API_BASE = process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 'https://api.ratq.itqan.dev/api';

// Payload's REST API paginates itself (default limit 10); we page through
// until exhausted (capped), same pattern as cms.ts.
const MAX_PAGES = 15;

export interface PayloadResourceDoc {
  id: number | string;
  name: string;
  slug: string;
  type: ResourceType;
  description: string;
  short_description: string;
  documentation_url: string | null;
  github_url: string | null;
  license: string;
  itqan_badge: boolean;
  status: 'draft' | 'published' | 'archived';
  version: string | null;
  createdAt: string;
  updatedAt: string;
}

interface PayloadListResponse {
  docs: PayloadResourceDoc[];
  totalDocs: number;
  hasNextPage: boolean;
}

// where[status][equals]=published: only Payload's admin-only preview
// (draft/archived) is excluded from the public source, matching cms.ts's
// is_open_access=true filter.
async function fetchPage(page: number): Promise<PayloadListResponse | null> {
  const res = await fetch(
    `${API_BASE}/resources?where[status][equals]=published&limit=100&page=${page}`,
    { next: { revalidate: 300 } },
  );
  return res.ok ? res.json() : null;
}

// First page tells us totalDocs, so remaining pages fetch in parallel -
// same reasoning as cms.ts's fetchAllAssets.
async function fetchAllDocs(): Promise<PayloadResourceDoc[]> {
  const first = await fetchPage(1);
  if (!first) return [];

  const pageSize = first.docs.length || 100;
  const totalPages = Math.min(MAX_PAGES, Math.ceil(first.totalDocs / pageSize));
  const rest = await Promise.all(
    Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => fetchPage(i + 2)),
  );

  return [first, ...rest].filter((p): p is PayloadListResponse => p !== null).flatMap((p) => p.docs);
}

// No public per-resource page on the Payload side yet - source_url is null
// until one exists (unlike cms.ts, which links to the CMS gallery).
// Slug is namespaced (payload-${slug}) the same way cms.ts namespaces its
// ids (cms-${id}) - the aggregator resolves detail pages by matching slug
// across the flat merged cross-source list (see aggregate.ts getResource),
// so an unprefixed slug could silently collide with a ratq-native/cms one.
export function toResource(doc: PayloadResourceDoc): Resource {
  return {
    id: 200_000 + Number(doc.id), // offset to avoid colliding with ratq-native/cms ids
    name: doc.name,
    slug: `payload-${doc.slug}`,
    source: 'payload',
    source_url: null,
    type: doc.type,
    description: doc.description,
    short_description: doc.short_description,
    documentation_url: doc.documentation_url,
    github_url: doc.github_url,
    license: doc.license,
    itqan_badge: doc.itqan_badge,
    status: doc.status,
    created_at: doc.createdAt,
    updated_at: doc.updatedAt,
    version: doc.version,
    github_stats: null,
    total_downloads: 0,
    downloads: 0,
  };
}

async function list(params: ResourceListParams): Promise<PaginatedResponse<Resource>> {
  const docs = await fetchAllDocs();
  const resources = docs.filter((d) => Number.isFinite(Number(d.id))).map(toResource);

  const filtered = resources.filter((r) => {
    if (params.type && r.type !== params.type) return false;
    if (params.license && r.license !== params.license) return false;
    if (params.itqan_badge === 'true' && !r.itqan_badge) return false;
    if (params.itqan_badge === 'false' && r.itqan_badge) return false;
    if (params.search) {
      const q = params.search.toLowerCase();
      if (!r.name.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return { count: filtered.length, next: null, previous: null, results: filtered };
}

async function getDetail(resource: Resource): Promise<Partial<Resource> | null> {
  const id = resource.id - 200_000;
  if (!Number.isFinite(id) || id <= 0) return null;

  const res = await fetch(`${API_BASE}/resources/${id}`, { next: { revalidate: 300 } });
  if (!res.ok) return null;
  const doc: PayloadResourceDoc = await res.json();

  return { description: doc.description, updated_at: doc.updatedAt };
}

export const payloadSource: ResourceSource = { id: 'payload', label: 'Payload', list, getDetail };
