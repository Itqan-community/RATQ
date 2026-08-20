import type { Announcement } from '@/types/announcement';
import { DATA_MODE, API_BASE } from '@/shared/infrastructure/data-mode';
import { mockAnnouncements } from './mock-data';

// Payload REST returns a paginated envelope ({ docs, hasNextPage, ... }), not a
// bare array, so this unwraps docs and normalizes each doc to the frontend
// Announcement contract. createdAt (Payload's built-in timestamp) becomes
// created_at, same mapping as developer/infrastructure/notifications-api.ts.
interface PayloadAnnouncementDoc {
  id: number | string;
  type: Announcement['type'];
  title: string;
  description: string;
  resource_id?: { id: number | string; slug: string } | number | string | null;
  cta_url?: string | null;
  cta_label?: string | null;
  createdAt: string;
  expires_at?: string | null;
  is_active: boolean;
}

interface PayloadAnnouncementsResponse {
  docs?: PayloadAnnouncementDoc[];
  hasNextPage?: boolean;
  nextPage?: number | null;
  page?: number;
  totalPages?: number;
}

// Announcements link to Payload-native resources, whose aggregator slug is
// payload-${slug} (same namespacing as repositories/payload.ts toResource) -
// the /resources/${slug} detail route resolves against the aggregator.
function toAnnouncement(doc: PayloadAnnouncementDoc): Announcement {
  const related = doc.resource_id;
  const resource_id =
    related && typeof related === 'object' ? `payload-${related.slug}` : undefined;

  return {
    id: String(doc.id),
    type: doc.type,
    title: doc.title,
    description: doc.description,
    resource_id,
    cta_url: doc.cta_url ?? undefined,
    cta_label: doc.cta_label ?? undefined,
    created_at: doc.createdAt,
    expires_at: doc.expires_at ?? undefined,
    is_active: doc.is_active,
  };
}

// depth=1 populates the resource_id relationship so the adapter can derive
// a routable aggregator slug; limit/sort mirror notifications-api.ts
// (newest first, no truncation at Payload's default limit of 10).
async function fetchAnnouncementPage(page: number): Promise<PayloadAnnouncementsResponse> {
  const res = await fetch(
    `${API_BASE}/api/announcements/?depth=1&limit=100&sort=-createdAt&page=${page}`,
  );
  if (!res.ok) throw new Error('Failed to fetch announcements');
  return res.json();
}

export async function fetchAnnouncements(): Promise<Announcement[]> {
  if (DATA_MODE === 'mock') {
    const now = new Date();
    return mockAnnouncements.filter((a) => {
      if (!a.is_active) return false;
      if (a.expires_at && new Date(a.expires_at) < now) return false;
      return true;
    });
  }

  // Payload pages the REST list (default limit 10); walk page 1 onwards and
  // concatenate docs, preserving the server-side sort order. Loop is guarded
  // against malformed metadata: stop when hasNextPage is false, when the
  // response claims no valid forward-moving next page, or when totalPages is
  // reached - so a buggy/misbehaving server cannot cause an infinite fetch.
  const docs: PayloadAnnouncementDoc[] = [];
  let page = 1;

  while (true) {
    const data = await fetchAnnouncementPage(page);
    if (Array.isArray(data.docs)) docs.push(...data.docs);

    if (!data.hasNextPage) break;
    if (typeof data.totalPages === 'number' && page >= data.totalPages) break;

    const nextPage = typeof data.nextPage === 'number' ? data.nextPage : 0;
    if (!Number.isInteger(nextPage) || nextPage <= page) break;
    page = nextPage;
  }

  return docs.map(toAnnouncement);
}
