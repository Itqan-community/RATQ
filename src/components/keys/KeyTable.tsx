// src/components/keys/KeyTable.tsx
import React, { useState } from 'react';
import { ApiKey } from '@/types';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { maskApiKey } from '@/lib/security';
import { formatDate } from '@/lib/format';
import { Key, RotateCw, Trash2, Clock, CheckCircle, AlertOctagon } from 'lucide-react';

interface KeyTableProps {
  keys: ApiKey[];
  onRotate: (keyId: string) => void;
  onRevoke: (keyId: string) => void;
}

export const KeyTable: React.FC<KeyTableProps> = ({ keys, onRotate, onRevoke }) => {
  const [selectedKeyForRevoke, setSelectedKeyForRevoke] = useState<ApiKey | null>(null);

  if (keys.length === 0) {
    return (
      <div className="py-8 text-center text-xs text-fg-subtle">
        ليس لديك أي مفاتيح API نشطة حالياً. يمكنك إصدار مفتاح جديد عند قبول طلبات الوصول الخاصة بك.
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-border bg-canvas text-start">
      <table className="w-full text-xs">
        <thead className="bg-subtle border-b border-border text-fg-subtle">
          <tr>
            <th className="py-3 px-4 font-bold">اسم المفتاح</th>
            <th className="py-3 px-4 font-bold">المورد المرتبط</th>
            <th className="py-3 px-4 font-bold">البادئة المقنعة</th>
            <th className="py-3 px-4 font-bold">الحالة</th>
            <th className="py-3 px-4 font-bold">ينتهي في</th>
            <th className="py-3 px-4 font-bold">الاستخدام</th>
            <th className="py-3 px-4 font-bold text-end">الإجراءات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle">
          {keys.map((k) => (
            <tr key={k.id} className="hover:bg-subtle/50 transition-colors">
              <td className="py-3 px-4 font-bold text-fg flex items-center gap-2">
                <Key className="w-3.5 h-3.5 text-ratq-600" />
                <span>{k.name_ar}</span>
              </td>
              <td className="py-3 px-4 text-fg-muted font-medium">
                {k.resource_title_ar || 'مورد مقيد'}
              </td>
              <td className="py-3 px-4 font-mono text-2xs text-fg-subtle" dir="ltr">
                {maskApiKey(k.key_prefix)}
              </td>
              <td className="py-3 px-4">
                {k.status === 'active' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200">
                    <CheckCircle className="w-3 h-3" /> نشط
                  </span>
                )}
                {k.status === 'rotating' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded border border-amber-200">
                    <Clock className="w-3 h-3" /> قيد التدوير (24h)
                  </span>
                )}
                {k.status === 'revoked' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-red-700 bg-red-50 dark:bg-red-950 px-2 py-0.5 rounded border border-red-200">
                    <AlertOctagon className="w-3 h-3" /> ملغى
                  </span>
                )}
              </td>
              <td className="py-3 px-4 text-fg-subtle">
                {formatDate(k.expires_at)}
              </td>
              <td className="py-3 px-4 font-mono text-fg-muted">
                {k.usage_count.toLocaleString()} طلب
              </td>
              <td className="py-3 px-4 text-end">
                {k.status === 'active' && (
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRotate(k.id)}
                      title="تدوير المفتاح (يُحذف القديم فوراً)"
                      startIcon={<RotateCw className="w-3 h-3 text-fg-muted" />}
                    >
                      تدوير
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedKeyForRevoke(k)}
                      title="إلغاء فوري"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      startIcon={<Trash2 className="w-3 h-3 text-red-600" />}
                    >
                      إلغاء
                    </Button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedKeyForRevoke && (
        <ConfirmDialog
          isOpen={Boolean(selectedKeyForRevoke)}
          onClose={() => setSelectedKeyForRevoke(null)}
          onConfirm={() => {
            onRevoke(selectedKeyForRevoke.id);
            setSelectedKeyForRevoke(null);
          }}
          title="تأكيد إلغاء مفتاح الـ API"
          description={`هل أنت متأكد من رغبتك في إلغاء المفتاح "${selectedKeyForRevoke.name_ar}" فوراً؟ ستتوقف أي تطبيقات تعتمد عليه عن العمل.`}
          confirmLabel="نعم، قم بالإلغاء"
          isDestructive
        />
      )}
    </div>
  );
};
