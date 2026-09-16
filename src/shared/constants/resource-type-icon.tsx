/**
 * Shared TypeIcon component used in ResourceCard, ResourceDetailClient, and
 * FilterPanel so the icon artwork is defined in one place.
 */
import type { ReactNode } from 'react';
import type { ResourceType } from '@/types/resource';

// CMS-derived categories share one generic "grid" icon.
// Add a dedicated icon path here if a category needs its own artwork.
const genericIcon = (
  <>
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <path d="M4 9h16M9 4v16" />
  </>
);

const TYPE_ICON_PATHS: Record<ResourceType, ReactNode> = {
  library:     <><path d="M6 4h11a2 2 0 0 1 2 2v13H8a2 2 0 0 1-2-2V4Z"/><path d="M8 19a2 2 0 0 1 0-4h11M9 8h6"/></>,
  sdk:         <><path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14"/></>,
  dataset:     <><rect x="4" y="5" width="16" height="14" rx="1"/><path d="M4 10h16M10 5v14"/></>,
  api:         <><path d="M8 9 4 12l4 3M16 9l4 3-4 3M14 5l-4 14"/></>,
  tafsir:      <><path d="M12 3v18M5 7l14 10M19 7 5 17"/></>,
  audio:       <><path d="M9 18V5l10-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="16" cy="16" r="3"/></>,
  pdf:         <><path d="M6 3h9l3 3v15H6z"/><path d="M14 3v4h4M9 13h6M9 17h4"/></>,
  json:        <><path d="M9 4c-2 0-3 1-3 3v2c0 2-1 3-3 3 2 0 3 1 3 3v2c0 2 1 3 3 3M15 4c2 0 3 1 3 3v2c0 2 1 3 3 3-2 0-3 1-3 3v2c0 2-1 3-3 3"/></>,
  recitation:  genericIcon,
  mushaf:      genericIcon,
  program:     genericIcon,
  linguistic:  genericIcon,
  translation: genericIcon,
  font:        genericIcon,
  search:      genericIcon,
  tajweed:     genericIcon,
};

export function TypeIcon({ type, className = 'h-4 w-4' }: { type: ResourceType; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {TYPE_ICON_PATHS[type]}
    </svg>
  );
}
