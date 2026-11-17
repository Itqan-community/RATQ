// src/components/resources/VersionTable.tsx
import React from 'react';
import { ResourceVersion } from '@/types';
import { formatDate } from '@/lib/format';
import { AlertTriangle, CheckCircle, Tag } from 'lucide-react';

interface VersionTableProps {
  versions?: ResourceVersion[];
}

export const VersionTable: React.FC<VersionTableProps> = ({ versions = [] }) => {
  if (versions.length === 0) {
    return (
      <div className="py-6 text-center text-xs text-fg-subtle">
        لا توجد سجلات إصدارات مفصلة لهذا المورد حالياً.
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-border bg-canvas text-start">
      <table className="w-full text-xs">
        <thead className="bg-subtle border-b border-border text-fg-subtle">
          <tr>
            <th className="py-3 px-4 font-bold">الإصدار</th>
            <th className="py-3 px-4 font-bold">النوع</th>
            <th className="py-3 px-4 font-bold">تاريخ الإطلاق</th>
            <th className="py-3 px-4 font-bold">ملاحظات الإصدار</th>
            <th className="py-3 px-4 font-bold text-end">التوافق</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle">
          {versions.map((ver) => (
            <tr key={ver.id} className="hover:bg-subtle/50 transition-colors">
              <td className="py-3 px-4 font-mono font-bold text-fg flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-ratq-600" />
                <span>v{ver.version}</span>
              </td>
              <td className="py-3 px-4 font-medium uppercase text-fg-muted">
                {ver.change_kind}
              </td>
              <td className="py-3 px-4 text-fg-subtle">
                {formatDate(ver.released_at)}
              </td>
              <td className="py-3 px-4 text-fg leading-relaxed max-w-md">
                {ver.changelog_ar}
              </td>
              <td className="py-3 px-4 text-end">
                {ver.breaking_change ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 bg-red-50 dark:bg-red-950 px-2 py-0.5 rounded border border-red-200">
                    <AlertTriangle className="w-3 h-3" />
                    <span>كسر توافق</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200">
                    <CheckCircle className="w-3 h-3" />
                    <span>متوافق</span>
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
