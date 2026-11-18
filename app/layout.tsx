import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { IBM_Plex_Sans_Arabic, IBM_Plex_Mono, Amiri_Quran } from 'next/font/google';
import { DEFAULT_OG_IMAGE, SITE_DESCRIPTION, SITE_NAME, SITE_NAME_AR, SITE_URL, ogImages } from '@/lib/seoMeta';
import { IS_BETA } from '@/lib/mockRoutes';
import '@/styles/tokens.css';
import '@/styles/base.css';

// Self-hosted at build time (no render-blocking Google stylesheet); tokens.css reads these variables.
const plexAr = IBM_Plex_Sans_Arabic({ variable: '--font-plex-ar', subsets: ['latin', 'arabic'], weight: ['300', '400', '500', '600', '700'], display: 'swap' });
const plexMono = IBM_Plex_Mono({ variable: '--font-plex-mono', subsets: ['latin'], weight: ['400', '500'], display: 'swap' });
const amiriQuran = Amiri_Quran({ variable: '--font-amiri-quran', subsets: ['arabic'], weight: '400', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Same suffix as live's layout.tsx title template.
  title: { default: `${SITE_NAME_AR} — مرجعك الموثوق لتطوير البرمجيات القرآنية`, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  openGraph: { type: 'website', siteName: SITE_NAME, locale: 'ar_SA', description: SITE_DESCRIPTION, images: ogImages() },
  twitter: { card: 'summary_large_image', images: [DEFAULT_OG_IMAGE] },
  icons: { icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }, { url: '/icon-192.png', sizes: '192x192', type: 'image/png' }], apple: '/icon-192.png' },
  manifest: '/manifest.webmanifest',
  robots: IS_BETA ? { index: false, follow: false } : undefined,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${plexAr.variable} ${plexMono.variable} ${amiriQuran.variable}`} data-palette="gold" data-font="suisse" data-radius="4px" suppressHydrationWarning>
      <body
        className="bg-canvas text-fg font-ui antialiased min-h-screen selection:bg-ratq-500 selection:text-white"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
