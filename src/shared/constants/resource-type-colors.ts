import type { ResourceType } from '@/types/resource';

/**
 * Single source of truth for the background-color Tailwind class applied to
 * each resource-type badge.  Used in ResourceCard, ResourceDetailClient, and
 * FilterPanel so the colors are always in sync.
 */
export const RESOURCE_TYPE_COLORS: Record<ResourceType, string> = {
  library:     'bg-[#e7ef3e]',
  sdk:         'bg-[#28b8f4]',
  dataset:     'bg-[#20df78]',
  api:         'bg-[#ff9c44]',
  tafsir:      'bg-[#17e4ad]',
  audio:       'bg-[#f4a7cd]',
  pdf:         'bg-[#ff8a80]',
  json:        'bg-[#8de5a1]',
  // CMS-sourced categories
  recitation:  'bg-[#a78bfa]',
  mushaf:      'bg-[#6ee7b7]',
  program:     'bg-[#67e8f9]',
  linguistic:  'bg-[#bef264]',
  translation: 'bg-[#7dd3fc]',
  font:        'bg-[#f0abfc]',
  search:      'bg-[#fde047]',
  tajweed:     'bg-[#fda4af]',
};
