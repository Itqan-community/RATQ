// src/test/slug.test.ts
import { describe, it, expect } from 'vitest';
import { generateSlug, slugFromName } from '../lib/slug';

describe('Slug Generator Utility', () => {
  it('converts English text to lowercased hyphenated slug', () => {
    expect(generateSlug('Quran Morphology JS')).toBe('quran-morphology-js');
  });

  it('removes special characters and trims excess dashes', () => {
    expect(generateSlug('  --Tanzil Verification API!!-- ')).toBe('tanzil-verification-api');
  });

  it('handles mixed case and multiple whitespaces', () => {
    expect(generateSlug('Fast    Search   Vector')).toBe('fast-search-vector');
  });
});

describe('slugFromName (mirrors the Payload Resources slugify)', () => {
  it('keeps Arabic letters instead of collapsing to an empty slug', () => {
    expect(slugFromName('  مكتبة القرآن -- v2! ')).toBe('مكتبة-القرآن-v2');
  });

  it('lowercases and hyphenates English', () => {
    expect(slugFromName('Quran Morphology JS')).toBe('quran-morphology-js');
  });

  it('returns empty for punctuation only', () => {
    expect(slugFromName('!!!')).toBe('');
  });
});
