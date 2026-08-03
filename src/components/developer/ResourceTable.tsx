'use client';

import Link from 'next/link';
import { ResourceBadge } from '@/components/ui/Badge';
import type { Resource } from '@/types/resource';

interface ResourceTableProps {
  resources: Resource[];
  emptyLabel?: string;
}

export function ResourceTable({ resources, emptyLabel = 'لا توجد موارد' }: ResourceTableProps) {
  if (resources.length === 0) {
    return (
      <div className="card p-8 text-center">
        <p className="text-[var(--text-muted)]">{emptyLabel}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {resources.map((resource) => (
        <div
          key={resource.id}
          className="card p-4 flex flex-col sm:flex-row sm:items-center gap-3"
        >
          <div className="flex-grow">
            <div className="flex items-center gap-2 mb-1">
              <ResourceBadge type={resource.type} />
              {resource.itqan_badge && (
                <span className="badge bg-[var(--accent-gold-light)] text-[var(--accent-gold)] text-xs">
                  ★ Itqan
                </span>
              )}
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                resource.status === 'published'
                  ? 'bg-green-100 text-green-700'
                  : resource.status === 'draft'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {resource.status === 'published' ? 'منشور' : resource.status === 'draft' ? 'مسودة' : 'أرشيف'}
              </span>
            </div>
            <h3 className="font-heading font-semibold text-sm">
              <Link
                href={`/developer/resources/${resource.slug}`}
                className="hover:text-[var(--accent-primary)] transition-colors"
              >
                {resource.name}
              </Link>
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              {resource.version || 'بدون إصدار'} · {resource.total_downloads} تحميل
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              href={`/developer/resources/${resource.slug}`}
              className="btn-outline text-xs py-1.5 px-3"
            >
              عرض
            </Link>
            {resource.type === 'api' && (
              <Link
                href={`/developer/resources/${resource.slug}/access`}
                className="btn-primary text-xs py-1.5 px-3"
              >
                إدارة الوصول
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
