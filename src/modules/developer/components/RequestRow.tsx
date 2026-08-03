'use client';

import type { AccessRequest } from '@/types/resource';

const statusStyles: Record<AccessRequest['status'], { bg: string; text: string; label: string }> = {
  pending: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'معلق' },
  approved: { bg: 'bg-green-100', text: 'text-green-700', label: 'مقبول' },
  denied: { bg: 'bg-red-100', text: 'text-red-700', label: 'مرفوض' },
};

interface RequestRowProps {
  request: AccessRequest;
}

export function RequestRow({ request }: RequestRowProps) {
  const style = statusStyles[request.status];

  return (
    <div className="card p-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-heading font-semibold text-sm">{request.resource_name}</span>
            <span className={`badge ${style.bg} ${style.text}`}>{style.label}</span>
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            {new Date(request.created_at).toLocaleDateString('ar', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
          {request.publisher_notes && (
            <p className="text-sm mt-2 text-[var(--text-secondary)] bg-[var(--bg-secondary)] rounded-lg p-3">
              <span className="text-[var(--text-muted)] text-xs">ملاحظات الناشر:</span>{' '}
              {request.publisher_notes}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
