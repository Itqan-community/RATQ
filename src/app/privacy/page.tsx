'use client';

import { useLanguage } from '@/shared/ui/i18n';

export default function PrivacyPage() {
  const { t, direction } = useLanguage();

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-5 pb-20 pt-32 text-black" dir={direction}>
      <h1 className="text-4xl font-black leading-tight text-black sm:text-5xl">{t.privacy.title}</h1>
      <p className="mt-6 text-base leading-8 text-[#59636d] sm:text-lg sm:leading-9">{t.privacy.intro}</p>

      <h2 className="mt-10 text-2xl font-black text-black">{t.privacy.collect.title}</h2>
      <ul className="mt-5 list-disc space-y-2 ps-6 text-base leading-8 text-[#59636d] sm:text-lg">
        <li>{t.privacy.collect.item1}</li>
        <li>{t.privacy.collect.item2}</li>
        <li>{t.privacy.collect.item3}</li>
      </ul>

      <h2 className="mt-10 text-2xl font-black text-black">{t.privacy.dontDo.title}</h2>
      <ul className="mt-5 list-disc space-y-2 ps-6 text-base leading-8 text-[#59636d] sm:text-lg">
        <li>{t.privacy.dontDo.item1}</li>
        <li>{t.privacy.dontDo.item2}</li>
      </ul>

      <h2 className="mt-10 text-2xl font-black text-black">{t.privacy.deletion.title}</h2>
      <p className="mt-5 text-base leading-8 text-[#59636d] sm:text-lg">{t.privacy.deletion.body}</p>

      <p className="mt-10 text-sm text-[#8d969e]">{t.privacy.betaNote}</p>
    </main>
  );
}
