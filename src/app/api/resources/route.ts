import { NextRequest, NextResponse } from 'next/server';
import { resourceAggregator } from '@/lib/sources/aggregate';
import { withEdgeCache } from '@/lib/edge-cache';
import type { ResourceListParams, SortOption } from '@/types/resource';

export const runtime = 'edge';

// Client components (useResources/useResource via SWR) hit this same-origin
// route instead of calling the aggregator directly, so source fetches (e.g.
// CMS) run server-side.
export async function GET(request: NextRequest) {
  return withEdgeCache(request, async () => {
    const sp = request.nextUrl.searchParams;
    const params: ResourceListParams = {
      type: sp.get('type') || undefined,
      license: sp.get('license') || undefined,
      itqan_badge: sp.get('itqan_badge') || undefined,
      search: sp.get('search') || undefined,
      sort: (sp.get('sort') as SortOption) || undefined,
      page: sp.get('page') ? Number(sp.get('page')) : undefined,
      page_size: sp.get('page_size') ? Number(sp.get('page_size')) : undefined,
    };

    const data = await resourceAggregator.list(params);
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60' },
    });
  });
}
