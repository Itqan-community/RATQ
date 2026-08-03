import { NextResponse } from 'next/server';
import { resourceAggregator } from '@/modules/resources/infrastructure/repositories/aggregate';
import { withEdgeCache } from '@/shared/infrastructure/edge-cache';

export const runtime = 'edge';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  return withEdgeCache(request, async () => {
    const { slug } = await params;
    const resource = await resourceAggregator.get(slug);
    if (!resource) return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    return NextResponse.json(resource, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60' },
    });
  });
}
