// src/test/arabic-normalize.test.ts
import { describe, it, expect } from 'vitest';
import { normalizeArabic } from '../../netlify/functions/_shared/arabic-normalize';

describe('Arabic Normalization for Search Indexing (Section 4 & 29)', () => {
  it('strips Arabic tashkeel (diacritics) correctly', () => {
    const input = 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ';
    const output = normalizeArabic(input);
    expect(output).toBe('الحمد لله رب العالمين');
  });

  it('normalizes alef variants (أ, إ, آ, ٱ) to plain alef (ا)', () => {
    const input = 'إسلام القرآن أمة ٱلرحمن';
    const output = normalizeArabic(input);
    expect(output).toBe('اسلام القران امه الرحمن');
  });

  it('normalizes teh marbuta (ة) to heh (ه)', () => {
    const input = 'مكتبة تفسيرية';
    const output = normalizeArabic(input);
    expect(output).toBe('مكتبه تفسيريه');
  });

  it('normalizes alef maqsura (ى) to yeh (ي)', () => {
    const input = 'هدى للمتقين';
    const output = normalizeArabic(input);
    expect(output).toBe('هدي للمتقين');
  });

  it('removes tatweel / kashida', () => {
    const input = 'رَتْـــــق';
    const output = normalizeArabic(input);
    expect(output).toBe('رتق');
  });

  it('handles empty strings safely', () => {
    expect(normalizeArabic('')).toBe('');
  });
});
