'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/shared/ui/i18n';
import { Sidebar } from '@/shared/ui/layout/Sidebar';
import { RequestCard } from '@/modules/developer/components/RequestCard';
import type { AccessRequest } from '@/types/resource';

const requests: AccessRequest[] = [
  { id: 101, applicant_name: 'user@example.com', applicant_display_name: 'Ahmed Mohammed', resource_slug: 'quranic-text-toolkit', resource_name: 'Quranic Text Toolkit (QTT)', status: 'pending', message: 'I need this resource for research on Quranic text analysis.', publisher_notes: null, created_at: '2026-04-20T10:00:00Z', updated_at: '2026-04-20T10:00:00Z' },
  { id: 102, applicant_name: 'dev@test.com', applicant_display_name: 'Fatimah Ali', resource_slug: 'surah-navigator-sdk', resource_name: 'Surah Navigator SDK', status: 'pending', message: 'I am building a Quran app and need an SDK for navigating between surahs.', publisher_notes: null, created_at: '2026-04-18T14:30:00Z', updated_at: '2026-04-18T14:30:00Z' },
];

export default function DashboardRequestsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { t, direction } = useLanguage();
  const copy = t.dashboard.requests;
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); if (!user) router.push('/login'); }, [user, router]);
  if (!isClient || !user) return <div className="flex min-h-[60vh] items-center justify-center bg-white"><div className="h-6 w-32 animate-pulse rounded bg-[#ededed]" /></div>;
  return <div className="min-h-screen bg-white text-black lg:flex" dir={direction}><Sidebar /><div className="pt-32 lg:flex-1"><main className="mx-auto max-w-[1180px] px-4 pb-8 pt-4 text-center sm:px-6 lg:px-8"><section className="rounded-2xl bg-[linear-gradient(122.15deg,#FCEDEA_30.7%,#F4D3CC_86.27%)] p-6 sm:p-8"><span className="inline-flex rounded-full bg-[#e8ef3d] px-4 py-2 text-sm font-black text-black">{copy.badge}</span><h1 className="mx-auto mt-5 max-w-3xl text-3xl font-black leading-tight text-black sm:text-4xl">{copy.title}</h1><p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[#59636d]">{copy.subtitle}</p></section><section className="mt-7 grid gap-4 text-start">{requests.map((request) => <RequestCard key={request.id} request={request} onApprove={(id) => console.log('Approve request', id)} onDeny={(id) => console.log('Deny request', id)} />)}</section></main></div></div>;
}