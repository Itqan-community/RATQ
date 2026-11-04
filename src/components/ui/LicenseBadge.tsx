// src/components/ui/LicenseBadge.tsx
import React from 'react';
import { Scale } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface LicenseBadgeProps {
  licenseId?: string;
  spdx?: string;
  name?: string;
  allowsCommercial?: boolean;
  className?: string;
  size?: 'sm' | 'md';
  showIcon?: boolean;
}

export const CC_LABELS: Record<string, string> = {
  'cc0': 'CC0',
  'cc0-1.0': 'CC0',
  'cc-by': 'CC BY',
  'cc-by-4.0': 'CC BY',
  'cc-by-sa': 'CC BY-SA',
  'cc-by-sa-4.0': 'CC BY-SA',
  'cc-by-nd': 'CC BY-ND',
  'cc-by-nd-4.0': 'CC BY-ND',
  'cc-by-nc': 'CC BY-NC',
  'cc-by-nc-4.0': 'CC BY-NC',
  'cc-by-nc-sa': 'CC BY-NC-SA',
  'cc-by-nc-sa-4.0': 'CC BY-NC-SA',
  'cc-by-nc-nd': 'CC BY-NC-ND',
  'cc-by-nc-nd-4.0': 'CC BY-NC-ND',
};

export const getLicenseColorClass = (licenseId?: string, spdx?: string): string => {
  const key = (licenseId || spdx || '').toLowerCase().replace(/-4\.0|-1\.0|\.0/g, '').trim();

  if (key === 'cc0' || key === 'cc-by') {
    return 'bg-emerald-50 text-emerald-700 border-emerald-200/70 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/40';
  }
  if (key === 'cc-by-sa' || key === 'cc-by-nd') {
    return 'bg-amber-50 text-amber-700 border-amber-200/70 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/40';
  }
  if (key === 'cc-by-nc') {
    return 'bg-orange-50 text-orange-700 border-orange-200/70 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-800/40';
  }
  if (key === 'cc-by-nc-sa' || key === 'cc-by-nc-nd') {
    return 'bg-rose-50 text-rose-700 border-rose-200/70 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/40';
  }

  // Fallbacks by token:
  if (key.includes('nc')) {
    return 'bg-rose-50 text-rose-700 border-rose-200/70 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/40';
  }
  if (key.includes('sa') || key.includes('nd')) {
    return 'bg-amber-50 text-amber-700 border-amber-200/70 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/40';
  }
  if (key.includes('cc0') || key.includes('by')) {
    return 'bg-emerald-50 text-emerald-700 border-emerald-200/70 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/40';
  }

  return 'bg-subtle text-fg-muted border-border';
};

export const LicenseBadge: React.FC<LicenseBadgeProps> = ({
  name,
  licenseId,
  spdx,
  allowsCommercial,
  className,
  size = 'sm',
  showIcon = true,
}) => {
  const raw = (licenseId || spdx || 'cc-by-sa').toLowerCase();
  const label = name || CC_LABELS[raw] || (licenseId || spdx || 'CC BY-SA').toUpperCase();
  const colorClass = getLicenseColorClass(licenseId, spdx);

  return (
    <span
      dir="ltr"
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1 font-mono font-normal rounded-full border select-none transition-colors',
          size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-0.5',
          colorClass,
          className
        )
      )}
    >
      {showIcon && <Scale className="w-3 h-3 opacity-75 shrink-0" />}
      <span>{label}</span>
      {allowsCommercial && (
        <span className="text-[10px] text-ratq-700 bg-ratq-100 dark:bg-ratq-900 dark:text-ratq-300 px-1 rounded">
          تجاري متاح
        </span>
      )}
    </span>
  );
};
