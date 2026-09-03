import { describe, it, expect } from 'vitest';
import { RESOURCE_TYPES } from '@/shared/constants/resource-types';
import type { ResourceType } from '@/types/resource';

describe('RESOURCE_TYPES constant — single source of truth', () => {
  it('contains all 16 ResourceType values in canonical order', () => {
    const expected: ResourceType[] = [
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
    ];
    expect(RESOURCE_TYPES).toEqual(expected);
  });

  it('has length 16 and no duplicates', () => {
    expect(RESOURCE_TYPES).toHaveLength(16);
    expect(new Set(RESOURCE_TYPES).size).toBe(16);
  });

  it('is assignable to ResourceType[] (type-level sanity)', () => {
    // If RESOURCE_TYPES drifts from the union, this line fails to compile
    const asTypes: ResourceType[] = [...RESOURCE_TYPES];
    expect(asTypes).toHaveLength(16);
  });
});
