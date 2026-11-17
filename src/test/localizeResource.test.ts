import { describe, expect, it } from 'vitest';
import { detectLanguage, languageDir, localizeResource } from '@/lib/localizeResource';

const base = { title_ar: 'مصحف', summary_ar: 'ملخص', description_ar: 'وصف' };

describe('detectLanguage', () => {
  it('returns the majority script', () => {
    expect(detectLanguage('Tanzil Quran text')).toBe('en');
    expect(detectLanguage('نص القرآن الكريم')).toBe('ar');
    expect(detectLanguage('مصحف Mushaf of Madinah v2')).toBe('en');
  });
  it('returns undefined when there are no letters', () => {
    expect(detectLanguage('')).toBeUndefined();
    expect(detectLanguage(null)).toBeUndefined();
    expect(detectLanguage('123 - 456')).toBeUndefined();
  });
});

describe('languageDir', () => {
  it('maps language to direction', () => {
    expect(languageDir('ar')).toBe('rtl');
    expect(languageDir('en')).toBe('ltr');
    expect(languageDir(undefined)).toBeUndefined();
  });
});

describe('localizeResource', () => {
  it('shows Arabic fields in the ar locale', () => {
    const r = localizeResource({ ...base, title_en: 'Mushaf', description_en: 'Desc', summary_en: 'Sum' }, 'ar');
    expect(r.title).toBe('مصحف');
    expect(r.description).toBe('وصف');
    expect(r.titleDir).toBe('rtl');
    expect(r.descriptionDir).toBe('rtl');
  });

  it('prefers English fields in the en locale and flips direction', () => {
    const r = localizeResource({ ...base, title_en: 'Mushaf', description_en: 'Desc', summary_en: 'Sum' }, 'en');
    expect(r.title).toBe('Mushaf');
    expect(r.summary).toBe('Sum');
    expect(r.description).toBe('Desc');
    expect(r.titleDir).toBe('ltr');
    expect(r.descriptionDir).toBe('ltr');
  });

  it('falls back to the Arabic field and keeps it rtl when no English exists', () => {
    const r = localizeResource(base, 'en');
    expect(r.title).toBe('مصحف');
    expect(r.titleDir).toBe('rtl');
  });

  it('takes direction from the text, so English Payload content stays ltr in the ar locale', () => {
    // Payload has one name/description; authors write English there (e.g. Tanzil).
    const r = localizeResource({ title_ar: 'Tanzil', summary_ar: 'Quran text', description_ar: 'Plain Quran text.' }, 'ar');
    expect(r.title).toBe('Tanzil');
    expect(r.titleDir).toBe('ltr');
    expect(r.descriptionDir).toBe('ltr');
  });

  it('uses the explicit content_language when the text has no letters', () => {
    const r = localizeResource({ ...base, description_ar: '1234', content_language: 'en' }, 'ar');
    expect(r.descriptionDir).toBe('ltr');
  });
});
