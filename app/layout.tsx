import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '@/styles/tokens.css';
import '@/styles/base.css';

export const metadata: Metadata = {
  title: 'منصة مجتمع RATQ — مرجعك الموثوق لتطوير البرمجيات القرآنية',
  description:
    'مرجعك الموثوق لتطوير البرمجيات القرآنية — كتالوج موثّق، شارات إتقان للجودة، مسارات وصول منظّمة، ومفاتيح API مُدارة.',
  icons: { icon: '/logo.png' },
  manifest: '/manifest.webmanifest',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" data-palette="gold" data-font="suisse" data-radius="4px" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&family=Amiri+Quran&display=swap"
        />
      </head>
      <body
        className="bg-canvas text-fg font-ui antialiased min-h-screen selection:bg-ratq-500 selection:text-white"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
