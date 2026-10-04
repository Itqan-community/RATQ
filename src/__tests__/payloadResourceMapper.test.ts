import { describe, it, expect } from 'vitest';
import { toResource, type PayloadResourceDoc } from '@/shared/infrastructure/payload-resource-mapper';

const doc: PayloadResourceDoc = {
  id: 1,
  name: 'Tanzil',
  slug: 'tanzil',
  type: 'dataset',
  description: 'Tanzil is a Quranic project',
  short_description: 'Quranic project',
  documentation_url: null,
  github_url: null,
  license: 'CC-BY',
  itqan_badge: false,
  status: 'published',
  version: null,
  createdAt: '',
  updatedAt: '',
};

describe('payload toResource language', () => {
  it('sets the language from the description and name text', () => {
    expect(toResource(doc)).toMatchObject({ content_language: 'en', title_language: 'en' });
  });

  it('marks an Arabic description as Arabic', () => {
    const r = toResource({ ...doc, name: 'تنزيل', description: 'مشروع قرآني مفتوح المصدر' });
    expect(r).toMatchObject({ content_language: 'ar', title_language: 'ar' });
  });

  it('prefers the languages set on the doc over the text', () => {
    const r = toResource({ ...doc, content_language: 'ar', title_language: 'en' });
    expect(r).toMatchObject({ content_language: 'ar', title_language: 'en' });
  });

  it('falls back to the text when the doc fields are null', () => {
    const r = toResource({ ...doc, content_language: null, title_language: null });
    expect(r).toMatchObject({ content_language: 'en', title_language: 'en' });
  });
});
