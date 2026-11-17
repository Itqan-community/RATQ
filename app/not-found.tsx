import type { Metadata } from 'next';
import { SpaShell } from './SpaShell';

export const metadata: Metadata = { title: 'Page Not Found', robots: { index: false, follow: false } };

// Served with a real 404 status. The SPA mounts on top and renders its own (translated) not-found view for the URL.
export default function NotFound() {
  return <SpaShell seo={<div className="container mx-auto px-4 py-16"><h1 className="text-3xl font-bold">الصفحة غير موجودة</h1></div>} />;
}
