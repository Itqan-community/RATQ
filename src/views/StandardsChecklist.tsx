// src/views/StandardsChecklist.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { Printer } from 'lucide-react';

export const StandardsChecklist: React.FC = () => {
  const { t } = useTranslation('site');
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full text-start">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-bold text-ratq-700 uppercase tracking-wider block mb-1">
            {t('checklist.c00')}
          </span>
          <h1 className="text-2xl font-bold text-fg">{t('checklist.c01')}</h1>
        </div>
        <Button variant="outline" size="sm" onClick={() => window.print()} startIcon={<Printer className="w-4 h-4" />}>
          {t('checklist.c02')}
        </Button>
      </div>

      <div className="flex flex-col gap-8 text-xs text-fg leading-relaxed">
        {/* Section 1 */}
        <div className="p-6 rounded-xl border border-border bg-canvas">
          <h2 className="text-sm font-bold text-fg mb-3 text-ratq-700">{t('checklist.c03')}</h2>
          <ul className="list-disc list-inside space-y-2 text-fg-muted">
            <li><strong>{t('checklist.c04')}</strong> {t('checklist.c05')}</li>
            <li><strong>{t('checklist.c06')}</strong> {t('checklist.c07')}</li>
            <li><strong>{t('checklist.c08')}</strong> {t('checklist.c09')}</li>
            <li><strong>{t('checklist.c10')}</strong> {t('checklist.c11')}</li>
          </ul>
        </div>

        {/* Section 2 */}
        <div className="p-6 rounded-xl border border-border bg-canvas">
          <h2 className="text-sm font-bold text-fg mb-3 text-cyan-700">{t('checklist.c12')}</h2>
          <ul className="list-disc list-inside space-y-2 text-fg-muted">
            <li><strong>{t('checklist.c13')}</strong> {t('checklist.c14')}</li>
            <li><strong>{t('checklist.c15')}</strong> {t('checklist.c16')}</li>
            <li><strong>{t('checklist.c17')}</strong> {t('checklist.c18')}</li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className="p-6 rounded-xl border border-border bg-canvas border-ratq-300 dark:border-ratq-800">
          <h2 className="text-sm font-bold text-fg mb-3 text-amber-700 flex items-center justify-between">
            <span>{t('checklist.c19')}</span>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded">
              {t('checklist.c20')}
            </span>
          </h2>
          <ul className="list-disc list-inside space-y-2 text-fg-muted">
            <li><strong>{t('checklist.c21')}</strong> {t('checklist.c22')}</li>
            <li><strong>{t('checklist.c23')}</strong> {t('checklist.c24')}</li>
            <li><strong>{t('checklist.c25')}</strong> {t('checklist.c26')}</li>
            <li><strong>{t('checklist.c27')}</strong> {t('checklist.c28')}</li>
          </ul>
        </div>

        {/* Section 4 */}
        <div className="p-6 rounded-xl border border-border bg-canvas">
          <h2 className="text-sm font-bold text-fg mb-3 text-purple-700">{t('checklist.c29')}</h2>
          <ul className="list-disc list-inside space-y-2 text-fg-muted">
            <li><strong>{t('checklist.c30')}</strong> {t('checklist.c31')}</li>
            <li><strong>{t('checklist.c32')}</strong> {t('checklist.c33')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
