// Payload `announcements` (public read: server returns only active + unexpired). Live shows them as the home carousel.
import { isLive, payloadBase } from './payloadAuth';

interface PayloadAnnouncementDoc {
  id: number;
  type: string;
  title: string;
  description: string;
  cta_url?: string | null;
  cta_label?: string | null;
}

export interface Announcement {
  id: number;
  type: string;
  title: string;
  description: string;
  ctaUrl: string | null;
  ctaLabel: string | null;
}

// cta_url is admin-entered and rendered as a link: allow only http(s) and site-relative paths.
export function safeCtaUrl(url?: string | null): string | null {
  if (!url) return null;
  if (url.startsWith('/') && !url.startsWith('//')) return url;
  return /^https?:\/\//i.test(url) ? url : null;
}

export function toAnnouncement(doc: PayloadAnnouncementDoc): Announcement {
  return {
    id: doc.id,
    type: doc.type,
    title: doc.title,
    description: doc.description,
    ctaUrl: safeCtaUrl(doc.cta_url),
    ctaLabel: doc.cta_label ?? null,
  };
}

export async function fetchAnnouncements(): Promise<Announcement[]> {
  if (!isLive()) return [];
  try {
    const res = await fetch(`${payloadBase()}/announcements?limit=10&sort=-createdAt&depth=0`);
    if (!res.ok) return [];
    const { docs } = (await res.json()) as { docs: PayloadAnnouncementDoc[] };
    return docs.map(toAnnouncement);
  } catch {
    return [];
  }
}
