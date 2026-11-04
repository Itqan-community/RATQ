// src/components/resources/ResourceGrid.tsx
import React from 'react';
import { Resource } from '@/types';
import { ResourceCard } from './ResourceCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { clsx } from 'clsx';

interface ResourceGridProps {
  resources: Resource[];
  isLoading?: boolean;
  viewMode?: 'grid' | 'list';
  isCompact?: boolean;
  onResetFilters?: () => void;
}

export const ResourceGrid: React.FC<ResourceGridProps> = ({
  resources,
  isLoading = false,
  viewMode = 'grid',
  isCompact = false,
  onResetFilters,
}) => {
  if (isLoading) {
    return (
      <div
        className={clsx(
          'grid gap-4',
          viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'
        )}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={clsx(
              'rounded-xl border border-border bg-canvas flex flex-col',
              isCompact ? 'p-3.5 gap-2' : 'p-5 gap-3'
            )}
          >
            <div className="flex justify-between items-center">
              <Skeleton className="w-1/2 h-5" />
              <Skeleton className="w-14 h-5" />
            </div>
            <Skeleton className="w-full h-4 mt-0.5" />
            {!isCompact && <Skeleton className="w-full h-8" />}
            <div className="flex justify-between items-center mt-auto pt-2 border-t border-border-subtle">
              <Skeleton className="w-14 h-3" />
              <Skeleton className="w-12 h-4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <EmptyState
        title="لا توجد موارد مطابقة لبحثك"
        description="جرّب إزالة بعض الفلاتر أو استخدام كلمات بحث أعم، أو تصفح التصنيفات الشاملة."
        actionLabel="إعادة تعيين الفلاتر"
        onAction={onResetFilters}
      />
    );
  }

  return (
    <div
      className={clsx(
        'grid gap-4',
        viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'
      )}
    >
      {resources.map((res) => (
        <ResourceCard
          key={res.id}
          resource={res}
          viewMode={viewMode}
          isCompact={isCompact}
          showEnglishTitle={false}
        />
      ))}
    </div>
  );
};
