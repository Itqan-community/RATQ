'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useTranslations } from '@/i18n';
import { useTrendingResources } from '@/hooks/useTrendingResources';
import { ResourceCard } from './ResourceCard';
import type { TrendingResource, TrendingPeriod } from '@/types/announcement';
import type { Resource } from '@/types/resource';

export default function TrendingResources() {
  const t = useTranslations();
  const { resources, isLoading, period, setPeriod, periods } = useTrendingResources();

  if (resources.length === 0 && !isLoading) {
    return null;
  }

  const periodLabels: Record<string, string> = {
    '7d': t.trending.period7d,
    '30d': t.trending.period30d,
    'all-time': t.trending.periodAllTime,
  };

  const resourceCards = useMemo(() => {
    return resources.map((resource: TrendingResource, index: number) => ({
      resource,
      rank: index + 1,
      downloadCount: resource.downloads,
    }));
  }, [resources]);

  return (
    <section className="section-padding py-8" aria-label={t.trending.title}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-2xl font-bold text-[var(--text-primary)]">{t.trending.title}</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1" role="tablist" aria-label={t.trending.title}>
              {periods.map((p) => (
                <button
                  key={p}
                  role="tab"
                  aria-selected={period === p}
                  onClick={() => setPeriod(p as '7d' | '30d' | 'all-time')}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    period === p
                      ? 'bg-[var(--accent-primary)] text-white'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                  }`}
                >
                  {periodLabels[p]}
                </button>
              ))}
            </div>
            <Link
              href="/resources?sort=downloads"
              className="text-sm font-heading text-[var(--accent-primary)] hover:underline flex items-center gap-1"
            >
              {t.trending.browseAll}
              <svg className="w-3.5 h-3.5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-5 animate-pulse">
                <div className="h-5 bg-[var(--bg-secondary)] rounded w-20 mb-3" />
                <div className="h-6 bg-[var(--bg-secondary)] rounded w-3/4 mb-2" />
                <div className="h-4 bg-[var(--bg-secondary)] rounded w-full mb-2" />
                <div className="h-4 bg-[var(--bg-secondary)] rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {resourceCards.map(({ resource, rank, downloadCount }) => (
              <ResourceCard
                key={resource.id}
                resource={resource as Resource}
                rank={rank}
                downloadCount={downloadCount}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
