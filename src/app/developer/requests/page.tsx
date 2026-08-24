"use client";

import { useState } from 'react';
import { useDeveloperRequests } from '@/hooks/useDeveloperRequests';
import type { AccessRequest } from '@/types/resource';
import { RequestCard, RequestCardSkeleton } from '@/modules/developer/components/RequestCard';
import { useUpdateAccessRequest } from '@/hooks/useUpdateAccessRequest';

export default function DeveloperRequestsPage() {
  const { data: requests, isLoading } = useDeveloperRequests();
    const {handleApprove, handleDeny} = useUpdateAccessRequest()
  
  const [statusFilter, setStatusFilter] = useState<string>("");

  if (isLoading) {
    return (
      <>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <RequestCardSkeleton key={i} />
          ))}
        </div>
      </>
    );
  }

  const filtered = (requests ?? []).filter((r: AccessRequest) => {
    if (statusFilter && r.status !== statusFilter) return false;
    return true;
  });

  return (
    <div>
      <h2 className="font-heading text-xl font-bold text-[var(--text-primary)] mb-6">
        طلبات الوصول
      </h2>

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

      <div className="space-y-3">
        {!!filtered.length ? (
          filtered.map((request: AccessRequest) => (
            <RequestCard
              key={request.id}
              request={request}
              onApprove={handleApprove}
              onDeny={handleDeny}
            />
          ))
        ) : (
          <div className="card p-8 text-center">
            <p className="text-[var(--text-muted)]">لا توجد طلبات وصول</p>
          </div>
        )}
      </div>
    </div>
  );
}
