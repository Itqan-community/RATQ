'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/shared/ui/i18n';
import { Sidebar } from '@/shared/ui/layout/Sidebar';

const keys = [
  { name: 'Production API', prefix: 'ratq_live_**** 2A9C', created: '2026-04-12' },
  { name: 'Testing API', prefix: 'ratq_test_**** 8F31', created: '2026-03-18' },
];

export default function DashboardApiKeysPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { t, direction } = useLanguage();
  const copy = t.dashboard.apiKeys;
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); if (!user) router.push('/login'); }, [user, router]);
  if (!isClient || !user) return <div className="flex min-h-[60vh] items-center justify-center bg-white"><div className="h-6 w-32 animate-pulse rounded bg-[#ededed]" /></div>;
  return <div className="min-h-screen bg-white text-black lg:flex" dir={direction}><Sidebar /><div className="pt-32 lg:flex-1"><main className="mx-auto max-w-[1180px] px-4 pb-8 pt-4 text-center sm:px-6 lg:px-8"><section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]"><div className="rounded-2xl bg-[linear-gradient(122.15deg,#F7F3DE_30.7%,#E8DEAC_86.27%)] p-6 sm:p-8"><span className="inline-flex rounded-full bg-[#e8ef3d] px-4 py-2 text-sm font-black text-black">{copy.badge}</span><h1 className="mx-auto mt-5 max-w-3xl text-3xl font-black leading-tight text-black sm:text-4xl">{copy.title}</h1><p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[#59636d]">{copy.subtitle}</p></div><aside className="rounded-lg bg-[#171717] p-6 text-white"><p className="text-sm font-black text-[#e8ef3d]">{copy.securityNote}</p><p className="mx-auto mt-4 max-w-sm text-base font-bold leading-8 text-white/80">{copy.securityText}</p></aside></section><section className="mt-7 rounded-lg border border-[#ededed] bg-white text-start shadow-[0_8px_24px_rgba(15,23,42,0.035)]"><div className="flex items-center justify-between gap-4 border-b border-[#ededed] p-5"><h2 className="text-xl font-black text-black">{copy.currentKeys}</h2><button type="button" className="h-10 rounded-full bg-black px-5 text-sm font-black text-white transition hover:bg-[#171717]">{copy.createKey}</button></div><div className="grid divide-y divide-[#ededed]">{keys.map((key) => <article key={key.prefix} className="grid gap-3 p-5 md:grid-cols-[minmax(0,1fr)_180px_110px] md:items-center"><div><h3 className="text-base font-black text-black">{key.name}</h3><p className="mt-2 font-mono text-sm text-[#59636d]" dir="ltr">{key.prefix}</p></div><p className="text-sm font-bold text-[#8b949e]">{key.created}</p><span className="w-fit rounded-full bg-green-50 px-3 py-1 text-xs font-black text-green-700">{copy.active}</span></article>)}</div></section></main></div></div>;
}