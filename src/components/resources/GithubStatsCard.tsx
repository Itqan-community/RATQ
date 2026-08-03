'use client';

import { formatDate } from '@/lib/utils';
import type { GithubStats } from '@/types/resource';
import { useLanguage } from '@/i18n';

interface GithubStatsCardProps {
  githubUrl: string;
  stats: GithubStats | null;
}

export function GithubStatsCard({ githubUrl, stats }: GithubStatsCardProps) {
  const { locale } = useLanguage();
  const hasGithubLink = githubUrl !== '#';
  const items = [
    { label: locale === 'ar' ? 'النجوم' : 'Stars', value: stats?.stars ?? 0, icon: '★' },
    { label: locale === 'ar' ? 'التفرعات' : 'Forks', value: stats?.forks ?? 0, icon: '⌘' },
    { label: locale === 'ar' ? 'القضايا المفتوحة' : 'Open issues', value: stats?.open_issues ?? 0, icon: '▲' },
    {
      label: locale === 'ar' ? 'آخر تحديث' : 'Last update',
      value: stats ? formatDate(stats.last_commit, locale) : '—',
      icon: '◷',
    },
  ];

  return (
    <section
      className="block min-h-[190px] w-full overflow-hidden rounded-[14px] border border-[#36b96b] p-5 text-white shadow-[0_10px_30px_rgba(31,163,88,0.18)]"
      style={{ background: "radial-gradient(circle at 8% 90%, #49d06f 0%, transparent 38%), radial-gradient(circle at 92% 18%, #42b9ae 0%, transparent 40%), #07100d" }}
      aria-labelledby="github-statistics-title"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="github-statistics-title" className="flex items-center gap-2 text-xl font-black">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          {locale === 'ar' ? 'إحصائيات GitHub' : 'GitHub statistics'}
        </h2>
        {hasGithubLink && (
          <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="rounded-full bg-white px-5 py-2 text-xs font-black text-black">
            {locale === 'ar' ? 'تصفح GitHub' : 'View GitHub'}
          </a>
        )}
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="rounded-xl bg-white/25 p-4 backdrop-blur-sm">
            <dt className="text-xs font-bold text-white/85">{item.icon} {item.label}</dt>
            <dd className="mt-2 text-xl font-black">{item.value}</dd>
          </div>
        ))}
      </dl>

      {!stats && (
        <p className="mt-3 text-xs text-white/75">
          {locale === 'ar' ? 'لم يتم ربط إحصائيات GitHub لهذا المورد بعد.' : 'GitHub statistics have not been connected for this resource yet.'}
        </p>
      )}
    </section>
  );
}


