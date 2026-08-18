'use client';

import { useLanguage } from '@/shared/ui/i18n';

export default function StandardsPage() {
  const { t, direction } = useLanguage();
  const items = [t.standards.accuracy, t.standards.completeness, t.standards.quality];

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-5 pb-20 pt-32 text-black" dir={direction}>
      <h1 className="text-4xl font-black leading-tight text-black sm:text-5xl">{t.standards.title}</h1>
      <p className="mt-6 text-base leading-8 text-[#59636d] sm:text-lg sm:leading-9">{t.standards.intro}</p>

      <div className="mt-10 border-t border-[#d7dde1]">
        {items.map((item, index) => (
          <article key={item.title} className="grid gap-3 border-b border-[#d7dde1] py-7 sm:grid-cols-[48px_minmax(0,1fr)] sm:gap-6">
            <span className="text-sm font-black text-[#8d969e]">{String(index + 1).padStart(2, '0')}</span>
            <div>
              <h3 className="text-lg font-black leading-7 text-black">{item.title}</h3>
              <p className="mt-2 text-sm leading-7 text-[#59636d]">{item.body}</p>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-10 text-base leading-8 text-[#59636d]">{t.standards.closing}</p>
    </main>
  );
}
