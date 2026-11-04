import { describe, it, expect } from 'vitest';
import { toDesignResource, type PayloadResourceDoc } from '@/lib/payloadResources';

const doc: PayloadResourceDoc = {
  id: 7,
  name: 'Quran Hafs SDK',
  slug: 'quran-hafs-sdk',
  type: 'sdk',
  description: 'Long description',
  short_description: 'Short',
  image: null,
  documentation_url: 'https://docs.example.test',
  github_url: 'https://github.com/example/repo',
  website_url: null,
  license: 'CC-BY-NC-ND-4.0',
  itqan_badge: true,
  status: 'published',
  version: '1.2.0',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-02-01T00:00:00.000Z',
};

describe('toDesignResource', () => {
  it('maps core fields and namespaces the slug like live (payload-<slug>)', () => {
    const r = toDesignResource(doc);
    expect(r.slug).toBe('payload-quran-hafs-sdk');
    expect(r.id).toBe('payload_7');
    expect(r.title_ar).toBe('Quran Hafs SDK');
    expect(r.summary_ar).toBe('Short');
    expect(r.description_ar).toBe('Long description');
    expect(r.resource_type).toBe('sdk');
    expect(r.repo_url).toBe('https://github.com/example/repo');
    expect(r.docs_url).toBe('https://docs.example.test');
    expect(r.latest_version).toBe('1.2.0');
    expect(r.status).toBe('published');
  });

  it('matches a known CC license by id, ignoring the version suffix', () => {
    expect(toDesignResource(doc).license?.id).toBe('cc-by-nc-nd');
  });

  it('synthesizes a license (no false CC claim) for unknown licenses such as MIT', () => {
    const r = toDesignResource({ ...doc, license: 'MIT' });
    expect(r.license?.id).not.toMatch(/^cc/);
    expect(r.license?.name_en).toBe('MIT');
    expect(r.license_spdx).toBe('MIT');
  });

  it.each([
    ['sdk', 'cat_dev'],
    ['recitation', 'cat_recitations'],
    ['tafsir', 'cat_tafsir'],
    ['font', 'cat_fonts'],
    ['dataset', 'cat_datasets'],
    ['translation', 'cat_translations'],
    ['mushaf', 'cat_quran_sources'],
  ])('puts a %s resource in category %s so the catalog shows it', (type, cat) => {
    expect(toDesignResource({ ...doc, type }).categories).toEqual([cat]);
  });

  it('maps itqan_badge to a level and tolerates missing optional fields', () => {
    expect(toDesignResource(doc).itqan_level).toBe('verified');
    const r = toDesignResource({ ...doc, itqan_badge: false, github_url: null, documentation_url: null, version: null });
    expect(r.itqan_level).toBe('none');
    expect(r.repo_url).toBeUndefined();
    expect(r.latest_version).toBeUndefined();
  });
});
