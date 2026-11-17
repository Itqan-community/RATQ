import { describe, expect, it } from 'vitest';
import {
  CC_LICENSE_ROWS,
  licenseRowHref,
  matchesLicenseFilter,
  matchesPublisherFilter,
  matchesSearch,
  newestResources,
  NO_PUBLISHER_VALUE,
  parseCatalogQuery,
  publisherKey,
  publisherOptions,
  sortResources,
  withQuery,
} from '@/lib/catalogQuery';
import { normalizeArabic } from '@/lib/format';
import { licenseFor } from '@/lib/resourceMapping';
import type { Resource } from '@/types';

describe('licenseRowHref', () => {
  it('licenseRowHref_EveryRow_FiltersCatalogToThatRowOnly', () => {
    for (const row of CC_LICENSE_ROWS) {
      const q = parseCatalogQuery(new URL(licenseRowHref(row.id), 'http://x').searchParams);
      expect(q.licenses).toEqual(row.values);
      expect(matchesLicenseFilter(row.values[0], q.licenses)).toBe(true);
      const other = CC_LICENSE_ROWS.find((r) => r.id !== row.id)!;
      expect(matchesLicenseFilter(other.values[0], q.licenses)).toBe(false);
    }
  });
  it('licenseRowHref_NonCcId_LinksToUnfilteredCatalog', () => {
    expect(licenseRowHref('mit')).toBe('/resources');
  });
});

const res = (o: Partial<Resource>): Resource =>
  ({ id: 'r', title_ar: '', summary_ar: '', description_ar: '', tags: [], downloads_count: 0, created_at: '', ...o }) as Resource;

describe('normalizeArabic', () => {
  it('normalizeArabic_TashkeelAlefYaTaMarbuta_FoldsToBareForm', () => {
    expect(normalizeArabic('القُرْآن')).toBe(normalizeArabic('القران'));
    expect(normalizeArabic('مكتبة')).toBe('مكتبه');
    expect(normalizeArabic('على')).toBe('علي');
    expect(normalizeArabic('Quran API')).toBe('quran api');
  });
});

describe('parseCatalogQuery', () => {
  it('parseCatalogQuery_LiveParams_ReadsAllRepeatedValues', () => {
    const q = parseCatalogQuery(new URLSearchParams('search=tabari&type=recitation&license=CC0&license=CC-BY-4.0&publisher=cms:2&publisher=cms:3&sort=name_asc&page=2'));
    expect(q).toEqual({ search: 'tabari', types: ['recitation'], licenses: ['CC0', 'CC-BY-4.0'], publishers: ['cms:2', 'cms:3'], sort: 'name_asc' });
  });
  it('parseCatalogQuery_LegacyQAlias_UsedOnlyWhenSearchAbsent', () => {
    expect(parseCatalogQuery(new URLSearchParams('q=abc')).search).toBe('abc');
    expect(parseCatalogQuery(new URLSearchParams('q=abc&search=xyz')).search).toBe('xyz');
  });
  it('parseCatalogQuery_UnknownSort_FallsBackToRelevance', () => {
    expect(parseCatalogQuery(new URLSearchParams('sort=hax')).sort).toBe('relevance');
    expect(parseCatalogQuery(new URLSearchParams('')).sort).toBe('relevance');
  });
});

describe('withQuery', () => {
  it('withQuery_AnyChange_DropsPageAndKeepsUnrelatedParams', () => {
    const p = withQuery(new URLSearchParams('page=3&foo=1&type=font'), { sort: 'newest' });
    expect(p.get('page')).toBeNull();
    expect(p.get('foo')).toBe('1');
    expect(p.getAll('type')).toEqual(['font']);
    expect(p.get('sort')).toBe('newest');
  });
  it('withQuery_RepeatedValuesAndDefaults_WrittenAsLiveShape', () => {
    const p = withQuery(new URLSearchParams('sort=newest&license=CC0'), { licenses: ['CC0', 'CC0-1.0'], sort: 'relevance', publishers: ['cms:2'] });
    expect(p.toString()).toBe('license=CC0&license=CC0-1.0&publisher=cms%3A2');
  });
  it('withQuery_SearchPatch_ReplacesLegacyQ', () => {
    expect(withQuery(new URLSearchParams('q=old'), { search: 'new' }).toString()).toBe('search=new');
    expect(withQuery(new URLSearchParams('q=old&search=x'), { search: '' }).toString()).toBe('');
  });
});

describe('matchesSearch', () => {
  it('matchesSearch_DiacriticsAndAlefForms_Match', () => {
    const r = res({ title_ar: 'القرآن الكريم' });
    expect(matchesSearch(r, 'القران')).toBe(true);
    expect(matchesSearch(r, 'القُرْآنِ')).toBe(true);
  });
  it('matchesSearch_DescriptionBothLanguages_Searched', () => {
    expect(matchesSearch(res({ description_ar: 'تفسير الطبري' }), 'الطبري')).toBe(true);
    expect(matchesSearch(res({ description_en: 'Tabari tafsir' }), 'TABARI')).toBe(true);
    expect(matchesSearch(res({ title_ar: 'خط' }), 'مصحف')).toBe(false);
  });
  it('matchesSearch_BlankQuery_MatchesEverything', () => {
    expect(matchesSearch(res({}), '   ')).toBe(true);
  });
});

describe('sortResources', () => {
  const a = res({ id: 'a', title_ar: 'باء', created_at: '2024-01-01T00:00:00Z', downloads_count: 5 });
  const b = res({ id: 'b', title_ar: 'ألف', created_at: '2025-01-01T00:00:00Z', downloads_count: 9 });
  const cms = res({ id: 'c', title_ar: 'جيم', created_at: '', downloads_count: 0 });
  const ids = (l: Resource[]) => l.map((r) => r.id);
  it('sortResources_Newest_UndatedSinkLast', () => {
    expect(ids(sortResources([cms, a, b], 'newest'))).toEqual(['b', 'a', 'c']);
  });
  it('sortResources_Oldest_UndatedFirst', () => {
    expect(ids(sortResources([a, b, cms], 'oldest'))).toEqual(['c', 'a', 'b']);
  });
  it('sortResources_NameAndDownloads_Order', () => {
    expect(ids(sortResources([a, b, cms], 'name_asc'))).toEqual(['b', 'a', 'c']);
    expect(ids(sortResources([a, b, cms], 'name_desc'))).toEqual(['c', 'a', 'b']);
    expect(ids(sortResources([a, b, cms], 'downloads'))).toEqual(['b', 'a', 'c']);
  });
  it('sortResources_Relevance_KeepsOrderAndDoesNotMutate', () => {
    const input = [cms, a, b];
    expect(sortResources(input, 'relevance')).toEqual(input);
    sortResources(input, 'newest');
    expect(ids(input)).toEqual(['c', 'a', 'b']);
  });
  it('newestResources_TakesFirstN', () => {
    expect(ids(newestResources([cms, a, b], 2))).toEqual(['b', 'a']);
  });
});

describe('license filter', () => {
  it('matchesLicenseFilter_NoSelection_PassesEverything', () => {
    expect(matchesLicenseFilter('CC-BY-NC-ND', [])).toBe(true);
    expect(matchesLicenseFilter('MIT', undefined)).toBe(true);
  });
  it('matchesLicenseFilter_UntrackedLicense_NeverHidden', () => {
    for (const lic of ['MIT', 'Unspecified', 'Waqf Public License', 'GPL-3.0', '']) {
      expect(matchesLicenseFilter(lic, ['CC0'])).toBe(true);
    }
  });
  it('matchesLicenseFilter_TrackedLicense_OrAcrossSelection', () => {
    expect(matchesLicenseFilter('CC-BY-ND', ['CC-BY-ND'])).toBe(true);
    expect(matchesLicenseFilter('CC-BY-ND', ['CC0', 'CC-BY-ND'])).toBe(true);
    expect(matchesLicenseFilter('CC-BY-NC-ND', ['CC-BY-ND'])).toBe(false);
    expect(matchesLicenseFilter('CC0 1.0', ['CC0'])).toBe(false); // raw-value match like live: the row toggles every value
  });
  it('matchesLicenseFilter_OnlyStaleValuesSelected_TreatedAsNoFilter', () => {
    expect(matchesLicenseFilter('CC0', ['bogus'])).toBe(true);
  });
  it('licenseFor_RawVariants_ResolveToRowIds', () => {
    expect(licenseFor('CC0 1.0').id).toBe('cc0');
    expect(licenseFor('CC-BY-SA 4.0').id).toBe('cc-by-sa');
    expect(licenseFor('CC-BY-ND').id).toBe('cc-by-nd');
    expect(licenseFor('CC-BY-NC-ND').id).toBe('cc-by-nc-nd');
    expect(licenseFor('MIT').id).toBe('spdx-mit');
  });
  it('CC_LICENSE_ROWS_Ids_ExistInDemoLicenses', async () => {
    const { DEMO_LICENSES } = await import('@/lib/mockData');
    for (const row of CC_LICENSE_ROWS) expect(DEMO_LICENSES.some((l) => l.id === row.id)).toBe(true);
  });
});

describe('publisher filter', () => {
  const cms = res({ source: 'cms', publisher_id: 'cms_pub_2', publisher: { id: 'cms_pub_2', name_ar: 'دار الإسلام', name_en: 'IslamHouse' } as Resource['publisher'] });
  const payload = res({ source: 'payload', publisher_id: 'payload_pub_5', publisher: { id: 'payload_pub_5', name_ar: 'x', name_en: 'x' } as Resource['publisher'] });
  const community = res({ source: 'payload', publisher_id: 'pub_ratq', publisher: { id: 'pub_ratq', name_ar: 'ratq', name_en: 'ratq' } as Resource['publisher'] });
  const none = res({ source: 'cms', publisher_id: '' });
  it('publisherKey_LiveShape_SourceColonId', () => {
    expect(publisherKey(cms)).toBe('cms:2');
    expect(publisherKey(payload)).toBe('payload:5');
  });
  it('publisherKey_CommunityFallbackOrMissing_IsNull', () => {
    expect(publisherKey(community)).toBeNull();
    expect(publisherKey(none)).toBeNull();
  });
  it('publisherKey_MockData_UsesDemoPrefix', () => {
    expect(publisherKey(res({ publisher_id: 'pub_quran_tech' }))).toBe('demo:pub_quran_tech');
  });
  it('matchesPublisherFilter_NoPublisherOption_MatchesNullKeys', () => {
    expect(matchesPublisherFilter(null, [NO_PUBLISHER_VALUE])).toBe(true);
    expect(matchesPublisherFilter('cms:2', [NO_PUBLISHER_VALUE])).toBe(false);
    expect(matchesPublisherFilter('cms:2', ['cms:2', 'cms:3'])).toBe(true);
    expect(matchesPublisherFilter(null, ['cms:2'])).toBe(false);
    expect(matchesPublisherFilter(null, [])).toBe(true);
  });
  it('publisherOptions_DedupesAndSortsByName', () => {
    const opts = publisherOptions([cms, cms, payload, none, community]);
    expect(opts.map((o) => o.key).sort()).toEqual(['cms:2', 'payload:5']);
    expect(opts.find((o) => o.key === 'cms:2')?.name).toBe('دار الإسلام');
  });
});
