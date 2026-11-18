// Server-only helpers for the per-route SEO wrappers (runs in the Cloudflare Worker: fetch only, no fs).
import { cache } from 'react';
import type { Metadata } from 'next';
import { fetchAllResources, fetchResourceBySlug, PAYLOAD_API_URL } from '@/lib/payloadResources';
import { SITE_NAME } from '@/lib/seoMeta';
import type { Resource } from '@/types';

// A hung API must not hold the HTML: past this the page renders without the list and the SPA loads as usual.
const SERVER_TIMEOUT_MS = 6_000;
const within = <T,>(p: Promise<T>): Promise<T> =>
  Promise.race([p, new Promise<never>((_, rej) => setTimeout(() => rej(new Error('server fetch timeout')), SERVER_TIMEOUT_MS))]);

export { mockRobots } from '@/lib/mockRoutes';

export const decodeSlug = (s: string): string => {
  try { return decodeURIComponent(s); } catch { return s; }
};

// The full list is ~15 upstream calls (3-4s cold). A Worker isolate outlives requests, so a short module-level memo
// keeps / , /resources and the sitemap fast. ponytail: per-isolate, not shared; move to the Workers Cache API if cold hits matter.
const LIST_TTL_MS = 5 * 60_000;
let memo: { at: number; list: Resource[] } | undefined;

// One fetch per request even though generateMetadata and the page both ask.
export const getResources = cache(async (): Promise<Resource[]> => {
  if (memo && Date.now() - memo.at < LIST_TTL_MS) return memo.list;
  try {
    const r = await within(fetchAllResources());
    if (r.ok && r.failed.length === 0) memo = { at: Date.now(), list: r.resources }; // never memoize a degraded list
    return r.resources;
  } catch { return []; }
});

// Resource = found, null = definitely unknown (-> real 404), undefined = cannot tell (mock mode or a source down:
// fail open and let the SPA decide, never 404 a real resource because an API blipped).
export const getResource = cache(async (slug: string): Promise<Resource | null | undefined> => {
  if (!PAYLOAD_API_URL) return undefined;
  try { return await within(fetchResourceBySlug(slug)); } catch { return undefined; }
});

export const openGraph = (o: { title: string; description: string; path: string; image?: string }): Metadata['openGraph'] => ({
  type: 'website',
  siteName: SITE_NAME,
  locale: 'ar_SA',
  title: `${o.title} | ${SITE_NAME}`,
  description: o.description,
  url: o.path,
  images: o.image ? [o.image] : undefined,
});

export function SeoBlock({ title, description, resources = [], heading }: {
  title: string; description?: string; resources?: Resource[]; heading?: string;
}) {
  return (
    <div className="container mx-auto px-4 py-16 space-y-4">
      <h1 className="text-3xl font-bold">{title}</h1>
      {description && <p>{description}</p>}
      {resources.length > 0 && (
        <>
          {heading && <h2 className="text-xl font-semibold">{heading}</h2>}
          <ul className="space-y-2">
            {resources.map((r) => (
              <li key={r.slug}>
                <a href={`/resources/${encodeURIComponent(r.slug)}`} className="font-medium underline">{r.title_ar}</a>
                {r.summary_ar && <span> - {r.summary_ar}</span>}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
