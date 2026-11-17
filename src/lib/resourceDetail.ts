// Pure helpers for the resource detail page (CTA banner, photos, related, license kind). CMS/Payload text is
// untrusted: every URL that reaches an href/src goes through isHttpUrl.
import { isHttpUrl } from './resourceMapping';
import type { License, Resource } from '@/types';

export function siteHost(url?: string | null): string | null {
  if (!url || !isHttpUrl(url)) return null;
  return new URL(url).hostname.replace(/^www\./, '') || null;
}

export type CtaBanner = { kind: 'site'; href: string; host: string } | { kind: 'cms'; href: string };

// Live order: website, else documentation, else (CMS only) the CMS gallery page. A bad website must not shadow good docs.
export function ctaBanner(r: Pick<Resource, 'homepage_url' | 'docs_url' | 'source' | 'source_url'>): CtaBanner | null {
  for (const href of [r.homepage_url, r.docs_url]) {
    const host = siteHost(href);
    if (href && host) return { kind: 'site', href, host };
  }
  if (r.source === 'cms' && r.source_url && isHttpUrl(r.source_url)) return { kind: 'cms', href: r.source_url };
  return null;
}

// Own gallery when present, else the single cover; never both (CMS links are presigned, so not persisted anywhere).
export function photosFor(r: Pick<Resource, 'preview_images' | 'image_url'>): string[] {
  const own = (r.preview_images ?? []).filter(isHttpUrl);
  if (own.length) return own;
  return r.image_url && isHttpUrl(r.image_url) ? [r.image_url] : [];
}

export const relatedTo = (all: Resource[], current: Resource, max = 4): Resource[] =>
  all.filter((x) => x.id !== current.id && x.resource_type === current.resource_type).slice(0, max);

// licenseFor() invents a neutral entry for licenses the platform has no terms for (MIT, Unspecified...).
export const isSynthesizedLicense = (l?: License): boolean => !!l && l.id.startsWith('spdx-');

// Payload upload URLs can be relative to the API origin; anything that is not http(s) once resolved is dropped.
export function mediaUrl(raw: string | null | undefined, apiBase: string): string | undefined {
  if (!raw) return undefined;
  try {
    const abs = isHttpUrl(raw) ? raw : new URL(raw, new URL(apiBase).origin).href;
    return isHttpUrl(abs) ? abs : undefined;
  } catch {
    return undefined;
  }
}
