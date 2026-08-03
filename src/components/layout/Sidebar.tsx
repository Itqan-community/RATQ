'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useLanguage } from '@/i18n';

const navItems = [
  { href: '/dashboard', labelKey: 'overview', detailKey: 'overview', icon: 'M3 12l9-9 9 9M5.25 10.5v9h4.5v-5.25h4.5V19.5h4.5v-9' },
  { href: '/dashboard/resources', labelKey: 'resources', detailKey: 'resourcesDetail', icon: 'M20.25 7.5 12 12.25 3.75 7.5M12 21.75V12.25m8.25-4.75v9.75L12 21.75l-8.25-4.5V7.5L12 3l8.25 4.5Z' },
  { href: '/dashboard/requests', labelKey: 'requests', detailKey: 'requestsDetail', icon: 'M12 6v6l4 2m5-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z' },
  { href: '/dashboard/api-keys', labelKey: 'apiKeys', detailKey: 'apiKeysDetail', icon: 'M15.75 7.5a3.75 3.75 0 1 1-1.08 2.64L6.75 18H4.5v2.25H2.25V18l9-9a3.74 3.74 0 0 1 4.5-1.5Z' },
  { href: '/dashboard/settings', labelKey: 'settings', detailKey: 'settingsDetail', icon: 'M10.5 6h3m-6.25 6h9.5M10.5 18h3M4.5 3.75h15A1.5 1.5 0 0 1 21 5.25v13.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.75V5.25a1.5 1.5 0 0 1 1.5-1.5Z' },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { t, direction } = useLanguage();
  const side = t.dashboard.side;
  const isRtl = direction === 'rtl';

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={`fixed top-32 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-[#ededed] bg-white text-black shadow-[0_10px_28px_rgba(15,23,42,0.08)] lg:hidden ${isRtl ? 'right-4' : 'left-4'}`} aria-label={side.openMenu}>
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>
      {open && <button type="button" aria-label={side.closeMenu} className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setOpen(false)} />}
      <aside className={`fixed top-0 z-50 flex h-full w-72 flex-col border-[#ededed] bg-white shadow-[0_16px_44px_rgba(15,23,42,0.08)] transition-transform duration-300 lg:sticky lg:top-32 lg:h-[calc(100vh-8rem)] lg:shrink-0 lg:translate-x-0 lg:shadow-none ${isRtl ? 'right-0 border-l' : 'left-0 border-r'} ${open ? 'translate-x-0' : isRtl ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0'}`} dir={direction}>
        <div className="flex h-full flex-col p-5">
          <div className="mb-7 flex items-center justify-between gap-3">
            <Link href="/dashboard" className="flex min-w-0 items-center gap-3" onClick={() => setOpen(false)}>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#fafafa]"><Image src="/images/logo.png" alt="RATQ" width={32} height={32} className="h-8 w-8 object-contain" /></span>
              <span className="min-w-0"><span className="block text-xs font-black text-[#8b949e]">RATQ</span><span className="block truncate text-lg font-black text-black">{side.title}</span></span>
            </Link>
            <button type="button" onClick={() => setOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fafafa] text-[#6f7780] lg:hidden" aria-label={side.closeMenu}><svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg></button>
          </div>
          <nav className="grid gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
              return (
                <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-lg px-3 py-3 transition ${isActive ? 'bg-[#171717] text-white' : 'text-[#59636d] hover:bg-[#fafafa] hover:text-black'}`}>
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${isActive ? 'bg-white/10 text-[#e8ef3d]' : 'bg-[#fafafa] text-[#171717]'}`}><svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d={item.icon} /></svg></span>
                  <span className="min-w-0"><span className="block truncate text-sm font-black">{side[item.labelKey]}</span><span className={`mt-0.5 block truncate text-xs font-bold ${isActive ? 'text-white/60' : 'text-[#9aa4ad]'}`}>{side[item.detailKey]}</span></span>
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto rounded-lg bg-[#fafafa] p-4"><p className="text-xs font-black text-[#8b949e]">{side.shortcut}</p><Link href="/resources" onClick={() => setOpen(false)} className="mt-3 inline-flex h-10 w-full items-center justify-center rounded-full bg-black px-4 text-sm font-black text-white transition hover:bg-[#171717]">{side.browseCatalog}</Link></div>
        </div>
      </aside>
    </>
  );
}

export function SidebarToggle() { return null; }