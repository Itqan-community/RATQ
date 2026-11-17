// src/views/Licenses.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { Link } from 'react-router-dom';
import { mockRepo } from '@/lib/supabase';
import { licenseRowHref } from '@/lib/catalogQuery';
import { Scale, Check, X, ArrowLeft, ExternalLink, Unlock, Shield, Info, Sparkles } from 'lucide-react';

interface LicenseTierInfo {
  label: string;
  badgeClass: string;
  freedomRank: string;
}

const getLicenseTier = (id: string, t: TFunction): LicenseTierInfo => {
  switch (id) {
    case 'cc0':
      return {
        label: t('licenses.l00'),
        badgeClass: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
        freedomRank: t('licenses.l01'),
      };
    case 'cc-by':
      return {
        label: t('licenses.l02'),
        badgeClass: 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800',
        freedomRank: t('licenses.l03'),
      };
    case 'cc-by-sa':
      return {
        label: t('licenses.l04'),
        badgeClass: 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800',
        freedomRank: t('licenses.l05'),
      };
    case 'cc-by-nd':
      return {
        label: t('licenses.l06'),
        badgeClass: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
        freedomRank: t('licenses.l07'),
      };
    case 'cc-by-nc':
      return {
        label: t('licenses.l08'),
        badgeClass: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
        freedomRank: t('licenses.l09'),
      };
    case 'cc-by-nc-sa':
      return {
        label: t('licenses.l10'),
        badgeClass: 'bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800',
        freedomRank: t('licenses.l11'),
      };
    case 'cc-by-nc-nd':
      return {
        label: t('licenses.l12'),
        badgeClass: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
        freedomRank: t('licenses.l13'),
      };
    default:
      return {
        label: t('licenses.l14'),
        badgeClass: 'bg-subtle text-fg-muted border-border',
        freedomRank: t('licenses.l15'),
      };
  }
};

export const Licenses: React.FC = () => {
  const { t, i18n } = useTranslation('site');
  const en = i18n.language === 'en';
  const licenses = mockRepo.getLicenses();
  const resources = mockRepo.getResources();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full text-start">
      {/* Page Header */}
      <div className="mb-10 text-start">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-ratq-200 bg-ratq-50 dark:border-ratq-800 dark:bg-ratq-950 text-ratq-800 dark:text-ratq-300 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-ratq-600" />
          <span>{t('licenses.l16')}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-fg">
          {t('licenses.l17')}
        </h1>
        <p className="text-xs sm:text-sm text-fg-subtle mt-2 leading-relaxed max-w-2xl">
          {t('licenses.l18')}
          {t('licenses.l19')}
        </p>

        {/* Informative Guidance Banner */}
        <div className="mt-6 p-4 rounded-xl border border-border bg-subtle/60 flex items-start sm:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-ratq-500/10 text-ratq-600 flex items-center justify-center shrink-0">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-fg">{t('licenses.l20')}</p>
              <p className="text-fg-muted text-[11px] mt-0.5">
                {t('licenses.l21')}
              </p>
            </div>
          </div>
          <div className="shrink-0 hidden md:flex items-center gap-2 text-[11px] font-mono text-fg-subtle bg-canvas px-3 py-1.5 rounded-lg border border-border">
            <span>{t('licenses.l22')}</span>
          </div>
        </div>
      </div>

      {/* Vertical Timeline Wrapper */}
      <div className="relative">
        {/* Top Start Milestone Header */}
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md shrink-0 ring-4 ring-emerald-500/20">
            <Unlock className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
              {t('licenses.l23')}
            </span>
            <span className="text-[11px] text-fg-subtle">
              {t('licenses.l24')}
            </span>
          </div>
        </div>

        {/* Continuous Spine Line */}
        <div
          className="absolute top-10 bottom-12 start-[17px] w-0.5 bg-gradient-to-b from-emerald-500 via-ratq-500 to-rose-500 -translate-x-1/2 z-0"
          aria-hidden="true"
        />

        {/* Timeline Items List */}
        <div className="space-y-8 relative z-10">
          {licenses.map((lic, index) => {
            const count = resources.filter((r) => r.license_id === lic.id).length;
            const tier = getLicenseTier(lic.id, t);
            const stepNumber = index + 1;

            return (
              <div key={lic.id} className="relative group flex items-start gap-4 sm:gap-6">
                {/* Milestone Node on the Spine */}
                <div className="shrink-0 flex items-center justify-center">
                  <div className="w-9 h-9 rounded-full bg-canvas border-2 border-ratq-500 text-ratq-700 dark:text-ratq-300 font-mono font-bold text-xs flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:bg-ratq-500 group-hover:text-white group-hover:border-ratq-600 transition-all duration-200 z-10">
                    {stepNumber}
                  </div>
                </div>

                {/* License Content Card */}
                <div className="flex-1 p-5 sm:p-6 rounded-2xl border border-border bg-canvas shadow-2xs group-hover:shadow-md group-hover:border-ratq-500/50 transition-all duration-200">
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Scale className="w-5 h-5 text-ratq-700 dark:text-ratq-400 shrink-0" />
                      <h3 className="text-base sm:text-lg font-bold text-fg">{en ? (lic.name_en || lic.name_ar) : lic.name_ar}</h3>
                      <span className="text-xs font-mono font-bold text-fg-subtle uppercase px-2 py-0.5 rounded bg-subtle border border-border">
                        {lic.name_en || lic.id}
                      </span>
                    </div>

                    <span
                      className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full border shrink-0 ${tier.badgeClass}`}
                    >
                      {tier.label}
                    </span>
                  </div>

                  {/* License Description */}
                  <p className="text-xs text-fg-muted mb-4 leading-relaxed">
                    {lic.notes_ar}
                  </p>

                  {/* 4 CC Dimensions Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-2xs p-3.5 rounded-xl bg-subtle/80 border border-border/60 mb-4">
                    {/* 1. Commercial Use */}
                    <div className="flex items-center gap-2">
                      {lic.allows_commercial ? (
                        <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[2.5]" />
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                          <X className="w-3 h-3 stroke-[2.5]" />
                        </div>
                      )}
                      <span className="text-fg font-medium">
                        {t('licenses.dim_commercial')}{' '}
                        <strong className={lic.allows_commercial ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}>
                          {lic.allows_commercial ? t('licenses.l25') : t('licenses.l26')}
                        </strong>
                      </span>
                    </div>

                    {/* 2. Attribution Required */}
                    <div className="flex items-center gap-2">
                      {lic.requires_attribution ? (
                        <div className="w-4 h-4 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[2.5]" />
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 text-fg-subtle flex items-center justify-center shrink-0">
                          <X className="w-3 h-3 stroke-[2.5]" />
                        </div>
                      )}
                      <span className="text-fg font-medium">
                        {t('licenses.dim_attribution')}{' '}
                        <strong className={lic.requires_attribution ? 'text-amber-700 dark:text-amber-400' : 'text-fg-subtle'}>
                          {lic.requires_attribution ? t('licenses.l27') : t('licenses.l28')}
                        </strong>
                      </span>
                    </div>

                    {/* 3. Modification Allowed */}
                    <div className="flex items-center gap-2">
                      {lic.allows_modification ? (
                        <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[2.5]" />
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                          <X className="w-3 h-3 stroke-[2.5]" />
                        </div>
                      )}
                      <span className="text-fg font-medium">
                        {t('licenses.dim_derivatives')}{' '}
                        <strong className={lic.allows_modification ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}>
                          {lic.allows_modification ? t('licenses.l25') : t('licenses.l29')}
                        </strong>
                      </span>
                    </div>

                    {/* 4. Share-Alike Required */}
                    <div className="flex items-center gap-2">
                      {lic.requires_share_alike ? (
                        <div className="w-4 h-4 rounded-full bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[2.5]" />
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 text-fg-subtle flex items-center justify-center shrink-0">
                          <X className="w-3 h-3 stroke-[2.5]" />
                        </div>
                      )}
                      <span className="text-fg font-medium">
                        {t('licenses.dim_sharealike')}{' '}
                        <strong className={lic.requires_share_alike ? 'text-sky-700 dark:text-sky-400' : 'text-fg-subtle'}>
                          {lic.requires_share_alike ? t('licenses.l30') : t('licenses.l31')}
                        </strong>
                      </span>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="pt-3.5 border-t border-border-subtle flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-fg-subtle">
                        {count} {count === 1 ? t('licenses.l32') : t('licenses.l33')}
                      </span>
                      {lic.url && (
                        <a
                          href={lic.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-fg-subtle hover:text-fg inline-flex items-center gap-1 transition-colors"
                        >
                          <span>{t('licenses.l34')}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    <Link
                      to={licenseRowHref(lic.id)}
                      className="text-ratq-700 dark:text-ratq-400 font-bold hover:underline inline-flex items-center gap-1.5 transition-colors"
                    >
                      <span>{t('licenses.l35')}</span>
                      <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0 rotate-180" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom End Milestone */}
        <div className="flex items-center gap-2.5 mt-8">
          <div className="w-9 h-9 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md shrink-0 ring-4 ring-rose-500/20">
            <Shield className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-rose-700 dark:text-rose-400">
              {t('licenses.l36')}
            </span>
            <span className="text-[11px] text-fg-subtle">
              {t('licenses.l37')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
