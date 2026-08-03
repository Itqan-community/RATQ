'use client';

import type { Comment } from '@/types/resource';

interface CommentRowProps {
  comment: Comment;
  resourceName: string;
}

export function CommentRow({ comment, resourceName }: CommentRowProps) {
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-heading font-semibold text-sm">{resourceName}</span>
            <span className="text-xs text-[var(--text-muted)]">
              {new Date(comment.created_at).toLocaleDateString('ar', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
          <p className="text-sm text-[var(--text-secondary)]">{comment.content}</p>
        </div>
      </div>
    </div>
  );
}
