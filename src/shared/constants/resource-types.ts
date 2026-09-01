import type { ResourceType } from '@/types/resource';

/**
 * Single source of truth for the runtime list of resource types.
 * Must stay in sync with the `ResourceType` union in `src/types/resource.ts`.
 */
export const RESOURCE_TYPES: readonly ResourceType[] = [
  'library',
  'sdk',
  'dataset',
  'api',
  'tafsir',
  'audio',
  'pdf',
  'json',
  'recitation',
  'mushaf',
  'program',
  'linguistic',
  'translation',
  'font',
  'search',
  'tajweed',
] as const;
