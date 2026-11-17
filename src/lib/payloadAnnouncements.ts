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

// CMS authors write bilingual text as "AR | EN" (or "EN | AR"): pick the half in the active locale's script.
// Anything that is not exactly one Arabic half and one non-Arabic half is returned untouched.
const ARABIC = /[؀-ۿ]/;
export function localizeAnnouncementText(text: string, lang: string): string {
  const parts = text.split('|').map((p) => p.trim());
  if (parts.length !== 2 || !parts[0] || !parts[1]) return text;
  const [a, b] = parts;
  if (ARABIC.test(a) === ARABIC.test(b)) return text;
  const wantAr = lang === 'ar';
  return ARABIC.test(a) === wantAr ? a : b;
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
