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
    const publishers = new Map<number, Publisher>();

    results.forEach((resource) => {
      if (!resource.publisher) return;
      const { id, name, name_ar } = resource.publisher;
      if (!publishers.has(id)) publishers.set(id, { id, name, name_ar });
    });

    return NextResponse.json([...publishers.values()].sort((a, b) => a.name.localeCompare(b.name)), {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60' },
    });
  });
}
