// src/views/AppRequests.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { DEMO_ACCESS_REQUESTS } from '@/lib/mockData';
import { AccessRequest } from '@/types';
import { Clock, CheckCircle2, XCircle, Search, Key, Plus, FileText } from 'lucide-react';
import { ApiKeyRevealDialog } from '@/components/keys/ApiKeyRevealDialog';

export const AppRequestsPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [createdKey, setCreatedKey] = useState<string | null>(null);

  const filtered = DEMO_ACCESS_REQUESTS.filter((req) => {
    const matchesStatus = filterStatus === 'all' || req.status === filterStatus;
    const title = req.resource?.title_ar || '';
    const purpose = req.purpose_ar || '';
    const matchesSearch =
      search.trim() === '' ||
      title.toLowerCase().includes(search.toLowerCase()) ||
      purpose.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleGenerateKey = (_req: AccessRequest) => {
    // Generate simulated key
    const rawKey = `rtk_live_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;
    setCreatedKey(rawKey);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-fg tracking-tight">
            {isAr ? 'طلبات الوصول وتصاريح الاستخدام' : 'Access Permits & Requests'}
          </h1>
          <p className="text-fg-muted text-sm mt-1">
            {isAr
              ? 'متابعة الطلبات المقدمة للوصول إلى مجموعات البيانات والمكتبات المقيدة باتفاقيات الاستخدام العادل.'
              : 'Track permission requests submitted for restricted Quranic datasets and APIs.'}
          </p>
        </div>
        <Link to="/resources">
          <Button variant="primary" size="sm" className="gap-2 shrink-0">
            <Plus className="w-4 h-4 shrink-0" />
            <span>{isAr ? 'طلب وصول جديد' : 'New Request'}</span>
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="w-full sm:w-72 relative">
          <Search className="w-4 h-4 text-fg-muted absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isAr ? 'بحث في الطلبات...' : 'Search requests...'}
            className="ps-9 text-sm"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[
              { value: 'all', label: isAr ? 'جميع الحالات' : 'All Statuses' },
              { value: 'approved', label: isAr ? 'معتمد' : 'Approved' },
              { value: 'under_review', label: isAr ? 'قيد المراجعة' : 'Under Review' },
              { value: 'rejected', label: isAr ? 'مرفوض' : 'Rejected' },
            ]}
          />
        </div>
      </Card>

      {/* Requests List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <Card className="p-12 text-center text-fg-muted">
            <FileText className="w-12 h-12 text-fg-subtle mx-auto mb-3" />
            <h3 className="font-bold text-fg text-base mb-1">
              {isAr ? 'لا توجد طلبات مطابقة' : 'No requests found'}
            </h3>
            <p className="text-sm">
              {isAr ? 'يمكنك تقديم طلب تصريح وصول من صفحة أي مورد بالطلب في الفهرس.' : 'You can request access from any restricted resource page.'}
            </p>
          </Card>
        ) : (
          filtered.map((req) => (
            <Card key={req.id} className="p-6 border-border hover:border-ratq-300 transition-all">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-fg-subtle">{req.id}</span>
                    <span className="text-fg-subtle">•</span>
                    <span className="text-xs text-fg-muted font-medium">
                      {isAr ? `تاريخ التقديم: ${new Date(req.submitted_at || req.created_at).toLocaleDateString()}` : `Submitted: ${new Date(req.submitted_at || req.created_at).toLocaleDateString()}`}
                    </span>
                    <span className="text-fg-subtle">•</span>
                    <span className="text-xs text-fg-muted">
                      {isAr ? `المدة المطلوبة: ${req.requested_days} يوماً` : `Duration: ${req.requested_days} days`}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-fg">
                    {req.resource?.title_ar || 'مورد قرآني'}
                  </h3>

                  <p className="text-sm text-fg-muted leading-relaxed">
                    <span className="font-semibold text-fg me-1">{isAr ? 'الغرض:' : 'Purpose:'}</span>
                    {req.purpose_ar}
                  </p>

                  {req.decision_note_ar && (
                    <div className="p-3 rounded-lg bg-canvas-subtle border border-border text-xs text-fg-muted mt-3">
                      <span className="font-semibold text-fg me-1">
                        {isAr ? 'ملاحظة قرار الناشر:' : 'Publisher decision note:'}
                      </span>
                      {req.decision_note_ar}
                    </div>
                  )}
                </div>

                <div className="shrink-0 flex flex-col md:items-end gap-3">
                  <div>
                    {req.status === 'approved' && (
                      <Badge variant="success" className="gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isAr ? 'معتمد' : 'Approved'}</span>
                      </Badge>
                    )}
                    {req.status === 'under_review' && (
                      <Badge variant="warning" className="gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{isAr ? 'قيد المراجعة' : 'Under Review'}</span>
                      </Badge>
                    )}
                    {req.status === 'rejected' && (
                      <Badge variant="danger" className="gap-1">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{isAr ? 'مرفوض' : 'Rejected'}</span>
                      </Badge>
                    )}
                  </div>

                  {req.status === 'approved' && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleGenerateKey(req)}
                      className="gap-1.5"
                    >
                      <Key className="w-3.5 h-3.5" />
                      <span>{isAr ? 'إصدار مفتاح API' : 'Issue API Key'}</span>
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Reveal Dialog if key generated */}
      <ApiKeyRevealDialog
        isOpen={Boolean(createdKey)}
        onClose={() => setCreatedKey(null)}
        rawKey={createdKey || ''}
        keyPrefix="rtk_live"
      />
    </div>
  );
};

export default AppRequestsPage;
