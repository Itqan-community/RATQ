import { describe, it, expect } from 'vitest';
import { normalizeArabic } from '@/shared/utils/utils';

describe('normalizeArabic', () => {
  // ─── Edge cases ───────────────────────────────────────────────────────────

  it('returns an empty string unchanged', () => {
    expect(normalizeArabic('')).toBe('');
  });

  it('passes through a string with no Arabic characters unchanged (aside from lowercasing)', () => {
    expect(normalizeArabic('Quran API v2')).toBe('quran api v2');
  });

  // ─── Alef variants ────────────────────────────────────────────────────────

  it('normalizes all alef variants to bare alef so they match each other', () => {
    // أ (U+0623), إ (U+0625), آ (U+0622), ٱ (U+0671) all → ا (U+0627)
    const withHamzaAbove  = normalizeArabic('أمر');   // أ U+0623
    const withHamzaBelow  = normalizeArabic('إمر');   // إ U+0625
    const withMadda       = normalizeArabic('آمر');   // آ U+0622
    const withWasla       = normalizeArabic('ٱمر');   // ٱ U+0671
    const bare            = normalizeArabic('امر');   // ا U+0627 — already canonical

    expect(withHamzaAbove).toBe(bare);
    expect(withHamzaBelow).toBe(bare);
    expect(withMadda).toBe(bare);
    expect(withWasla).toBe(bare);
  });

  it('normalizes alef variants mid-word, not just at word start', () => {
    expect(normalizeArabic('سأل')).toBe(normalizeArabic('سال'));
    expect(normalizeArabic('مآخذ')).toBe(normalizeArabic('ماخذ'));
  });

  // ─── Alef maqsura vs yaa ─────────────────────────────────────────────────

  it('normalizes alef maqsura (ى) to yaa (ي) so both forms match', () => {
    // searching "الدورى" should find "الدوري" and vice-versa
    expect(normalizeArabic('الدورى')).toBe(normalizeArabic('الدوري'));
  });

  it('normalizes alef maqsura mid-word as well', () => {
    expect(normalizeArabic('يحيى')).toBe(normalizeArabic('يحيي'));
  });

  // ─── Taa marbuta vs haa ───────────────────────────────────────────────────

  it('normalizes taa marbuta (ة) to haa (ه) so both forms match', () => {
    expect(normalizeArabic('مكتبة')).toBe(normalizeArabic('مكتبه'));
  });

  it('normalizes taa marbuta mid-word as well', () => {
    // e.g. a compound like "مكتبةالقرآن" (no space, contrived but covers mid-position)
    expect(normalizeArabic('فاطمةالزهراء')).toBe(normalizeArabic('فاطمهالزهراء'));
  });

  // ─── Tashkeel / diacritics ────────────────────────────────────────────────

  it('strips fatha (U+064E), kasra (U+0650), and damma (U+064F)', () => {
    // كَتَبَ with fatha on each consonant → كتب
    expect(normalizeArabic('\u0643\u064E\u062A\u064E\u0628\u064E')).toBe('كتب');
    // كِتَاب with kasra and fatha → كتاب
    expect(normalizeArabic('\u0643\u0650\u062A\u064E\u0627\u0628')).toBe('كتاب');
    // كُتُب with damma → كتب
    expect(normalizeArabic('\u0643\u064F\u062A\u064F\u0628')).toBe('كتب');
  });

  it('strips sukun (U+0652) and shadda (U+0651)', () => {
    // مُحَمَّد with shadda on the meem: م + shadda → مم without shadda
    expect(normalizeArabic('م\u0651')).toBe('م');
    expect(normalizeArabic('ب\u0652')).toBe('ب');
  });

  it('strips tanwin forms (fathatan U+064B, kasratan U+064D, dammatan U+064C)', () => {
    expect(normalizeArabic('كتاب\u064B')).toBe('كتاب');  // fathatan
    expect(normalizeArabic('كتاب\u064C')).toBe('كتاب');  // dammatan
    expect(normalizeArabic('كتاب\u064D')).toBe('كتاب');  // kasratan
  });

  it('strips a fully vowelled word down to its bare consonants', () => {
    // بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ — common test for Arabic stripping
    const vowelled   = 'بِسْمِ';
    const unvowelled = 'بسم';
    expect(normalizeArabic(vowelled)).toBe(normalizeArabic(unvowelled));
  });

  // ─── Combined normalization ───────────────────────────────────────────────

  it('applies all normalizations together on a single word', () => {
    // أُمَّةٌ: alef-with-hamza + damma + meem + shadda + taa-marbuta + dammatan
    // → after normalization: امه
    expect(normalizeArabic('أُمَّةٌ')).toBe('امه');
  });

  it('normalizes query and resource name independently so a diacriticed query finds an unvowelled name', () => {
    const query    = normalizeArabic('القُرْآن');   // vowelled, alef-madda
    const resource = normalizeArabic('القران');     // bare, no diacritics
    expect(resource.includes(query)).toBe(true);
  });

  // ─── Mixed Arabic / Latin / numerals ─────────────────────────────────────

  it('lowercases Latin characters while leaving unaffected Arabic unchanged', () => {
    expect(normalizeArabic('Quran مكتبة API')).toBe('quran مكتبه api');
  });

  it('leaves numerals (Arabic-Indic and ASCII) untouched', () => {
    expect(normalizeArabic('سورة ١١٤')).toBe('سوره ١١٤');
    expect(normalizeArabic('سورة 114')).toBe('سوره 114');
  });

  // ─── Out-of-scope: marks this implementation does NOT strip ───────────────

  it('does not strip superscript alef (U+0670) — outside the stripped tashkeel range', () => {
    // U+0670 is above U+065F, so it is intentionally left intact
    const withSuperscriptAlef = 'ر\u0670حمن';
    expect(normalizeArabic(withSuperscriptAlef)).toContain('\u0670');
  });

  it('does not strip Quranic pause marks (U+06D6–U+06ED) — out of scope for this utility', () => {
    const withPauseMark = 'قَالَ\u06D6';
    expect(normalizeArabic(withPauseMark)).toContain('\u06D6');
  });
});
