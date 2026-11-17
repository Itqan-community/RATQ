// src/views/AppReports.tsx
// Reports I filed (live /developer/reports). Any signed-in user; the server returns only what they may read.
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { mockRepo } from '@/lib/supabase';
import { fetchMyReports } from '@/lib/payloadReports';
import { useAuthStore } from '@/store/useAuthStore';
import type { Report } from '@/types';
import { Flag } from 'lucide-react';

const REASONS: Record<Report['reason'], { ar: string; en: string }> = {
  inappropriate: { ar: 'محتوى غير لائق', en: 'Inappropriate' },
  inaccurate: { ar: 'معلومات غير دقيقة', en: 'Inaccurate' },
  copyright: { ar: 'انتهاك حقوق', en: 'Copyright' },
  misleading: { ar: 'مضلل', en: 'Misleading' },
  abuse: { ar: 'إساءة أو مزعج', en: 'Spam / abuse' },
  broken: { ar: 'رابط معطل', en: 'Broken link' },
  sacred_error: { ar: 'خطأ في نص مقدس', en: 'Sacred text error' },
  other: { ar: 'أخرى', en: 'Other' },
};

const STATUSES = {
  open: { ar: 'مفتوح', en: 'Open', variant: 'warning' },
  triaged: { ar: 'قيد الفرز', en: 'Triaged', variant: 'info' },
  resolved: { ar: 'تمت المعالجة', en: 'Resolved', variant: 'success' },
  dismissed: { ar: 'مغلق', en: 'Closed', variant: 'default' },
} as const;

export const AppReportsPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const myId = useAuthStore((s) => s.profile.id);
  const [reports, setReports] = useState<Report[] | null>(null);
  const [status, setStatus] = useState('all');
  const [reason, setReason] = useState('all');

  useEffect(() => {
    let alive = true;
    fetchMyReports(myId).then((r) => alive && setReports(r));
    return () => {
      alive = false;
    };
  }, [myId]);

  const shown = (reports ?? []).filter((r) => (status === 'all' || r.status === status) && (reason === 'all' || r.reason === reason));
  const slugOf = (r: Report) => mockRepo.getResources().find((x) => x.id === r.target_id)?.slug;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-fg tracking-tight">{isAr ? 'بلاغاتي' : 'My Reports'}</h1>
        <p className="text-fg-muted text-sm mt-1">
          {isAr ? 'البلاغات التي أرسلتها عن الموارد وحالة كل منها.' : 'Reports you filed on resources and where each one stands.'}
        </p>
      </div>

      <Card className="p-4 flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-48">
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { value: 'all', label: isAr ? 'جميع الحالات' : 'All statuses' },
              ...Object.entries(STATUSES).map(([value, s]) => ({ value, label: isAr ? s.ar : s.en })),
            ]}
          />
        </div>
        <div className="w-full sm:w-56">
          <Select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            options={[
              { value: 'all', label: isAr ? 'جميع الأسباب' : 'All reasons' },
              ...Object.entries(REASONS).map(([value, s]) => ({ value, label: isAr ? s.ar : s.en })),
            ]}
          />
        </div>
      </Card>

      {reports === null ? (
        <Card className="p-12 text-center text-fg-muted text-sm">{isAr ? 'جارٍ التحميل...' : 'Loading...'}</Card>
      ) : shown.length === 0 ? (
        <Card className="p-12 text-center text-fg-muted">
          <Flag className="w-12 h-12 text-fg-subtle mx-auto mb-3" />
          <h3 className="font-bold text-fg text-base mb-1">{isAr ? 'لا توجد بلاغات' : 'No reports'}</h3>
          <p className="text-sm">{isAr ? 'ستظهر هنا البلاغات التي ترسلها عن الموارد.' : 'Reports you file on resources will appear here.'}</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {shown.map((r) => {
            const slug = slugOf(r);
            const st = STATUSES[r.status as keyof typeof STATUSES] ?? STATUSES.open;
            return (
              <Card key={r.id} className="p-4 space-y-2">
                <div className="flex flex-wrap items-center gap-2 justify-between">
                  {slug ? (
                    <Link to={`/resources/${slug}`} className="font-semibold text-fg hover:text-ratq-600">
                      {r.target_title || slug}
                    </Link>
                  ) : (
                    <span className="font-semibold text-fg">{r.target_title || r.target_id}</span>
                  )}
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{isAr ? REASONS[r.reason].ar : REASONS[r.reason].en}</Badge>
                    <Badge variant={st.variant}>{isAr ? st.ar : st.en}</Badge>
                  </div>
                </div>
                {r.details_ar && <p className="text-sm text-fg-muted whitespace-pre-wrap">{r.details_ar}</p>}
                <div className="text-xs text-fg-subtle font-mono">{new Date(r.created_at).toLocaleDateString(isAr ? 'ar-SA' : 'en-US')}</div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AppReportsPage;
