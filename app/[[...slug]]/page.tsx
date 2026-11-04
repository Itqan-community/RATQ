'use client';
import dynamic from 'next/dynamic';

// ponytail: client-only SPA shell (no SSR/SEO). Port to per-route server pages when real data lands.
const ClientApp = dynamic(() => import('../ClientApp'), { ssr: false });

export default function Page() {
  return <ClientApp />;
}
