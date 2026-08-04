import { Suspense } from 'react';
import { CatalogContent } from './CatalogContent';

export default function CatalogPage() {
  return (
    <Suspense fallback={<CatalogLoading />}>
      <CatalogContent />
    </Suspense>
  );
}

function CatalogLoading() {
  return (
    <div className="bg-white pb-20 pt-36">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="h-[250px] animate-pulse rounded-[28px] bg-[#e7eef3]" />
        <div className="mt-7 grid gap-7 lg:grid-cols-[270px_minmax(0,1fr)]">
          <div className="h-[560px] animate-pulse rounded-[18px] bg-[#fafafa]" />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 9 }).map((_, index) => (
              <div key={index} className="h-[305px] animate-pulse rounded-[13px] bg-[#f5f5f5]" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
