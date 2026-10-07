import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Resource } from '@/types/resource';
import type { ResourceSource } from '@/modules/resources/infrastructure/repositories/types';

// The aggregator reads SOURCES from the registry at call time; swap in fake
// sources per test through this hoisted holder.
const state = vi.hoisted(() => ({ sources: [] as unknown[] }));

vi.mock('@/modules/resources/infrastructure/repositories/registry', () => ({
  get SOURCES() {
    return state.sources;
  },
}));

const { resourceAggregator } = await import(
  '@/modules/resources/infrastructure/repositories/aggregate'
);

function resource(slug: string): Resource {
  return { slug, name: slug, source: 'cms' } as Resource;
}

function listReturning(resources: Resource[]) {
  return vi.fn(async () => ({ count: resources.length, next: null, previous: null, results: resources }));
}

beforeEach(() => {
  state.sources = [];
});

describe('resourceAggregator.get per-source lookup (issue M1)', () => {
  it('routes a prefixed slug to the matching source getBySlug without scanning the catalog', async () => {
    const getBySlug = vi.fn(async (slug: string) => resource(slug));
    const list = listReturning([]);
    state.sources = [
      { id: 'cms', label: 'CMS', slugPrefix: 'cms-', list, getBySlug } satisfies ResourceSource,
    ];

    const result = await resourceAggregator.get('cms-27');

    expect(getBySlug).toHaveBeenCalledWith('cms-27');
    expect(list).not.toHaveBeenCalled();
    expect(result?.slug).toBe('cms-27');
  });

  it('does not scan when the source reports the slug is missing', async () => {
    const getBySlug = vi.fn(async () => null);
    const list = listReturning([resource('cms-27')]);
    state.sources = [
      { id: 'cms', label: 'CMS', slugPrefix: 'cms-', list, getBySlug } satisfies ResourceSource,
    ];

    const result = await resourceAggregator.get('cms-999');

    expect(result).toBeUndefined();
    expect(list).not.toHaveBeenCalled();
  });

  it('falls back to the full scan for sources without getBySlug', async () => {
    const list = listReturning([resource('legacy-1')]);
    state.sources = [
      { id: 'cms', label: 'Legacy', slugPrefix: 'legacy-', list } satisfies ResourceSource,
    ];

    const result = await resourceAggregator.get('legacy-1');

    expect(list).toHaveBeenCalled();
    expect(result?.slug).toBe('legacy-1');
  });

  it('routes unprefixed slugs to the source that owns no prefix', async () => {
    const getBySlug = vi.fn(async (slug: string) => resource(slug));
    const list = listReturning([]);
    state.sources = [
      { id: 'cms', label: 'CMS', slugPrefix: 'cms-', list, getBySlug: vi.fn(async () => null) } satisfies ResourceSource,
      { id: 'ratq', label: 'RATQ', list, getBySlug } satisfies ResourceSource,
    ];

    const result = await resourceAggregator.get('quranic-text-toolkit');

    expect(getBySlug).toHaveBeenCalledWith('quranic-text-toolkit');
    expect(list).not.toHaveBeenCalled();
    expect(result?.slug).toBe('quranic-text-toolkit');
  });

  it('degrades to the scan when getBySlug throws', async () => {
    const getBySlug = vi.fn(async () => {
      throw new Error('boom');
    });
    const list = listReturning([resource('cms-27')]);
    state.sources = [
      { id: 'cms', label: 'CMS', slugPrefix: 'cms-', list, getBySlug } satisfies ResourceSource,
    ];
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await resourceAggregator.get('cms-27');

    expect(list).toHaveBeenCalled();
    expect(result?.slug).toBe('cms-27');
    errorSpy.mockRestore();
  });
});
