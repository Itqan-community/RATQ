'use client';

import { useState } from 'react';
import { CommentRow } from '@/components/developer/CommentRow';
import type { Comment } from '@/types/resource';

const mockCommentsWithResources = [
  {
    comment: {
      id: 501,
      author_name: 'محمد أحمد',
      content: 'مكتبة ممتازة! التحليل الصرفي كان مفيداً جداً لمشروع البحث الخاص بي.',
      created_at: '2026-02-10T14:30:00Z',
    },
    resource_name: 'Quranic Text Toolkit (QTT)',
  },
  {
    comment: {
      id: 502,
      author_name: 'محمد أحمد',
      content: 'هل يمكن إضافة دعم لخط الإنديك؟ هذا سيكون مفيداً جداً للمشاريع التي تستهدف جنوب آسيا.',
      created_at: '2026-03-05T09:15:00Z',
    },
    resource_name: 'Quranic Text Toolkit (QTT)',
  },
  {
    comment: {
      id: 503,
      author_name: 'محمد أحمد',
      content: 'SDK جيد جداً. المزامنة مع التلاوات ميزة رائعة.',
      created_at: '2026-01-20T16:45:00Z',
    },
    resource_name: 'Quranic Audio SDK',
  },
];

export default function DeveloperCommentsPage() {
  const [activeTab, setActiveTab] = useState<'my-comments' | 'discussions'>('my-comments');

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
        <div className="space-y-3">
          {mockCommentsWithResources.map(({ comment, resource_name }) => (
            <CommentRow key={comment.id} comment={comment} resourceName={resource_name} />
          ))}
        </div>
      )}

      {activeTab === 'discussions' && (
        <div className="card p-8 text-center">
          <p className="text-[var(--text-muted)]">لا توجد نقاشات مشاركة فيها</p>
        </div>
      )}
    </div>
  );
}
