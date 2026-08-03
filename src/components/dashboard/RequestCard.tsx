'use client';

import { useLanguage } from '@/i18n';
import type { AccessRequest } from '@/types/resource';

interface RequestCardProps { request: AccessRequest; onApprove?: (id: number) => void; onDeny?: (id: number) => void; }

export function RequestCard({ request, onApprove, onDeny }: RequestCardProps) {
  const { t, locale } = useLanguage();
  const copy = t.dashboard.requests;
  const statusStyles: Record<AccessRequest['status'], { bg: string; text: string; label: string }> = {
    pending: { bg: 'bg-[#fff7e6]', text: 'text-[#9a5a00]', label: copy.pending },
    approved: { bg: 'bg-green-50', text: 'text-green-700', label: copy.approved },
    denied: { bg: 'bg-red-50', text: 'text-red-700', label: copy.denied },
  };
  const style = statusStyles[request.status];
  const date = new Date(request.created_at).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const requestedBy = copy.requestedBy.replace('{{name}}', request.applicant_display_name).replace('{{date}}', date);

  return (
    <article className="rounded-lg border border-[#ededed] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.035)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2"><h3 className="text-base font-black text-black">{request.resource_name}</h3><span className={`rounded-full px-3 py-1 text-xs font-black ${style.bg} ${style.text}`}>{style.label}</span></div>
          <p className="mt-2 text-xs font-bold text-[#8b949e]">{requestedBy}</p>
          <p className="mt-4 rounded-lg bg-[#fafafa] p-4 text-sm leading-7 text-[#59636d]">{request.message}</p>
          {request.publisher_notes && <p className="mt-3 text-sm italic leading-6 text-[#8b949e]">Notes: {request.publisher_notes}</p>}
        </div>
        {request.status === 'pending' && onApprove && onDeny && <div className="flex shrink-0 gap-2"><button type="button" onClick={() => onApprove(request.id)} className="h-9 rounded-full bg-[#171717] px-4 text-xs font-black text-white transition hover:bg-black">{copy.approve}</button><button type="button" onClick={() => onDeny(request.id)} className="h-9 rounded-full border border-red-200 bg-white px-4 text-xs font-black text-red-700 transition hover:bg-red-50">{copy.deny}</button></div>}
      </div>
    </article>
  );
}