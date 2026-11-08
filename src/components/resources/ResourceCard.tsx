// src/components/resources/ResourceCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Resource } from '@/types';
import { ItqanBadge } from '@/components/ui/ItqanBadge';
import { LicenseBadge } from '@/components/ui/LicenseBadge';
import { AccessBadge } from '@/components/ui/AccessBadge';
import { RatingStars } from '@/components/ui/RatingStars';
import { ArrowLeft, Package, Download } from 'lucide-react';
import { clsx } from 'clsx';
import { ResourceAppBadges } from '@/components/resources/ResourceAppBadges';
import { getAppsUsingResource } from '@/lib/appEcosystem';

export interface ResourceCardProps {
  resource: Resource;
  viewMode?: 'grid' | 'list';
  showEnglishTitle?: boolean;
  isCompact?: boolean;
  showAppUsages?: boolean;
}

interface ResourceCardTitleProps {
  titleAr: string;
  titleEn?: string;
  slug: string;
  showEnglishTitle?: boolean;
  isCompact?: boolean;
}

const ResourceCardTitle: React.FC<ResourceCardTitleProps> = ({
  titleAr,
  titleEn,
  slug,
  showEnglishTitle,
  isCompact,
}) => {
  const [isTruncated, setIsTruncated] = React.useState(false);
  const titleSpanRef = React.useRef<HTMLSpanElement>(null);

  const checkTruncation = React.useCallback(() => {
    if (titleSpanRef.current) {
      const { scrollWidth, clientWidth } = titleSpanRef.current;
      if (clientWidth > 0) {
        setIsTruncated(scrollWidth > clientWidth);
      } else {
        // Fallback for headless testing environments without layout engine
        setIsTruncated(titleAr.length > 32);
      }
    }
  }, [titleAr]);

  React.useEffect(() => {
    checkTruncation();
    window.addEventListener('resize', checkTruncation);
    return () => window.removeEventListener('resize', checkTruncation);
  }, [checkTruncation]);

  return (
    <div
      className="relative group/title min-w-0"
      onMouseEnter={checkTruncation}
    >
      <Link
        to={`/resources/${slug}`}
        className="block group-hover:text-ratq-700 transition-colors truncate"
        title={isTruncated ? titleAr : undefined}
      >
        <h3
          className={clsx(
            'font-bold text-fg leading-snug flex items-center min-w-0',
            isCompact ? 'text-sm gap-1.5' : 'text-base gap-2'
          )}
        >
          <Package className="w-4 h-4 text-ratq-600 shrink-0" />
          <span ref={titleSpanRef} className="truncate">
            {titleAr}
          </span>
        </h3>
        {showEnglishTitle && titleEn && (
          <p className="text-2xs font-mono text-fg-subtle mt-0.5 truncate">{titleEn}</p>
        )}
      </Link>

      {/* Quick Floating Tooltip: Only rendered and shown for truncated titles ending with ellipsis */}
      {isTruncated && (
        <div
          role="tooltip"
          className="pointer-events-none opacity-0 invisible group-hover/title:opacity-100 group-hover/title:visible transition-none absolute bottom-full start-0 mb-1.5 z-30 max-w-xs sm:max-w-sm px-2.5 py-1 rounded-lg bg-slate-900/95 dark:bg-slate-800 text-white text-xs font-medium shadow-lg border border-slate-700/60 leading-normal"
        >
          عنوان المورد: {titleAr}
          <div className="absolute top-full start-4 -mt-px border-4 border-t-slate-900/95 dark:border-t-slate-800 border-x-transparent border-b-transparent" />
        </div>
      )}
    </div>
  );
};

export const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  viewMode = 'grid',
  showEnglishTitle = false,
  isCompact = false,
  showAppUsages = true,
}) => {
  const isList = viewMode === 'list';
  const appUsages = showAppUsages
    ? getAppsUsingResource(resource.slug, resource.title_ar)
    : [];

  // Compact Mode (Proposal 1: Clean Identity & Purpose)
  if (isCompact) {
    return (
      <article
        className={clsx(
          'group rounded-xl border border-border bg-canvas p-3.5 sm:p-4 transition-all duration-200 text-start',
          'hover:border-ratq-400 hover:shadow-xs dark:hover:border-ratq-700 flex flex-col justify-between gap-2.5',
          isList && 'sm:flex-row sm:items-center sm:gap-4'
        )}
      >
        <div className="flex-1 min-w-0">
          {/* Header: Title */}
          <div className="mb-1.5">
            <ResourceCardTitle
              titleAr={resource.title_ar}
              titleEn={resource.title_en}
              slug={resource.slug}
              showEnglishTitle={false}
              isCompact={true}
            />
          </div>

          {/* Single-line Core Purpose */}
          <p className="text-xs text-fg-muted line-clamp-1 leading-relaxed">
            {resource.summary_ar}
          </p>

          {/* Compact App Usages */}
          {showAppUsages && appUsages.length > 0 && (
            <div className="mt-2 pt-1.5 border-t border-border-subtle/50">
              <ResourceAppBadges apps={appUsages} maxDisplay={6} showLabel={false} size="sm" />
            </div>
          )}
        </div>

        {/* Minimal Footer: License and Details Link */}
        <div
          className={clsx(
            'flex items-center justify-between text-2xs text-fg-subtle pt-2 border-t border-border-subtle/70 mt-1',
            isList && 'sm:pt-0 sm:border-t-0 sm:mt-0 sm:shrink-0 sm:gap-4'
          )}
        >
          <LicenseBadge licenseId={resource.license_id} spdx={resource.license_spdx} size="sm" />

          <Link
            to={`/resources/${resource.slug}`}
            className="inline-flex items-center gap-1 font-semibold text-xs text-ratq-700 hover:text-ratq-800 transition-colors shrink-0"
          >
            <span>التفاصيل</span>
            <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0 rotate-180 transition-transform group-hover:-translate-x-0.5" />
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article
      className={clsx(
        'group rounded-xl border border-border bg-canvas p-5 transition-all duration-200 text-start',
        'hover:border-ratq-300 hover:shadow-md dark:hover:border-ratq-800 flex flex-col justify-between',
        isList && 'sm:flex-row sm:items-center sm:gap-6'
      )}
    >
      <div className="flex-1 min-w-0">
        {/* Header: Badges & Version */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <ItqanBadge level={resource.itqan_level} size="sm" />
            <AccessBadge level={resource.access_level} />
            <LicenseBadge licenseId={resource.license_id} spdx={resource.license_spdx} />
          </div>

          {resource.latest_version && (
            <span className="text-[11px] font-mono text-fg-subtle bg-muted px-2 py-0.5 rounded">
              v{resource.latest_version}
            </span>
          )}
        </div>

        {/* Title and Short Description */}
        <ResourceCardTitle
          titleAr={resource.title_ar}
          titleEn={resource.title_en}
          slug={resource.slug}
          showEnglishTitle={showEnglishTitle}
          isCompact={false}
        />

        <p className="text-xs text-fg-muted mt-2 line-clamp-2 leading-relaxed">
          {resource.summary_ar}
        </p>

        {/* Tech Stack Chips */}
        {resource.tech_stack && resource.tech_stack.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 mt-3">
            {resource.tech_stack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="text-[10px] font-mono text-fg-subtle bg-subtle px-1.5 py-0.5 rounded border border-border-subtle"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Apps using this resource */}
        {showAppUsages && appUsages.length > 0 && (
          <div className="mt-2.5">
            <ResourceAppBadges apps={appUsages} maxDisplay={6} showLabel={false} size="sm" />
          </div>
        )}
      </div>

      {/* Footer Info & Action */}
      <div
        className={clsx(
          'mt-4 pt-3 border-t border-border-subtle flex items-center justify-between text-2xs text-fg-subtle',
          isList && 'sm:mt-0 sm:pt-0 sm:border-t-0 sm:flex-col sm:items-end sm:justify-center sm:gap-2 sm:shrink-0'
        )}
      >
        {/* Payload has no ratings/downloads: live resources hide them instead of showing zeros. */}
        {resource.id.startsWith('payload_') ? (
          <div />
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <RatingStars rating={resource.rating_avg} size={12} />
              <span className="font-semibold text-fg">({resource.rating_avg})</span>
            </div>

            <div className="flex items-center gap-1">
              <Download className="w-3 h-3 text-fg-subtle" />
              <span>{resource.downloads_count.toLocaleString()}</span>
            </div>
          </div>
        )}

        <Link
          to={`/resources/${resource.slug}`}
          className="inline-flex items-center gap-1 font-semibold text-xs text-ratq-700 hover:text-ratq-800 transition-colors"
        >
          <span>التفاصيل</span>
          <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0 rotate-180 transition-transform group-hover:-translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
};
