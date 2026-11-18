// Site logo: a directory grid whose fourth tile is an eight-point star, plus the bilingual name.
// Drawn in currentColor so it follows the theme in light and dark (public/favicon.svg is the same mark).
import React from 'react';
import { SITE_NAME, SITE_NAME_AR } from '@/lib/seoMeta';

export const BrandMark: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 48 48" aria-hidden="true" className={`shrink-0 text-qtd-600 dark:text-qtd-400 ${className}`} fill="currentColor">
    <rect x="5" y="5" width="17" height="17" rx="3" opacity=".35" />
    <rect x="26" y="26" width="17" height="17" rx="3" opacity=".35" />
    <rect x="5" y="26" width="17" height="17" rx="3" opacity=".6" />
    <rect x="28" y="7" width="13" height="13" />
    <rect x="28" y="7" width="13" height="13" transform="rotate(45 34.5 13.5)" />
  </svg>
);

// `nameClassName` lets a tight spot (the header) show the mark alone below a breakpoint.
export const BrandLogo: React.FC<{ className?: string; markClassName?: string; nameClassName?: string }> = ({ className = '', markClassName = 'h-8 w-8', nameClassName = 'flex' }) => (
  <span className={`inline-flex items-center gap-2 ${className}`}>
    <BrandMark className={markClassName} />
    <span className={`${nameClassName} flex-col leading-tight text-start`}>
      <span className="text-sm font-bold text-fg whitespace-nowrap">{SITE_NAME_AR}</span>
      <span className="text-[10px] font-medium tracking-wide text-fg-muted whitespace-nowrap" dir="ltr">{SITE_NAME}</span>
    </span>
  </span>
);
