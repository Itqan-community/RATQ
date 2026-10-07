import { describe, it, expect, vi } from 'vitest';
import type { Resource, ResourceSourceId } from '@/types/resource';

// Regression tests for the 'newest'/'oldest' sorts in repositories/aggregate.ts.
// The CMS API exposes no creation-date fields, so CMS resources are mapped with
// created_at: '' — and the old raw comparator computed NaN for those items,
// which sort() treats as 0: every undated resource kept its source order under
// both sorts. These tests pin the defensive behavior: dated resources order
// chronologically, undated/invalid ones are treated as time 0 (no dates
// invented) and never break the ordering.

// Minimal Resource factory — only the fields the aggregator's sort/pagination
// actually reads; the rest are inert placeholders (same approach as
// ratqNativeSearch.test.ts).
function makeResource(partial: {
  id: number;
  name: string;
  source: ResourceSourceId;
  created_at: string;
  total_downloads?: number;
}): Resource {
  return {
    id: partial.id,
    name: partial.name,
    slug: `resource-${partial.id}`,
    source: partial.source,
    source_url: null,
    type: 'library',
    description: '',
    short_description: '',
    documentation_url: null,
    github_url: null,
    license: 'MIT',
    itqan_badge: false,
    status: 'published',
    created_at: partial.created_at,
    updated_at: '',
    version: null,
    github_stats: null,
    total_downloads: partial.total_downloads ?? 0,
    downloads: 0,
  };
}

// Stand-ins for the two production sources:
// - cmsLike: mirrors cms.ts, which has no date fields upstream ('' and one
//   deliberately invalid value; the dated one represents a CMS that later
//   starts exposing real dates).
// - payloadLike: mirrors payload.ts, which maps real createdAt timestamps.
const cmsLikeResources = [
  makeResource({ id: 101, name: 'CMS undated A', source: 'cms', created_at: '' }),
  makeResource({ id: 102, name: 'CMS undated B', source: 'cms', created_at: '' }),
  makeResource({ id: 103, name: 'CMS invalid date', source: 'cms', created_at: 'not-a-date' }),
  makeResource({ id: 104, name: 'CMS dated', source: 'cms', created_at: '2026-03-01T10:00:00Z' }),
];
const payloadLikeResources = [
  makeResource({ id: 201, name: 'Payload mid', source: 'payload', created_at: '2026-01-15T00:00:00Z', total_downloads: 5 }),
  makeResource({ id: 202, name: 'Payload newest', source: 'payload', created_at: '2026-06-01T00:00:00Z', total_downloads: 3 }),
  makeResource({ id: 203, name: 'Payload oldest', source: 'payload', created_at: '2025-12-01T00:00:00Z', total_downloads: 4 }),
];

vi.mock('@/modules/resources/infrastructure/repositories/registry', () => ({
  SOURCES: [
    {
      id: 'cms',
      label: 'CMS',
      list: async () => ({
        count: cmsLikeResources.length,
        next: null,
        previous: null,
        results: cmsLikeResources,
      }),
    },
    {
      id: 'payload',
      label: 'Payload',
      list: async () => ({
        count: payloadLikeResources.length,
        next: null,
        previous: null,
        results: payloadLikeResources,
      }),
    },
  ],
}));

// Import AFTER the mock is registered so SOURCES is our controlled fixture.
const { resourceAggregator } = await import(
  '@/modules/resources/infrastructure/repositories/aggregate'
);

// The aggregator merges sources in registry order: cmsLike first, then payloadLike.
const idsOf = async (params: Parameters<typeof resourceAggregator.list>[0]) =>
  (await resourceAggregator.list(params)).results.map((r) => r.id);

describe('resourceAggregator.list — newest/oldest date sorting', () => {
  it('orders dated resources newest-first across sources, undated last in stable source order', async () => {
    // Dated items must interleave by date regardless of source; undated ones
    // (time 0) sink below every dated resource without breaking the sort.
    expect(await idsOf({ sort: 'newest', page_size: 10 })).toEqual([
      202, // 2026-06-01
      104, // 2026-03-01 (CMS with a real date participates globally)
      201, // 2026-01-15
      203, // 2025-12-01
      101, // '' (undated, keeps source order)
      102,
      103, // 'not-a-date' (invalid, same treatment as '')
    ]);
  });

  it('orders oldest-first as the exact reverse chronological order, undated first', async () => {
    expect(await idsOf({ sort: 'oldest', page_size: 10 })).toEqual([
      101, 102, 103, // undated (time 0)
      203, // 2025-12-01
      201, // 2026-01-15
      104, // 2026-03-01
      202, // 2026-06-01
    ]);
  });

  it('keeps multiple undated resources in a deterministic order across repeated calls', async () => {
    const first = await idsOf({ sort: 'newest', page_size: 10 });
    const second = await idsOf({ sort: 'newest', page_size: 10 });
    expect(first).toEqual(second);
    // Undated resources never reorder among themselves (stable sort on equal keys).
    expect(first.filter((id) => [101, 102, 103].includes(id))).toEqual([101, 102, 103]);
  });

  it('does not throw or scramble results when created_at is empty or invalid', async () => {
    const { results, count } = await resourceAggregator.list({ sort: 'newest', page_size: 10 });
    expect(count).toBe(7);
    expect(results).toHaveLength(7);
    expect(new Set(results.map((r) => r.id))).toEqual(new Set([101, 102, 103, 104, 201, 202, 203]));
  });

  it('leaves other sort modes unaffected', async () => {
    // downloads: descending by total_downloads; the zero-download undated
    // CMS items keep their merged source order (stable sort).
    expect(await idsOf({ sort: 'downloads', page_size: 10 })).toEqual([201, 203, 202, 101, 102, 103, 104]);
    // name sorts keep working over the merged list
    const names = (await resourceAggregator.list({ sort: 'name_desc', page_size: 10 })).results.map((r) => r.name);
    expect(names).toEqual([...names].sort((a, b) => b.localeCompare(a)));
    // relevance (no sort param): merged source order preserved
    expect(await idsOf({ page_size: 10 })).toEqual([101, 102, 103, 104, 201, 202, 203]);
  });
});
