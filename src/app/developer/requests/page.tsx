'use client';

import { useState } from 'react';
import { useDeveloperRequests } from '@/hooks/useDeveloperRequests';
import { RequestRow } from '@/components/developer/RequestRow';
import type { AccessRequest } from '@/types/resource';

export default function DeveloperRequestsPage() {
  const { data: requests, isLoading } = useDeveloperRequests();
  const [statusFilter, setStatusFilter] = useState<string>('');

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

  const filtered = (requests ?? []).filter((r: AccessRequest) => {
    if (statusFilter && r.status !== statusFilter) return false;
    return true;
  });

  return (
    <div>
      <h2 className="font-heading text-xl font-bold text-[var(--text-primary)] mb-6">طلبات الوصول</h2>

      {/* Filter */}
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="input-field text-sm py-2 px-3 mb-6 w-48"
      >
        <option value="">الحالة: الكل</option>
        <option value="pending">معلق</option>
        <option value="approved">مقبول</option>
        <option value="denied">مرفوض</option>
      </select>

      {/* Requests list */}
      {filtered.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-[var(--text-muted)]">لا توجد طلبات وصول</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((request: AccessRequest) => (
            <RequestRow key={request.id} request={request} />
          ))}
        </div>
      )}
    </div>
  );
}
