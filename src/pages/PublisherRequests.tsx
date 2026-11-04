// src/pages/PublisherRequests.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Tooltip } from '@/components/ui/Tooltip';
import { DEMO_ACCESS_REQUESTS } from '@/lib/mockData';
import { AccessRequest } from '@/types';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  User,
  FileText,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';

export const PublisherRequestsPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const [requests, setRequests] = useState<AccessRequest[]>(DEMO_ACCESS_REQUESTS);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Purpose Modal State
  const [purposeRequest, setPurposeRequest] = useState<AccessRequest | null>(null);

  // Decision Modal State
  const [activeRequest, setActiveRequest] = useState<AccessRequest | null>(null);
  const [decisionType, setDecisionType] = useState<'approved' | 'rejected'>('approved');
  const [decisionNote, setDecisionNote] = useState('');

  const getIntendedUseLabel = (type: string) => {
    const map: Record<string, { ar: string; en: string }> = {
      research: { ar: 'بحث علمي', en: 'Research' },
      education: { ar: 'تعليمي', en: 'Education' },
      nonprofit: { ar: 'غير ربحي', en: 'Non-profit' },
      commercial: { ar: 'تجاري', en: 'Commercial' },
      personal: { ar: 'شخصي', en: 'Personal' },
      government: { ar: 'حكومي', en: 'Government' },
    };
    return map[type] ? (isAr ? map[type].ar : map[type].en) : type;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString(isAr ? 'ar-SA' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const filtered = requests.filter((r) => {
    const matchesFilter = filter === 'all' || r.status === filter;
    const reqName = r.requester?.display_name || '';
    const purpose = r.purpose_ar || '';
    const resourceTitle =
      (r.resource
        ? (isAr ? r.resource.title_ar : r.resource.title_en)
        : '') || '';
    const matchesSearch =
      search.trim() === '' ||
      reqName.toLowerCase().includes(search.toLowerCase()) ||
      purpose.toLowerCase().includes(search.toLowerCase()) ||
      resourceTitle.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleOpenDecision = (req: AccessRequest, type: 'approved' | 'rejected') => {
    setActiveRequest(req);
    setDecisionType(type);
    setDecisionNote('');
    setPurposeRequest(null);
  };

  const handleConfirmDecision = () => {
    if (!activeRequest) return;

    const updated = requests.map((r) =>
      r.id === activeRequest.id
        ? {
            ...r,
            status: decisionType,
            decision_note_ar: decisionNote,
            decided_at: new Date().toISOString(),
          }
        : r
    );

    setRequests(updated);

    if (purposeRequest && purposeRequest.id === activeRequest.id) {
      setPurposeRequest({
        ...purposeRequest,
        status: decisionType,
        decision_note_ar: decisionNote,
        decided_at: new Date().toISOString(),
      });
    }

    setActiveRequest(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-fg tracking-tight">
          {isAr ? 'طلبات تصاريح الوصول الواردة' : 'Inbound Access Requests'}
        </h1>
        <p className="text-fg-muted text-sm mt-1">
          {isAr
            ? 'مراجعة طلبات المطورين والمراكز الأكاديمية الراغبة في استخدام مواردك المقيدة واتخاذ القرارات بشأنها.'
            : 'Evaluate permit requests for your restricted datasets & APIs.'}
        </p>
      </div>

      {/* Filter and Search */}
      <Card className="p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="w-full sm:w-72 relative">
          <Search className="w-4 h-4 text-fg-muted absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isAr ? 'البحث بالاسم أو الغرض أو المورد...' : 'Search by requester, purpose, or resource...'}
            className="ps-9 text-sm"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            options={[
              { value: 'all', label: isAr ? 'جميع الحالات' : 'All Requests' },
              { value: 'under_review', label: isAr ? 'بانتظار القرار' : 'Pending Decision' },
              { value: 'approved', label: isAr ? 'معتمد' : 'Approved' },
              { value: 'rejected', label: isAr ? 'مرفوض' : 'Rejected' },
            ]}
          />
        </div>
      </Card>

      {/* Requests Table */}
      {filtered.length === 0 ? (
        <Card className="p-12 text-center text-fg-muted">
          <FileText className="w-12 h-12 text-fg-subtle mx-auto mb-3" />
          <h3 className="font-bold text-fg text-base mb-1">
            {isAr ? 'لا توجد طلبات مطابقة' : 'No requests found'}
          </h3>
          <p className="text-sm">
            {isAr
              ? 'ستظهر هنا طلبات الوصول الواردة لمواردك بمجرد تقديمها من قبل المطورين.'
              : 'Inbound permit requests will be listed here.'}
          </p>
        </Card>
      ) : (
        <Card className="overflow-hidden border-border shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-start text-sm">
              <thead className="bg-canvas-subtle border-b border-border text-fg-subtle text-xs">
                <tr>
                  <th className="py-3.5 px-4 font-bold text-start">
                    {isAr ? 'مقدم الطلب' : 'Requester'}
                  </th>
                  <th className="py-3.5 px-4 font-bold text-start">
                    {isAr ? 'المورد المطلوب' : 'Target Resource'}
                  </th>
                  <th className="py-3.5 px-4 font-bold text-start">
                    {isAr ? 'نوع الاستخدام' : 'Intended Use'}
                  </th>
                  <th className="py-3.5 px-4 font-bold text-start">
                    {isAr ? 'المدة' : 'Duration'}
                  </th>
                  <th className="py-3.5 px-4 font-bold text-start">
                    {isAr ? 'تاريخ التقديم' : 'Submitted Date'}
                  </th>
                  <th className="py-3.5 px-4 font-bold text-start">
                    {isAr ? 'الحالة' : 'Status'}
                  </th>
                  <th className="py-3.5 px-4 font-bold text-end">
                    {isAr ? 'الإجراءات' : 'Actions'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((req) => (
                  <tr
                    key={req.id}
                    className="hover:bg-canvas-subtle/50 transition-colors"
                  >
                    {/* Requester */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-ratq-500/10 text-ratq-600 flex items-center justify-center font-bold shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-fg">
                            {req.requester?.display_name ||
                              (isAr ? 'مطور معتمد' : 'Verified Developer')}
                          </div>
                          <div className="text-xs text-fg-subtle font-mono">
                            @{req.requester?.handle || 'dev'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Target Resource */}
                    <td className="py-4 px-4">
                      {req.resource ? (
                        <div>
                          <Link
                            to={`/resources/${req.resource.slug}`}
                            className="font-semibold text-fg hover:text-ratq-600 transition-colors line-clamp-1 inline-flex items-center gap-1 group"
                          >
                            <span>
                              {isAr
                                ? req.resource.title_ar
                                : req.resource.title_en}
                            </span>
                            <ExternalLink className="w-3 h-3 text-fg-subtle opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                          <div className="text-xs text-fg-subtle font-mono">
                            {req.resource.slug}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs font-mono text-fg-muted">
                          {req.resource_id}
                        </span>
                      )}
                    </td>

                    {/* Intended Use */}
                    <td className="py-4 px-4">
                      <Badge variant="outline" className="font-medium text-xs">
                        {getIntendedUseLabel(req.intended_use)}
                      </Badge>
                    </td>

                    {/* Duration */}
                    <td className="py-4 px-4 font-mono text-xs text-fg">
                      {req.requested_days} {isAr ? 'يوم' : 'days'}
                    </td>

                    {/* Submitted Date */}
                    <td className="py-4 px-4 font-mono text-xs text-fg-muted">
                      {formatDate(req.submitted_at || req.created_at)}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      {req.status === 'approved' && (
                        <Badge variant="success" className="gap-1 text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{isAr ? 'تمت الموافقة' : 'Approved'}</span>
                        </Badge>
                      )}
                      {req.status === 'under_review' && (
                        <Badge variant="warning" className="gap-1 text-xs">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{isAr ? 'قيد المراجعة' : 'Under Review'}</span>
                        </Badge>
                      )}
                      {req.status === 'rejected' && (
                        <Badge variant="danger" className="gap-1 text-xs">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>{isAr ? 'مرفوض' : 'Rejected'}</span>
                        </Badge>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-end">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Action 1: Purpose of Use */}
                        <Tooltip content={isAr ? 'الغرض من الاستخدام' : 'Purpose of Use'} position="top-right">
                          <button
                            type="button"
                            onClick={() => setPurposeRequest(req)}
                            className="w-8 h-8 rounded-lg border border-border bg-canvas hover:bg-canvas-subtle hover:border-ratq-400 text-fg-muted hover:text-ratq-700 dark:hover:text-ratq-300 flex items-center justify-center transition-colors cursor-pointer"
                            aria-label={isAr ? 'الغرض من الاستخدام' : 'Purpose of Use'}
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                        </Tooltip>

                        {/* Decisions if Under Review */}
                        {req.status === 'under_review' && (
                          <>
                            {/* Action 2: Approve */}
                            <Tooltip content={isAr ? 'الموافقة على الطلب' : 'Approve Request'} position="top-right">
                              <button
                                type="button"
                                onClick={() => handleOpenDecision(req, 'approved')}
                                className="w-8 h-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-xs transition-colors cursor-pointer"
                                aria-label={isAr ? 'الموافقة على الطلب' : 'Approve Request'}
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            </Tooltip>

                            {/* Action 3: Reject */}
                            <Tooltip content={isAr ? 'رفض الطلب' : 'Reject Request'} position="top-right">
                              <button
                                type="button"
                                onClick={() => handleOpenDecision(req, 'rejected')}
                                className="w-8 h-8 rounded-lg border border-red-200 dark:border-red-900/50 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center justify-center transition-colors cursor-pointer"
                                aria-label={isAr ? 'رفض الطلب' : 'Reject Request'}
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </Tooltip>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Purpose Modal */}
      <Modal
        isOpen={Boolean(purposeRequest)}
        onClose={() => setPurposeRequest(null)}
        title={isAr ? 'تفاصيل الغرض من الاستخدام' : 'Purpose of Use Details'}
        maxWidth="lg"
      >
        {purposeRequest && (
          <div className="space-y-5">
            {/* Requester & Target Resource Header Card */}
            <div className="p-4 rounded-xl bg-canvas-subtle border border-border space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-ratq-500/10 text-ratq-600 flex items-center justify-center font-bold">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-fg text-sm">
                      {purposeRequest.requester?.display_name ||
                        (isAr ? 'مطور معتمد' : 'Verified Developer')}
                    </h4>
                    <div className="text-xs text-fg-subtle font-mono">
                      @{purposeRequest.requester?.handle || 'dev'}
                    </div>
                  </div>
                </div>
                <div>
                  {purposeRequest.status === 'approved' && (
                    <Badge variant="success" className="gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isAr ? 'تمت الموافقة' : 'Approved'}</span>
                    </Badge>
                  )}
                  {purposeRequest.status === 'under_review' && (
                    <Badge variant="warning" className="gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{isAr ? 'قيد المراجعة' : 'Under Review'}</span>
                    </Badge>
                  )}
                  {purposeRequest.status === 'rejected' && (
                    <Badge variant="danger" className="gap-1">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>{isAr ? 'مرفوض' : 'Rejected'}</span>
                    </Badge>
                  )}
                </div>
              </div>

              {/* Quick Meta Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-border/70 text-xs">
                <div>
                  <span className="text-fg-subtle block mb-0.5">
                    {isAr ? 'المورد المطلوب' : 'Target Resource'}
                  </span>
                  <span className="font-medium text-fg">
                    {purposeRequest.resource
                      ? (isAr ? purposeRequest.resource.title_ar : purposeRequest.resource.title_en)
                      : purposeRequest.resource_id}
                  </span>
                </div>
                <div>
                  <span className="text-fg-subtle block mb-0.5">
                    {isAr ? 'نوع الاستخدام' : 'Intended Use'}
                  </span>
                  <span className="font-medium text-fg">
                    {getIntendedUseLabel(purposeRequest.intended_use)}
                  </span>
                </div>
                <div>
                  <span className="text-fg-subtle block mb-0.5">
                    {isAr ? 'المدة المطلوبة' : 'Requested Duration'}
                  </span>
                  <span className="font-medium text-fg font-mono">
                    {purposeRequest.requested_days} {isAr ? 'يوم' : 'days'}
                  </span>
                </div>
                <div>
                  <span className="text-fg-subtle block mb-0.5">
                    {isAr ? 'تاريخ التقديم' : 'Submitted Date'}
                  </span>
                  <span className="font-medium text-fg font-mono">
                    {formatDate(purposeRequest.submitted_at || purposeRequest.created_at)}
                  </span>
                </div>
              </div>

              {/* Scopes if any */}
              {purposeRequest.requested_scope?.scopes && purposeRequest.requested_scope.scopes.length > 0 && (
                <div className="pt-2.5 border-t border-border/70 text-xs">
                  <span className="text-fg-subtle block mb-1.5">
                    {isAr ? 'النطاقات البرمجية المطلوبة:' : 'Requested Scopes:'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {purposeRequest.requested_scope.scopes.map((scope) => (
                      <span
                        key={scope}
                        className="px-2 py-0.5 rounded-md bg-canvas-card border border-border text-[11px] font-mono text-fg-muted"
                      >
                        {scope}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Purpose Statement Box */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-fg flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-ratq-600" />
                <span>{isAr ? 'بيان الغرض من الاستخدام والمشروع التطبيقي:' : 'Statement of Intended Purpose:'}</span>
              </label>
              <div className="p-4 rounded-xl bg-canvas-subtle border border-border text-sm text-fg leading-relaxed whitespace-pre-wrap">
                {purposeRequest.purpose_ar}
              </div>
            </div>

            {/* Decision Note if available */}
            {purposeRequest.decision_note_ar && (
              <div className="p-3.5 rounded-xl bg-canvas-subtle/80 border border-border text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-fg">
                    {isAr ? 'ملاحظة القرار الصادر:' : 'Decision Note:'}
                  </span>
                  {purposeRequest.decided_at && (
                    <span className="text-fg-subtle font-mono">
                      {formatDate(purposeRequest.decided_at)}
                    </span>
                  )}
                </div>
                <p className="text-fg-muted leading-relaxed">
                  {purposeRequest.decision_note_ar}
                </p>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border">
              {purposeRequest.status === 'under_review' ? (
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleOpenDecision(purposeRequest, 'approved')}
                    className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <Check className="w-4 h-4" />
                    <span>{isAr ? 'الموافقة على الطلب' : 'Approve Request'}</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenDecision(purposeRequest, 'rejected')}
                    className="gap-1.5 text-red-600 border-red-300 hover:bg-red-50 dark:hover:bg-red-950/20"
                  >
                    <X className="w-4 h-4" />
                    <span>{isAr ? 'رفض الطلب' : 'Reject Request'}</span>
                  </Button>
                </div>
              ) : (
                <div />
              )}

              <Button variant="ghost" onClick={() => setPurposeRequest(null)}>
                {isAr ? 'إغلاق' : 'Close'}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Decision Modal */}
      <Modal
        isOpen={Boolean(activeRequest)}
        onClose={() => setActiveRequest(null)}
        title={
          decisionType === 'approved'
            ? isAr ? 'الموافقة على طلب التصريح' : 'Approve Permit Request'
            : isAr ? 'رفض طلب التصريح' : 'Reject Permit Request'
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-fg-muted">
            {decisionType === 'approved'
              ? isAr
                ? 'سيتم منح المطور تصريح الوصول وتمكينه من إصدار مفتاح API للمورد.'
                : 'The developer will be granted access to generate an API key.'
              : isAr
                ? 'يرجى تقديم سبب الرفض لتوضيح الأمر لمقدم الطلب.'
                : 'Please explain why the request is being rejected.'}
          </p>

          <div>
            <label className="block text-xs font-semibold text-fg mb-1.5">
              {isAr ? 'ملاحظة القرار (تصل للمطور):' : 'Decision Note (sent to requester):'}
            </label>
            <Textarea
              rows={3}
              value={decisionNote}
              onChange={(e) => setDecisionNote(e.target.value)}
              placeholder={
                decisionType === 'approved'
                  ? isAr ? 'تمت الموافقة لأغراض البحث العلمي...' : 'Approved for academic research...'
                  : isAr ? 'نعتذر، المورد مخصص للجهات غير الربحية فقط...' : 'Rejected due to...'
              }
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setActiveRequest(null)}>
              {isAr ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button
              variant={decisionType === 'approved' ? 'primary' : 'outline'}
              className={decisionType === 'approved' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'text-red-600 border-red-300'}
              onClick={handleConfirmDecision}
            >
              {decisionType === 'approved' ? (isAr ? 'تأكيد الموافقة' : 'Confirm Approval') : (isAr ? 'تأكيد الرفض' : 'Confirm Rejection')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PublisherRequestsPage;
