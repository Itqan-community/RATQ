'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/shared/ui/i18n';
import { Sidebar } from '@/shared/ui/layout/Sidebar';

export default function DashboardSettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { t, direction } = useLanguage();
  const copy = t.dashboard.settings;
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); if (!user) router.push('/login'); }, [user, router]);
  if (!isClient || !user) return <div className="flex min-h-[60vh] items-center justify-center bg-white"><div className="h-6 w-32 animate-pulse rounded bg-[#ededed]" /></div>;
  return <div className="min-h-screen bg-white text-black lg:flex" dir={direction}><Sidebar /><div className="pt-32 lg:flex-1"><main className="mx-auto max-w-[1180px] px-4 pb-8 pt-4 text-center sm:px-6 lg:px-8"><section className="rounded-2xl bg-[linear-gradient(122.15deg,#F1EDF8_30.7%,#DDD4EE_86.27%)] p-6 sm:p-8"><span className="inline-flex rounded-full bg-[#e8ef3d] px-4 py-2 text-sm font-black text-black">{copy.badge}</span><h1 className="mx-auto mt-5 max-w-3xl text-3xl font-black leading-tight text-black sm:text-4xl">{copy.title}</h1><p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[#59636d]">{copy.subtitle}</p></section><section className="mt-7 grid gap-6 text-start lg:grid-cols-2"><article className="rounded-lg border border-[#ededed] bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.035)]"><h2 className="text-xl font-black text-black">{copy.accountInfo}</h2><div className="mt-5 grid gap-4"><label className="grid gap-2"><span className="text-sm font-black text-[#3f4851]">{copy.name}</span><input className="input-field h-12 rounded-lg" value={user.display_name} readOnly /></label><label className="grid gap-2"><span className="text-sm font-black text-[#3f4851]">{copy.role}</span><input className="input-field h-12 rounded-lg capitalize" value={user.role} readOnly /></label></div></article><article className="rounded-lg border border-[#ededed] bg-[#fafafa] p-6"><h2 className="text-xl font-black text-black">{copy.preferences}</h2><div className="mt-5 grid gap-3"><label className="flex items-center justify-between gap-4 rounded-lg bg-white p-4"><span className="text-sm font-bold text-[#59636d]">{copy.accessNotifications}</span><input type="checkbox" className="h-5 w-5 rounded border-[#d6d6d6] text-[#171717]" defaultChecked /></label><label className="flex items-center justify-between gap-4 rounded-lg bg-white p-4"><span className="text-sm font-bold text-[#59636d]">{copy.weeklySummary}</span><input type="checkbox" className="h-5 w-5 rounded border-[#d6d6d6] text-[#171717]" /></label></div></article></section></main></div></div>;
}