// src/views/ResourceDetails.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { mockRepo } from '@/lib/supabase';
import { Tabs, TabItem } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { ItqanBadge } from '@/components/ui/ItqanBadge';
import { AccessBadge } from '@/components/ui/AccessBadge';
import { LicenseBadge } from '@/components/ui/LicenseBadge';
import { RatingStars } from '@/components/ui/RatingStars';
import { QuranQuote } from '@/components/ui/QuranQuote';
import { VersionTable } from '@/components/resources/VersionTable';
import { InstallSnippet } from '@/components/resources/InstallSnippet';
import { AccessRequestDialog } from '@/components/requests/AccessRequestDialog';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Report, Review } from '@/types';
import { useAuthStore } from '@/store/useAuthStore';
import { deleteComment, fetchComments, postComment } from '@/lib/payloadComments';
import { formatDate } from '@/lib/format';
import { isLive } from '@/lib/payloadAuth';
import { submitReport } from '@/lib/payloadReports';
import { getAppsUsingResource } from '@/lib/appEcosystem';
import { ResourceAppBadges } from '@/components/resources/ResourceAppBadges';
import {
  Package,
  Download,
  Lock,
  ExternalLink,
  Github,
  Flag,
  Share2,
  CheckCircle,
  CheckCircle2,
  Copy,
  Check,
  AlertTriangle,
  Mail,
  Send,
  MessageCircle,
} from 'lucide-react';

export const ResourceDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);

  // Report Modal state
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState<Report['reason']>('sacred_error');
  const [reportDetails, setReportDetails] = useState('');
  const [reportEvidence, setReportEvidence] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);

  // Share Modal state
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);

  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewBody, setReviewBody] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Live comments (Payload) for live resources; loaded after mount.
  const myProfileId = useAuthStore((s) => s.profile.id);
  const [liveReviews, setLiveReviews] = useState<Review[]>([]);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const resource = mockRepo.getResourceBySlug(slug || '');
  const isLiveRes = isLive() && Boolean(resource?.id.startsWith('payload_'));
  const reloadComments = () => (resource ? fetchComments(resource.id).then(setLiveReviews) : undefined);
  useEffect(() => {
    if (isLiveRes) void reloadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource?.id, isLiveRes]);

  if (!resource) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <h2 className="text-xl font-bold text-fg mb-2">المورد غير موجود</h2>
        <p className="text-xs text-fg-subtle mb-6">
          المورد الذي تبحث عنه غير متاح أو تم نقله إلى رابط آخر.
        </p>
        <Button variant="primary" onClick={() => navigate('/resources')}>
          العودة للكتالوج
        </Button>
      </div>
    );
  }

  const reviews = isLiveRes ? liveReviews : mockRepo.getReviews(resource.id);
  const ecosystemApps = getAppsUsingResource(resource.slug, resource.title_ar);

  const tabs: TabItem[] = [
    { id: 'overview', label: 'نظرة عامة' },
    { id: 'install', label: 'التركيب والتشغيل' },
    { id: 'versions', label: 'الإصدارات والملفات', count: 1 },
    { id: 'license', label: 'الترخيص والمصدر' },
    { id: 'reviews', label: 'التقييمات والمراجعات', count: reviews.length },
  ];

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resource) return;

    // Live: the server is the authority (auth, one open report per resource). Never fake success.
    if (isLive()) {
      const err = await submitReport(resource.id, reportReason, reportDetails, reportEvidence);
      setReportError(err);
      if (err) return;
      setReportSubmitted(true);
      setReportDetails('');
      setReportEvidence('');
      return;
    }

    mockRepo.addReport({
      target_kind: 'resource',
      target_id: resource.id,
      target_title: resource.title_ar,
      reason: reportReason,
      priority: reportReason === 'sacred_error' ? 'critical' : 'normal',
      details_ar: reportDetails,
      evidence_urls: reportEvidence.trim() ? [reportEvidence.trim()] : [],
    });

    setReportSubmitted(true);
    setReportDetails('');
    setReportEvidence('');
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewBody.trim()) return;
    if (isLiveRes) {
      const err = await postComment(resource.id, reviewBody.trim());
      setReviewError(err);
      if (err) return;
      setReviewSubmitted(true);
      setReviewBody('');
      await reloadComments();
      return;
    }
    mockRepo.addReview(resource.id, reviewRating, reviewBody);
    setReviewSubmitted(true);
    setReviewBody('');
  };

  return (
    <div className="max-w-container mx-auto px-4 sm:px-6 py-8 w-full text-start">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-fg-subtle mb-6">
        <Link to="/" className="hover:text-fg">الرئيسية</Link>
        <span>/</span>
        <Link to="/resources" className="hover:text-fg">مكتبة الموارد</Link>
        <span>/</span>
        <span className="text-fg font-medium truncate max-w-xs">{resource.title_ar}</span>
      </nav>

      {/* Resource Main Header */}
      <div className="p-6 sm:p-7 rounded-2xl border border-border hero-gradient-bg transition-colors shadow-xs mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-white/90 dark:bg-slate-900/90 shadow-2xs flex items-center justify-center text-ratq-700 dark:text-ratq-300 border border-slate-200/80 dark:border-slate-800 shrink-0">
              <Package className="w-7 h-7" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <h1 className="text-xl sm:text-2xl font-bold text-fg">{resource.title_ar}</h1>
                <ItqanBadge level={resource.itqan_level} size="md" />
              </div>

              {resource.title_en && (
                <p className="text-xs font-mono text-fg-subtle mb-2">{resource.title_en}</p>
              )}

              <div className="flex flex-wrap items-center gap-2">
                <AccessBadge level={resource.access_level} />
                <LicenseBadge licenseId={resource.license_id} spdx={resource.license_spdx} />
                {resource.latest_version && (
                  <span className="text-xs font-mono text-fg-subtle bg-white/80 dark:bg-slate-900/80 border border-border/70 px-2 py-0.5 rounded shadow-2xs">
                    v{resource.latest_version}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5">
            {resource.access_level === 'open' ? (
              <Button
                variant="primary"
                size="md"
                onClick={() => setActiveTab('install')}
                startIcon={<Download className="w-4 h-4" />}
              >
                تنزيل واستخدام
              </Button>
            ) : (
              <Button
                variant="gold"
                size="md"
                onClick={() => setRequestDialogOpen(true)}
                startIcon={<Lock className="w-4 h-4" />}
              >
                طلب وصول معتمد
              </Button>
            )}

            {resource.repo_url && (
              <a href={resource.repo_url} target="_blank" rel="noopener noreferrer">
                <Button
                  variant="outline"
                  size="md"
                  startIcon={<Github className="w-4 h-4" />}
                  className="bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 border-border/80 shadow-2xs"
                >
                  المستودع
                </Button>
              </a>
            )}

            {resource.docs_url && (
              <a href={resource.docs_url} target="_blank" rel="noopener noreferrer">
                <Button
                  variant="outline"
                  size="md"
                  startIcon={<ExternalLink className="w-4 h-4" />}
                  className="bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 border-border/80 shadow-2xs"
                >
                  التوثيق
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Tabs Content & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Tabs Area (2 Cols) */}
        <div className="lg:col-span-2 flex flex-col">
          <Tabs items={tabs} activeId={activeTab} onChange={setActiveTab} />

          <div className="py-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="text-sm font-bold text-fg mb-2">الوصف العام والميزات</h3>
                  <div className="text-xs text-fg leading-relaxed whitespace-pre-line bg-subtle/30 p-4 rounded-xl border border-border-subtle">
                    {resource.description_ar}
                  </div>
                </div>

                {/* Sacred Text Notice */}
                {resource.contains_quranic_text && (
                  <QuranQuote
                    text="إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ"
                    surahName="الإسراء"
                    ayahNumber={9}
                    sourceAuthority={resource.quran_source_authority || 'مصحف المدينة النبوية المعتمد'}
                    sourceVersion={resource.quran_source_version}
                    licenseId={resource.quran_source_license_id || resource.license_id}
                  />
                )}

                {/* Tech Stack */}
                {resource.tech_stack && (
                  <div>
                    <h3 className="text-sm font-bold text-fg mb-2">التقنيات المدعومة</h3>
                    <div className="flex flex-wrap gap-2">
                      {resource.tech_stack.map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-1 rounded-md bg-muted text-xs font-mono font-medium text-fg"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Install Tab */}
            {activeTab === 'install' && (
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-bold text-fg">تعليمات التثبيت السريع</h3>
                <p className="text-xs text-fg-subtle">
                  انسخ الأمر البرمجي المناسب لبيئة العمل الخاصة بمشروعك:
                </p>
                <InstallSnippet instructions={resource.install_instructions} />
              </div>
            )}

            {/* Versions Tab */}
            {activeTab === 'versions' && (
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-bold text-fg">سجل الإصدارات والملفات المرفقة</h3>
                <VersionTable
                  versions={[
                    {
                      id: 'ver_001',
                      resource_id: resource.id,
                      version: resource.latest_version || '1.0.0',
                      released_at: resource.latest_released_at || resource.created_at,
                      changelog_ar: 'الإصدار المعتمد المستقر مع دعم كامل لمعايير إتقان.',
                      change_kind: 'minor',
                      breaking_change: false,
                      status: 'published',
                      file_count: 1,
                      total_size_bytes: 450000,
                    },
                  ]}
                />
              </div>
            )}

            {/* License Tab */}
            {activeTab === 'license' && (
              <div className="p-6 rounded-xl border border-border bg-canvas flex flex-col gap-4 text-xs shadow-2xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-fg">ترخيص المشاع الإبداعي (Creative Commons) وحقوق الاستخدام</h3>
                  {resource.license?.url && (
                    <a
                      href={resource.license.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-ratq-700 hover:underline font-medium text-2xs"
                    >
                      نص الرخصة الرسمي ↗
                    </a>
                  )}
                </div>
                <div className="flex flex-col gap-2.5 text-fg leading-relaxed">
                  <p>
                    <strong>الترخيص المطبق:</strong> {resource.license?.name_ar || resource.license_id} ({resource.license_spdx || resource.license?.name_en || resource.license_id})
                  </p>
                  {resource.license?.notes_ar && (
                    <p className="text-fg-subtle bg-subtle p-3 rounded-lg border border-border-subtle">
                      {resource.license.notes_ar}
                    </p>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                    <p className="p-2.5 rounded-lg bg-subtle/60 border border-border-subtle">
                      <strong>الاستخدام التجاري:</strong> {resource.license?.allows_commercial ? 'مسموح به وفق شروط الترخيص' : 'غير مصرح به للاستخدام التجاري (NonCommercial)'}
                    </p>
                    <p className="p-2.5 rounded-lg bg-subtle/60 border border-border-subtle">
                      <strong>الإسناد والنسبة:</strong> {resource.license?.requires_attribution ? 'يلزم إسناد العمل ونسبته لصاحبه (Attribution)' : 'غير ملزم (تنازل كامل)'}
                    </p>
                    <p className="p-2.5 rounded-lg bg-subtle/60 border border-border-subtle">
                      <strong>التعديل والاشتقاق:</strong> {resource.license?.allows_modification ? 'مسموح باشتقاق وتعديل العمل' : 'غير مصرح بالاشتقاق (NoDerivatives)'}
                    </p>
                    <p className="p-2.5 rounded-lg bg-subtle/60 border border-border-subtle">
                      <strong>المشاركة بالمثل:</strong> {resource.license?.requires_share_alike ? 'يلزم ترخيص الأعمال المشتقة بنفس الرخصة (ShareAlike)' : 'غير ملزم بشرط المشاركة بالمثل'}
                    </p>
                  </div>
                  {resource.contains_quranic_text && (
                    <div className="p-3.5 rounded-lg bg-ratq-50 dark:bg-ratq-950 border border-ratq-200 text-ratq-900 dark:text-ratq-200 mt-2">
                      <strong>مصدر المحتوى القرآني:</strong> {resource.quran_source_authority}
                      <br />
                      <strong>رابط التوثيق الرسمي:</strong> <a href={resource.quran_source_url} target="_blank" rel="noreferrer" className="underline">{resource.quran_source_url}</a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="flex flex-col gap-6">
                {/* Submit Review Box */}
                <form onSubmit={handleAddReview} className="p-5 rounded-xl border border-border bg-canvas flex flex-col gap-3">
                  <h4 className="text-xs font-bold text-fg">أضف تقييمك وملاحظاتك الفنية</h4>
                  {!isLiveRes && (
                  <div className="flex items-center gap-2">
                    <span className="text-2xs text-fg-subtle">التقييم:</span>
                    <RatingStars
                      rating={reviewRating}
                      interactive
                      size={18}
                      onRatingChange={setReviewRating}
                    />
                  </div>
                  )}
                  <textarea
                    rows={3}
                    value={reviewBody}
                    onChange={(e) => setReviewBody(e.target.value)}
                    placeholder="شارك تجربتك مع أداء المكتبة وتوافقها..."
                    className="w-full rounded-md border border-border bg-subtle p-3 text-xs text-fg focus:outline-none focus:ring-1 focus:ring-ratq-500"
                  />
                  <div className="flex justify-end">
                    <Button variant="primary" size="sm" type="submit">
                      إرسال التقييم
                    </Button>
                  </div>
                  {reviewError && <p role="alert" className="text-2xs text-red-600">{reviewError}</p>}
                  {reviewSubmitted && (
                    <p className="text-2xs text-emerald-600 font-semibold">
                      تمت إضافة تقييمك بنجاح! شكراً لمساهمتك.
                    </p>
                  )}
                </form>

                {/* Review items */}
                <div className="flex flex-col gap-3">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-xl border border-border-subtle bg-canvas">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-fg">{rev.profile?.display_name || 'مطور'}</span>
                          {!isLiveRes && <RatingStars rating={rev.rating} size={12} />}
                        </div>
                        <span className="text-2xs text-fg-subtle flex items-center gap-3">
                          {formatDate(rev.created_at)}
                          {isLiveRes && rev.profile_id === myProfileId && (
                            <button
                              type="button"
                              className="text-red-600 hover:underline"
                              onClick={async () => {
                                setReviewError(await deleteComment(rev.id));
                                await reloadComments();
                              }}
                            >
                              حذف
                            </button>
                          )}
                        </span>
                      </div>
                      <p className="text-xs text-fg-muted leading-relaxed">{rev.body_ar}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar (1 Col) */}
        <div className="flex flex-col gap-6">
          {/* Publisher Card */}
          {resource.publisher && (
            <div className="p-5 rounded-xl border border-border bg-canvas text-start">
              <span className="text-[11px] font-bold text-fg-subtle uppercase tracking-wider block mb-3">
                الناشر المعتمد
              </span>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-ratq-100 dark:bg-ratq-900 text-ratq-700 dark:text-ratq-300 flex items-center justify-center font-bold text-sm shrink-0">
                  {resource.publisher.name_ar.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-fg">{resource.publisher.name_ar}</h4>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> موثق في المنصة
                  </span>
                </div>
              </div>
              <p className="text-xs text-fg-muted leading-relaxed mb-4">
                {resource.publisher.description_ar}
              </p>
              <Link to={`/publishers/${resource.publisher.slug}`}>
                <Button variant="outline" size="sm" className="w-full">
                  عرض ملف الناشر
                </Button>
              </Link>
            </div>
          )}

          {/* Ecosystem Apps Widget (Sidebar) */}
          {ecosystemApps.length > 0 && (
            <div className="p-5 rounded-xl border border-border bg-canvas text-start">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-fg-subtle uppercase tracking-wider">
                  تطبيقات تعتمد على المورد
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-ratq-50 dark:bg-ratq-950 text-ratq-700 dark:text-ratq-300 border border-ratq-200 dark:border-ratq-800">
                  {ecosystemApps.length}
                </span>
              </div>
              <p className="text-xs text-fg-muted mb-3.5 leading-relaxed">
                مُعتمد ومُدمج في معمارية المنظومات والتطبيقات القرآنية التالية:
              </p>
              <div className="pt-0.5 pb-1">
                <ResourceAppBadges
                  apps={ecosystemApps}
                  showLabel={false}
                  maxDisplay={6}
                  size="sm"
                  linkToTechStack
                />
              </div>
            </div>
          )}

          {/* Quick Metrics Card */}
          <div className="p-5 rounded-xl border border-border bg-canvas text-start flex flex-col gap-3 text-xs">
            <span className="text-[11px] font-bold text-fg-subtle uppercase tracking-wider">
              إحصاءات المورد
            </span>
            {!resource.id.startsWith('payload_') && (
              <>
                <div className="flex justify-between py-1.5 border-b border-border-subtle">
                  <span className="text-fg-subtle">إجمالي التنزيلات:</span>
                  <span className="font-bold font-mono text-fg">{resource.downloads_count.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border-subtle">
                  <span className="text-fg-subtle">المشاهدات:</span>
                  <span className="font-bold font-mono text-fg">{resource.views_count.toLocaleString()}</span>
                </div>
              </>
            )}
            <div className="flex justify-between py-1.5 border-b border-border-subtle">
              <span className="text-fg-subtle">آخر تحديث:</span>
              <span className="font-medium text-fg">{formatDate(resource.updated_at)}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-fg-subtle">مستوى الوصول:</span>
              <span className="font-semibold text-fg">
                {resource.access_level === 'open' ? 'مفتوح ومباشر' : 'بالطلب عبر الناشر'}
              </span>
            </div>
          </div>

          {/* Actions & Report */}
          <div className="flex items-center justify-between text-xs text-fg-subtle px-1">
            <button
              type="button"
              onClick={() => {
                setReportSubmitted(false);
                setReportModalOpen(true);
              }}
              className="hover:text-red-600 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="الإبلاغ عن مشكلة في هذا المورد"
            >
              <Flag className="w-3.5 h-3.5" />
              <span>أبلغ عن مشكلة</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setCopiedLink(false);
                setCopiedMarkdown(false);
                setShareModalOpen(true);
              }}
              className="hover:text-fg flex items-center gap-1.5 transition-colors cursor-pointer"
              title="مشاركة رابط المورد"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>مشاركة الرابط</span>
            </button>
          </div>
        </div>
      </div>

      {/* Access Request Dialog */}
      <AccessRequestDialog
        resource={resource}
        isOpen={requestDialogOpen}
        onClose={() => setRequestDialogOpen(false)}
        onSuccess={() => navigate('/app/requests')}
      />

      {/* Report Issue Modal */}
      <Modal
        isOpen={reportModalOpen}
        onClose={() => {
          setReportModalOpen(false);
          setTimeout(() => setReportSubmitted(false), 300);
        }}
        title="الإبلاغ عن مشكلة في المورد"
        maxWidth="md"
      >
        {reportSubmitted ? (
          <div className="py-6 px-2 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-fg mb-1">تم تسجيل البلاغ بنجاح</h3>
              <p className="text-xs text-fg-muted max-w-sm mx-auto leading-relaxed">
                شكراً لحرصك على نزاهة وجودة موارد المنصة. تم إرسال البلاغ لفريق مراجعي إتقان وسيتم فحصه ومعالجته بدقة.
              </p>
            </div>
            <div className="pt-2">
              <Button
                variant="primary"
                onClick={() => {
                  setReportModalOpen(false);
                  setReportSubmitted(false);
                }}
              >
                حسناً، إغلاق
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleReportSubmit} className="space-y-4 text-start">
            {/* Target Resource Summary */}
            <div className="p-3 rounded-xl bg-canvas-subtle border border-border flex items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-fg-subtle block text-[11px]">المورد المستهدف:</span>
                <span className="font-bold text-fg">{resource.title_ar}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-fg-subtle font-mono">v{resource.latest_version}</span>
                <ItqanBadge level={resource.itqan_level} />
              </div>
            </div>

            <Select
              label="سبب الإبلاغ"
              required
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value as Report['reason'])}
              options={[
                { value: 'sacred_error', label: 'خطأ في ضبط أو رسم آيات القرآن الكريم (أولوية قصوى)' },
                { value: 'broken', label: 'رابط معطل أو ملف غير متاح أو تالف' },
                { value: 'copyright', label: 'انتهاك حقوق الملكية أو مخالفة شروط الترخيص' },
                { value: 'inaccurate', label: 'بيانات وصفية أو معلومات تقنية غير دقيقة' },
                { value: 'abuse', label: 'برمجية مشبوهة أو ثغرة أمنية أو محتوى غير لائق' },
                { value: 'other', label: 'سبب آخر...' },
              ]}
            />

            {reportReason === 'sacred_error' && (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong>تنبيه نزاهة القرآن الكريم:</strong> البلاغات المتعلقة بسلامة نصوص القرآن الكريم ورسمها المصحفي تخضع لمسار تدقيق فوري ومباشر من قبل لجان المراجعة الشرعية والتقنية.
                </div>
              </div>
            )}

            <Textarea
              label="تفاصيل المشكلة"
              required
              rows={3}
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
              placeholder="يرجى وصف المشكلة بوضوح، مع تحديد الآيات أو الملفات المتأثرة إن وجدت..."
            />

            <Input
              label="رابط مرجعي أو إثبات (اختياري)"
              type="url"
              value={reportEvidence}
              onChange={(e) => setReportEvidence(e.target.value)}
              placeholder="https://example.com/issue-screenshot.png"
            />

            {reportError && <p role="alert" className="text-xs text-red-600">{reportError}</p>}

            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <Button variant="ghost" type="button" onClick={() => setReportModalOpen(false)}>
                إلغاء
              </Button>
              <Button variant="primary" type="submit" className="bg-red-600 hover:bg-red-700 text-white">
                إرسال البلاغ
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Share Resource Modal */}
      <Modal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title="مشاركة المورد"
        maxWidth="lg"
      >
        <div className="space-y-5 text-start">
          {/* Resource Preview Box */}
          <div className="p-4 rounded-xl bg-canvas-subtle border border-border space-y-2">
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-bold text-fg text-sm">{resource.title_ar}</h4>
              <div className="flex items-center gap-1.5 shrink-0">
                <ItqanBadge level={resource.itqan_level} />
                <LicenseBadge licenseId={resource.license_id} spdx={resource.license_spdx} />
              </div>
            </div>
            <p className="text-xs text-fg-muted line-clamp-2 leading-relaxed">
              {resource.summary_ar}
            </p>
            <div className="text-[11px] text-fg-subtle font-mono pt-1">
              الناشر: {resource.publisher?.name_ar || 'غير محدد'}
            </div>
          </div>

          {/* Direct URL with Copy Button */}
          <div>
            <label className="block text-xs font-semibold text-fg mb-1.5">
              الرابط المباشر للمورد:
            </label>
            <div className="flex items-center gap-2">
              <Input
                readOnly
                value={typeof window !== 'undefined' ? window.location.href : ''}
                className="text-xs font-mono select-all bg-canvas-card"
              />
              <Button
                variant={copiedLink ? 'secondary' : 'outline'}
                size="sm"
                className="shrink-0 gap-1.5 min-w-[90px]"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    navigator.clipboard.writeText(window.location.href);
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 2000);
                  }
                }}
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>تم النسخ</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>نسخ</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Social Sharing Buttons */}
          <div>
            <label className="block text-xs font-semibold text-fg mb-2">
              مشاركة سريعة عبر المنصات:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {/* X / Twitter */}
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  `${resource.title_ar} - مورد موثق عبر منصة رتق الرقمية:\n`
                )}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-lg border border-border bg-canvas hover:bg-canvas-subtle hover:border-ratq-400 text-xs font-medium text-fg transition-colors whitespace-nowrap"
              >
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span className="whitespace-nowrap">منصة X</span>
              </a>

              {/* WhatsApp */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `${resource.title_ar} - عبر منصة رتق للموارد القرآنية:\n${typeof window !== 'undefined' ? window.location.href : ''}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-lg border border-border bg-canvas hover:bg-canvas-subtle hover:border-emerald-400 text-xs font-medium text-fg transition-colors whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="whitespace-nowrap">واتساب</span>
              </a>

              {/* Telegram */}
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.href : ''
                )}&text=${encodeURIComponent(resource.title_ar)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-lg border border-border bg-canvas hover:bg-canvas-subtle hover:border-sky-400 text-xs font-medium text-fg transition-colors whitespace-nowrap"
              >
                <Send className="w-4 h-4 text-sky-500 shrink-0" />
                <span className="whitespace-nowrap">تيليجرام</span>
              </a>

              {/* Email */}
              <a
                href={`mailto:?subject=${encodeURIComponent(
                  `مورد قرآني موثق: ${resource.title_ar}`
                )}&body=${encodeURIComponent(
                  `السلام عليكم،\n\nأشاركك هذا المورد القرآني الموثق من منصة رتق:\n${resource.title_ar}\n${typeof window !== 'undefined' ? window.location.href : ''}`
                )}`}
                className="flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-lg border border-border bg-canvas hover:bg-canvas-subtle hover:border-ratq-400 text-xs font-medium text-fg transition-colors whitespace-nowrap"
              >
                <Mail className="w-4 h-4 text-fg-muted shrink-0" />
                <span className="whitespace-nowrap">بريد إلكتروني</span>
              </a>
            </div>
          </div>

          {/* Markdown for Developers */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-fg">
                كود Markdown (للتوثيق و README):
              </label>
              <button
                type="button"
                onClick={() => {
                  const md = `[![رتق - ${resource.title_ar}](https://img.shields.io/badge/رتق-${encodeURIComponent(
                    resource.title_ar
                  )}-0d9488)](${typeof window !== 'undefined' ? window.location.href : ''})`;
                  navigator.clipboard.writeText(md);
                  setCopiedMarkdown(true);
                  setTimeout(() => setCopiedMarkdown(false), 2000);
                }}
                className="text-xs text-ratq-600 hover:underline flex items-center gap-1 font-medium cursor-pointer"
              >
                {copiedMarkdown ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>تم نسخ الرمز</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>نسخ Markdown</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-2.5 rounded-lg bg-canvas-card border border-border font-mono text-[11px] text-fg-muted overflow-x-auto select-all">
              {`[![رتق - ${resource.title_ar}](https://img.shields.io/badge/رتق-${encodeURIComponent(
                resource.title_ar
              )}-0d9488)](${typeof window !== 'undefined' ? window.location.href : ''})`}
            </div>
          </div>

          {/* Close button */}
          <div className="flex justify-end pt-2 border-t border-border">
            <Button variant="ghost" onClick={() => setShareModalOpen(false)}>
              إغلاق
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
