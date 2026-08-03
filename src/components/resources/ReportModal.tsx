'use client';

import { useState } from 'react';
import { useLanguage } from '@/i18n';
import { useToast } from '@/components/ui/Toast';
import { useReport } from '@/hooks/useReport';
import type { ReportReason } from '@/types/resource';

export interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  resourceId: number;
  resourceName: string;
}

export function ReportModal({ isOpen, onClose, onSubmit, resourceId, resourceName }: ReportModalProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { submitReport, isSubmitting } = useReport(resourceId);
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [reasonTouched, setReasonTouched] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!reason) {
      setReasonTouched(true);
      setFormError(t.resource.detail.reportReason + ' is required');
      return;
    }

    try {
      await submitReport(reason as ReportReason, details);
      toast(t.resource.detail.reportSuccess, 'success');
      onSubmit?.();
      onClose();
    } catch {
      toast(t.resource.detail.reportError, 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-6 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)] mb-4">
          {t.resource.detail.reportModalTitle}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
              {t.resource.detail.reportReason} *
            </label>
            <select
              value={reason}
              onChange={(e) => { setReason(e.target.value); setReasonTouched(false); }}
              className={`w-full px-3 py-2 border rounded-md bg-[var(--bg-primary)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 ${reasonTouched && !reason ? 'border-[var(--danger)] focus:ring-[var(--danger)]' : 'border-[var(--border-color)] focus:ring-[var(--accent-primary)]'}`}
            >
              <option value="">Select a reason</option>
              <option value="inaccurate">{t.resource.detail.reportReasonInaccurate}</option>
              <option value="inappropriate">{t.resource.detail.reportReasonInappropriate}</option>
              <option value="infringing">{t.resource.detail.reportReasonInfringing}</option>
              <option value="spam">{t.resource.detail.reportReasonSpam}</option>
              <option value="outdated">{t.resource.detail.reportReasonOutdated}</option>
              <option value="broken-link">{t.resource.detail.reportReasonBrokenLink}</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
              {t.resource.detail.reportDetails}
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              maxLength={500}
              rows={3}
              className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md bg-[var(--bg-primary)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] resize-none"
              placeholder="Provide additional context..."
            />
            <p className="text-xs text-[var(--text-muted)] mt-1 text-right">{details.length}/500</p>
          </div>

          {formError && (
            <p className="text-xs text-[var(--danger)] mb-3">{formError}</p>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm border border-[var(--border-color)] rounded-md text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors"
            >
              {t.resource.detail.reportCancel}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary text-sm disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : t.resource.detail.reportSubmit}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
