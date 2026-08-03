'use client';

import { useState } from 'react';
import { useMyReports } from '@/hooks/useMyReports';
import { ReportRow } from '@/components/developer/ReportRow';
import type { Report, ReportReason } from '@/types/resource';

const reasonFilters: { value: string; label: string }[] = [
  { value: '', label: 'السبب: الكل' },
  { value: 'inaccurate', label: 'غير دقيق' },
  { value: 'inappropriate', label: 'غير لائق' },
  { value: 'infringing', label: 'انتهاك' },
  { value: 'spam', label: 'مزعج' },
  { value: 'outdated', label: 'قديم' },
  { value: 'broken-link', label: 'رابط معطل' },
];

export default function DeveloperReportsPage() {
  const { data: reports, isLoading } = useMyReports();
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [reasonFilter, setReasonFilter] = useState<string>('');

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="card p-4 animate-pulse">
            <div className="skeleton h-4 w-1/2 rounded mb-2" />
            <div className="skeleton h-3 w-1/3 rounded" />
          </div>
        ))}
      </div>
    );
  }

  const filtered = (reports ?? []).filter((r: Report) => {
    if (statusFilter && r.status !== statusFilter) return false;
    if (reasonFilter && r.reason !== reasonFilter) return false;
    return true;
  });

  return (
    <div>
      <h2 className="font-heading text-xl font-bold text-[var(--text-primary)] mb-6">تقاريري</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-field text-sm py-2 px-3"
        >
          <option value="">الحالة: الكل</option>
          <option value="open">مفتوح</option>
          <option value="resolved">محلول</option>
          <option value="closed">مغلق</option>
        </select>
        <select
          value={reasonFilter}
          onChange={(e) => setReasonFilter(e.target.value)}
          className="input-field text-sm py-2 px-3"
        >
          {reasonFilters.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
      </div>

      {/* Reports list */}
      {filtered.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-[var(--text-muted)]">لا توجد تقارير</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((report: Report) => (
            <ReportRow key={report.id} report={report} />
          ))}
        </div>
      )}
    </div>
  );
}
