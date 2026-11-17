// Repo topics + recent commits, as cached by the Payload cron on the resource doc (no client GitHub API calls).
import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatDate } from '@/lib/format';
import { isHttpUrl } from '@/lib/resourceMapping';
import type { Resource } from '@/types';

export const GithubRepoPreview: React.FC<{ resource: Pick<Resource, 'github_topics' | 'github_commits'> }> = ({ resource }) => {
  const { t } = useTranslation('site');
  const topics = resource.github_topics ?? [];
  const commits = resource.github_commits ?? [];
  if (!topics.length && !commits.length) return null;

  return (
    <section aria-labelledby="gh-preview-title" className="p-5 rounded-xl border border-border bg-canvas">
      <h3 id="gh-preview-title" className="text-sm font-bold text-fg mb-3">{t('detail.gh_preview')}</h3>
      {topics.length > 0 && (
        <ul className="flex flex-wrap gap-2 mb-4">
          {topics.map((topic) => (
            <li key={topic} dir="ltr" className="px-2.5 py-1 rounded-full bg-muted text-2xs font-mono text-fg">{topic}</li>
          ))}
        </ul>
      )}
      {commits.length > 0 && (
        <>
          <h4 className="text-xs font-bold text-fg-subtle mb-2">{t('detail.gh_commits')}</h4>
          <ul className="divide-y divide-border-subtle">
            {commits.map((c) => (
              <li key={c.sha} className="py-2.5 first:pt-0 last:pb-0 text-xs">
                {isHttpUrl(c.url) ? (
                  <a href={c.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-fg hover:underline">
                    {c.message || c.sha.slice(0, 7)}
                  </a>
                ) : (
                  <span className="font-semibold text-fg">{c.message || c.sha.slice(0, 7)}</span>
                )}
                <div className="mt-1 flex flex-wrap gap-x-3 text-2xs text-fg-subtle">
                  <span>{c.author}</span>
                  <span>{formatDate(c.date)}</span>
                  <span dir="ltr" className="font-mono">{c.sha.slice(0, 7)}</span>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
};
