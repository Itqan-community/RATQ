// Routes whose views read no hydrated API data, so they can render before hydrateResources resolves.
const STATIC_ROOTS = ['/about', '/contact', '/docs', '/contributors', '/faq', '/legal', '/privacy', '/standards'];

export const isStaticPath = (pathname: string): boolean =>
  STATIC_ROOTS.some((r) => pathname === r || pathname.startsWith(r + '/'));
