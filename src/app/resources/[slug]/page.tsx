import { notFound } from 'next/navigation';
import { mockResources } from '@/lib/mock-data';
import { ResourceDetailClient } from './ResourceDetailClient';

// Required by @cloudflare/next-on-pages: non-static routes must opt into the
// edge runtime or the CF Pages build fails.
export const runtime = 'edge';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resource = mockResources.find((r) => r.slug === slug);
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
  const mock = mockResources.find((r) => r.slug === slug);

  if (!mock) {
    notFound();
  }

  return <ResourceDetailClient resource={{ ...mock, source: 'ratq', source_url: null }} />;
}
