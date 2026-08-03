'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api-client';
import { useLanguage } from '@/i18n';

interface AccessRequestButtonProps {
  resourceId: number;
  resourceSlug: string;
  resourceName: string;
}

export function AccessRequestButton({ resourceId, resourceSlug, resourceName }: AccessRequestButtonProps) {
  const { user } = useAuth();
  const { locale, t } = useLanguage();
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!user) return;
    setSubmitting(true);
    setError(null);
    try {
      await api.requests.submit(resourceId, message);
      setSubmitted(true);
      setMessage('');
    } catch {
      setError(t.resource.detail.requestFailed);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-xl bg-[#eaf8ef] p-4 text-center text-sm font-bold text-[#176b3a]">
        {t.resource.detail.requestSent}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder={locale === 'ar' ? 'اشرح سبب الطلب' : 'Explain why you need access'}
        aria-label={`${t.resource.detail.accessRequestFor} ${resourceName}`}
        className="min-h-[92px] w-full resize-none rounded-xl border-0 bg-[#f8f8f8] p-4 text-xs leading-6 outline-none placeholder:text-[#888] focus:ring-1 focus:ring-black/15"
        required
      />
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      {user ? (
        <button
          type="submit"
          disabled={submitting}
          className="mt-4 h-9 w-full rounded-full bg-black text-xs font-black text-white transition hover:bg-[#171717] disabled:opacity-50"
        >
          {submitting ? (locale === 'ar' ? 'جارٍ الإرسال...' : 'Sending...') : t.resource.detail.submit}
        </button>
      ) : (
        <Link
          href={`/login?redirect=/resources/${resourceSlug}`}
          className="mt-4 flex h-9 w-full items-center justify-center rounded-full bg-black text-xs font-black text-white transition hover:bg-[#171717]"
        >
          {t.resource.detail.loginToRequest}
        </Link>
      )}
    </form>
  );
}
