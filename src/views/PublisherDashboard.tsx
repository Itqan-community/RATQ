// src/views/PublisherDashboard.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ItqanBadge } from '@/components/ui/ItqanBadge';
import { DEMO_PUBLISHERS, DEMO_RESOURCES, DEMO_ACCESS_REQUESTS } from '@/lib/mockData';
import { Publisher, Resource } from '@/types';
import { mockRepo } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';
import { isLive } from '@/lib/payloadAuth';
import { fetchMyResources } from '@/lib/payloadOwnResources';
import { requestsFor } from '@/lib/payloadRequests';
import {
  Package,
  Download,
  Plus,
  ShieldCheck,
  Clock,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';

export const PublisherDashboardPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const live = isLive();
  const profile = useAuthStore((s) => s.profile);
  const [liveResources, setLiveResources] = useState<Resource[]>([]);
  useEffect(() => {
    if (live) void fetchMyResources(profile.id).then(setLiveResources);
  }, [live, profile.id]);

  // Live: the signed-in user's own resources + inbound requests, and no borrowed "verified publisher" identity.
  const publisher: Publisher = live
    ? { ...DEMO_PUBLISHERS[0], name_ar: profile.display_name, name_en: profile.display_name, description_ar: '', bio_ar: '', bio_en: '', is_verified: false, verification_status: 'unverified' }
    : DEMO_PUBLISHERS[0];
  const publishedResources = live ? liveResources : DEMO_RESOURCES.filter((r) => r.publisher_id === publisher.id);
  const pendingRequests = (live
    ? requestsFor(mockRepo.getRequests(), 'inbound', profile.id)
    : DEMO_ACCESS_REQUESTS
  ).filter((r) => r.status === 'under_review');

  const totalDownloads = publishedResources.reduce((acc, r) => acc + r.downloads_count, 0);

  return (
    <div className="space-y-8">
      {/* Publisher Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-deep-900 via-ratq-950 to-canvas-card text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4">
          {/* Publisher Text Logo / Emblem */}
          <div
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-ratq-400/50 shadow-md bg-gradient-to-br from-ratq-800 via-ratq-900 to-deep-950 p-2 flex flex-col items-center justify-center text-center shrink-0 relative overflow-hidden select-none group"
            title={isAr ? publisher.name_ar : publisher.name_en}
          >
            {/* Ambient Radial Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--ratq-primary-500)_0%,transparent_70%)] opacity-25 pointer-events-none" />

            {/* Corner Decorative Accents */}
            <span className="absolute top-1 start-1.5 text-[8px] text-ratq-300/40 font-serif leading-none">✦</span>
            <span className="absolute bottom-1 end-1.5 text-[8px] text-ratq-300/40 font-serif leading-none">✦</span>

            {/* Typographic Text Logo */}
            <div className="relative z-10 flex flex-col items-center justify-center leading-none">
              <span className="text-xl sm:text-2xl font-black font-ui text-white tracking-tight drop-shadow-xs">
                {live ? (publisher.name_en || '?').charAt(0).toUpperCase() : isAr ? 'ق·ت' : 'QTF'}
              </span>
              <span className="text-[8.5px] sm:text-[9.5px] font-bold text-ratq-300 font-ui tracking-wide mt-1 leading-tight whitespace-nowrap">
                {isAr ? 'التقنيات القرآنية' : 'QuranTech'}
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                {isAr ? publisher.name_ar : publisher.name_en}
              </h1>
              {(publisher.is_verified || publisher.verification_status === 'verified') && (
                <Badge variant="primary" className="bg-ratq-500/20 text-ratq-300 border-ratq-400/30">
                  <ShieldCheck className="w-3.5 h-3.5 me-1" />
                  {isAr ? 'جهة موثقة' : 'Verified Publisher'}
                </Badge>
              )}
            </div>
            <p className="text-white/80 text-xs sm:text-sm max-w-xl line-clamp-1">
              {isAr
                ? publisher.description_ar || publisher.bio_ar
                : publisher.bio_en || publisher.description_ar}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link to="/publisher/resources/new">
            <Button variant="primary" size="sm" className="bg-ratq-500 hover:bg-ratq-600 text-white gap-1.5">
              <Plus className="w-4 h-4" />
              <span>{isAr ? 'نشر مورد جديد' : 'Publish Resource'}</span>
            </Button>
          </Link>
          <Link to="/publisher/claim">
            <Button variant="outline" size="sm" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              {isAr ? 'إثبات الملكية' : 'Claim Verification'}
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-ratq-500/10 text-ratq-600 dark:text-ratq-400 flex items-center justify-center shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-fg">{publishedResources.length}</div>
            <div className="text-xs text-fg-muted font-medium">{isAr ? 'الموارد المنشورة' : 'Published Resources'}</div>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-fg">{totalDownloads.toLocaleString()}</div>
            <div className="text-xs text-fg-muted font-medium">{isAr ? 'إجمالي التحميلات' : 'Total Downloads'}</div>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-fg">{pendingRequests.length}</div>
            <div className="text-xs text-fg-muted font-medium">{isAr ? 'طلبات تصريح بانتظار البت' : 'Pending Approvals'}</div>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-fg">{live ? '-' : '4.9 / 5'}</div>
            <div className="text-xs text-fg-muted font-medium">{isAr ? 'متوسط تقييم الأقران' : 'Avg Community Rating'}</div>
          </div>
        </Card>
      </div>

      {/* Main Grid: My Resources & Inbound Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Published Resources */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-fg">
              {isAr ? 'الموارد البرمجية الخاصة بك' : 'Your Published Resources'}
            </h2>
            <Link to="/publisher/resources" className="text-xs text-ratq-600 hover:underline font-semibold">
              {isAr ? 'إدارة الموارد' : 'Manage All'}
            </Link>
          </div>

          <div className="space-y-3">
            {publishedResources.map((res) => (
              <Card key={res.id} className="p-5 hover:border-ratq-400 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-fg">
                        {isAr ? res.title_ar : res.title_en}
                      </h3>
                      <ItqanBadge level={res.itqan_level} />
                    </div>
                    <p className="text-xs text-fg-muted line-clamp-1">
                      {isAr ? res.summary_ar : res.summary_en}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-fg-subtle pt-1 font-mono">
                      <span>v{res.latest_version}</span>
                      <span>•</span>
                      <span>{res.downloads_count.toLocaleString()} {isAr ? 'تنزيل' : 'downloads'}</span>
                      <span>•</span>
                      <span className="capitalize">{res.resource_type}</span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <Link to={`/resources/${res.slug}`}>
                      <Button variant="outline" size="sm">
                        {isAr ? 'صفحة العرض' : 'Public Page'}
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Inbound Requests Action Box */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-fg">
              {isAr ? 'طلبات بانتظار القرار' : 'Inbound Requests'}
            </h2>
            <Link to="/publisher/requests" className="text-xs text-ratq-600 hover:underline font-semibold">
              {isAr ? 'عرض الطلبات' : 'View Requests'}
            </Link>
          </div>

          <div className="space-y-3">
            {pendingRequests.length === 0 ? (
              <Card className="p-6 text-center text-fg-muted text-xs">
                {isAr ? 'لا توجد طلبات تصريح معلقة حالياً.' : 'No pending access requests.'}
              </Card>
            ) : (
              pendingRequests.map((req) => (
                <Card key={req.id} className="p-4 border-amber-300 dark:border-amber-900/60">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-fg">
                      {req.requester?.display_name || 'مطور معتمد'}
                    </span>
                    <Badge variant="warning" className="text-[10px]">
                      {isAr ? 'قيد المراجعة' : 'Pending'}
                    </Badge>
                  </div>
                  <p className="text-xs text-fg-muted line-clamp-2 mb-3">
                    {req.purpose_ar}
                  </p>
                  <Link to="/publisher/requests">
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      {isAr ? 'مراجعة واتخاذ قرار' : 'Review & Decide'}
                    </Button>
                  </Link>
                </Card>
              ))
            )}
          </div>

          {/* Quick links card */}
          <Card className="p-5">
            <h3 className="font-bold text-fg text-sm mb-3">
              {isAr ? 'أدوات الناشر' : 'Publisher Tools'}
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/publisher/analytics" className="text-ratq-600 hover:underline flex items-center justify-between">
                  <span>{isAr ? 'إحصائيات الاستهلاك والتحميلات' : 'Usage & Download Analytics'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
              <li>
                <Link to="/publisher/webhooks" className="text-ratq-600 hover:underline flex items-center justify-between">
                  <span>{isAr ? 'خطافات الويب (Webhooks)' : 'Webhook Endpoints'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
              <li>
                <Link to="/standards/checklist" className="text-ratq-600 hover:underline flex items-center justify-between">
                  <span>{isAr ? 'قائمة التحقق من معايير الإتقان' : 'Itqan Self-Assessment Checklist'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PublisherDashboardPage;
