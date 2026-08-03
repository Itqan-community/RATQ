'use client';

import Image from 'next/image';
import { Fragment } from 'react';
import { useLanguage } from '@/i18n';

const decorativeStars = [
  { top: '3%', left: '3%', size: 'clamp(44px, 7vw, 105px)', opacity: 0.07, rotate: -12 },
  { top: '9%', right: '5%', size: 'clamp(70px, 11vw, 165px)', opacity: 0.06, rotate: 18 },
  { top: '20%', left: '13%', size: 'clamp(34px, 5vw, 74px)', opacity: 0.09, rotate: 31 },
  { top: '27%', right: '14%', size: 'clamp(48px, 8vw, 118px)', opacity: 0.055, rotate: -24 },
  { top: '36%', left: '2%', size: 'clamp(68px, 10vw, 145px)', opacity: 0.06, rotate: 14 },
  { top: '43%', right: '3%', size: 'clamp(36px, 6vw, 88px)', opacity: 0.1, rotate: 38 },
  { top: '51%', left: '21%', size: 'clamp(30px, 4vw, 62px)', opacity: 0.07, rotate: -31 },
  { top: '58%', right: '20%', size: 'clamp(62px, 9vw, 132px)', opacity: 0.055, rotate: 9 },
  { top: '67%', left: '4%', size: 'clamp(38px, 6vw, 92px)', opacity: 0.085, rotate: 26 },
  { top: '74%', right: '5%', size: 'clamp(75px, 12vw, 175px)', opacity: 0.05, rotate: -17 },
  { top: '83%', left: '16%', size: 'clamp(46px, 7vw, 108px)', opacity: 0.065, rotate: 42 },
  { top: '91%', right: '23%', size: 'clamp(32px, 5vw, 72px)', opacity: 0.09, rotate: -36 },
] as const;

function BrandText({ text }: { text: string }) {
  return text.split('RATQ').map((part, index, parts) => (
    <Fragment key={`${part}-${index}`}>
      {part}
      {index < parts.length - 1 && (
        <span className="mx-1 inline-flex translate-y-[0.15em] align-baseline">
          <Image src="/images/logo.png" alt="RATQ" width={30} height={30} className="h-[1em] w-auto object-contain" />
        </span>
      )}
    </Fragment>
  ));
}

function DecorativeStars() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      {decorativeStars.map((star, index) => (
        <Image
          key={index}
          src="/images/islamicStar.png"
          alt=""
          width={180}
          height={180}
          className="absolute h-auto select-none object-contain"
          style={{
            top: star.top,
            left: 'left' in star ? star.left : undefined,
            right: 'right' in star ? star.right : undefined,
            width: star.size,
            opacity: star.opacity,
            transform: `rotate(${star.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}

export default function AboutPage() {
  const { t, direction } = useLanguage();
  const offerItems = Object.values(t.about.offer.items);

  return (
    <main className="page-enter relative isolate min-h-screen overflow-hidden bg-[linear-gradient(145deg,#EBEFF0_0%,#F7F9FA_48%,#D8E8F5_100%)] bg-fixed pb-20 pt-32 text-black" dir={direction}>
      <DecorativeStars />

      <section className="relative z-10 mx-auto max-w-[1480px] px-3 sm:px-4">
        <div className="px-3 pb-10 pt-16 sm:px-10 sm:pt-24 lg:px-16 lg:pb-12 lg:pt-28">
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-start gap-3 sm:items-center"><h1 className="min-w-0 text-4xl font-black leading-[1.2] text-black sm:text-5xl">{t.about.pageTitle}</h1><Image src="/images/logo.png" alt="RATQ" width={44} height={44} className="h-9 w-9 shrink-0 object-contain sm:h-11 sm:w-11" priority /></div>
            <div className="mt-6 max-w-3xl space-y-3 text-base leading-8 text-[#59636d] sm:text-lg sm:leading-9">
              <p><BrandText text={t.about.why.paragraph1} /></p>
              <p><BrandText text={t.about.why.paragraph2} /></p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto mt-14 max-w-[980px] px-5 sm:mt-20">
        <h2 className="text-3xl font-black leading-tight text-black sm:text-4xl"><BrandText text={t.about.whatIs.title} /></h2>
        <div className="mt-7 space-y-5 text-base leading-8 text-[#59636d] sm:text-lg sm:leading-9">
          <p><BrandText text={t.about.whatIs.paragraph1} /></p>
          <p>{t.about.whatIs.paragraph2Before}<strong className="font-black text-black">{t.about.whatIs.standards}</strong>{t.about.whatIs.paragraph2After}</p>
        </div>
      </section>

      <section className="relative z-10 mx-auto mt-14 max-w-[980px] px-5 sm:mt-20">
        <h2 className="text-3xl font-black leading-tight text-black sm:text-4xl"><BrandText text={t.about.offer.title} /></h2>
        <p className="mt-4 max-w-3xl text-base leading-8 text-[#6f7780]"><BrandText text={t.about.offer.intro} /></p>
        <div className="mt-9 border-t border-[#d7dde1]">
          {offerItems.map((item, index) => (
            <article key={item.title} className="grid gap-3 border-b border-[#d7dde1] py-7 sm:grid-cols-[48px_240px_minmax(0,1fr)] sm:gap-6">
              <span className="text-sm font-black text-[#8d969e]">{String(index + 1).padStart(2, '0')}</span>
              <h3 className="text-lg font-black leading-7 text-black"><BrandText text={item.title} /></h3>
              <p className="text-sm leading-7 text-[#59636d]"><BrandText text={item.description} /></p>
            </article>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto mt-14 max-w-[980px] px-5 sm:mt-20">
        <div className="grid gap-10 border-t border-[#d7dde1] pt-10 sm:gap-12 sm:pt-12 md:grid-cols-2">
          <article>
            <h2 className="text-2xl font-black text-black">{t.about.mission.title}</h2>
            <p className="mt-5 text-base leading-8 text-[#59636d]"><BrandText text={t.about.mission.description} /></p>
          </article>
          <article>
            <h2 className="text-2xl font-black text-black">{t.about.vision.title}</h2>
            <p className="mt-5 text-base leading-8 text-[#59636d]"><BrandText text={t.about.vision.description} /></p>
          </article>
        </div>
      </section>
    </main>
  );
}