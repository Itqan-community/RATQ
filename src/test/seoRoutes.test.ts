import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { isKnownPath, isReservedResourceSlug, isResourceDetailPath, PUBLIC_PATHS } from '@/lib/knownRoutes';
import { resourceMeta, SITE_DESCRIPTION } from '@/lib/seoMeta';
import LEGACY_REDIRECTS from '@/lib/legacyRedirects.json';
import type { Resource } from '@/types';

const res = (over: Partial<Resource>) => ({ title_ar: 'تنزيل', summary_ar: 'ملخص', description_ar: 'وصف عربي', ...over }) as Resource;

describe('isKnownPath', () => {
  it('KnownRoutes_EveryRouterPath_Matches (guards drift from src/router.tsx)', () => {
    const src = readFileSync('src/router.tsx', 'utf8');
    const paths = [...src.matchAll(/\bpath="([^"]+)"/g)].map((m) => m[1]).filter((p) => p !== '*');
    expect(paths.length).toBeGreaterThan(40);
    for (const p of paths) expect(isKnownPath(p.replace(/:\w+/g, 'x')), p).toBe(true);
    // A static /resources/<page> missing from the reserved list would be 404'd (or titled) as a resource slug.
    for (const p of paths.filter((x) => /^\/resources\/[a-z-]+$/.test(x))) {
      expect(isReservedResourceSlug(p.slice('/resources/'.length)), p).toBe(true);
    }
  });
  it('KnownRoutes_EveryLegacyRedirect_Matches', () => {
    for (const p of Object.keys(LEGACY_REDIRECTS)) expect(isKnownPath(p.replace(/:\w+/g, 'x')), p).toBe(true);
  });
  it('KnownRoutes_UnknownPaths_AreNotMatched', () => {
    for (const p of ['/zzz-nope', '/terms', '/sitemap.xmlx', '/app/zzz', '/resources/a/b', '/legal/a/b', '/auth/zzz']) {
      expect(isKnownPath(p), p).toBe(false);
    }
  });
  it('KnownRoutes_TrailingSlashAndRoot_Match', () => {
    expect(isKnownPath('/')).toBe(true);
    expect(isKnownPath('/about/')).toBe(true);
  });
  it('PublicPaths_AllKnown', () => {
    for (const p of PUBLIC_PATHS) expect(isKnownPath(p), p).toBe(true);
  });
  it('ResourceDetailPath_OnlyForSlugsNotStaticPages', () => {
    expect(isResourceDetailPath('/resources/payload-tanzil')).toBe(true);
    expect(isResourceDetailPath('/resources/roadmap')).toBe(false);
    expect(isResourceDetailPath('/resources')).toBe(false);
    expect(isResourceDetailPath('/resources/stacks/tech-spec-table')).toBe(false);
  });
  it('ReservedSlugs_StaticResourceSubpages_AreReserved', () => {
    expect(isReservedResourceSlug('roadmap')).toBe(true);
    expect(isReservedResourceSlug('preview-sections')).toBe(true);
    expect(isReservedResourceSlug('payload-tanzil')).toBe(false);
    expect(isReservedResourceSlug('cms-4')).toBe(false);
  });
});

describe('resourceMeta', () => {
  it('ResourceMeta_EnglishName_PreferredForTitleLikeLive', () => {
    const m = resourceMeta(res({ title_en: 'Tanzil', description_en: 'English text' }));
    expect(m.title).toBe('Tanzil');
    expect(m.description).toBe('English text');
  });
  it('ResourceMeta_NoEnglish_FallsBackToArabicThenSummary', () => {
    expect(resourceMeta(res({})).title).toBe('تنزيل');
    expect(resourceMeta(res({ description_ar: '' })).description).toBe('ملخص');
    expect(resourceMeta(res({ description_ar: '', summary_ar: '' })).description).toBe(SITE_DESCRIPTION);
  });
  it('ResourceMeta_LongDescription_TrimmedTo160', () => {
    expect(resourceMeta(res({ description_en: 'x'.repeat(500) })).description).toHaveLength(160);
  });
  it('ResourceMeta_ImageOnlyWhenHttp', () => {
    expect(resourceMeta(res({ image_url: 'https://a.test/i.png' })).image).toBe('https://a.test/i.png');
    expect(resourceMeta(res({ image_url: 'javascript:1' })).image).toBeUndefined();
  });
});
