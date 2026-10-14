'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useComments } from '@/hooks/useResources';
import { useAuth } from '@/hooks/useAuth';
import { postComment } from '@/modules/resources/application/use-cases/post-comment';
import { deleteComment } from '@/modules/resources/infrastructure/comments-api';
import { formatDate } from '@/shared/utils/utils';
import { useLanguage } from '@/shared/ui/i18n';
import { useToast } from '@/shared/ui/Toast';

const MAX_COMMENT_LENGTH = 2000;

function useOptionalToast(): (message: string, type?: 'success' | 'error' | 'info') => void {
  // CommentSection also renders in harnesses without a ToastProvider (e.g. some suites);
  // production always provides one (src/app/layout.tsx). Without it, toast degrades to a no-op
  // instead of throwing (RATQ#347 review).
  try {
    return useToast().toast;
  } catch {
    return () => {};
  }
}

interface CommentSectionProps {
  resourceId: number;
  resourceSlug: string;
}

export function CommentSection({ resourceId, resourceSlug }: CommentSectionProps) {
  const { data: comments, isLoading, mutate } = useComments(resourceId);
  const { user } = useAuth();
  const toast = useOptionalToast();
  const [newComment, setNewComment] = useState('');
  const [posting, setPosting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { locale, t } = useLanguage();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newComment.trim()) return;
    setPosting(true);
    try {
      await postComment(resourceId, newComment);
      setNewComment('');
      mutate();
    } catch {
      // The typed text stays so the user can retry.
      toast(t.resource.detail.commentPostError, 'error');
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!confirm(t.resource.detail.commentDeleteConfirm)) return;
    setDeletingId(commentId);
    try {
      await deleteComment(commentId);
      toast(t.resource.detail.commentDeleted, 'success');
      mutate();
    } catch {
      toast(t.resource.detail.commentDeleteError, 'error');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="mt-9">
      <h2 className="text-xl font-black">{t.resource.detail.comments}</h2>
      {user ? (
        <form onSubmit={handleSubmit} className="mt-5">
          <label htmlFor="comment-textarea" className="sr-only">
            {t.resource.detail.commentLabel}
          </label>
          <textarea
            id="comment-textarea"
            value={newComment}
            onChange={(event) => setNewComment(event.target.value)}
            placeholder={t.resource.detail.leaveAComment}
            maxLength={MAX_COMMENT_LENGTH}
            className="min-h-[86px] w-full resize-none rounded-xl border-0 bg-[#f8f8f8] p-4 text-sm outline-none focus:ring-1 focus:ring-black/10"
            required
          />
          <div className="mt-1 flex items-center justify-between">
            <span className="text-xs text-[#8c8c8c]">
              {newComment.length}/{MAX_COMMENT_LENGTH}
            </span>
            <button type="submit" disabled={posting} className="rounded-full bg-black px-8 py-2 text-xs font-black text-white transition hover:bg-[#171717] disabled:opacity-50">
              {t.resource.detail.post}
            </button>
          </div>
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
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-black">{comment.author_name}</h3>
                  <time className="mt-1 block text-xs text-[#8c8c8c]">{formatDate(comment.created_at, locale)}</time>
                </div>
                {user && comment.author_id != null && comment.author_id === user.id && (
                  <button
                    type="button"
                    onClick={() => handleDelete(comment.id)}
                    disabled={deletingId === comment.id}
                    className="shrink-0 rounded-full px-3 py-1 text-xs font-black text-[#b3261e] transition hover:bg-[#b3261e]/10 disabled:opacity-50"
                  >
                    {t.resource.detail.commentDelete}
                  </button>
                )}
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
