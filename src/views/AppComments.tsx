// src/views/AppComments.tsx
// Comments I wrote across resources (live /developer/comments). Delete is author-only on the server.
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { mockRepo } from '@/lib/supabase';
import { deleteComment, fetchMyComments } from '@/lib/payloadComments';
import { useAuthStore } from '@/store/useAuthStore';
import type { Review } from '@/types';
import { MessageSquare, Trash2 } from 'lucide-react';

type Row = { review: Review; resourceName?: string };

export const AppCommentsPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const myId = useAuthStore((s) => s.profile.id);
  const [rows, setRows] = useState<Row[] | null>(null);
  const [toDelete, setToDelete] = useState<Row | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetchMyComments(myId).then((r) => alive && setRows(r));
    return () => {
      alive = false;
    };
  }, [myId]);

  const confirmDelete = async () => {
    const target = toDelete;
    setToDelete(null);
    if (!target) return;
    const err = await deleteComment(target.review.id);
    setError(err);
    if (!err) setRows((prev) => (prev ?? []).filter((r) => r.review.id !== target.review.id));
  };

  const slugOf = (r: Row) => mockRepo.getResources().find((x) => x.id === r.review.resource_id)?.slug;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-fg tracking-tight">{isAr ? 'تعليقاتي' : 'My Comments'}</h1>
        <p className="text-fg-muted text-sm mt-1">
          {isAr ? 'كل التعليقات التي كتبتها على الموارد.' : 'Every comment you wrote on resources.'}
        </p>
      </div>

      {error && <p role="alert" className="text-xs text-red-600">{error}</p>}

      {rows === null ? (
        <Card className="p-12 text-center text-fg-muted text-sm">{isAr ? 'جارٍ التحميل...' : 'Loading...'}</Card>
      ) : rows.length === 0 ? (
        <Card className="p-12 text-center text-fg-muted">
          <MessageSquare className="w-12 h-12 text-fg-subtle mx-auto mb-3" />
          <h3 className="font-bold text-fg text-base mb-1">{isAr ? 'لا توجد تعليقات' : 'No comments yet'}</h3>
          <p className="text-sm">{isAr ? 'ستظهر هنا تعليقاتك على الموارد.' : 'Your comments on resources will appear here.'}</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {rows.map((row) => {
            const slug = slugOf(row);
            const name = row.resourceName || slug || row.review.resource_id;
            return (
              <Card key={row.review.id} className="p-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  {slug ? (
                    <Link to={`/resources/${slug}`} className="font-semibold text-fg hover:text-ratq-600">{name}</Link>
                  ) : (
                    <span className="font-semibold text-fg">{name}</span>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => setToDelete(row)} className="text-red-600" startIcon={<Trash2 className="w-3.5 h-3.5" />}>
                    {isAr ? 'حذف' : 'Delete'}
                  </Button>
                </div>
                <p className="text-sm text-fg-muted whitespace-pre-wrap">{row.review.body_ar}</p>
                <div className="text-xs text-fg-subtle font-mono">{new Date(row.review.created_at).toLocaleDateString(isAr ? 'ar-SA' : 'en-US')}</div>
              </Card>
            );
          })}
        </div>
      )}

      {toDelete && (
        <ConfirmDialog
          isOpen
          onClose={() => setToDelete(null)}
          onConfirm={confirmDelete}
          title={isAr ? 'حذف التعليق' : 'Delete comment'}
          description={isAr ? 'سيتم حذف تعليقك نهائياً.' : 'Your comment will be permanently deleted.'}
          confirmLabel={isAr ? 'حذف' : 'Delete'}
          isDestructive
        />
      )}
    </div>
  );
};

export default AppCommentsPage;
