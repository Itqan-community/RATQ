'use client';

import { useState } from 'react';
import { useLanguage } from '@/shared/ui/i18n';
import { canApproveOrDeny } from '@/modules/developer/domain/services/access-request-status';
import type { AccessRequest } from '@/types/resource';
import { useUpdateAccessRequest } from '@/hooks/useUpdateAccessRequest';
import { useAuth } from '@/hooks/useAuth';

interface RequestCardProps { request: AccessRequest; }

export function RequestCardSkeleton() {
  const { t } = useLanguage();
  return (
    <article
      aria-busy="true"
      aria-label={
        t.dashboard.requests.loadingMassgesSkeleton
      }
      className="rounded-lg border border-[#ededed] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.035)]"
    >
      <div className='animate-pulse'>
        <div className=" flex justify-between items-center">
          <div className="w-full">
            <div className="skeleton h-4 w-1/2 rounded mb-2" />
          </div>
          <div className="flex gap-2">
            <div className="skeleton h-6 w-16 rounded-full" />
            <div className="skeleton h-6 w-16 rounded-full" />
          </div>

        </div>
        <div className="skeleton h-20 w-full rounded mt-4" />
      </div>

    </article>


  );
}

export function RequestCard({ request }: RequestCardProps) {
  const { t, locale } = useLanguage();
  const { user } = useAuth();
  const copy = t.dashboard.requests;
  const statusStyles: Record<AccessRequest['status'], { bg: string; text: string; label: string }> = {
    pending: { bg: 'bg-[#fff7e6]', text: 'text-[#9a5a00]', label: copy.pending },
    approved: { bg: 'bg-green-50', text: 'text-green-700', label: copy.approved },
    denied: { bg: 'bg-red-50', text: 'text-red-700', label: copy.denied },
    // Neutral rather than red: denied means the request was refused, revoked
    // means access was granted and later withdrawn - different states.
    revoked: { bg: 'bg-[#f3f4f6]', text: 'text-[#4b5563]', label: copy.revoked },
  };
  const style = statusStyles[request.status];
  const date = new Date(request.created_at).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const requestedBy = copy.requestedBy.replace('{{name}}', request.applicant_display_name).replace('{{date}}', date);

  const { trigger, isMutating, error } = useUpdateAccessRequest();
  const [pendingAction, setPendingAction] = useState<'approved' | 'denied' | null>(null);


  const handleApprove = async (id: number) => {

    if (isMutating) return // Just to prevent the extra request 

    setPendingAction('approved');
    try {
      await trigger([id, 'approved'], {
        onError: (error) => {
          // TODO: Add a toast notification to show the error message
          console.error('Error updating access request:', error);
        },
      });
    } finally {
      setPendingAction(null);
    }
  };

  const handleDeny = async (id: number) => {
    if (isMutating) return // Just to prevent the extra request 

    setPendingAction('denied');
    try {
      await trigger([id, 'denied'], {
        onError: (error) => {
          // TODO: Add a toast notification to show the error message
          console.error('Error updating access request:', error);
          console.error('Can\'t update access request:', error);
        },
      });
    } finally {
      setPendingAction(null);
    }
  };

  return (
    <article className="rounded-lg border border-[#ededed] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.035)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2"><h3 className="text-base font-black text-black">{request.resource_name}</h3><span className={`rounded-full px-3 py-1 text-xs font-black ${style.bg} ${style.text}`}>{style.label}</span></div>
          <p className="mt-2 text-xs font-bold text-[#8b949e]">{requestedBy}</p>
          <p className="mt-4 rounded-lg bg-[#fafafa] p-4 text-sm leading-7 text-[#59636d]">{request.message}</p>
          {request.publisher_notes && <p className="mt-3 text-sm italic leading-6 text-[#8b949e]">Notes: {request.publisher_notes}</p>}
        </div>
        {canApproveOrDeny(request) &&
        request.resource_owner_id === user?.id && (
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => handleApprove(request.id)}
              disabled={isMutating}
              className="h-9 rounded-full bg-[#171717] px-4 text-xs font-black text-white transition hover:bg-black"
            >
              {isMutating && pendingAction === 'approved' ? t.dashboard.requests.loading : copy.approve}
            </button>
            <button
              type="button"
              onClick={() => handleDeny(request.id)}
              disabled={isMutating}
              className="h-9 rounded-full border border-red-200 bg-white px-4 text-xs font-black text-red-700 transition hover:bg-red-50"
            >
              {isMutating && pendingAction === 'denied' ? t.dashboard.requests.loading : copy.deny}
            </button>
          </div>
        )}
      </div>

      {
        // #TODo: Add a toast notification to show the error message instead of showing it here
        error && (
          <div className={"mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-700 " + (isMutating ? 'animate-pulse' : '')}>
            {t.dashboard.requests.errorRequest}
          </div>
        )
      }

    </article>
  );
}