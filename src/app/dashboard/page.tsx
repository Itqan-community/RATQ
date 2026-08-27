'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/shared/ui/i18n';
import { Sidebar } from '@/shared/ui/layout/Sidebar';
import { RequestCard, RequestCardSkeleton } from '@/modules/developer/components/RequestCard';
import { useDeveloperRequests } from '@/hooks/useDeveloperRequests';


type StatCardProps = { label: string; value: ReactNode; detail: string; tone: 'green' | 'gold' | 'blue' | 'neutral'; icon: ReactNode; };
const iconClassName = 'h-5 w-5';
const format = (text: string, values: Record<string, string | number>) => Object.entries(values).reduce((next, [key, value]) => next.replaceAll(`{{${key}}}`, String(value)), text);
function BoxIcon() { return <svg className={iconClassName} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5 12 12.25 3.75 7.5M12 21.75V12.25m8.25-4.75v9.75L12 21.75l-8.25-4.5V7.5L12 3l8.25 4.5Z" /></svg>; }
function ClockIcon() { return <svg className={iconClassName} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m5-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>; }
function KeyIcon() { return <svg className={iconClassName} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.5a3.75 3.75 0 1 1-1.08 2.64L6.75 18H4.5v2.25H2.25V18l9-9a3.74 3.74 0 0 1 4.5-1.5Z" /></svg>; }
function UserIcon() { return <svg className={iconClassName} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0" /></svg>; }
function PlusIcon() { return <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5" /></svg>; }
function StatCard({ label, value, detail, tone, icon }: StatCardProps) {
  const toneClasses = { green: 'bg-[#171717] text-white', gold: 'bg-[#e8ef3d] text-black', blue: 'bg-[#d8e8f5] text-[#0f4f63]', neutral: 'bg-[#f5f5f5] text-black' };
  return <article className="rounded-lg border border-[#ededed] bg-white p-5 text-center shadow-[0_8px_24px_rgba(15,23,42,0.035)]"><div className="flex flex-col items-center gap-4"><span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${toneClasses[tone]}`}>{icon}</span><div><p className="text-xs font-bold text-[#8b949e]">{label}</p><div className="mt-3 text-3xl font-black leading-none text-black">{value}</div></div></div><p className="mt-4 text-sm leading-6 text-[#6f7780]">{detail}</p></article>;
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { t, direction } = useLanguage();
  const [isClient, setIsClient] = useState(false);
  const copy = t.dashboard.overview;
  useEffect(() => { setIsClient(true); if (!user) router.push('/login'); }, [user, router]);

  const requestsResponse = useDeveloperRequests()
  const filteredRequests = requestsResponse.data?.filter((request) => request.status === 'pending');


  if (!isClient || !user) return <div className="flex min-h-[60vh] items-center justify-center bg-white"><div className="h-6 w-32 animate-pulse rounded bg-[#ededed]" /></div>;
  return (
    <div className="min-h-screen bg-white text-black lg:flex" dir={direction}>
      <Sidebar />
      <div className="pt-32 lg:flex-1">
        <header className="border-b border-[#ededed] bg-white px-4 py-4 sm:px-6 lg:px-8"><div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4"><div className="min-w-0"><p className="text-xs font-black text-[#8b949e]">RATQ</p><h1 className="truncate text-xl font-black text-black">{copy.title}</h1></div><div className="flex shrink-0 items-center gap-3"><span className="hidden max-w-[220px] truncate text-sm font-bold text-[#59636d] sm:inline">{t.dashboard.common.welcome}, {user.display_name}</span><button type="button" onClick={logout} className="rounded-full border border-[#ededed] bg-white px-4 py-2 text-xs font-black text-[#6f7780] transition hover:border-red-200 hover:bg-red-50 hover:text-red-700">{t.dashboard.common.logout}</button></div></div></header>
        <main className="mx-auto max-w-[1180px] px-4 py-8 text-center sm:px-6 lg:px-8">
          <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]"><div className="rounded-2xl bg-[linear-gradient(122.15deg,#EBEFF0_30.7%,#D8E8F5_86.27%)] p-6 sm:p-8"><span className="inline-flex rounded-full bg-[#e8ef3d] px-4 py-2 text-sm font-black text-black">{copy.activitySummary}</span><h2 className="mx-auto mt-5 max-w-3xl text-3xl font-black leading-[1.25] text-black sm:text-4xl">{format(copy.welcomeBack, { name: user.display_name })}</h2><p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[#59636d]">{copy.summary}</p></div><aside className="rounded-lg bg-[#171717] p-6 text-white"><p className="text-sm font-black text-[#e8ef3d]">{copy.nextAction}</p><h3 className="mx-auto mt-4 max-w-sm text-2xl font-black leading-9">{copy.nextActionTitle}</h3><Link href="/dashboard/resources" className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-black text-black transition hover:bg-[#e8ef3d]"><PlusIcon />{copy.addResource}</Link></aside></section>
          <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label={copy.publishedResources} value="0" detail={copy.publishedResourcesDetail} tone="green" icon={<BoxIcon />} /><StatCard label={copy.pendingRequests} value={requestsResponse.data?.length} detail={copy.pendingRequestsDetail} tone="gold" icon={<ClockIcon />} /><StatCard label={copy.apiKeys} value="0" detail={copy.apiKeysDetail} tone="blue" icon={<KeyIcon />} /><StatCard label={copy.role} value={<span className="text-xl capitalize">{user.role}</span>} detail={copy.roleDetail} tone="neutral" icon={<UserIcon />} /></section>
          <section className="mt-10 grid gap-7 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div>
              <div className="mb-5 flex flex-col items-center gap-3">
                <h2 className="text-2xl font-black text-black">
                  {copy.recentRequests}
                </h2>
                <p className="max-w-xl text-sm leading-6 text-[#6f7780]">
                  {copy.recentRequestsDetail}
                </p>
                <Link
                  href="/dashboard/resources"
                  className="text-sm font-black text-[#171717] transition hover:text-black"
                >
                  {copy.manageResources}
                </Link>
              </div>
              <div className="grid gap-4 text-start">
                {requestsResponse.isLoading ? Array.from({ length: 3 }).map((_, index) => (
                  <RequestCardSkeleton key={index} />
                )) : filteredRequests?.length === 0 ? (
                  <div className="text-center text-[#6f7780]">
                    {t.dashboard.requests.noRequests}
                  </div>
                ) : (
                  filteredRequests?.map((request) => (
                    <RequestCard
                      key={request.id}
                      request={request}
                    />
                  ))
                )}
              </div>
            </div>
            <aside className="rounded-lg border border-[#ededed] bg-[#fafafa] p-6">
              <h2 className="text-xl font-black text-black">
                {copy.shortcuts}
              </h2>
              <div className="mt-5 grid gap-3">
                <Link
                  href="/dashboard/resources"
                  className="rounded-lg bg-white p-4 text-sm font-black text-black transition hover:bg-[#f7f7f7]"
                >
                  {copy.myResources}
                </Link>
                <Link
                  href="/resources"
                  className="rounded-lg bg-white p-4 text-sm font-black text-black transition hover:bg-[#f7f7f7]"
                >
                  {t.dashboard.side.browseCatalog}
                </Link>
                <Link
                  href="/about"
                  className="rounded-lg bg-white p-4 text-sm font-black text-black transition hover:bg-[#f7f7f7]"
                >
                  {copy.aboutRatq}
                </Link>
              </div>
            </aside>
          </section>
        </main>


      </div>
    </div>
  );
}