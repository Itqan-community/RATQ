import { NextResponse } from 'next/server';
import { resourceAggregator } from '@/modules/resources/infrastructure/repositories/aggregate';
import { withEdgeCache } from '@/shared/infrastructure/edge-cache';
import type { Publisher } from '@/types/resource';

export const runtime = 'edge';
const PUBLISHERS_RESOURCE_PAGE_SIZE = 10_000;

export async function GET(request: Request) {
  return withEdgeCache(request, async () => {
    const { results } = await resourceAggregator.list({
      page: 1,
      page_size: PUBLISHERS_RESOURCE_PAGE_SIZE,
    });
    const publishers = new Map<string, Publisher>();

    results.forEach((resource) => {
      if (!resource.publisher) return;
      const key = String(resource.publisher.name );
      if (!publishers.has(key)) {
        publishers.set(key, {
          id: resource.publisher.id,
          name: resource.publisher.name,
        });
      }
    });

    return NextResponse.json([...publishers.values()].sort((a, b) => a.name.localeCompare(b.name)), {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60' },
    });
  });
}
