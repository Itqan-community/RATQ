'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Resource, ResourceType } from '@/types/resource';
import { useLanguage } from '@/shared/ui/i18n';

interface ResourceCardProps {
  resource: Resource;
  rank?: number;
  downloadCount?: number;
}

const typeStyles: Record<ResourceType, string> = {
  library: 'bg-[#e7ef3e]',
  sdk: 'bg-[#28b8f4]',
  dataset: 'bg-[#20df78]',
  api: 'bg-[#ff9c44]',
  tafsir: 'bg-[#17e4ad]',
  audio: 'bg-[#f4a7cd]',
  pdf: 'bg-[#ff8a80]',
  json: 'bg-[#8de5a1]',
  // CMS-sourced categories
  recitation: 'bg-[#a78bfa]',
  mushaf: 'bg-[#6ee7b7]',
  program: 'bg-[#67e8f9]',
  linguistic: 'bg-[#bef264]',
  translation: 'bg-[#7dd3fc]',
  font: 'bg-[#f0abfc]',
  search: 'bg-[#fde047]',
  tajweed: 'bg-[#fda4af]',
};

// CMS-derived categories share one generic "asset" icon instead of
// bespoke artwork per category - add a dedicated icon if a category needs one.
const genericIcon = <><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 9h16M9 4v16"/></>;

function TypeIcon({ type }: { type: ResourceType }) {
  const common = 'h-4 w-4';
  const icons: Record<ResourceType, ReactNode> = {
    library: <><path d="M6 4h11a2 2 0 0 1 2 2v13H8a2 2 0 0 1-2-2V4Z"/><path d="M8 19a2 2 0 0 1 0-4h11M9 8h6"/></>,
    sdk: <><path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14"/></>,
    dataset: <><rect x="4" y="5" width="16" height="14" rx="1"/><path d="M4 10h16M10 5v14"/></>,
    api: <><path d="M8 9 4 12l4 3M16 9l4 3-4 3M14 5l-4 14"/></>,
    tafsir: <><path d="M12 3v18M5 7l14 10M19 7 5 17"/></>,
    audio: <><path d="M9 18V5l10-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="16" cy="16" r="3"/></>,
    pdf: <><path d="M6 3h9l3 3v15H6z"/><path d="M14 3v4h4M9 13h6M9 17h4"/></>,
    json: <><path d="M9 4c-2 0-3 1-3 3v2c0 2-1 3-3 3 2 0 3 1 3 3v2c0 2 1 3 3 3M15 4c2 0 3 1 3 3v2c0 2 1 3 3 3-2 0-3 1-3 3v2c0 2-1 3-3 3"/></>,
    recitation: genericIcon,
    mushaf: genericIcon,
    program: genericIcon,
    linguistic: genericIcon,
    translation: genericIcon,
    font: genericIcon,
    search: genericIcon,
    tajweed: genericIcon,
  };

  return (
    <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      {icons[type]}
    </svg>
  );
}

const sourceLabel: Record<Resource['source'], { ar: string; en: string }> = {
  ratq: { ar: 'تجريبي', en: 'Demo' },
  cms: { ar: 'CMS مباشر', en: 'Live CMS' },
  payload: { ar: 'Payload مباشر', en: 'Live Payload' },
};

function formatDownloads(count: number, arabic: boolean) {
  if (count >= 1000) {
    const value = Math.round(count / 100) / 10;
    return arabic ? `${value} ألف` : `${value}k`;
  }
  return String(count);
}

export function ResourceCard({ resource, rank, downloadCount }: ResourceCardProps) {
  const { locale, t } = useLanguage();
  const isArabic = locale === 'ar';
  const downloads = downloadCount ?? resource.total_downloads ?? resource.downloads ?? 0;
  const description = resource.short_description || resource.description;
  // undefined for TrendingResource callers, which don't carry a source
  // (TrendingResources.tsx force-casts to Resource) - show nothing rather
  // than a confidently wrong label.
  const sourceInfo = sourceLabel[resource.source];

  return (
    <article className="group relative flex min-h-[305px] flex-col rounded-[13px] border border-[#e7e7e7] bg-white p-5 text-start transition duration-200 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(15,23,42,0.08)]">
      {/* Stretched link: sits above the plain content (z-10) so the whole
          card is clickable, but below the GitHub button (z-20), which stays
          a real, separately-clickable control - nesting a <button> inside
          this <a> would be invalid HTML. */}
      <Link
        href={`/resources/${resource.slug}`}
        aria-label={resource.name}
        className="absolute inset-0 z-10 rounded-[13px]"
      />

      {rank != null && (
        <span aria-label={`Rank ${rank}`} className="mb-3 text-sm font-black text-[#171717]">
          #{rank}
        </span>
      )}

      <div className="flex items-center justify-between gap-3">
        {resource.itqan_badge ? (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#171717] text-white" title={t.resource.itqanBadge}>
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="m6 12 4 4 8-9" />
            </svg>
          </span>
        ) : <span />}
        <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black text-black ${typeStyles[resource.type]}`}>
          <TypeIcon type={resource.type} />
          {t.catalog.types[resource.type]}
        </span>
      </div>

      <h3 className="mt-5 line-clamp-2 text-xl font-black leading-8 text-black">
        {resource.name}
      </h3>
      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-7 text-[#8b8b8b]">
        {description}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold text-[#b5b5b5]" dir="ltr">
        <span>{resource.license || '—'}</span>
        {resource.version && <span>{resource.version}</span>}
        <span className="inline-flex items-center gap-1">
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M12 3v12m0 0 4-4m-4 4-4-4"/><path d="M5 19h14"/>
          </svg>
          {formatDownloads(downloads, isArabic)}
        </span>
        {sourceInfo && (
          <span className={resource.source === 'cms' ? 'text-emerald-600' : 'text-[#b5b5b5]'}>
            {isArabic ? sourceInfo.ar : sourceInfo.en}
          </span>
        )}
        {resource.github_url && (
          <a
            href={resource.github_url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            onClick={(e) => e.stopPropagation()}
            className="relative z-20 inline-flex h-6 w-6 items-center justify-center rounded-full text-[#b5b5b5] transition hover:bg-[#f7f7f7] hover:text-black"
          >
            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
        )}
      </div>
    </article>
  );
}
