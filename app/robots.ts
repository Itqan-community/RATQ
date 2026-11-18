import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seoMeta';
import { IS_BETA } from '@/lib/mockRoutes';

export default function robots(): MetadataRoute.Robots {
  if (IS_BETA) return { rules: { userAgent: '*', disallow: '/' } };
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/app/', '/publisher/', '/review/', '/moderation/', '/admin/', '/search', '/auth/', '/api/'] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
