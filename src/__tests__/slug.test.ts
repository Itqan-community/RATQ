import { describe, it, expect } from 'vitest';
import { Slug } from '@/modules/resources/domain/value-objects/slug';

describe('Slug.fromName', () => {
  it('produces a real slug for Unicode (Arabic) names, unlike the old ASCII-only \\w slugify (issue #170)', () => {
    expect(Slug.fromName('مكتبة القرآن').toString()).toBe('مكتبة-القرآن');
  });

  it('lowercases, trims, and collapses punctuation/whitespace while stripping edge dashes', () => {
    expect(Slug.fromName('  Quran API v2!  ').toString()).toBe('quran-api-v2');
  });
});
