// Marks a nav item whose page runs on mock data. Renders only in live mode (in mock mode everything is demo).
import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { isLive } from '@/lib/payloadAuth';
import { isMockRoute } from '@/lib/mockRoutes';

export const DemoBadge: React.FC<{ to: string; isAr?: boolean }> = ({ to, isAr = true }) =>
  isLive() && isMockRoute(to) ? (
    // Superscript: sits at the top corner of the label text.
    <Badge variant="outline" size="sm" className="relative -top-1.5 ms-0.5 px-1 py-0 text-[8px] leading-tight">
      {isAr ? 'تجريبي' : 'Demo'}
    </Badge>
  ) : null;
