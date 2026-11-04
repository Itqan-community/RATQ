// src/components/ui/ItqanBadge.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ItqanBadgeLevel } from '@/types';
import { Shield, ShieldCheck, Award, Crown, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ItqanBadgeProps {
  level: ItqanBadgeLevel | 'revoked';
  size?: 'sm' | 'md' | 'lg';
  showDescription?: boolean;
  className?: string;
}

export const ItqanBadge: React.FC<ItqanBadgeProps> = ({
  level,
  size = 'md',
  showDescription = false,
  className,
}) => {
  const { t } = useTranslation('common');

  if (level === 'none') return null;

  const config = {
    basic: {
      label: t('badges.basic'),
      desc: t('badges.basic_desc'),
      icon: Shield,
      styles: 'bg-muted text-fg border-border',
      iconColor: 'text-fg-subtle',
    },
    verified: {
      label: t('badges.verified'),
      desc: t('badges.verified_desc'),
      icon: ShieldCheck,
      styles: 'bg-ratq-50 text-ratq-800 border-ratq-300 dark:bg-ratq-950 dark:text-ratq-200 dark:border-ratq-800',
      iconColor: 'text-ratq-600 dark:text-ratq-400',
    },
    certified: {
      label: t('badges.certified'),
      desc: t('badges.certified_desc'),
      icon: Award,
      styles: 'bg-cyan-50 text-cyan-900 border-cyan-300 dark:bg-cyan-950 dark:text-cyan-200 dark:border-cyan-800',
      iconColor: 'text-cyan-700 dark:text-cyan-400',
    },
    gold: {
      label: t('badges.gold'),
      desc: t('badges.gold_desc'),
      icon: Crown,
      styles: 'bg-gold-50 text-gold-900 border-gold-300 dark:bg-gold-950 dark:text-gold-200 dark:border-gold-800',
      iconColor: 'text-gold-600 dark:text-gold-400',
    },
    revoked: {
      label: t('badges.revoked'),
      desc: t('badges.revoked_desc'),
      icon: AlertTriangle,
      styles: 'bg-red-50 text-red-900 border-red-300 dark:bg-red-950 dark:text-red-200',
      iconColor: 'text-red-600',
    },
  };

  const item = config[level];
  const Icon = item.icon;

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  return (
    <div className="inline-flex flex-col gap-0.5 text-start">
      <span
        title={item.desc}
        className={twMerge(
          clsx(
            'inline-flex items-center font-semibold rounded-full border shadow-2xs select-none',
            item.styles,
            sizeClasses[size],
            className
          )
        )}
      >
        <Icon size={iconSizes[size]} className={clsx(item.iconColor, 'shrink-0')} />
        <span>{item.label}</span>
      </span>
      {showDescription && (
        <span className="text-2xs text-fg-subtle max-w-xs">{item.desc}</span>
      )}
    </div>
  );
};
