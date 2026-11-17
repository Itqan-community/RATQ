import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SpaShell } from '../SpaShell';
import { isKnownPath } from '@/lib/knownRoutes';
import { routeTitle } from '@/lib/routeTitle';
import { mockRobots } from '../seo';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string[] }> };
const pathOf = async ({ params }: Props) => '/' + (await params).slug.join('/');

// Every other SPA route (about, faq, portals, ...). Unknown paths get a real 404 instead of the SPA's soft one.
export async function generateMetadata(props: Props): Promise<Metadata> {
  const path = await pathOf(props);
  return isKnownPath(path) ? { title: { absolute: routeTitle(path, 'ar') }, robots: mockRobots(path) } : { robots: { index: false } };
}

export default async function SpaPage(props: Props) {
  if (!isKnownPath(await pathOf(props))) notFound();
  return <SpaShell />;
}
