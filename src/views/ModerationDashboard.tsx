// src/views/ModerationDashboard.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { DEMO_REPORTS, DEMO_AUDIT_LOGS } from '@/lib/mockData';
import { Report } from '@/types';
import {
  ShieldAlert,
  CheckCircle2,
  Shield,
  ExternalLink,
} from 'lucide-react';

export const ModerationDashboardPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const [reports, setReports] = useState<Report[]>(DEMO_REPORTS);
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const handleResolve = (id: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'resolved' } : r))
    );
    setActionFeedback(isAr ? 'تمت معالجة البلاغ وتحديث الحالة.' : 'Report marked as resolved.');
    setTimeout(() => setActionFeedback(null), 3000);
  };

  const handleSuspend = (id: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'resolved' } : r))
    );
    setActionFeedback(isAr ? 'تم تعليق المورد مؤقتاً لحين انتهاء الفحص الفني.' : 'Resource suspended pending audit.');
    setTimeout(() => setActionFeedback(null), 3000);
  };

  const filtered = reports.filter((r) => filter === 'all' || r.status === filter);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="danger" className="text-xs">
            <ShieldAlert className="w-3.5 h-3.5 me-1" />
            {isAr ? 'مركز الإشراف وحماية المحتوى' : 'Moderation & Content Safety'}
          </Badge>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-fg tracking-tight">
          {isAr ? 'بلاغات المجتمع ومتابعة الامتثال' : 'Community Reports & Moderation Queue'}
        </h1>
        <p className="text-fg-muted text-sm mt-1 max-w-2xl">
          {isAr
            ? 'متابعة البلاغات الواردة حول سلامة الروابط، حقوق الملكية الفكرية، وأي مخالفات لميثاق نزاهة القرآن الكريم.'
            : 'Track community reports concerning broken links, DMCA claims, or sacred text discrepancies.'}
        </p>
      </div>

      {actionFeedback && (
        <Alert variant="success" className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionFeedback}</span>
        </Alert>
      )}

      {/* Reports List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-fg">
            {isAr ? 'البلاغات النشطة' : 'Active Reports'}
          </h2>
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              {isAr ? 'الكل' : 'All'}
            </Button>
            <Button
              variant={filter === 'open' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('open')}
            >
              {isAr ? 'المفتوحة فقط' : 'Open Only'}
            </Button>
          </div>
        </div>

        {filtered.map((rep) => (
          <Card key={rep.id} className="p-6 border-border">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant={rep.reason === 'sacred_error' ? 'danger' : 'warning'}>
                    {rep.reason}
                  </Badge>
                  <span className="font-mono text-xs text-fg-subtle">{rep.id}</span>
                  <span className="text-fg-subtle">•</span>
                  <span className="text-xs text-fg-muted">
                    {isAr ? `تاريخ البلاغ: ${new Date(rep.created_at).toLocaleDateString()}` : `Reported: ${new Date(rep.created_at).toLocaleDateString()}`}
                  </span>
                </div>

                <h3 className="text-base font-bold text-fg">
                  {rep.target_title || 'مورد قرآني'}
                </h3>

                <p className="text-sm text-fg-muted leading-relaxed bg-canvas-subtle p-3 rounded-lg border border-border">
                  {rep.details_ar}
                </p>

                {rep.evidence_urls && rep.evidence_urls.length > 0 && (
                  <div className="text-xs text-fg-subtle">
                    <span className="font-semibold text-fg me-1">{isAr ? 'روابط الإثبات:' : 'Evidence:'}</span>
                    <a
                      href={rep.evidence_urls[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ratq-600 hover:underline font-mono inline-flex items-center gap-1"
                    >
                      <span>{rep.evidence_urls[0]}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              <div className="shrink-0 flex flex-col md:items-end gap-3">
                <Badge variant={rep.status === 'open' ? 'warning' : 'success'}>
                  {rep.status === 'open' ? (isAr ? 'بانتظار الإجراء' : 'Open') : (isAr ? 'تم الحل' : 'Resolved')}
                </Badge>

                {rep.status === 'open' && (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleResolve(rep.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      {isAr ? 'إغلاق البلاغ' : 'Resolve'}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleSuspend(rep.id)}
                      className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                    >
                      {isAr ? 'تعليق المورد' : 'Suspend'}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Audit Trail Preview */}
      <Card className="p-6">
        <h2 className="text-base font-bold text-fg mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-ratq-600" />
          <span>{isAr ? 'سجل إجراءات الإشراف الأخيرة' : 'Recent Moderation Log'}</span>
        </h2>
        <div className="space-y-3">
          {DEMO_AUDIT_LOGS.map((item) => (
            <div key={item.id} className="p-3 rounded-lg bg-canvas-subtle border border-border text-xs flex items-center justify-between gap-4">
              <div>
                <span className="font-bold text-fg">{item.actor_name}</span>
                <span className="text-fg-subtle mx-2">•</span>
                <span className="font-mono text-ratq-600">{item.action}</span>
                <span className="text-fg-muted block mt-0.5">{item.reason_ar}</span>
              </div>
              <time className="text-fg-subtle font-mono shrink-0">
                {new Date(item.ts).toLocaleDateString()}
              </time>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ModerationDashboardPage;
