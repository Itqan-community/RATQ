import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seoMeta';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/app/', '/publisher/', '/review/', '/moderation/', '/admin/', '/search', '/auth/', '/api/'] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
