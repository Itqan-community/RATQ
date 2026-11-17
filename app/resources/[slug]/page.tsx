import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SpaShell } from '../../SpaShell';
import { SeoBlock, decodeSlug, getResource, mockRobots, openGraph } from '../../seo';
import { isReservedResourceSlug } from '@/lib/knownRoutes';
import { routeTitle } from '@/lib/routeTitle';
import { resourceMeta } from '@/lib/seoMeta';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const raw = (await params).slug;
  const slug = decodeSlug(raw);
  // Static SPA pages that live under /resources (roadmap, wizard, ...) keep their route title.
  if (isReservedResourceSlug(slug)) return { title: { absolute: routeTitle(`/resources/${slug}`, 'ar') }, robots: mockRobots(`/resources/${slug}`) };
  const resource = await getResource(slug);
  if (resource === null) return { title: 'Resource Not Found', robots: { index: false, follow: false } };
  if (!resource) return {};
  const m = resourceMeta(resource);
  const path = `/resources/${encodeURIComponent(slug)}`;
  return {
    title: m.title,
    description: m.description,
    alternates: { canonical: path },
    openGraph: openGraph({ ...m, path }),
    twitter: { card: m.image ? 'summary_large_image' : 'summary', title: m.title, description: m.description, images: m.image ? [m.image] : undefined },
  };
}

export default async function ResourcePage({ params }: Props) {
  const slug = decodeSlug((await params).slug);
  if (isReservedResourceSlug(slug)) return <SpaShell />;
  const resource = await getResource(slug);
  if (resource === null) notFound(); // real 404 status (live: notFound() + noindex page)
  const seo = resource && <SeoBlock title={resource.title_ar} description={resource.description_ar || resource.summary_ar} />;
  return <SpaShell seo={seo || undefined} />;
}
