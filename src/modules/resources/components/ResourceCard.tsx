'use client';

import Link from 'next/link';
import type { Resource } from '@/types/resource';
import { useLanguage } from '@/shared/ui/i18n';
import { RESOURCE_TYPE_COLORS } from '@/shared/constants/resource-type-colors';
import { TypeIcon } from '@/shared/constants/resource-type-icon';

interface ResourceCardProps {
  resource: Resource;
  rank?: number;
  downloadCount?: number;
}

// Use the shared color map so type badges always match across card, detail page,
// and filter panel.
const typeStyles = RESOURCE_TYPE_COLORS;

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

      {resource.image_url && (
        <div className="relative -mx-5 -mt-5 mb-4 h-32 overflow-hidden rounded-t-[13px]">
          <img src={resource.image_url} alt="" className="h-full w-full object-cover" />
        </div>
      )}

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
