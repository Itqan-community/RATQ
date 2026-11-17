import { fetchApiResources, handle, preflight, publishersFrom } from '@/lib/publicApi';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export const GET = (request: Request) => handle(request, async () => publishersFrom(await fetchApiResources()));
export const OPTIONS = preflight;
