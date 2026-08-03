'use client';

import Link from 'next/link';
import { useResources } from '@/hooks/useResources';
import type { Resource } from '@/types/resource';
import { ResourceBadge } from '@/components/ui/Badge';
import { useTranslations } from '@/i18n';

interface RelatedResourcesProps {
  currentResourceId: number;
  currentResourceType?: string;
}

export function RelatedResources({ currentResourceId, currentResourceType }: RelatedResourcesProps) {
  const t = useTranslations();
  // Fetch only resources of the same type — server-side filter, fewer results
  const { data: paginated, isLoading } = useResources({
    type: currentResourceType,
    page_size: 6,
  });

  if (isLoading) {
    return (
      <section className="mt-8">
        <h2 className="font-heading text-xl font-semibold mb-4">{t.resource.detail.relatedResources}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-28 rounded-lg" />
          ))}
        </div>
      </section>
    );
  }

  const allResources = paginated?.results ?? [];
  const related = allResources
    .filter((r) => r.id !== currentResourceId)
    .slice(0, 4);

  if (related.length === 0) {
    return null;
  }

  return (
    <section className="mt-8">
      <h2 className="font-heading text-xl font-semibold mb-4">{t.resource.detail.relatedResources}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {related.map((resource) => (
          <RelatedResourceCard key={resource.id} resource={resource} />
        ))}
      </div>
    </section>
  );
}

function RelatedResourceCard({ resource }: { resource: Resource }) {
  return (
    <Link
      href={`/resources/${resource.slug}`}
      className="card p-4 flex flex-col gap-2 hover:border-[var(--accent-primary)] transition-colors block no-underline"
    >
      <div className="flex items-center gap-2">
        <ResourceBadge type={resource.type} />
        {resource.itqan_badge && (
          <span className="badge bg-[var(--accent-gold-light)] text-[var(--accent-gold)]" title="Itqan Verified">
            ★
          </span>
        )}
      </div>
      <h3 className="font-heading font-semibold text-sm leading-snug text-[var(--text-primary)]">
        {resource.name}
      </h3>
      <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-2">
        {resource.short_description || resource.description}
      </p>
    </Link>
  );
}
