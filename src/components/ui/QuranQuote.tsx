// src/components/ui/QuranQuote.tsx
// Quranic Sacred Text Quote Display with Mandatory Authority & License Attribution (Section 4)

import React from 'react';
import { BookOpen } from 'lucide-react';

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
  sourceAuthority = 'مجمع الملك فهد لطباعة المصحف الشريف',
  sourceVersion,
  licenseId,
}) => {
  return (
    <div className="my-4 rounded-xl border border-ratq-200 bg-ratq-50/50 p-6 text-center dark:border-ratq-900 dark:bg-ratq-950/40">
      <div className="flex items-center justify-center gap-1.5 text-xs text-ratq-700 dark:text-ratq-300 font-semibold mb-3">
        <BookOpen className="w-4 h-4" />
        <span>
          {surahName ? `سورة ${surahName}` : 'مقتطف قرآني موثق'}
          {ayahNumber ? ` — آية (${ayahNumber})` : ''}
        </span>
      </div>

      <blockquote className="font-quran text-xl sm:text-2xl text-fg leading-loose py-2 select-text">
        « {text} »
      </blockquote>

      <div className="mt-4 pt-3 border-t border-ratq-200/60 dark:border-ratq-900 flex flex-wrap items-center justify-center gap-3 text-2xs text-fg-subtle">
        <span>المصدر المعتمد: {sourceAuthority}</span>
        {sourceVersion && <span>الإصدار: {sourceVersion}</span>}
        {licenseId && <span>الترخيص: {licenseId.toUpperCase()}</span>}
      </div>
    </div>
  );
};
