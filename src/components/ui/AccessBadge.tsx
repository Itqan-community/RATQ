// src/components/ui/AccessBadge.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { AccessLevel } from '@/types';
import { Badge } from './Badge';
import { Lock, Unlock, Building2 } from 'lucide-react';

interface AccessBadgeProps {
  level: AccessLevel;
}

export const AccessBadge: React.FC<AccessBadgeProps> = ({ level }) => {
  const { t } = useTranslation('common');

  if (level === 'open') {
    return (
      <Badge variant="primary" size="sm" className="gap-1">
        <Unlock className="w-3 h-3" />
        <span>{t('access_levels.open')}</span>
      </Badge>
    );
  }

  if (level === 'request') {
    return (
      <Badge variant="gold" size="sm" className="gap-1">
        <Lock className="w-3 h-3" />
        <span>{t('access_levels.request')}</span>
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" size="sm" className="gap-1">
      <Building2 className="w-3 h-3" />
      <span>{t('access_levels.institutional')}</span>
    </Badge>
  );
};
