// src/views/AppOverview.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/useAuthStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DEMO_API_KEYS, DEMO_ACCESS_REQUESTS, DEMO_NOTIFICATIONS } from '@/lib/mockData';
import { mockRepo } from '@/lib/supabase';
import { isLive } from '@/lib/payloadAuth';
import { requestsFor } from '@/lib/payloadRequests';
import { Key, Send, Bell, ArrowUpRight, ShieldCheck, Zap, Layers } from 'lucide-react';

export const AppOverviewPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const { profile } = useAuthStore();

  // Live: real Payload data only (requests = mine); mock mode keeps the demo constants.
  const live = isLive();
  const keys = live ? mockRepo.getKeys().filter((k) => k.id.startsWith('payload_key_')) : DEMO_API_KEYS;
  const requests = live ? requestsFor(mockRepo.getRequests(), 'mine', profile.id) : DEMO_ACCESS_REQUESTS;
  const notifications = live
    ? mockRepo.getNotifications().filter((n) => n.id.startsWith('payload_notif_')).slice(0, 3)
    : DEMO_NOTIFICATIONS;
  const activeKeysCount = keys.filter((k) => k.status === 'active').length;
  const pendingRequestsCount = requests.filter((r) => r.status === 'under_review').length;
  const approvedRequestsCount = requests.filter((r) => r.status === 'approved').length;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-ratq-900 via-deep-900 to-canvas-card text-white relative overflow-hidden shadow-sm">
        <div className="relative z-10 max-w-2xl">
          <Badge variant="primary" className="bg-ratq-500/20 text-ratq-300 border-ratq-400/30 mb-3">
            {isAr ? 'بوابة المطور التقنية' : 'Developer Console'}
          </Badge>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">
            {isAr ? `أهلاً بك، ${profile.display_name}` : `Welcome, ${profile.display_name}`}
          </h1>
          <p className="text-white/80 text-sm md:text-base leading-relaxed mb-6">
            {isAr
              ? 'أدر مفاتيحك البرمجية، وتابع طلبات الوصول للمصادر المقيدة، واستفد من البنية التحتية لحزم علوم القرآن.'
              : 'Manage API credentials, track restricted access permits, and utilize QuranTech infrastructure.'}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/resources">
              <Button variant="primary" size="sm" className="bg-ratq-500 hover:bg-ratq-600 text-white">
                {isAr ? 'استكشاف الفهرس' : 'Explore Catalog'}
              </Button>
            </Link>
            <Link to="/app/keys">
              <Button variant="outline" size="sm" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                <Key className="w-3.5 h-3.5 me-1.5" />
                {isAr ? 'إدارة المفاتيح' : 'Manage Keys'}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-ratq-500/10 text-ratq-600 dark:text-ratq-400 flex items-center justify-center shrink-0">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-fg">{activeKeysCount}</div>
            <div className="text-xs text-fg-muted font-medium">{isAr ? 'مفاتيح API نشطة' : 'Active API Keys'}</div>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Send className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-fg">{pendingRequestsCount}</div>
            <div className="text-xs text-fg-muted font-medium">{isAr ? 'طلبات قيد المراجعة' : 'Pending Requests'}</div>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-fg">{approvedRequestsCount}</div>
            <div className="text-xs text-fg-muted font-medium">{isAr ? 'تصاريح معتمدة' : 'Approved Permits'}</div>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-fg">1,420</div>
            <div className="text-xs text-fg-muted font-medium">{isAr ? 'استدعاءات هذا الشهر' : 'Calls This Month'}</div>
          </div>
        </Card>
      </div>

      {/* Main Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Recent Requests & Usage */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-fg">
              {isAr ? 'طلبات الوصول الأخيرة' : 'Recent Access Requests'}
            </h2>
            <Link to="/app/requests" className="text-xs text-ratq-600 hover:underline font-semibold">
              {isAr ? 'عرض الكل' : 'View All'}
            </Link>
          </div>

          <div className="space-y-3">
            {DEMO_ACCESS_REQUESTS.map((req) => (
              <Card key={req.id} className="p-5 hover:border-ratq-400 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-fg text-base mb-1">
                      {req.resource?.title_ar || 'مورد قرآني'}
                    </h3>
                    <p className="text-xs text-fg-muted line-clamp-1 mb-2">
                      {req.purpose_ar}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-fg-subtle">
                      <span className="font-mono">{req.id}</span>
                      <span>•</span>
                      <span>{req.requested_days} {isAr ? 'يوم' : 'days'}</span>
                    </div>
                  </div>

                  <div className="shrink-0 text-end">
                    {req.status === 'approved' && (
                      <Badge variant="success">{isAr ? 'معتمد' : 'Approved'}</Badge>
                    )}
                    {req.status === 'under_review' && (
                      <Badge variant="warning">{isAr ? 'قيد المراجعة' : 'Under Review'}</Badge>
                    )}
                    {req.status === 'rejected' && (
                      <Badge variant="danger">{isAr ? 'مرفوض' : 'Rejected'}</Badge>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Quick Integration Card */}
          <Card className="p-6 bg-canvas-subtle/60 border-border">
            <h3 className="font-bold text-fg mb-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-ratq-600" />
              {isAr ? 'البدء السريع باستخدام الحزمة البرمجية' : 'Quick Integration Snippet'}
            </h3>
            <p className="text-xs text-fg-muted mb-4">
              {isAr
                ? 'استدعاء آمن للمصادر المصرح بها عبر ترويسة x-api-key مع حماية المعدل:'
                : 'Authenticate and fetch Quranic assets securely using the standard header:'}
            </p>
            <pre className="p-3 rounded-lg bg-deep-950 text-white font-mono text-xs overflow-x-auto text-left" dir="ltr">
{`curl -X GET "https://api.ratq.org/v1/resources/res_003" \\
  -H "x-api-key: rtk_live_YOUR_KEY" \\
  -H "Accept: application/json"`}
            </pre>
          </Card>
        </div>

        {/* Right 1 Col: Notifications & Quick Shortcuts */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-fg">
              {isAr ? 'التنبيهات' : 'Notifications'}
            </h2>
            <Link to="/app/notifications" className="text-xs text-ratq-600 hover:underline font-semibold">
              {isAr ? 'عرض الكل' : 'View All'}
            </Link>
          </div>

          <div className="space-y-3">
            {notifications.map((notif) => (
              <Card key={notif.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-ratq-500/10 text-ratq-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-fg mb-1">
                      {isAr ? notif.title_ar : notif.title_ar}
                    </h4>
                    <p className="text-xs text-fg-muted leading-relaxed mb-2">
                      {isAr ? notif.body_ar : notif.body_ar}
                    </p>
                    <time className="text-[10px] font-mono text-fg-subtle">
                      {new Date(notif.created_at).toLocaleDateString()}
                    </time>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-5">
            <h3 className="font-bold text-fg text-sm mb-3">
              {isAr ? 'روابط سريعة' : 'Quick Links'}
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/standards" className="text-ratq-600 hover:underline flex items-center justify-between">
                  <span>{isAr ? 'معايير إتقان الـ 14' : 'Itqan 14 Standards'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
              <li>
                <Link to="/licenses" className="text-ratq-600 hover:underline flex items-center justify-between">
                  <span>{isAr ? 'دليل تراخيص البرمجيات' : 'License Directory'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
              <li>
                <Link to="/legal/privacy" className="text-ratq-600 hover:underline flex items-center justify-between">
                  <span>{isAr ? 'سياسة حماية البيانات وGDPR' : 'Privacy & GDPR Policy'}</span>
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

export default AppOverviewPage;
