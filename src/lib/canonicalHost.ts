import authPrefixes from '@/lib/authPrefixes.json';

export const CANONICAL_ORIGIN = 'https://ratq.itqan.dev';

// quran.tech is served by the same app for read-only browsing. The session cookie is SameSite=Lax on .ratq.itqan.dev,
// so pages that sign in or use the session must run on the canonical host. next.config.mjs covers full page loads from
// the same list; this covers in-app (client-side) navigation.
export function canonicalAuthUrl(hostname: string, pathname: string, search: string, hash: string): string | null {
  if (hostname !== 'quran.tech') return null;
  const needsSession = (authPrefixes as string[]).some((p) => pathname === `/${p}` || pathname.startsWith(`/${p}/`));
  return needsSession ? `${CANONICAL_ORIGIN}${pathname}${search}${hash}` : null;
}
