'use client';

import { useLanguage } from '@/shared/ui/i18n';

export default function ContactPage() {
  const { t, direction } = useLanguage();

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-5 pb-20 pt-32 text-black" dir={direction}>
      <h1 className="text-4xl font-black leading-tight text-black sm:text-5xl">{t.contact.title}</h1>
      <div className="mt-6 space-y-5 text-base leading-8 text-[#59636d] sm:text-lg sm:leading-9">
        <p>{t.contact.intro}</p>
        <p>{t.contact.noTeam}</p>
      </div>

      <h2 className="mt-10 text-2xl font-black text-black">{t.contact.howToReach}</h2>
      <ul className="mt-5 space-y-3 text-base leading-8 text-[#59636d] sm:text-lg">
        <li>{t.contact.email}: <a href="mailto:connect@itqan.dev" className="font-semibold text-black underline">connect@itqan.dev</a></li>
        <li>{t.contact.issues} <a href="https://github.com/Itqan-community/RATQ/issues" target="_blank" rel="noopener noreferrer" className="font-semibold text-black underline">github.com/Itqan-community/RATQ/issues</a></li>
        <li>{t.contact.forum} <a href="https://community.itqan.dev" target="_blank" rel="noopener noreferrer" className="font-semibold text-black underline">community.itqan.dev</a></li>
        <li>{t.contact.contribute}</li>
      </ul>
    </main>
  );
}
