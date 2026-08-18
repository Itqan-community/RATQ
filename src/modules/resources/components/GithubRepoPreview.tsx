'use client';

import { formatDate } from '@/shared/utils/utils';
import { useLanguage } from '@/shared/ui/i18n';
import type { GithubRepoPreview as GithubRepoPreviewData } from '@/types/resource';

interface GithubRepoPreviewProps {
  repoPreview: GithubRepoPreviewData | null;
}

export function GithubRepoPreview({ repoPreview }: GithubRepoPreviewProps) {
  const { t, locale } = useLanguage();

  if (!repoPreview) return null;

  const copy = t.resource.detail.githubPreview;
  const hasTopics = repoPreview.topics.length > 0;
  const hasCommits = repoPreview.commits.length > 0;

  return (
    <section
      className="mt-6 rounded-xl border border-[#e5e5e5] bg-white p-6 text-start"
      aria-labelledby="github-repo-preview-title"
    >
      <h2 id="github-repo-preview-title" className="text-xl font-black">
        {copy.title}
      </h2>

      {hasTopics && (
        <div className="mt-5">
          <h3 className="text-sm font-black">{copy.topics}</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {repoPreview.topics.map((topic) => (
              <li
                key={topic}
                className="rounded-full bg-[#f4f4f4] px-3 py-1 text-xs font-semibold text-[#333]"
                dir="ltr"
              >
                {topic}
              </li>
            ))}
          </ul>
        </div>
      )}

      {hasCommits && (
        <div className={hasTopics ? 'mt-6' : 'mt-5'}>
          <h3 className="text-sm font-black">{copy.recentCommits}</h3>
          <ul className="mt-3 divide-y divide-[#ededed]">
            {repoPreview.commits.map((commit) => (
              <li key={commit.sha} className="py-3 first:pt-0 last:pb-0">
                <a
                  href={commit.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-[#111] hover:underline"
                >
                  {commit.message || commit.sha.slice(0, 7)}
                </a>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#777]">
                  <span>{commit.author}</span>
                  <span>{formatDate(commit.date, locale)}</span>
                  <a
                    href={commit.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#36b96b] hover:underline"
                    dir="ltr"
                  >
                    {copy.viewCommit}
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
