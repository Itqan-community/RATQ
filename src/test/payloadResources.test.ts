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

  it('attributes to the real Payload publisher instead of one generic community publisher', () => {
    const r = toDesignResource({ ...doc, publisher: { id: 44, name: 'abdullah' } });
    expect(r.publisher_id).toBe('payload_pub_44');
    expect(r.publisher?.name_en).toBe('abdullah');
  });

  it('falls back to the RATQ community publisher when the doc carries none', () => {
    expect(toDesignResource(doc).publisher_id).toBe('pub_ratq');
  });

  it('carries content language, audio fields and source tags', () => {
    const r = toDesignResource({
      ...doc, content_language: 'en', audio_url: 'https://a.test/x.mp3', audio_thumbnail: 'javascript:1',
      reciter_name: 'R', audio_quality: '128kbps',
    });
    expect(r.content_language).toBe('en');
    expect(r.languages).toEqual(['en']);
    expect(r.audio_url).toBe('https://a.test/x.mp3');
    expect(r.audio_thumbnail).toBeUndefined(); // non-http(s) dropped
    expect([r.reciter_name, r.audio_quality, r.source]).toEqual(['R', '128kbps', 'payload']);
  });

  it('maps GitHub stats/commits/topics, treating an all-null stats group as absent', () => {
    expect(toDesignResource({ ...doc, github_stats: { stars: null, forks: null, open_issues: null, last_commit: null } }).github_stats).toBeUndefined();
    const r = toDesignResource({
      ...doc,
      github_stats: { stars: 5, forks: 1, open_issues: 0, last_commit: '2026-01-01T00:00:00Z' },
      github_stats_fetched_at: '2026-01-02T00:00:00Z',
      github_commits: [{ sha: 'a', message: 'm', author: 'x', date: '2026-01-01', url: 'https://github.com/x' }],
      github_topics: ['quran', 5 as unknown as string],
    });
    expect(r.github_stats).toEqual({ stars: 5, forks: 1, open_issues: 0, last_commit: '2026-01-01T00:00:00Z', fetched_at: '2026-01-02T00:00:00Z' });
    expect(r.github_commits).toHaveLength(1);
    expect(r.github_topics).toEqual(['quran']);
  });

  it('maps the populated cover image (http(s) only) and ignores an unpopulated relation id', () => {
    expect(toDesignResource({ ...doc, image: { url: 'https://cdn.test/c.png' } }).image_url).toBe('https://cdn.test/c.png');
    expect(toDesignResource({ ...doc, image: { url: 'javascript:1' } }).image_url).toBeUndefined();
    expect(toDesignResource({ ...doc, image: 12 }).image_url).toBeUndefined();
  });

  it('maps itqan_badge to a level and tolerates missing optional fields', () => {
    expect(toDesignResource(doc).itqan_level).toBe('verified');
    const r = toDesignResource({ ...doc, itqan_badge: false, github_url: null, documentation_url: null, version: null });
    expect(r.itqan_level).toBe('none');
    expect(r.repo_url).toBeUndefined();
    expect(r.latest_version).toBeUndefined();
  });
});
