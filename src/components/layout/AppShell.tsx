// src/components/layout/AppShell.tsx
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';
import { CommandPalette } from './CommandPalette';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const location = useLocation();
  const isStandalone = location.pathname.startsWith('/ux-study');

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-fg transition-colors">
      {/* Skip to Content Accessibility Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-ratq-700 focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none"
      >
        تخطّ إلى المحتوى الرئيسي
      </a>

      {!isStandalone && (
        <SiteHeader onOpenCommandPalette={() => setCommandPaletteOpen(true)} />
      )}

      <main id="main-content" className="flex-1 w-full flex flex-col">
        {children}
      </main>

      {!isStandalone && <SiteFooter />}

      {!isStandalone && (
        <CommandPalette
          isOpen={commandPaletteOpen}
          onClose={() => setCommandPaletteOpen(false)}
        />
      )}
    </div>
  );
};
