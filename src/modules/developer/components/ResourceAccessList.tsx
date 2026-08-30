'use client';

import { useState } from 'react';
import { useResourceAccess } from '@/hooks/useResourceAccess';
import { useRevokeAccess } from '@/hooks/useRevokeAccess';
import { useLanguage } from '@/shared/ui/i18n';
import { useToast } from '@/shared/ui/Toast';
import type { AccessRequest } from '@/types/resource';

export function ResourceAccessListSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="card p-4 animate-pulse">
          <div className="skeleton h-4 w-1/3 rounded mb-2" />
          <div className="skeleton h-3 w-1/4 rounded" />
        </div>
      ))}
    </div>
  );
}

export function ResourceAccessList({ resourceId }: { resourceId: number }) {
  const { t, locale } = useLanguage();
  const copy = t.dashboard.resourceAccess;
  const { toast } = useToast();

  const { data, isLoading, error, mutate } = useResourceAccess(resourceId);
  const grants = data?.grants;
  const { trigger, isMutating } = useRevokeAccess(resourceId);

  // Which row is awaiting confirmation. Revoking is destructive and cannot be
  // undone (the backend treats revoked as terminal), so it takes two clicks.
  const [confirmingId, setConfirmingId] = useState<number | null>(null);

  const handleRevoke = async (id: number) => {
    if (isMutating) return;
    try {
      await trigger(id);
    } catch {
      // trigger() rejects on failure; SWR leaves the list untouched, so the
      // row stays put and the publisher can retry.
      toast(copy.revokeFailed, 'error');
    } finally {
      setConfirmingId(null);
    }
  };

  if (isLoading) return <ResourceAccessListSkeleton />;

  // Before the empty state, not after it: a failed fetch also leaves `grants`
  // undefined, and "no one has access" is a very different claim to make to a
  // publisher than "we could not find out who has access".
  if (error) {
    return (
      <div className="card p-6 text-center bg-[var(--bg-secondary)]">
        <p className="text-sm text-[var(--text-secondary)]">{copy.loadFailed}</p>
        <button
          type="button"
          onClick={() => mutate()}
          className="mt-3 h-9 rounded-full border border-[var(--border-color)] bg-white px-4 text-xs font-black text-[var(--text-secondary)] transition hover:bg-white/60"
        >
          {copy.retry}
        </button>
      </div>
    );
  }

  if (!grants?.length) {
    return (
      <div className="card p-6 text-center bg-[var(--bg-secondary)]">
        <p className="text-sm text-[var(--text-muted)]">{copy.empty}</p>
      </div>
    );
  }

  const hiddenCount = (data?.total ?? 0) - grants.length;

  return (
    <>
    <ul className="space-y-2">
      {grants.map((grant: AccessRequest) => {
        const grantedOn = copy.grantedOn.replace(
          '{{date}}',
          new Date(grant.updated_at).toLocaleDateString(
            locale === 'ar' ? 'ar-SA' : 'en-US',
            { year: 'numeric', month: 'short', day: 'numeric' },
          ),
        );
        const isConfirming = confirmingId === grant.id;

        return (
          <li
            key={grant.id}
            className="card p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                {grant.applicant_display_name}
              </p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">{grantedOn}</p>
            </div>

            {isConfirming ? (
              <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                <p className="text-xs text-[var(--text-secondary)]">
                  {copy.confirmRevoke.replace('{{name}}', grant.applicant_display_name)}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleRevoke(grant.id)}
                    disabled={isMutating}
                    className="h-9 rounded-full border border-red-200 bg-white px-4 text-xs font-black text-red-700 transition hover:bg-red-50 disabled:opacity-60"
                  >
                    {/* Not copy.revoke: in Arabic that reads "إلغاء الوصول"
                        next to a Cancel button reading "إلغاء", and the two
                        are easy to confuse. "تأكيد الإلغاء" keeps the
                        destructive choice distinct from backing out. */}
                    {isMutating ? copy.revoking : copy.confirmAction}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmingId(null)}
                    disabled={isMutating}
                    className="h-9 rounded-full border border-[var(--border-color)] bg-white px-4 text-xs font-black text-[var(--text-secondary)] transition hover:bg-[var(--bg-secondary)] disabled:opacity-60"
                  >
                    {t.dashboard.common.cancel}
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmingId(grant.id)}
                disabled={isMutating}
                // Every row's button reads the same on its own, so name the
                // person it belongs to for screen readers.
                aria-label={`${copy.revoke} - ${grant.applicant_display_name}`}
                className="h-9 shrink-0 rounded-full border border-red-200 bg-white px-4 text-xs font-black text-red-700 transition hover:bg-red-50 disabled:opacity-60"
              >
                {copy.revoke}
              </button>
            )}
          </li>
        );
      })}
    </ul>
    {hiddenCount > 0 && (
      // The query is capped like every other list in the app. Say so rather
      // than letting a publisher believe this is everyone with access.
      <p className="mt-3 text-xs text-[var(--text-muted)]">
        {copy.showingFirst
          .replace('{{shown}}', String(grants.length))
          .replace('{{total}}', String(data?.total ?? grants.length))}
      </p>
    )}
    </>
  );
}
