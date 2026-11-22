// src/views/ResourceDetails.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { signInHref } from '@/lib/authFlow';
import { mockRepo } from '@/lib/supabase';
import { Tabs, TabItem } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { SiteLink } from '@/components/ui/SiteLink';
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
import { localizeResource } from '@/lib/localizeResource';
import { isHttpUrl } from '@/lib/resourceMapping';
import { sourceRows } from '@/lib/sourceDetails';
import { isLive } from '@/lib/payloadAuth';
import { resourceMeta, SITE_NAME } from '@/lib/seoMeta';
import { useResourceDetail } from '@/lib/useResourceDetail';
import { submitReport } from '@/lib/payloadReports';
import { getAppsUsingResource } from '@/lib/appEcosystem';
import { ResourceAppBadges } from '@/components/resources/ResourceAppBadges';
import { ResourceCard } from '@/components/resources/ResourceCard';
import { ResourcePhotoCarousel } from '@/components/resources/ResourcePhotoCarousel';
import { GithubRepoPreview } from '@/components/resources/GithubRepoPreview';
import { ctaBanner, isSynthesizedLicense, photosFor, relatedTo, siteHost } from '@/lib/resourceDetail';
import {
  Globe,
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

const COMMENT_MAX = 2000; // Comments.content maxLength; same cap as old prod's form

export const ResourceDetails: React.FC = () => {
  const { t, i18n } = useTranslation('site');
  const locale: 'ar' | 'en' = i18n.language === 'en' ? 'en' : 'ar';
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
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
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [liveReviews, setLiveReviews] = useState<Review[]>([]);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const { resource, loading: resourceLoading } = useResourceDetail(slug || '');
  const isLiveRes = isLive() && Boolean(resource?.id.startsWith('payload_'));
  // The server already titled this URL; client navigation (catalog -> detail) sets the same title here.
  useEffect(() => {
    if (resource) document.title = `${resourceMeta(resource).title} | ${SITE_NAME}`;
  }, [resource]);
  const reloadComments = () => (resource ? fetchComments(resource.id).then(setLiveReviews) : undefined);
  useEffect(() => {
    if (isLiveRes) void reloadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource?.id, isLiveRes]);

  if (!resource && resourceLoading) return null;
  if (!resource) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <h2 className="text-xl font-bold text-fg mb-2">{t('detail.not_found_title')}</h2>
        <p className="text-xs text-fg-subtle mb-6">
          {t('detail.not_found_body')}
        </p>
        <Button variant="primary" onClick={() => navigate('/resources')}>
          {t('detail.back_to_catalog')}
        </Button>
      </div>
    );
  }

  const loc = localizeResource(resource, locale);
  const reviews = isLiveRes ? liveReviews : mockRepo.getReviews(resource.id);
  const ecosystemApps = getAppsUsingResource(resource.slug, resource.title_ar);
  // Comments and reports live in Payload, so (like old prod) they exist for Payload resources only; CMS entries have neither.
  const hasFeedback = !isLive() || isLiveRes;
  const returnTo = location.pathname + location.search;
  const photos = photosFor(resource);
  const banner = ctaBanner(resource);
  const headerHost = siteHost(resource.homepage_url);
  const related = relatedTo(mockRepo.getResources(), resource);
  const synthesizedLicense = isSynthesizedLicense(resource.license);
  const verifiedPublisher = resource.publisher?.verification_status === 'verified';

  const tabs: TabItem[] = [
    { id: 'overview', label: t('detail.tab_overview') },
    { id: 'install', label: t('detail.tab_install') },
    { id: 'versions', label: t('detail.tab_versions'), count: 1 },
    { id: 'license', label: t('detail.tab_license') },
    ...(hasFeedback ? [{ id: 'reviews', label: t('detail.tab_reviews'), count: reviews.length }] : []),
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
        <Link to="/" className="hover:text-fg">{t('detail.breadcrumb_home')}</Link>
        <span>/</span>
        <Link to="/resources" className="hover:text-fg">{t('detail.breadcrumb_library')}</Link>
        <span>/</span>
        <span className="text-fg font-medium truncate max-w-xs" dir={loc.titleDir}>{loc.title}</span>
      </nav>

      <ResourcePhotoCarousel photos={photos} label={loc.title} />

      {/* Resource Main Header */}
      <div className="p-6 sm:p-7 rounded-2xl border border-border hero-gradient-bg transition-colors shadow-xs mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-white/90 dark:bg-slate-900/90 shadow-2xs flex items-center justify-center text-qtd-700 dark:text-qtd-300 border border-slate-200/80 dark:border-slate-800 shrink-0">
              <Package className="w-7 h-7" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <h1 dir={loc.titleDir} className="text-xl sm:text-2xl font-bold text-fg">{loc.title}</h1>
                <ItqanBadge level={resource.itqan_level} size="md" />
              </div>

              {resource.title_en && resource.title_en !== loc.title && (
                <p dir="ltr" className="text-xs font-mono text-fg-subtle mb-2 text-start">{resource.title_en}</p>
              )}

              <div className="flex flex-wrap items-center gap-2">
                <AccessBadge level={resource.access_level} />
                <LicenseBadge licenseId={resource.license_id} spdx={resource.license_spdx} />
                {resource.latest_version && (
                  <span className="text-xs font-mono text-fg-subtle bg-white/80 dark:bg-slate-900/80 border border-border/70 px-2 py-0.5 rounded shadow-2xs">
                    v{resource.latest_version}
                  </span>
                )}
                {headerHost && (
                  <span dir="ltr" className="inline-flex items-center gap-1 text-xs font-mono text-fg-subtle bg-white/80 dark:bg-slate-900/80 border border-border/70 px-2 py-0.5 rounded shadow-2xs">
                    <Globe className="w-3 h-3" /> {headerHost}
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
                {t('detail.download_use')}
              </Button>
            ) : (
              <Button
                variant="gold"
                size="md"
                onClick={() => setRequestDialogOpen(true)}
                startIcon={<Lock className="w-4 h-4" />}
              >
                {t('detail.request_access')}
              </Button>
            )}

            {/* Live resources are all 'open' in the design model, but the API still gates keys behind an approved
                request (as on old prod's resource page), so offer the request here too. Guests go sign in first. */}
            {isLiveRes && resource.access_level === 'open' && (
              <Button
                variant="gold"
                size="md"
                onClick={() => (isAuthenticated ? setRequestDialogOpen(true) : navigate(signInHref(location.pathname + location.search)))}
                startIcon={<Lock className="w-4 h-4" />}
              >
                {t('detail.request_access')}
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
                  {t('detail.repo')}
                </Button>
              </a>
            )}

            {resource.homepage_url && (
              <a href={resource.homepage_url} target="_blank" rel="noopener noreferrer">
                <Button
                  variant="outline"
                  size="md"
                  startIcon={<Globe className="w-4 h-4" />}
                  className="bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 border-border/80 shadow-2xs"
                >
                  {t('detail.website')}
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
                  {t('detail.docs')}
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
                  <h3 className="text-sm font-bold text-fg mb-2">{t('detail.overview_heading')}</h3>
                  <div dir={loc.descriptionDir} className="text-xs text-fg leading-relaxed whitespace-pre-line bg-subtle/30 p-4 rounded-xl border border-border-subtle">
                    {loc.description}
                  </div>
                </div>

                {/* Sacred Text Notice */}
                {resource.contains_quranic_text && (
                  <QuranQuote
                    text="إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ"
                    surahName={t('detail.quran_sample_surah')}
                    ayahNumber={9}
                    sourceAuthority={resource.quran_source_authority || t('detail.quran_default_authority')}
                    sourceVersion={resource.quran_source_version}
                    licenseId={resource.quran_source_license_id || resource.license_id}
                  />
                )}

                {banner && (
                  <section
                    aria-label={banner.kind === 'site' ? t('detail.banner_visit_site') : t('detail.banner_view_cms')}
                    className="p-4 rounded-xl border border-border bg-canvas flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-9 h-9 rounded-full bg-subtle text-fg flex items-center justify-center shrink-0">
                        <Globe className="w-4 h-4" />
                      </span>
                      <div>
                        <h3 className="text-sm font-bold text-fg">
                          {banner.kind === 'site' ? t('detail.banner_visit_site') : t('detail.banner_view_cms')}
                        </h3>
                        <p className="text-2xs text-fg-subtle leading-relaxed">
                          {banner.kind === 'site'
                            ? t('detail.banner_available_on', { host: banner.host })
                            : t('detail.banner_published_cms')}
                        </p>
                      </div>
                    </div>
                    <a
                      href={banner.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      dir={banner.kind === 'site' ? 'ltr' : undefined}
                      className="shrink-0 inline-flex items-center justify-center gap-1.5 rounded-full bg-qtd-600 hover:bg-qtd-700 text-white text-xs font-semibold px-4 py-2"
                    >
                      {banner.kind === 'site' ? t('detail.banner_visit_host', { host: banner.host }) : t('detail.banner_open_page')}
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </section>
                )}

                <GithubRepoPreview resource={resource} />

                {/* Tech Stack */}
                {resource.tech_stack?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-fg mb-2">{t('detail.tech_stack')}</h3>
                    <div className="flex flex-wrap gap-2">
                      {resource.tech_stack.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 rounded-md bg-muted text-xs font-mono font-medium text-fg"
                        >
                          {tech}
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
                <h3 className="text-sm font-bold text-fg">{t('detail.install_heading')}</h3>
                <p className="text-xs text-fg-subtle">
                  {t('detail.install_hint')}
                </p>
                <InstallSnippet instructions={resource.install_instructions} />
              </div>
            )}

            {/* Versions Tab */}
            {activeTab === 'versions' && (
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-bold text-fg">{t('detail.versions_heading')}</h3>
                <VersionTable
                  versions={[
                    {
                      id: 'ver_001',
                      resource_id: resource.id,
                      version: resource.latest_version || '1.0.0',
                      released_at: resource.latest_released_at || resource.created_at,
                      changelog_ar: t('detail.version_changelog'),
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
                  <h3 className="text-sm font-bold text-fg">
                    {synthesizedLicense ? t('detail.license_heading_synth') : t('detail.license_heading_cc')}
                  </h3>
                  {resource.license?.url && (
                    <a
                      href={resource.license.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-qtd-700 hover:underline font-medium text-2xs"
                    >
                      {t('detail.license_official_text')}
                    </a>
                  )}
                </div>
                <div className="flex flex-col gap-2.5 text-fg leading-relaxed">
                  <p>
                    <strong>{t('detail.license_applied')}</strong> {resource.license?.name_ar || resource.license_id} ({resource.license_spdx || resource.license?.name_en || resource.license_id})
                  </p>
                  {resource.license?.notes_ar && (
                    <p className="text-fg-subtle bg-subtle p-3 rounded-lg border border-border-subtle">
                      {resource.license.notes_ar}
                    </p>
                  )}
                  {synthesizedLicense ? (
                    // The platform has no terms for this license: show it verbatim instead of an all-"no" permission grid.
                    <p className="text-fg-subtle bg-subtle p-3 rounded-lg border border-border-subtle">
                      {t('detail.license_no_terms')}
                    </p>
                  ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                    <p className="p-2.5 rounded-lg bg-subtle/60 border border-border-subtle">
                      <strong>{t('detail.license_commercial')}</strong> {resource.license?.allows_commercial ? t('detail.license_commercial_yes') : t('detail.license_commercial_no')}
                    </p>
                    <p className="p-2.5 rounded-lg bg-subtle/60 border border-border-subtle">
                      <strong>{t('detail.license_attribution')}</strong> {resource.license?.requires_attribution ? t('detail.license_attribution_yes') : t('detail.license_attribution_no')}
                    </p>
                    <p className="p-2.5 rounded-lg bg-subtle/60 border border-border-subtle">
                      <strong>{t('detail.license_modification')}</strong> {resource.license?.allows_modification ? t('detail.license_modification_yes') : t('detail.license_modification_no')}
                    </p>
                    <p className="p-2.5 rounded-lg bg-subtle/60 border border-border-subtle">
                      <strong>{t('detail.license_sharealike')}</strong> {resource.license?.requires_share_alike ? t('detail.license_sharealike_yes') : t('detail.license_sharealike_no')}
                    </p>
                  </div>
                  )}
                  {resource.contains_quranic_text && (
                    <div className="p-3.5 rounded-lg bg-qtd-50 dark:bg-qtd-950 border border-qtd-200 text-qtd-900 dark:text-qtd-200 mt-2">
                      <strong>{t('detail.quran_source')}</strong> {resource.quran_source_authority}
                      <br />
                      <strong>{t('detail.quran_source_url')}</strong> <a href={resource.quran_source_url} target="_blank" rel="noreferrer" className="underline">{resource.quran_source_url}</a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="flex flex-col gap-6">
                {/* Submit Review Box */}
                {isLiveRes && !isAuthenticated ? (
                  <div className="p-5 rounded-xl border border-border bg-canvas text-xs text-fg-muted flex flex-wrap items-center justify-between gap-3">
                    <span>{t('detail.sign_in_to_comment')}</span>
                    <Link to={signInHref(returnTo)}>
                      <Button variant="primary" size="sm">{t('detail.sign_in')}</Button>
                    </Link>
                  </div>
                ) : (
                <form onSubmit={handleAddReview} className="p-5 rounded-xl border border-border bg-canvas flex flex-col gap-3">
                  <h4 className="text-xs font-bold text-fg">{t('detail.review_form_title')}</h4>
                  {!isLiveRes && (
                  <div className="flex items-center gap-2">
                    <span className="text-2xs text-fg-subtle">{t('detail.rating')}</span>
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
                    maxLength={COMMENT_MAX}
                    onChange={(e) => setReviewBody(e.target.value)}
                    placeholder={t('detail.review_placeholder')}
                    className="w-full rounded-md border border-border bg-subtle p-3 text-xs text-fg focus:outline-none focus:ring-1 focus:ring-qtd-500"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-2xs text-fg-subtle font-mono">{reviewBody.length}/{COMMENT_MAX}</span>
                    <Button variant="primary" size="sm" type="submit">
                      {t('detail.submit_review')}
                    </Button>
                  </div>
                  {reviewError && <p role="alert" className="text-2xs text-red-600">{reviewError}</p>}
                  {reviewSubmitted && (
                    <p className="text-2xs text-emerald-600 font-semibold">
                      {t('detail.review_thanks')}
                    </p>
                  )}
                </form>
                )}

                {/* Review items */}
                <div className="flex flex-col gap-3">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-xl border border-border-subtle bg-canvas">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-fg">{rev.profile?.display_name || t('detail.anonymous_dev')}</span>
                          {!isLiveRes && <RatingStars rating={rev.rating} size={12} />}
                        </div>
                        <span className="text-2xs text-fg-subtle flex items-center gap-3">
                          {formatDate(rev.created_at)}
                          {isLiveRes && rev.profile_id === myProfileId && (
                            <button
                              type="button"
                              className="text-red-600 hover:underline"
                              onClick={async () => {
                                if (!window.confirm(t('detail.confirm_delete_comment'))) return;
                                setReviewError(await deleteComment(rev.id));
                                await reloadComments();
                              }}
                            >
                              {t('detail.delete')}
                            </button>
                          )}
                        </span>
                      </div>
                      <p dir="auto" className="text-xs text-fg-muted leading-relaxed">{rev.body_ar}</p>
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
                {t('detail.publisher_card')}
              </span>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-qtd-100 dark:bg-qtd-900 text-qtd-700 dark:text-qtd-300 flex items-center justify-center font-bold text-sm shrink-0">
                  {resource.publisher.name_ar.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-fg">{resource.publisher.name_ar}</h4>
                  {verifiedPublisher && (
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> {t('detail.verified_publisher')}
                    </span>
                  )}
                </div>
              </div>
              {resource.publisher.description_ar && (
                <p className="text-xs text-fg-muted leading-relaxed mb-4">
                  {resource.publisher.description_ar}
                </p>
              )}
              <SiteLink to={`/publishers/${resource.publisher.slug}`}>
                <Button variant="outline" size="sm" className="w-full">
                  {t('detail.view_publisher')}
                </Button>
              </SiteLink>
            </div>
          )}

          {/* Ecosystem Apps Widget (Sidebar) */}
          {ecosystemApps.length > 0 && (
            <div className="p-5 rounded-xl border border-border bg-canvas text-start">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-fg-subtle uppercase tracking-wider">
                  {t('detail.apps_title')}
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-qtd-50 dark:bg-qtd-950 text-qtd-700 dark:text-qtd-300 border border-qtd-200 dark:border-qtd-800">
                  {ecosystemApps.length}
                </span>
              </div>
              <p className="text-xs text-fg-muted mb-3.5 leading-relaxed">
                {t('detail.apps_hint')}
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
              {t('detail.stats_title')}
            </span>
            {!resource.id.startsWith('payload_') && (
              <>
                <div className="flex justify-between py-1.5 border-b border-border-subtle">
                  <span className="text-fg-subtle">{t('detail.stat_downloads')}</span>
                  <span className="font-bold font-mono text-fg">{resource.downloads_count.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border-subtle">
                  <span className="text-fg-subtle">{t('detail.stat_views')}</span>
                  <span className="font-bold font-mono text-fg">{resource.views_count.toLocaleString()}</span>
                </div>
              </>
            )}
            <div className="flex justify-between py-1.5 border-b border-border-subtle">
              <span className="text-fg-subtle">{t('detail.stat_updated')}</span>
              <span className="font-medium text-fg">{formatDate(resource.updated_at)}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-fg-subtle">{t('detail.stat_access')}</span>
              <span className="font-semibold text-fg">
                {resource.access_level === 'open' ? t('detail.access_open') : t('detail.access_request')}
              </span>
            </div>
          </div>

          {/* Technical details (old prod's "quick summary" + "technical details") */}
          <div className="p-5 rounded-xl border border-border bg-canvas text-start flex flex-col gap-3 text-xs">
            <span className="text-[11px] font-bold text-fg-subtle uppercase tracking-wider">
              {t('detail.tech_title')}
            </span>
            {([
              [t('detail.tech_publisher'), resource.publisher?.name_ar],
              [t('detail.tech_type'), resource.resource_type],
              [t('detail.tech_version'), resource.latest_version && `v${resource.latest_version}`],
              [t('detail.tech_published'), resource.created_at && formatDate(resource.created_at)],
              [t('detail.tech_license'), (locale === 'en' && resource.license_en) || resource.license_spdx || resource.license?.name_en],
              [t('detail.tech_status'), resource.status === 'published' ? t('detail.status_published') : resource.status],
              [t('detail.tech_badge'), resource.itqan_level === 'none' ? t('detail.no') : t('detail.yes')],
              // Sheet-imported rows: a missing value reads "Not stated" rather than vanishing.
              ...sourceRows(resource, locale === 'en').map((r): [string, React.ReactNode] => [
                t(`detail.src_${r.key}`),
                !r.value ? (
                  <span className="text-fg-subtle font-normal">{t('detail.src_not_stated')}</span>
                ) : r.url && isHttpUrl(r.value) ? (
                  <a href={r.value} target="_blank" rel="noopener noreferrer" dir="ltr" className="text-qtd-700 hover:underline">
                    {r.value}
                  </a>
                ) : r.key === 'has_api' ? (
                  t(`detail.src_api_${r.value}`)
                ) : (
                  r.value
                ),
              ]),
            ] as [string, React.ReactNode][]).map(([label, value]) =>
              value ? (
                <div key={label} className="flex justify-between gap-3 py-1.5 border-b border-border-subtle last:border-0">
                  <span className="text-fg-subtle shrink-0">{label}:</span>
                  <span className="font-medium text-fg text-end break-words min-w-0">{value}</span>
                </div>
              ) : null
            )}
          </div>

          {/* Actions & Report */}
          <div className="flex items-center justify-between text-xs text-fg-subtle px-1">
            {hasFeedback && (
              <button
                type="button"
                onClick={() => {
                  // Live: reports need an account (server enforces it too); send guests to sign in and back.
                  if (isLive() && !isAuthenticated) return navigate(signInHref(returnTo));
                  setReportSubmitted(false);
                  setReportModalOpen(true);
                }}
                className="hover:text-red-600 flex items-center gap-1.5 transition-colors cursor-pointer"
                title={t('detail.report_link_title')}
              >
                <Flag className="w-3.5 h-3.5" />
                <span>{t('detail.report_link')}</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setCopiedLink(false);
                setCopiedMarkdown(false);
                setShareModalOpen(true);
              }}
              className="hover:text-fg flex items-center gap-1.5 transition-colors cursor-pointer"
              title={t('detail.share_link_title')}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{t('detail.share_link')}</span>
            </button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-12" aria-labelledby="related-title">
          <h2 id="related-title" className="text-base font-bold text-fg mb-4">{t('detail.related')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map((r) => (
              <ResourceCard key={r.id} resource={r} isCompact showAppUsages={false} />
            ))}
          </div>
        </section>
      )}

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
        title={t('detail.report_modal_title')}
        maxWidth="md"
      >
        {reportSubmitted ? (
          <div className="py-6 px-2 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-fg mb-1">{t('detail.report_done_title')}</h3>
              <p className="text-xs text-fg-muted max-w-sm mx-auto leading-relaxed">
                {t('detail.report_done_body')}
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
                {t('detail.report_done_close')}
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleReportSubmit} className="space-y-4 text-start">
            {/* Target Resource Summary */}
            <div className="p-3 rounded-xl bg-canvas-subtle border border-border flex items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-fg-subtle block text-[11px]">{t('detail.report_target')}</span>
                <span dir={loc.titleDir} className="font-bold text-fg">{loc.title}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-fg-subtle font-mono">v{resource.latest_version}</span>
                <ItqanBadge level={resource.itqan_level} />
              </div>
            </div>

            <Select
              label={t('detail.report_reason')}
              required
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value as Report['reason'])}
              options={[
                { value: 'sacred_error', label: t('detail.reason_sacred_error') },
                { value: 'broken', label: t('detail.reason_broken') },
                { value: 'copyright', label: t('detail.reason_copyright') },
                { value: 'inaccurate', label: t('detail.reason_inaccurate') },
                { value: 'abuse', label: t('detail.reason_abuse') },
                { value: 'other', label: t('detail.reason_other') },
              ]}
            />

            {reportReason === 'sacred_error' && (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong>{t('detail.sacred_warning_title')}</strong> {t('detail.sacred_warning_body')}
                </div>
              </div>
            )}

            <Textarea
              label={t('detail.report_details')}
              required
              rows={3}
              maxLength={500}
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
              placeholder={t('detail.report_details_placeholder')}
            />

            <Input
              label={t('detail.report_evidence')}
              type="url"
              value={reportEvidence}
              onChange={(e) => setReportEvidence(e.target.value)}
              placeholder="https://example.com/issue-screenshot.png"
            />

            {reportError && <p role="alert" className="text-xs text-red-600">{reportError}</p>}

            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <Button variant="ghost" type="button" onClick={() => setReportModalOpen(false)}>
                {t('detail.cancel')}
              </Button>
              <Button variant="primary" type="submit" className="bg-red-600 hover:bg-red-700 text-white">
                {t('detail.report_submit')}
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Share Resource Modal */}
      <Modal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title={t('detail.share_modal_title')}
        maxWidth="lg"
      >
        <div className="space-y-5 text-start">
          {/* Resource Preview Box */}
          <div className="p-4 rounded-xl bg-canvas-subtle border border-border space-y-2">
            <div className="flex items-center justify-between gap-2">
              <h4 dir={loc.titleDir} className="font-bold text-fg text-sm">{loc.title}</h4>
              <div className="flex items-center gap-1.5 shrink-0">
                <ItqanBadge level={resource.itqan_level} />
                <LicenseBadge licenseId={resource.license_id} spdx={resource.license_spdx} />
              </div>
            </div>
            <p dir={loc.descriptionDir} className="text-xs text-fg-muted line-clamp-2 leading-relaxed">
              {loc.summary}
            </p>
            <div className="text-[11px] text-fg-subtle font-mono pt-1">
              {t('detail.publisher_label')} {resource.publisher?.name_ar || t('detail.publisher_unknown')}
            </div>
          </div>

          {/* Direct URL with Copy Button */}
          <div>
            <label className="block text-xs font-semibold text-fg mb-1.5">
              {t('detail.direct_link')}
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
                    <span>{t('detail.copied')}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{t('detail.copy')}</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Social Sharing Buttons */}
          <div>
            <label className="block text-xs font-semibold text-fg mb-2">
              {t('detail.quick_share')}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {/* X / Twitter */}
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  t('detail.share_tweet', { title: loc.title })
                )}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-lg border border-border bg-canvas hover:bg-canvas-subtle hover:border-qtd-400 text-xs font-medium text-fg transition-colors whitespace-nowrap"
              >
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span className="whitespace-nowrap">{t('detail.share_x')}</span>
              </a>

              {/* WhatsApp */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  t('detail.share_whatsapp_text', { title: loc.title, url: typeof window !== 'undefined' ? window.location.href : '' })
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-lg border border-border bg-canvas hover:bg-canvas-subtle hover:border-emerald-400 text-xs font-medium text-fg transition-colors whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="whitespace-nowrap">{t('detail.share_whatsapp')}</span>
              </a>

              {/* Telegram */}
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.href : ''
                )}&text=${encodeURIComponent(loc.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-lg border border-border bg-canvas hover:bg-canvas-subtle hover:border-sky-400 text-xs font-medium text-fg transition-colors whitespace-nowrap"
              >
                <Send className="w-4 h-4 text-sky-500 shrink-0" />
                <span className="whitespace-nowrap">{t('detail.share_telegram')}</span>
              </a>

              {/* Email */}
              <a
                href={`mailto:?subject=${encodeURIComponent(
                  t('detail.share_mail_subject', { title: loc.title })
                )}&body=${encodeURIComponent(
                  t('detail.share_mail_body', { title: loc.title, url: typeof window !== 'undefined' ? window.location.href : '' })
                )}`}
                className="flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-lg border border-border bg-canvas hover:bg-canvas-subtle hover:border-qtd-400 text-xs font-medium text-fg transition-colors whitespace-nowrap"
              >
                <Mail className="w-4 h-4 text-fg-muted shrink-0" />
                <span className="whitespace-nowrap">{t('detail.share_email')}</span>
              </a>
            </div>
          </div>

          {/* Markdown for Developers */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-fg">
                {t('detail.markdown_label')}
              </label>
              <button
                type="button"
                onClick={() => {
                  const md = `[![دليل التقنيات القرآنية - ${resource.title_ar}](https://img.shields.io/badge/دليل_التقنيات_القرآنية-${encodeURIComponent(
                    resource.title_ar
                  )}-0d9488)](${typeof window !== 'undefined' ? window.location.href : ''})`;
                  navigator.clipboard.writeText(md);
                  setCopiedMarkdown(true);
                  setTimeout(() => setCopiedMarkdown(false), 2000);
                }}
                className="text-xs text-qtd-600 hover:underline flex items-center gap-1 font-medium cursor-pointer"
              >
                {copiedMarkdown ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>{t('detail.markdown_copied')}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>{t('detail.markdown_copy')}</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-2.5 rounded-lg bg-canvas-card border border-border font-mono text-[11px] text-fg-muted overflow-x-auto select-all">
              {`[![دليل التقنيات القرآنية - ${resource.title_ar}](https://img.shields.io/badge/دليل_التقنيات_القرآنية-${encodeURIComponent(
                resource.title_ar
              )}-0d9488)](${typeof window !== 'undefined' ? window.location.href : ''})`}
            </div>
          </div>

          {/* Close button */}
          <div className="flex justify-end pt-2 border-t border-border">
            <Button variant="ghost" onClick={() => setShareModalOpen(false)}>
              {t('detail.close')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
