import { describe, expect, it } from 'vitest';
import { resources } from '@/i18n/config';

const flat = (o: unknown, p = ''): string[] =>
  o && typeof o === 'object' && !Array.isArray(o)
    ? Object.entries(o).flatMap(([k, v]) => flat(v, p ? `${p}.${k}` : k))
    : [p];

const ARABIC = /[؀-ۿ]/;
// The language switch is labelled in the language you switch to, so it is the one English string with Arabic in it.
const ALLOWED_ARABIC_IN_EN = new Set(['header.other_language']);

describe('i18n catalogs', () => {
  it.each(Object.keys(resources.ar))('%s has the same keys in ar and en', (ns) => {
    const ar = flat(resources.ar[ns as keyof typeof resources.ar]).sort();
    const en = flat(resources.en[ns as keyof typeof resources.en]).sort();
    expect(en).toEqual(ar);
  });

  it('English site copy contains no Arabic script', () => {
    const leaks: string[] = [];
    const walk = (o: unknown, p = '') => {
      if (typeof o === 'string') {
        if (ARABIC.test(o) && !ALLOWED_ARABIC_IN_EN.has(p)) leaks.push(p);
      } else if (o && typeof o === 'object') {
        Object.entries(o).forEach(([k, v]) => walk(v, p ? `${p}.${k}` : k));
      }
    };
    walk(resources.en.site);
    expect(leaks).toEqual([]);
  });

  it('default language is Arabic (live is lang=ar dir=rtl)', async () => {
    const i18n = (await import('@/i18n/config')).default;
    expect(i18n.language).toBe('ar');
    expect(document.documentElement.lang).toBe('ar');
    expect(document.documentElement.dir).toBe('rtl');
  });
});
