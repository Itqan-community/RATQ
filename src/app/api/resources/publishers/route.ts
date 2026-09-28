import { NextResponse } from 'next/server';
import { resourceAggregator } from '@/modules/resources/infrastructure/repositories/aggregate';
import { withEdgeCache } from '@/shared/infrastructure/edge-cache';
import { publisherKey } from '@/shared/utils/publisher-filter';
import type { PublisherOption } from '@/types/resource';

export const runtime = 'edge';
const PUBLISHERS_RESOURCE_PAGE_SIZE = 10_000;

export async function GET(request: Request) {
  return withEdgeCache(request, async () => {
    const { results } = await resourceAggregator.list({
      page: 1,
      page_size: PUBLISHERS_RESOURCE_PAGE_SIZE,
    });
    const publishers = new Map<string, PublisherOption>();

    results.forEach((resource) => {
      if (!resource.publisher) return;
      const key = publisherKey(resource) as string;
      const { id, name, name_ar } = resource.publisher;
      const existing = publishers.get(key);
      // A resource whose Arabic fetch failed carries no name_ar; keep looking
      // through the rest for one that has it.
      if (!existing) publishers.set(key, { key, id, name, name_ar });
      else if (!existing.name_ar && name_ar) existing.name_ar = name_ar;
    });

    return NextResponse.json([...publishers.values()].sort((a, b) => a.name.localeCompare(b.name)), {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60' },
    });
  });
}
