// src/components/ui/QuranQuote.tsx
// Quranic Sacred Text Quote Display with Mandatory Authority & License Attribution (Section 4)

import React from 'react';
import { BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface QuranQuoteProps {
  text: string;
  surahName?: string;
  ayahNumber?: number;
  sourceAuthority?: string;
  sourceVersion?: string;
  licenseId?: string;
}

export const QuranQuote: React.FC<QuranQuoteProps> = ({
  text,
  surahName,
  ayahNumber,
  sourceAuthority,
  sourceVersion,
  licenseId,
}) => {
  const { t } = useTranslation('site');
  return (
    <div className="my-4 rounded-xl border border-qtd-200 bg-qtd-50/50 p-6 text-center dark:border-qtd-900 dark:bg-qtd-950/40">
      <div className="flex items-center justify-center gap-1.5 text-xs text-qtd-700 dark:text-qtd-300 font-semibold mb-3">
        <BookOpen className="w-4 h-4" />
        <span>
          {surahName ? t('ui.surah', { name: surahName }) : t('ui.quran_excerpt')}
          {ayahNumber ? t('ui.ayah', { n: ayahNumber }) : ''}
        </span>
      </div>

      <blockquote className="font-quran text-xl sm:text-2xl text-fg leading-loose py-2 select-text">
        « {text} »
      </blockquote>

      <div className="mt-4 pt-3 border-t border-qtd-200/60 dark:border-qtd-900 flex flex-wrap items-center justify-center gap-3 text-2xs text-fg-subtle">
        <span>{t('ui.source_authority', { value: sourceAuthority || t('ui.default_authority') })}</span>
        {sourceVersion && <span>{t('ui.source_version', { value: sourceVersion })}</span>}
        {licenseId && <span>{t('ui.source_license', { value: licenseId.toUpperCase() })}</span>}
      </div>
    </div>
  );
};
