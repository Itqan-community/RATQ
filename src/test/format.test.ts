import { describe, expect, it } from 'vitest';
import { languageName, versionLabel } from '@/lib/format';

describe('languageName', () => {
  const ar = new Intl.DisplayNames('ar', { type: 'language' });

  it.each([
    ['Urdu', 'ur'],
    ['Turkish (tr)', 'tr'],
    ['Bengali', 'bn'],
    ['Divehi (Maldivian)', 'dv'],
    ['Filipino (Bisayan) (ceb)', 'ceb'],
  ])('languageName_%s_InArabic_UsesPlatformName', (name, code) => {
    expect(languageName(name, false)).toBe(ar.of(code));
  });

  it('languageName_CodeWithoutPlatformName_KeepsSheetText', () => {
    expect(languageName('Filipino (Maguindanaon) (mdh)', false)).toBe('Filipino (Maguindanaon) (mdh)');
  });

  it('languageName_EnglishUi_KeepsSheetText', () => {
    expect(languageName('Urdu', true)).toBe('Urdu');
  });

  it.each(['Multilingual', '9 languages', 'Not stated', 'Latin script'])('languageName_%s_NotALanguage_Unchanged', (name) => {
    expect(languageName(name, false)).toBe(name);
  });
});

describe('versionLabel', () => {
  it.each([
    ['1.2.0', 'v1.2.0'],
    ['2', 'v2'],
    ['v1.0', 'v1.0'],
    ['vv1', 'vv1'],
    ['vContent API v4', 'vContent API v4'],
    ['No updates', 'No updates'],
    ['API v1 (1.0.0)', 'API v1 (1.0.0)'],
  ])('versionLabel_%s_Renders_%s', (input, want) => {
    expect(versionLabel(input)).toBe(want);
  });
});
