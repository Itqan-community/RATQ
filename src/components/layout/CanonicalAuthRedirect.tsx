import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { canonicalAuthUrl } from '@/lib/canonicalHost';

// Renders nothing: moves quran.tech visitors to ratq.itqan.dev when client-side navigation reaches a session page.
export const CanonicalAuthRedirect = () => {
  const { pathname, search, hash } = useLocation();
  useEffect(() => {
    const target = canonicalAuthUrl(window.location.hostname, pathname, search, hash);
    if (target) window.location.replace(target);
  }, [pathname, search, hash]);
  return null;
};
