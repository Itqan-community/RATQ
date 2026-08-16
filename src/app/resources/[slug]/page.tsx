import { cache } from 'react';
import { notFound } from 'next/navigation';
import { resourceAggregator } from '@/modules/resources/infrastructure/repositories/aggregate';
import { withEdgeCache } from '@/shared/infrastructure/edge-cache';
import { ResourceDetailClient } from './ResourceDetailClient';
import type { Resource } from '@/types/resource';

// Required by @cloudflare/next-on-pages: non-static routes must opt into the
// edge runtime or the CF Pages build fails.
export const runtime = 'edge';

// Page components run in the same edge runtime as /api/resources/[slug] but
// previously called resourceAggregator.get() directly, bypassing the
// Workers Cache API layer that route uses (see withEdgeCache) - Next's
// `next: { revalidate }` fetch cache isn't reliably honored on this runtime
// (see edge-cache.ts comment), so every page visit re-hit the CMS uncached.
// This wraps the same aggregator call in withEdgeCache using a synthetic
// cache-key Request (never actually sent over the network) so the page
// benefits from the same cache as the API route, without an extra self-fetch
// round-trip or needing a base-URL env var.
// Wrapped in React's cache() so generateMetadata and the page component
// (which both need the same resource) share one call per request instead
// of hitting withEdgeCache's cache.match twice.
const getCachedResource = cache(async (slug: string): Promise<Resource | null> => {
  const cacheKeyRequest = new Request(`https://cache-key.internal/resources/${slug}`);
  const response = await withEdgeCache(cacheKeyRequest, async () => {
    const resource = await resourceAggregator.get(slug);
    return new Response(JSON.stringify(resource ?? null), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
      },
    });
  });
  return response.json();
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resource = await getCachedResource(slug);
  if (!resource) return { title: 'Resource Not Found' };
  return {
    title: resource.name,
    description: resource.description.slice(0, 160),
  };
}

export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resource = await getCachedResource(slug);
  if (!resource) {
    notFound();
  }
  return <ResourceDetailClient resource={resource} />;
}
