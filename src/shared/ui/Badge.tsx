'use client';

import type { ResourceType } from '@/types/resource';
import { useTranslations } from '@/shared/ui/i18n';

interface BadgeProps {
  type: ResourceType;
  className?: string;
}

export function ResourceBadge({ type, className }: BadgeProps) {
  const t = useTranslations();

  const styles: Record<ResourceType, string> = {
    library: 'bg-blue-100 text-blue-800',
    sdk: 'bg-purple-100 text-purple-800',
    dataset: 'bg-teal-100 text-teal-800',
    api: 'bg-orange-100 text-orange-800',
    tafsir: 'bg-amber-100 text-amber-800',
    audio: 'bg-pink-100 text-pink-800',
    pdf: 'bg-red-100 text-red-800',
    json: 'bg-green-100 text-green-800',
    // CMS-sourced categories
    recitation: 'bg-indigo-100 text-indigo-800',
    mushaf: 'bg-emerald-100 text-emerald-800',
    program: 'bg-cyan-100 text-cyan-800',
    linguistic: 'bg-lime-100 text-lime-800',
    translation: 'bg-sky-100 text-sky-800',
    font: 'bg-fuchsia-100 text-fuchsia-800',
    search: 'bg-yellow-100 text-yellow-800',
    tajweed: 'bg-rose-100 text-rose-800',
  };

  return (
    <span className={`badge ${styles[type]} ${className || ''}`}>
      {t.catalog.types[type]}
    </span>
  );
}
