// Live RATQ pages with no design counterpart: /docs and /contributors. Copy comes from the `live` i18n
// namespace (extracted from live's messages/{en,ar}.json); contributors data is a copy of live's
// src/app/contributors/contributors-data.ts (hand-curated there too - keep in sync when a community PR merges).
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { contributors } from '@/lib/contributorsData';

export const DocsPage: React.FC = () => {
  const { t } = useTranslation('live');
  const sections = ['browse', 'publish', 'apiKeys', 'contribute'] as const;
  return (
    <main className="mx-auto max-w-3xl px-5 py-12 text-start">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-fg tracking-tight">{t('docs.title')}</h1>
      <p className="mt-4 text-fg-muted leading-8">{t('docs.intro')}</p>
      <div className="mt-8 space-y-6">
        {sections.map((s) => (
          <article key={s}>
            <h2 className="text-lg font-bold text-fg">{t(`docs.${s}.title`)}</h2>
            <p className="mt-1.5 text-fg-muted leading-8">{t(`docs.${s}.body`)}</p>
          </article>
        ))}
      </div>
    </main>
  );
};

export const ContributorsPage: React.FC = () => {
  const { t } = useTranslation('live');
  return (
    <main className="container mx-auto max-w-5xl px-4 py-12 text-start">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-fg tracking-tight">{t('contributors.pageTitle')}</h1>
      <p className="mt-4 max-w-3xl text-fg-muted leading-8">{t('contributors.subtitle')}</p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {contributors.map((c) => (
          <Card key={c.githubUsername} className="p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <a href={c.githubUrl} target="_blank" rel="noopener noreferrer" className="shrink-0">
                <img src={c.avatarUrl} alt={c.name} width={56} height={56} className="h-14 w-14 rounded-full object-cover" />
              </a>
              <a href={c.githubUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-fg hover:underline">
                {c.name}
              </a>
            </div>
            <p className="text-sm leading-7 text-fg-muted" dir="ltr">{c.contribution}</p>
            <div className="mt-auto flex flex-wrap gap-4 text-xs font-bold">
              <a href={c.issueUrl} target="_blank" rel="noopener noreferrer" className="text-ratq-700 hover:underline">
                {t('contributors.viewIssue')}
              </a>
              <a href={c.prUrl} target="_blank" rel="noopener noreferrer" className="text-ratq-700 hover:underline">
                {t('contributors.viewPr')}
              </a>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
};
