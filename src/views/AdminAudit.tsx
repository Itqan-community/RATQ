// src/views/AdminAudit.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { DEMO_AUDIT_LOGS } from '@/lib/mockData';
import { Lock, Search } from 'lucide-react';

export const AdminAuditPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const [search, setSearch] = useState('');

  const filtered = DEMO_AUDIT_LOGS.filter((l) => {
    const actor = (l.actor_name || '').toLowerCase();
    const action = (l.action || '').toLowerCase();
    const target = (l.target_name || '').toLowerCase();
    const reason = (l.reason_ar || '').toLowerCase();
    const q = search.toLowerCase();
    return actor.includes(q) || action.includes(q) || target.includes(q) || reason.includes(q);
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-fg tracking-tight">
          {isAr ? 'سجل التدقيق غير القابل للتعديل (Audit Log)' : 'Immutable Audit Log'}
        </h1>
        <p className="text-fg-muted text-sm mt-1">
          {isAr
            ? 'سجل مركزي دائم وغير قابل للتعديل يوثق كافة القرارات الحساسة وعمليات منح الشارات وسحبها وفق ADR-005.'
            : 'Append-only ledger recording all security and governance actions per ADR-005.'}
        </p>
      </div>

      {/* Security Banner */}
      <Card className="p-5 bg-deep-900 text-white border-deep-800">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-white/10 text-ratq-400 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-white text-base">
              {isAr ? 'حماية الحذف والتعديل على مستوى قاعدة البيانات (ADR-005)' : 'PostgreSQL Append-Only Trigger Enforced'}
            </h3>
            <p className="text-white/80 text-xs leading-relaxed">
              {isAr
                ? 'يمنع محفز قاعدة البيانات (Trigger) أي عملية UPDATE أو DELETE على هذا الجدول نهائياً حتى من قبل مديري النظام، لضمان النزاهة العلمية والشفافية التامة أمام المجتمع.'
                : 'All UPDATE and DELETE operations are permanently blocked by database triggers.'}
            </p>
          </div>
        </div>
      </Card>

      {/* Search */}
      <Card className="p-4">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-fg-muted absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isAr ? 'البحث بالفاعل، الإجراء، أو المورد...' : 'Search by actor, action, or target...'}
            className="ps-9"
          />
        </div>
      </Card>

      {/* Audit Log Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="bg-canvas-subtle border-b border-border text-fg-subtle">
              <tr>
                <th className="py-3 px-4 font-bold text-start">{isAr ? 'المعرّف' : 'Log ID'}</th>
                <th className="py-3 px-4 font-bold text-start">{isAr ? 'الفاعل' : 'Actor'}</th>
                <th className="py-3 px-4 font-bold text-start">{isAr ? 'الدور' : 'Role'}</th>
                <th className="py-3 px-4 font-bold text-start">{isAr ? 'الإجراء' : 'Action'}</th>
                <th className="py-3 px-4 font-bold text-start">{isAr ? 'الهدف' : 'Target'}</th>
                <th className="py-3 px-4 font-bold text-start">{isAr ? 'السبب والبيان' : 'Reason / Note'}</th>
                <th className="py-3 px-4 font-bold text-end">{isAr ? 'التوقيت الموثق' : 'Timestamp'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-canvas-subtle/50">
                  <td className="py-3 px-4 font-mono text-fg-subtle">{log.id}</td>
                  <td className="py-3 px-4 font-bold text-fg">{log.actor_name}</td>
                  <td className="py-3 px-4 font-mono text-fg-muted">{log.actor_role}</td>
                  <td className="py-3 px-4">
                    <Badge variant="primary" className="font-mono text-[10px]">
                      {log.action}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 font-medium text-fg">{log.target_name}</td>
                  <td className="py-3 px-4 text-fg-muted max-w-xs">{log.reason_ar}</td>
                  <td className="py-3 px-4 text-end font-mono text-fg-subtle">
                    {new Date(log.ts).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminAuditPage;
