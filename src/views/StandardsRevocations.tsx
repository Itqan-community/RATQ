// src/views/StandardsRevocations.tsx
import React from 'react';
import { formatDate } from '@/lib/format';
import { ShieldAlert } from 'lucide-react';

export const StandardsRevocations: React.FC = () => {
  // Public transparent revocation ledger records
  const revocations = [
    {
      id: 'rev_log_01',
      resource_name: 'حزمة الخطوط التجريبية v0.9',
      previous_badge: 'موثّق تقنياً',
      reason_category: 'انقطاع الرابط الرسمي وخلل في التنزيل',
      date: '2025-12-10T10:00:00Z',
      status: 'سارية (قيد التصحيح من الناشر)',
    },
    {
      id: 'rev_log_02',
      resource_name: 'مجموعة نصوص ترجمات قديمة',
      previous_badge: 'إتقان أساسي',
      reason_category: 'عدم اكتمال وثائق التحقق من المصدر والترخيص',
      date: '2025-11-04T14:30:00Z',
      status: 'سارية',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full text-start">
      <div className="mb-8">
        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block mb-1">
          الشفافية والحوكمة العامة
        </span>
        <h1 className="text-2xl font-bold text-fg flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-amber-600" />
          <span>سجل الشارات المسحوبة والمُعلّقة</span>
        </h1>
        <p className="text-xs text-fg-subtle mt-1.5 leading-relaxed">
          وفقاً للقسم 23.7 من معيار إتقان، تُنشر جميع حالات سحب الشارات أو تجميدها بشفافية لحماية مجتمع المطورين والمستخدمين.
        </p>
      </div>

      <div className="w-full overflow-x-auto rounded-xl border border-border bg-canvas text-xs">
        <table className="w-full">
          <thead className="bg-subtle border-b border-border text-fg-subtle">
            <tr>
              <th className="py-3 px-4 font-bold">المورد المعني</th>
              <th className="py-3 px-4 font-bold">المستوى السابق</th>
              <th className="py-3 px-4 font-bold">سبب السحب / التعليق</th>
              <th className="py-3 px-4 font-bold">التاريخ</th>
              <th className="py-3 px-4 font-bold">الحالة الحالية</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {revocations.map((item) => (
              <tr key={item.id} className="hover:bg-subtle/50 transition-colors">
                <td className="py-3 px-4 font-bold text-fg">{item.resource_name}</td>
                <td className="py-3 px-4 text-fg-muted">{item.previous_badge}</td>
                <td className="py-3 px-4 text-red-700 dark:text-red-300 font-medium">{item.reason_category}</td>
                <td className="py-3 px-4 text-fg-subtle">{formatDate(item.date)}</td>
                <td className="py-3 px-4 text-fg-subtle">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
