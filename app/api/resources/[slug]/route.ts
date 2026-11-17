import { fetchApiResource, handle, preflight } from '@/lib/publicApi';

export const dynamic = 'force-dynamic';

export const GET = (request: Request, { params }: { params: Promise<{ slug: string }> }) =>
  handle(request, async () => fetchApiResource((await params).slug));
export const OPTIONS = preflight;
