'use client';

import { useLanguage } from '@/shared/ui/i18n';

export default function DocsPage() {
  const { t, direction } = useLanguage();
  const sections = [t.docs.browse, t.docs.publish, t.docs.apiKeys, t.docs.contribute];

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-5 pb-20 pt-32 text-black" dir={direction}>
      <h1 className="text-4xl font-black leading-tight text-black sm:text-5xl">{t.docs.title}</h1>
      <p className="mt-6 text-base leading-8 text-[#59636d] sm:text-lg sm:leading-9">{t.docs.intro}</p>

      <div className="mt-10 space-y-8">
        {sections.map((section) => (
          <article key={section.title}>
            <h2 className="text-xl font-black text-black">{section.title}</h2>
            <p className="mt-2 text-base leading-8 text-[#59636d]">{section.body}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
