import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BOOT_SCRIPT, PrefsProvider } from "@/lib/prefs";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AppearancePanel } from "@/components/AppearancePanel";
import { Chrome } from "@/components/Chrome";
import { Replay } from "@/components/Replay";

export const metadata: Metadata = {
  title: "منصة مجتمع RATQ — مرجعك الموثوق لتطوير البرمجيات القرآنية",
  description:
    "مرجعك الموثوق لتطوير البرمجيات القرآنية — كتالوج موثّق، شارات إتقان للجودة، مسارات وصول منظّمة، ومفاتيح API مُدارة.",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/logo.png" },
};
export const viewport: Viewport = { themeColor: "#946E37", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" data-palette="gold" data-font="suisse" data-radius="4px" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Amiri+Quran&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <PrefsProvider>
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-2 focus:bg-canvas">تخطّ إلى المحتوى الرئيسي</a>
          <Chrome><Header /></Chrome>
          {children}
          <Chrome><Footer /></Chrome>
          <AppearancePanel />
          <Replay />
        </PrefsProvider>
      </body>
    </html>
  );
}
