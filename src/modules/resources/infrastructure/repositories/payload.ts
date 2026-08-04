import type { PaginatedResponse, Resource, ResourceListParams } from '@/types/resource';
import type { ResourceSource } from './types';
import { toResource, type PayloadResourceDoc } from '@/shared/infrastructure/payload-resource-mapper';

export type { PayloadResourceDoc };

const API_BASE = process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 'https://api.ratq.itqan.dev/api';

// Payload's REST API paginates itself (default limit 10); we page through
// until exhausted (capped), same pattern as cms.ts.
const MAX_PAGES = 15;

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
