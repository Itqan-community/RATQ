// Live's public catalog JSON (CORS *, 5 min edge cache): see src/lib/publicApi.ts.
import { fetchApiResources, handle, listParamsFrom, listResources, preflight } from '@/lib/publicApi';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export const GET = (request: Request) =>
  handle(request, async () => listResources(await fetchApiResources(), listParamsFrom(new URL(request.url).searchParams)));
export const OPTIONS = preflight;
