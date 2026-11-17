// Marks a nav item whose page runs on mock data. Renders only in live mode (in mock mode everything is demo).
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/Badge';
import { isLive } from '@/lib/payloadAuth';
import { isMockRoute } from '@/lib/mockRoutes';

export const DemoBadge: React.FC<{ to: string }> = ({ to }) => {
  const { t } = useTranslation('site');
  return isLive() && isMockRoute(to) ? (
    // Superscript: sits at the top corner of the label text.
    <Badge variant="outline" size="sm" className="relative -top-1.5 ms-0.5 px-1 py-0 text-[8px] leading-tight">
      {t('ui.demo')}
    </Badge>
  ) : null;
};
