'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useComments } from '@/hooks/useResources';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api-client';
import { formatDate } from '@/lib/utils';
import { useLanguage } from '@/i18n';

interface CommentSectionProps {
  resourceId: number;
  resourceSlug: string;
}

export function CommentSection({ resourceId, resourceSlug }: CommentSectionProps) {
  const { data: comments, isLoading, mutate } = useComments(resourceId);
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [posting, setPosting] = useState(false);
  const { locale, t } = useLanguage();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newComment.trim()) return;
    setPosting(true);
    try {
      await api.comments.post(resourceId, newComment);
      setNewComment('');
      mutate();
    } catch {
      // Swallowed - form stays filled so the user can retry.
    } finally {
      setPosting(false);
    }
  };

  return (
    <section className="mt-9">
      <h2 className="text-xl font-black">{t.resource.detail.comments}</h2>
      {user ? (
        <form onSubmit={handleSubmit} className="mt-5">
          <textarea
            value={newComment}
            onChange={(event) => setNewComment(event.target.value)}
            placeholder={t.resource.detail.leaveAComment}
            className="min-h-[86px] w-full resize-none rounded-xl border-0 bg-[#f8f8f8] p-4 text-sm outline-none focus:ring-1 focus:ring-black/10"
            required
          />
          <button type="submit" disabled={posting} className="mt-3 rounded-full bg-black px-8 py-2 text-xs font-black text-white transition hover:bg-[#171717] disabled:opacity-50">
            {t.resource.detail.post}
          </button>
        </form>
      ) : (
        <Link
          href={`/login?redirect=/resources/${resourceSlug}`}
          className="mt-5 flex h-9 w-full items-center justify-center rounded-full bg-black text-xs font-black text-white transition hover:bg-[#171717]"
        >
          {t.resource.detail.loginToComment}
        </Link>
      )}

      <div className="mt-6 space-y-5">
        {isLoading ? (
          [1, 2].map((item) => <div key={item} className="h-32 animate-pulse rounded-xl bg-[#f7f7f7]" />)
        ) : comments?.length ? (
          comments.map((comment) => (
            <article key={comment.id} className="rounded-xl border border-[#e7e7e7] bg-white p-6">
              <div>
                <h3 className="text-base font-black">{comment.author_name}</h3>
                <time className="mt-1 block text-xs text-[#8c8c8c]">{formatDate(comment.created_at, locale)}</time>
              </div>
              <p className="mt-5 text-sm leading-8 text-[#777]">{comment.content}</p>
            </article>
          ))
        ) : (
          <p className="rounded-xl bg-[#fafafa] p-8 text-center text-sm text-[#888]">{t.resource.detail.noComments}</p>
        )}
      </div>
    </section>
  );
}
