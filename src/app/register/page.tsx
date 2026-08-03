'use client';

import Image from 'next/image';
import Link from 'next/link';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { useLanguage } from '@/i18n';

function CheckIcon() {
  return <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m5 12 4 4L19 6" /></svg>;
}

export default function RegisterPage() {
  const { t, direction } = useLanguage();
  const copy = t.auth;
  const benefits = [copy.registerBenefit1, copy.registerBenefit2, copy.registerBenefit3];

  return (
    <main className="page-enter bg-white pb-20 pt-32 text-black" dir={direction}>
      <section className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <div className="grid min-h-[700px] overflow-hidden rounded-2xl border border-[#ededed] bg-[#fafafa] shadow-[0_16px_44px_rgba(15,23,42,0.05)] lg:grid-cols-[minmax(0,1fr)_430px]">
          <div className="flex items-center px-6 py-10 sm:px-8 lg:px-12">
            <div className="w-full max-w-[520px]">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white shadow-[0_8px_22px_rgba(15,23,42,0.06)]">
                  <Image src="/images/logo.png" alt="RATQ" width={34} height={34} className="h-8 w-8 object-contain" />
                </div>
                <div>
                  <p className="text-sm font-black text-[#7d8790]">RATQ</p>
                  <h1 className="text-3xl font-black leading-tight text-black sm:text-4xl">{copy.registerTitle}</h1>
                </div>
              </div>
              <p className="mb-7 text-base leading-8 text-[#59636d]">{copy.registerSubtitle}</p>
              <div className="rounded-lg bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.045)] sm:p-6">
                <RegisterForm />
              </div>
              <p className="mt-6 text-center text-sm text-[#6f7780]">
                {copy.haveAccount}{' '}
                <Link href="/login" className="font-black text-[#171717] transition hover:text-black">{copy.loginNow}</Link>
              </p>
            </div>
          </div>

          <aside className="flex bg-[linear-gradient(122.15deg,#EAF4ED_30.7%,#CFE7D8_86.27%)] px-6 py-8 sm:px-8 lg:px-10" aria-label={copy.registerBadge}>
            <div className="flex w-full flex-col justify-between gap-10">
              <div>
                <span className="inline-flex rounded-full bg-[#e8ef3d] px-4 py-2 text-sm font-black text-black">{copy.registerBadge}</span>
                <h2 className="mt-6 text-3xl font-black leading-[1.3] text-black">{copy.registerPanelTitle}</h2>
                <div className="mt-7 grid gap-3">
                  {benefits.map((benefit) => (
                    <div key={benefit} className="flex items-start gap-3 rounded-lg bg-white/75 p-4 text-sm font-bold leading-7 text-[#3f4851]">
                      <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#171717] text-white"><CheckIcon /></span>
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-lg bg-[#171717] p-5 text-white">
                <p className="text-sm font-black text-[#e8ef3d]">RATQ</p>
                <p className="mt-3 text-base font-bold leading-8 text-white/85">{copy.registerNote}</p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}