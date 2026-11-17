'use client';
import { useEffect, useState, type ComponentType, type ReactNode } from 'react';

// The design is a client-only react-router SPA. `seo` is server-rendered into the initial HTML (crawlers, link
// previews, no-JS) and stays on screen until the SPA chunk has loaded, then the SPA replaces it.
export function SpaShell({ seo }: { seo?: ReactNode }) {
  const [App, setApp] = useState<ComponentType | null>(null);
  useEffect(() => {
    void import('./ClientApp').then((m) => setApp(() => m.default));
  }, []);
  return App ? <App /> : <>{seo}</>;
}
