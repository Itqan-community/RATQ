// Cloudflare Pages Functions don't honor zone-level Cache Rules or Next's
// `next: { revalidate }` fetch cache for routes that read searchParams
// (confirmed live: no cf-cache-status header, latency never improved across
// repeat requests even with a matching zone Cache Rule in place). The
// Workers Cache API is the one mechanism that reliably caches a response
// from inside a Pages Function itself.
export async function withEdgeCache(request: Request, compute: () => Promise<Response>): Promise<Response> {
  const cache: Cache | undefined = (globalThis as { caches?: { default?: Cache } }).caches?.default;
  if (!cache) return compute(); // local dev / non-Cloudflare runtime - no Cache API available

  const cacheKey = new Request(request.url, request);
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const response = await compute();
  if (response.ok) await cache.put(cacheKey, response.clone());
  return response;
}
