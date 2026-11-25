import { describe, expect, it } from 'vitest';
import { sourceRows } from '@/lib/sourceDetails';
import type { Resource } from '@/types';

const res = (o: Partial<Resource>): Resource => ({ id: 'payload_1', slug: 's', ...o }) as Resource;
const keys = (r: Resource, en = false) => sourceRows(r, en).map((x) => x.key);
const val = (r: Resource, key: string, en = false) => sourceRows(r, en).find((x) => x.key === key)?.value;

describe('sourceRows', () => {
  it('sourceRows_NotSheetImported_ReturnsNothing', () => {
    expect(sourceRows(res({ has_api: 'yes' }), false)).toEqual([]);
  });
  it('sourceRows_ImportedWithoutValues_KeepsCoreRowsEmptyForNotStated', () => {
    const r = res({ sheet_id: 'S1' });
    expect(keys(r)).toContain('domain');
    expect(val(r, 'domain')).toBeUndefined();
    expect(keys(r)).not.toContain('base_url'); // has_api unknown: no API rows
  });
  it('sourceRows_HasApiNo_HidesApiRows_YesShowsThem', () => {
    expect(keys(res({ sheet_id: 'S', has_api: 'no' }))).not.toContain('base_url');
    const yes = res({ sheet_id: 'S', has_api: 'yes', api: { base_url: 'https://a.test', rate_limits: { en: '10/s' } } });
    expect(keys(yes)).toEqual(expect.arrayContaining(['base_url', 'rate_limits', 'authentication']));
    expect(val(yes, 'base_url')).toBe('https://a.test');
  });
  it('sourceRows_Language_PicksEnglishThenFallsBackToArabic', () => {
    const r = res({ sheet_id: 'S', attribution: { ar: 'عربي', en: 'English' }, scholarly_review: { ar: 'مراجعة' } });
    expect(val(r, 'attribution', true)).toBe('English');
    expect(val(r, 'attribution')).toBe('عربي');
    expect(val(r, 'review', true)).toBe('مراجعة');
  });
  it('sourceRows_ListsJoinedAndUrlsFlagged', () => {
    const r = res({ sheet_id: 'S', source_languages: ['Arabic', 'English'], download_url: 'https://d.test' });
    expect(val(r, 'languages', true)).toBe('Arabic, English');
    const ar = new Intl.DisplayNames('ar', { type: 'language' });
    expect(val(r, 'languages')).toBe(`${ar.of('ar')}، ${ar.of('en')}`);
    expect(sourceRows(r, false).find((x) => x.key === 'download')?.url).toBe(true);
  });
});
