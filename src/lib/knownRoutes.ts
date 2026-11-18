// Paths the react-router table (src/router.tsx) serves, so the Next shell can answer unknown URLs with a real 404
// instead of a soft 200. src/test/seoRoutes.test.ts parses router.tsx and fails if this list drifts from it.
// Pure (no DOM, no fs): runs in the Cloudflare Worker.
import { matchPath } from 'react-router-dom';
import legacy from './legacyRedirects.json';
import { isHiddenRoute, isMockRoute } from './mockRoutes';

// Static pages under /resources that must win over the /resources/:slug detail route.
const RESERVED_RESOURCE_SLUGS = ['roadmap', 'wizard', 'stacks', 'preview-sections', 'preview-tree-explorer'];
export const isReservedResourceSlug = (slug: string): boolean => RESERVED_RESOURCE_SLUGS.includes(slug);

const PATTERNS = [
  '/', '/resources', '/resources/:slug', '/resources/stacks/tech-spec-table', '/stacks', '/stacks/tech-spec-table',
  '/categories', '/publishers', '/publishers/:slug',
  '/standards', '/standards/checklist', '/standards/revocations',
  '/licenses', '/about', '/roadmap', '/faq', '/ux-study', '/changelog', '/status',
  '/legal', '/legal/:slug', '/contact', '/docs', '/contributors',
  '/auth/sign-in', '/auth/sign-up', '/auth/forgot', '/reset-password', '/verify-email', '/oauth/callback', '/logout',
  '/app', '/app/requests', '/app/keys', '/app/saved', '/app/reports', '/app/comments', '/app/notifications', '/app/settings',
  '/publisher', '/publisher/resources', '/publisher/resources/new', '/publisher/resources/:id/edit',
  '/publisher/requests', '/publisher/analytics', '/publisher/claim', '/publisher/webhooks',
  '/review', '/review/:resourceId', '/moderation',
  '/admin', '/admin/users', '/admin/resources', '/admin/audit', '/admin/flags',
  '/403', '/500',
  ...Object.keys(legacy),
];

export const isResourceDetailPath = (pathname: string): boolean => {
  const m = pathname.match(/^\/resources\/([^/]+)\/?$/);
  return m !== null && !isReservedResourceSlug(m[1]);
};

// Indexable pages for sitemap.xml (resource URLs are appended from the API). Portals, auth and previews stay out.
// Mock-only pages (src/lib/mockRoutes.ts) carry invented data: never advertised to crawlers, whatever this list says.
export const PUBLIC_PATHS = [
  '/', '/resources', '/resources/roadmap', '/resources/wizard', '/resources/stacks', '/categories', '/publishers',
  '/standards', '/licenses', '/about', '/roadmap', '/faq', '/changelog', '/status', '/docs', '/contributors',
  '/contact', '/legal',
].filter((p) => !isMockRoute(p));

// Hidden (mock-only on production) paths count as unknown, so the server answers them with a real 404.
export const isKnownPath = (pathname: string): boolean =>
  !isHiddenRoute(pathname) && PATTERNS.some((p) => matchPath({ path: p, end: true }, pathname) !== null);
