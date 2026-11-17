import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { IBM_Plex_Sans_Arabic, IBM_Plex_Mono, Amiri_Quran } from 'next/font/google';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/seoMeta';
import '@/styles/tokens.css';
import '@/styles/base.css';

// Self-hosted at build time (no render-blocking Google stylesheet); tokens.css reads these variables.
const plexAr = IBM_Plex_Sans_Arabic({ variable: '--font-plex-ar', subsets: ['latin', 'arabic'], weight: ['300', '400', '500', '600', '700'], display: 'swap' });
const plexMono = IBM_Plex_Mono({ variable: '--font-plex-mono', subsets: ['latin'], weight: ['400', '500'], display: 'swap' });
const amiriQuran = Amiri_Quran({ variable: '--font-amiri-quran', subsets: ['arabic'], weight: '400', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Same suffix as live's layout.tsx title template.
  title: { default: 'منصة مجتمع RATQ — مرجعك الموثوق لتطوير البرمجيات القرآنية', template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  openGraph: { type: 'website', siteName: SITE_NAME, locale: 'ar_SA', description: SITE_DESCRIPTION },
  icons: { icon: '/logo.png' },
  manifest: '/manifest.webmanifest',
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
