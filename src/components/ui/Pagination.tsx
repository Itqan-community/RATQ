// src/components/ui/Pagination.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './Button';
import { DirectionalIcon } from './DirectionalIcon';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const { t } = useTranslation('site');
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between gap-2 py-4">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        startIcon={<DirectionalIcon name="arrow-prev" />}
      >
        {t('ui.prev')}
      </Button>

      <span className="text-xs font-medium text-fg-muted">
        {t('ui.page_of', { current: currentPage, total: totalPages })}
      </span>

      <Button
        variant="outline"
        size="sm"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        endIcon={<DirectionalIcon name="arrow-next" />}
      >
        {t('ui.next')}
      </Button>
    </div>
  );
};
