'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/i18n';

interface PaginationProps {
  count: number;
  pageSize?: number;
}

export function Pagination({ count, pageSize = 12 }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locale } = useLanguage();
  const totalPages = Math.ceil(count / pageSize);
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  if (totalPages <= 1) return null;

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(page));
    router.push(`/resources?${params.toString()}`);
  };

  const pages: (number | '…')[] = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('…');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('…');
    pages.push(totalPages);
  }

  const prevLabel = locale === 'ar' ? 'السابق' : 'Prev';
  const nextLabel = locale === 'ar' ? 'التالي' : 'Next';

  const ChevronLeft = (
    <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
  const ChevronRight = (
    <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );

  return (
    <nav className="flex items-center justify-center gap-2 mt-8 mb-16" aria-label="Pagination">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className="btn-outline disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
      >
        {ChevronLeft}
        <span>{prevLabel}</span>
      </button>
      <div className="flex items-center gap-1">
        {pages.map((page, i) =>
          page === '…' ? (
            <span key={`ellipsis-${i}`} className="px-2 text-[var(--text-muted)] text-sm">
              …
            </span>
          ) : (
            <button
              key={page}
              onClick={() => goToPage(page as number)}
              className={`w-9 h-9 rounded-lg text-sm font-heading transition-colors ${
                page === currentPage
                  ? 'bg-[var(--accent-primary)] text-white'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
              }`}
            >
              {page}
            </button>
          )
        )}
      </div>
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="btn-outline disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
      >
        <span>{nextLabel}</span>
        {ChevronRight}
      </button>
    </nav>
  );
}
