import type { Announcement } from '@/types/announcement';
import { DATA_MODE, API_BASE } from '@/shared/infrastructure/data-mode';
import { mockAnnouncements } from './mock-data';

// Payload REST returns a paginated envelope ({ docs, totalDocs, ... }), not a
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
  docs: PayloadAnnouncementDoc[];
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

export function fetchAnnouncements(): Promise<Announcement[]> {
  if (DATA_MODE === 'mock') {
    const now = new Date();
    return Promise.resolve(
      mockAnnouncements.filter((a) => {
        if (!a.is_active) return false;
        if (a.expires_at && new Date(a.expires_at) < now) return false;
        return true;
      })
    );
  }

  // depth=1 populates the resource_id relationship so the adapter can derive
  // a routable aggregator slug; limit/sort mirror notifications-api.ts
  // (newest first, no truncation at Payload's default limit of 10).
  return fetch(`${API_BASE}/api/announcements/?depth=1&limit=100&sort=-createdAt`).then((res) => {
    if (!res.ok) throw new Error('Failed to fetch announcements');
    return res.json().then((data: PayloadAnnouncementsResponse) => data.docs.map(toAnnouncement));
  });
}
