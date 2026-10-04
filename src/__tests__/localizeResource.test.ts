import { describe, it, expect } from 'vitest';
import { localizeResource, detectLanguage } from '@/shared/utils/localize-resource';
import type { Resource } from '@/types/resource';

function createResource(overrides: Partial<Resource> = {}): Resource {
  return {
    id: 1,
    name: 'Ad-Douri Mushaf',
    slug: 'cms-27',
    type: 'mushaf',
    description: 'Long English description',
    short_description: 'Short English description',
    documentation_url: null,
    github_url: null,
    license: 'CC0',
    itqan_badge: false,
    status: 'published',
    created_at: '',
    updated_at: '',
    version: null,
    github_stats: null,
    total_downloads: 0,
    downloads: 0,
    source: 'cms',
    source_url: null,
    content_language: 'en',
    title_language: 'en',
    publisher: { id: 3, name: 'Tahbeer Center', name_ar: 'مركز تحبير' },
    name_ar: 'المصحف المرتل برواية الدوري',
    description_ar: 'وصف عربي طويل',
    ...overrides,
  };
}

describe('localizeResource', () => {
  it('returns the Arabic fields and marks them Arabic when the site is Arabic', () => {
    const l = localizeResource(createResource(), 'ar');

    expect(l.name).toBe('المصحف المرتل برواية الدوري');
    expect(l.description).toBe('وصف عربي طويل');
    expect(l.shortDescription).toBe('وصف عربي طويل');
    expect(l.publisherName).toBe('مركز تحبير');
    expect(l.contentLanguage).toBe('ar');
    expect(l.titleLanguage).toBe('ar');
  });

  it('returns the English fields when the site is English', () => {
    const l = localizeResource(createResource(), 'en');

    expect(l.name).toBe('Ad-Douri Mushaf');
    expect(l.description).toBe('Long English description');
    expect(l.shortDescription).toBe('Short English description');
    expect(l.publisherName).toBe('Tahbeer Center');
    expect(l.contentLanguage).toBe('en');
    expect(l.titleLanguage).toBe('en');
  });

  it('falls back to English, and keeps it marked English, when an Arabic field is missing', () => {
    const l = localizeResource(
      createResource({ name_ar: undefined, description_ar: '', publisher: { id: 3, name: 'Tahbeer Center' } }),
      'ar',
    );

    expect(l.name).toBe('Ad-Douri Mushaf');
    expect(l.description).toBe('Long English description');
    expect(l.publisherName).toBe('Tahbeer Center');
    expect(l.contentLanguage).toBe('en');
    expect(l.titleLanguage).toBe('en');
  });

  it('leaves resources without Arabic fields untouched', () => {
    const l = localizeResource(
      createResource({
        name_ar: undefined,
        description_ar: undefined,
        content_language: undefined,
        title_language: undefined,
        publisher: null,
      }),
      'ar',
    );

    expect(l.name).toBe('Ad-Douri Mushaf');
    expect(l.publisherName).toBeUndefined();
    expect(l.contentLanguage).toBeUndefined();
    expect(l.titleLanguage).toBeUndefined();
  });
});

describe('detectLanguage', () => {
  it('returns ar for predominantly Arabic text', () => {
    expect(detectLanguage('اعتمد الطبري في تفسيره')).toBe('ar');
  });

  it('returns en for predominantly Latin text', () => {
    expect(detectLanguage('Tanzil is a Quranic project')).toBe('en');
  });

  it('goes by the majority in mixed text', () => {
    expect(detectLanguage('Mushaf بروايتي الدوري عن أبي عمرو بالتوسط')).toBe('ar');
    expect(detectLanguage('Quran Corpus (القرآن) annotated project')).toBe('en');
  });

  it('returns undefined when there are no letters', () => {
    expect(detectLanguage('')).toBeUndefined();
    expect(detectLanguage('123 - 456')).toBeUndefined();
    expect(detectLanguage(undefined)).toBeUndefined();
  });
});

describe('localizeResource language of shown text', () => {
  it('leaves the language unset when the resource has none and no Arabic text is shown', () => {
    const l = localizeResource(
      createResource({ description: 'اعتمد الطبري في تفسيره', content_language: undefined, name_ar: undefined, description_ar: undefined }),
      'en',
    );
    expect(l.contentLanguage).toBeUndefined();
  });

  it('marks the Arabic fetch as English when it is actually English text', () => {
    const l = localizeResource(createResource({ description_ar: 'Plain English text' }), 'ar');
    expect(l.contentLanguage).toBe('en');
  });
});
