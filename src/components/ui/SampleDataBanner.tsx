// Live-mode notice on pages that run on mock data (src/lib/mockRoutes.ts), so invented figures are never read as real.
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { isLive } from '@/lib/payloadAuth';
import { isHiddenRoute, isMockRoute } from '@/lib/mockRoutes';

export const SampleDataBanner: React.FC = () => {
  const { t } = useTranslation('site');
  const { pathname } = useLocation();
  // A hidden route shows the not-found view on production, so there is no sample data to flag.
  return isLive() && isMockRoute(pathname) && !isHiddenRoute(pathname) ? (
    <div role="note" className="w-full border-b border-amber-300 bg-amber-50 px-4 py-2 text-center text-xs font-semibold text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
      {t('ui.sample_data')}
    </div>
  ) : null;
};
