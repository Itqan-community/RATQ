'use client';

import { useLanguage } from '@/shared/ui/i18n';
import { contributors } from './contributors-data';

export default function ContributorsPage() {
  const { t, direction } = useLanguage();

  return (
    <main
      className="page-enter relative isolate min-h-screen bg-[linear-gradient(145deg,#EBEFF0_0%,#F7F9FA_48%,#D8E8F5_100%)] bg-fixed pb-20 pt-32 text-black"
      dir={direction}
    >
      <section className="relative z-10 mx-auto max-w-[1480px] px-3 sm:px-4">
        <div className="px-3 pb-10 pt-16 sm:px-10 sm:pt-24 lg:px-16 lg:pb-12 lg:pt-28">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-black leading-[1.2] text-black sm:text-5xl">
              {t.contributors.pageTitle}
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[#59636d] sm:text-lg sm:leading-9">
              {t.contributors.subtitle}
            </p>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto mt-10 max-w-[980px] px-5">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {contributors.map((contributor) => (
            <article
              key={contributor.githubUsername}
              className="flex flex-col gap-4 rounded-lg border border-[#ededed] bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.035)]"
            >
              <div className="flex items-center gap-3">
                <a
                  href={contributor.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- external GitHub avatar, not part of the local image pipeline */}
                  <img
                    src={contributor.avatarUrl}
                    alt={contributor.name}
                    width={56}
                    height={56}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                </a>
                <a
                  href={contributor.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-black text-black hover:underline"
                >
                  {contributor.name}
                </a>
              </div>

              <p className="text-sm leading-7 text-[#59636d]" dir="ltr">
                {contributor.contribution}
              </p>

              <div className="mt-auto flex flex-wrap gap-4 text-xs font-black">
                <a
                  href={contributor.issueUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#171717] hover:underline"
                >
                  {t.contributors.viewIssue}
                </a>
                <a
                  href={contributor.prUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#171717] hover:underline"
                >
                  {t.contributors.viewPr}
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
