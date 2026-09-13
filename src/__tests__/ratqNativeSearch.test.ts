import { describe, it, expect, vi } from 'vitest';
import type { Resource } from '@/types/resource';

// Minimal Resource factory — only the fields ratq-native.ts's list() actually
// reads during filtering. The rest are filled with inert placeholder values so
// TypeScript is satisfied without coupling every test to the full Resource shape.
function makeResource(partial: { id: number; name: string; description: string }): Omit<Resource, 'source' | 'source_url'> {
  return {
    id: partial.id,
    name: partial.name,
    slug: `resource-${partial.id}`,
    type: 'library',
    description: partial.description,
    short_description: '',
    documentation_url: null,
    github_url: null,
    license: 'MIT',
    itqan_badge: false,
    status: 'published',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    version: null,
    github_stats: null,
    total_downloads: 0,
    downloads: 0,
  };
}

// Arabic test resources — one for each normalization class so each test can
// assert a single concern without ambiguity.
const arabicResources = [
  // alef variants: name uses plain alef, description uses madda form (آ)
  makeResource({ id: 1, name: 'القران الكريم',    description: 'نص القرآن الكريم كاملاً' }),
  // alef maqsura: name uses ي (yaa), description uses ى (alef maqsura)
  makeResource({ id: 2, name: 'موسوعة الدوري',    description: 'تسجيلات القارئ الدورى' }),
  // taa marbuta: name uses ة, description uses ه
  makeResource({ id: 3, name: 'مكتبة القرآن',     description: 'مكتبه رقميه للموارد القرآنيه' }),
  // tashkeel: name is fully vowelled, description is bare
  makeResource({ id: 4, name: 'كِتَابُ التَّجْوِيد', description: 'كتاب في علم التجويد' }),
  // English control — normalization must not break plain ASCII search
  makeResource({ id: 5, name: 'Quran Search API',  description: 'A REST API for Quran full-text search' }),
];

// Replace the mock-data module so ratq-native.ts uses our Arabic test resources
// instead of the all-English mockResources array.
vi.mock('@/modules/resources/infrastructure/mock-data', () => ({
  mockResources: arabicResources,
}));

// Import AFTER the mock is registered so the module-level `resources` constant
// in ratq-native.ts is built from arabicResources.
const { ratqNativeSource } = await import('@/modules/resources/infrastructure/repositories/ratq-native');

describe('ratqNativeSource.list — Arabic normalization in search', () => {
  // ─── Alef variants ──────────────────────────────────────────────────────

  it('finds a resource whose name has plain alef when the query uses alef-with-madda (آ)', async () => {
    // Resource 1 name: "القران" — query: "القرآن" (alef-madda)
    const { results } = await ratqNativeSource.list({ search: 'القرآن' });
    expect(results.map((r) => r.id)).toContain(1);
  });

  it('finds a resource whose description has alef-with-madda (آ) when the query uses plain alef', async () => {
    // Resource 1 description: "القرآن" — query: "القران" (plain alef)
    const { results } = await ratqNativeSource.list({ search: 'القران' });
    expect(results.map((r) => r.id)).toContain(1);
  });

  it('finds a resource whose name has alef-with-hamza-above (أ) when the query uses plain alef', async () => {
    const { results } = await ratqNativeSource.list({ search: 'القران الكريم' });
    expect(results.map((r) => r.id)).toContain(1);
  });

  // ─── Alef maqsura vs yaa ────────────────────────────────────────────────

  it('finds a resource whose description has alef maqsura (ى) when the query uses yaa (ي)', async () => {
    // Resource 2 description: "الدورى" — query: "الدوري"
    const { results } = await ratqNativeSource.list({ search: 'الدوري' });
    expect(results.map((r) => r.id)).toContain(2);
  });

  it('finds a resource whose name has yaa (ي) when the query uses alef maqsura (ى)', async () => {
    // Resource 2 name: "الدوري" — query: "الدورى"
    const { results } = await ratqNativeSource.list({ search: 'الدورى' });
    expect(results.map((r) => r.id)).toContain(2);
  });

  // ─── Taa marbuta vs haa ─────────────────────────────────────────────────

  it('finds a resource whose name has taa marbuta (ة) when the query uses haa (ه)', async () => {
    // Resource 3 name: "مكتبة" — query: "مكتبه"
    const { results } = await ratqNativeSource.list({ search: 'مكتبه' });
    expect(results.map((r) => r.id)).toContain(3);
  });

  it('finds a resource whose description has haa (ه) when the query uses taa marbuta (ة)', async () => {
    // Resource 3 description: "مكتبه" — query: "مكتبة"
    const { results } = await ratqNativeSource.list({ search: 'مكتبة' });
    expect(results.map((r) => r.id)).toContain(3);
  });

  // ─── Tashkeel / diacritics ───────────────────────────────────────────────

  it('finds a resource whose name is fully vowelled when the query is bare (no tashkeel)', async () => {
    // Resource 4 name: "كِتَابُ التَّجْوِيد" — query: "كتاب التجويد"
    const { results } = await ratqNativeSource.list({ search: 'كتاب التجويد' });
    expect(results.map((r) => r.id)).toContain(4);
  });

  it('finds a resource whose description is bare when the query carries tashkeel', async () => {
    // Resource 4 description: "كتاب في علم التجويد" — query with fatha/kasra added
    const { results } = await ratqNativeSource.list({ search: 'كِتَاب' });
    expect(results.map((r) => r.id)).toContain(4);
  });

  // ─── No false positives ──────────────────────────────────────────────────

  it('does not return resources that do not match the normalized query', async () => {
    const { results } = await ratqNativeSource.list({ search: 'بيانات' }); // "data" — not in any resource
    expect(results).toHaveLength(0);
  });

  // ─── English search still works ─────────────────────────────────────────

  it('still finds English-named resources by plain substring match after normalization', async () => {
    // Resource 5: "Quran Search API" — normalization lowercases both sides
    const { results } = await ratqNativeSource.list({ search: 'quran search' });
    expect(results.map((r) => r.id)).toContain(5);
  });

  it('English search is case-insensitive after normalization applies toLowerCase', async () => {
    const { results } = await ratqNativeSource.list({ search: 'QURAN SEARCH' });
    expect(results.map((r) => r.id)).toContain(5);
  });

  // ─── count matches results.length ────────────────────────────────────────

  it('returns a count consistent with the number of matched results', async () => {
    const { count, results } = await ratqNativeSource.list({ search: 'القرآن' });
    expect(count).toBe(results.length);
  });

  // ─── No search param returns all resources ───────────────────────────────

  it('returns all resources when no search param is provided', async () => {
    const { results } = await ratqNativeSource.list({});
    expect(results).toHaveLength(arabicResources.length);
  });
});
