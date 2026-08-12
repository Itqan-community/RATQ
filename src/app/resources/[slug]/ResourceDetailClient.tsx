'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { formatDate } from '@/shared/utils/utils';
import { GithubStatsCard } from '@/modules/resources/components/GithubStatsCard';
import { TrustedBySection } from '@/modules/resources/components/TrustedBySection';
import { useLanguage } from '@/shared/ui/i18n';
import type { Resource, ResourceType } from '@/types/resource';
import arabicDescriptions from '@/shared/ui/i18n/resource-descriptions.ar.json';

interface ResourceDetailClientProps {
  resource: Resource;
}

const typeColors: Record<ResourceType, string> = {
  library: 'bg-[#e7ef3e]', sdk: 'bg-[#28b8f4]', dataset: 'bg-[#20df78]', api: 'bg-[#ff9c44]',
  tafsir: 'bg-[#17e4ad]', audio: 'bg-[#f4a7cd]', pdf: 'bg-[#ff8a80]', json: 'bg-[#8de5a1]',
  recitation: 'bg-[#a78bfa]', mushaf: 'bg-[#6ee7b7]', program: 'bg-[#67e8f9]', linguistic: 'bg-[#bef264]',
  translation: 'bg-[#7dd3fc]', font: 'bg-[#f0abfc]', search: 'bg-[#fde047]', tajweed: 'bg-[#fda4af]',
};

const genericTypeIcon = <><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 9h16M9 4v16"/></>;

function TypeIcon({ type }: { type: ResourceType }) {
  const paths: Record<ResourceType, ReactNode> = {
    library: <><path d="M6 4h11a2 2 0 0 1 2 2v13H8a2 2 0 0 1-2-2V4Z"/><path d="M8 19a2 2 0 0 1 0-4h11M9 8h6"/></>,
    sdk: <><path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14"/></>,
    dataset: <><rect x="4" y="5" width="16" height="14" rx="1"/><path d="M4 10h16M10 5v14"/></>,
    api: <><path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14"/></>,
    tafsir: <><path d="M12 3v18M5 7l14 10M19 7 5 17"/></>,
    audio: <><path d="M9 18V5l10-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="16" cy="16" r="3"/></>,
    pdf: <><path d="M6 3h9l3 3v15H6z"/><path d="M14 3v4h4M9 13h6"/></>,
    json: <><path d="M9 4c-2 0-3 1-3 3v2c0 2-1 3-3 3 2 0 3 1 3 3v2c0 2 1 3 3 3M15 4c2 0 3 1 3 3v2c0 2 1 3 3 3-2 0-3 1-3 3v2c0 2-1 3-3 3"/></>,
    recitation: genericTypeIcon, mushaf: genericTypeIcon, program: genericTypeIcon, linguistic: genericTypeIcon,
    translation: genericTypeIcon, font: genericTypeIcon, search: genericTypeIcon, tajweed: genericTypeIcon,
  };
  return <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">{paths[type]}</svg>;
}

function InfoItem({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return <div className="flex items-center gap-3 text-sm"><span className="text-[#777]">{icon}</span><span><strong>{label}:</strong> {value}</span></div>;
}

const smallIcon = (path: ReactNode) => <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>{path}</svg>;

export function ResourceDetailClient({ resource }: ResourceDetailClientProps) {
  const { t, locale, direction } = useLanguage();
  const arabicCopy = arabicDescriptions[resource.slug as keyof typeof arabicDescriptions];
  const localizedDescription = locale === 'ar' && arabicCopy ? arabicCopy.description : resource.description;

  return (
    <div className="bg-white pb-10 pt-32 text-black sm:pt-36" dir={direction}>
      <main className="mx-auto max-w-[1050px] px-4 sm:px-6">
        <header className="mx-auto max-w-[760px] text-start lg:ms-auto lg:me-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black ${typeColors[resource.type]}`}><TypeIcon type={resource.type}/>{t.catalog.types[resource.type]}</span>
            {resource.itqan_badge && <span className="inline-flex h-9 items-center rounded-full bg-[#171717] px-4 text-xs font-black text-white">إتقان</span>}
          </div>
          <h1 className="mt-5 text-3xl font-black leading-[1.4] sm:text-4xl">{resource.name}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-[#aaa]" dir="ltr">
            <span>{resource.license}</span><span>{resource.version || '—'}</span>
            <span className="inline-flex items-center gap-1">{smallIcon(<><path d="M12 3v12m0 0 4-4m-4 4-4-4"/><path d="M5 19h14"/></>)} {resource.total_downloads}</span>
          </div>
        </header>

        <div className="mt-7 grid items-start gap-8 lg:grid-cols-[270px_minmax(0,1fr)]" dir="ltr">
          <aside className="space-y-4" dir={direction}>
            {resource.consumers && resource.consumers.length > 0 && <TrustedBySection consumers={resource.consumers}/>}
            <section className="rounded-xl border border-[#e6e6e6] bg-white p-5">
              <h2 className="text-sm font-black">{t.resource.detail.quickSummary}</h2>
              <ul className="mt-4 space-y-3 text-xs">
                <li className="flex items-center justify-between"><span>{t.resource.detail.status}</span><strong>{t.resource.detail.published}</strong></li>
                <li className="flex items-center justify-between"><span>{t.resource.detail.license}</span><strong>{resource.license}</strong></li>
                <li className="flex items-center justify-between"><span>{t.resource.detail.itqanCertified}</span><strong>{resource.itqan_badge ? t.resource.detail.yes : t.resource.detail.no}</strong></li>
              </ul>
            </section>
          </aside>

          <div className="min-w-0" dir={direction}>

            <section className="mt-6">
              <h2 className="text-xl font-black">{t.resource.detail.description}</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-8 text-[#808080]">{localizedDescription}</p>
            </section>

            <section className="mt-7 rounded-xl border border-[#e5e5e5] bg-white p-6">
              <h2 className="text-xl font-black">{t.resource.detail.quickSummary}</h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <InfoItem icon={smallIcon(<path d="M5 4h14v16H5zM9 8h6M9 12h6"/>)} label={t.resource.detail.license} value={resource.license}/>
                <InfoItem icon={smallIcon(<><circle cx="12" cy="12" r="9"/><path d="m9 12 2 2 4-5"/></>)} label={t.resource.detail.version} value={resource.version || '—'}/>
                <InfoItem icon={smallIcon(<><rect x="4" y="4" width="6" height="6"/><rect x="14" y="4" width="6" height="6"/><rect x="4" y="14" width="6" height="6"/><rect x="14" y="14" width="6" height="6"/></>)} label={t.resource.detail.type} value={t.catalog.types[resource.type]}/>
                <InfoItem icon={smallIcon(<><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/></>)} label={t.resource.detail.created} value={formatDate(resource.created_at, locale)}/>
                <InfoItem icon={smallIcon(<><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/></>)} label={t.resource.detail.updated} value={formatDate(resource.updated_at, locale)}/>
              </div>
            </section>

            <section className="mt-6">
              <GithubStatsCard githubUrl={resource.github_url || resource.documentation_url || "#"} stats={resource.github_stats}/>
            </section>
          </div>
        </div>

        <section className="mt-24 overflow-hidden rounded-[24px] bg-[linear-gradient(112deg,#edf1f1_15%,#dbeaf6_100%)] px-7 sm:px-12">
          <div className="grid items-stretch md:min-h-[340px] gap-8 md:grid-cols-[330px_1fr]" dir="ltr">
            <div className="flex h-[220px] items-end justify-center self-stretch overflow-hidden sm:h-[270px] md:h-full"><img src="/images/rocket.png" alt="" className="h-full w-auto max-w-full object-contain object-bottom md:max-w-none"/></div>
            <div className="flex flex-col items-start justify-center py-10 text-start" dir={direction}>
              <h2 className="text-3xl font-black sm:text-5xl">{locale === 'ar' ? 'انشر موردك القرآني' : 'Publish your Quranic resource'}</h2>
              <p className="mt-5 text-base leading-8 text-[#818181] sm:text-lg">{locale === 'ar' ? 'شارك مكتبتك أو أداة التطوير أو مجموعة البيانات مع المجتمع.' : 'Share your library, development tool, or dataset with the community.'}</p>
              <Link href="/dashboard/resources" className="mt-7 inline-flex rounded-full bg-black px-10 py-4 text-base font-black text-white transition hover:bg-[#171717]">{locale === 'ar' ? 'انشره الآن' : 'Publish now'}</Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
