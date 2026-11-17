import type { MetadataRoute } from 'next';
import { getResources } from './seo';
import { PUBLIC_PATHS } from '@/lib/knownRoutes';
import { SITE_URL } from '@/lib/seoMeta';

export const runtime = 'edge';
export const dynamic = 'force-dynamic'; // resource URLs come from the live APIs; a build-time snapshot would go stale

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const resources = await getResources(); // [] when a source is down: the static pages still list
  return [
    ...PUBLIC_PATHS.map((p) => ({ url: `${SITE_URL}${p}` })),
    ...resources.map((r) => ({
      url: `${SITE_URL}/resources/${encodeURIComponent(r.slug)}`,
      lastModified: r.updated_at || undefined,
    })),
  ];
}
