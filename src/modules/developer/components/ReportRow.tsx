'use client';

import type { Report, ReportReason } from '@/types/resource';

const statusStyles: Record<Report['status'], { bg: string; text: string; label: string }> = {
  open: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'مفتوح' },
  resolved: { bg: 'bg-green-100', text: 'text-green-700', label: 'محلول' },
  closed: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'مغلق' },
};

const reasonLabels: Record<ReportReason, string> = {
  inaccurate: 'غير دقيق',
  inappropriate: 'غير لائق',
  infringing: 'انتهاك',
  spam: 'مزعج',
  outdated: 'قديم',
  'broken-link': 'رابط معطل',
};

interface ReportRowProps {
  report: Report;
}

export function ReportRow({ report }: ReportRowProps) {
  const style = statusStyles[report.status];

  return (
    <div className="card p-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-heading font-semibold text-sm">{report.resource_slug}</span>
            <span className={`badge ${style.bg} ${style.text}`}>{style.label}</span>
            <span className="badge bg-blue-100 text-blue-800 text-xs">{reasonLabels[report.reason]}</span>
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            {new Date(report.created_at).toLocaleDateString('ar', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
          <p className="text-sm text-[var(--text-secondary)] mt-1">{report.details}</p>
        </div>
      </div>
    </div>
  );
}
