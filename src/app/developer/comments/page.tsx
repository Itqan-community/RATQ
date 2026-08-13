'use client';

import { useState } from 'react';
import { useDeveloperComments } from '@/hooks/useDeveloperComments';
import { CommentRow } from '@/modules/developer/components/CommentRow';

export default function DeveloperCommentsPage() {
  const [activeTab, setActiveTab] = useState<'my-comments' | 'discussions'>('my-comments');
  const { data: comments, isLoading } = useDeveloperComments();

  return (
    <div>
      <h2 className="font-heading text-xl font-bold text-[var(--text-primary)] mb-6">التعليقات والنقاشات</h2>

      {/* Tabs */}
      <div className="border-b border-[var(--border-color)] mb-6">
        <nav className="flex gap-1 -mb-px">
          <button
            onClick={() => setActiveTab('my-comments')}
            className={`px-4 py-2.5 text-sm font-heading transition-colors border-b-2 ${
              activeTab === 'my-comments'
                ? 'border-[var(--accent-primary)] text-[var(--accent-primary)] font-semibold'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            تعليقاتي
          </button>
          <button
            onClick={() => setActiveTab('discussions')}
            className={`px-4 py-2.5 text-sm font-heading transition-colors border-b-2 ${
              activeTab === 'discussions'
                ? 'border-[var(--accent-primary)] text-[var(--accent-primary)] font-semibold'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            النقاشات
          </button>
        </nav>
      </div>

      {/* Tab content */}
      {activeTab === 'my-comments' && (
        isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card p-4 animate-pulse">
                <div className="skeleton h-4 w-1/3 rounded mb-2" />
                <div className="skeleton h-3 w-2/3 rounded" />
              </div>
            ))}
          </div>
        ) : (comments ?? []).length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-[var(--text-muted)]">لا توجد تعليقات بعد</p>
          </div>
        ) : (
          <div className="space-y-3">
            {(comments ?? []).map(({ comment, resource_name }) => (
              <CommentRow key={comment.id} comment={comment} resourceName={resource_name} />
            ))}
          </div>
        )
      )}

      {activeTab === 'discussions' && (
        <div className="card p-8 text-center">
          <p className="text-[var(--text-muted)]">لا توجد نقاشات مشاركة فيها</p>
        </div>
      )}
    </div>
  );
}
