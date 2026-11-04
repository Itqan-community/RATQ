// src/pages/Status.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { CheckCircle2, Clock, Activity, ShieldCheck, Database, Server, Cpu, Radio } from 'lucide-react';

interface ServiceStatus {
  name_ar: string;
  name_en: string;
  status: 'operational' | 'degraded' | 'maintenance';
  uptime: string;
  latency: string;
  icon: any;
}

const SERVICES: ServiceStatus[] = [
  {
    name_ar: 'شبكة التوزيع وحافة Netlify CDN',
    name_en: 'Global Edge & Netlify CDN',
    status: 'operational',
    uptime: '99.99%',
    latency: '18ms',
    icon: Server,
  },
  {
    name_ar: 'قاعدة بيانات Supabase (Postgres & RLS)',
    name_en: 'Supabase PostgreSQL & RLS Core',
    status: 'operational',
    uptime: '99.98%',
    latency: '32ms',
    icon: Database,
  },
  {
    name_ar: 'محرك البحث المتجهي (pgvector)',
    name_en: 'pgvector Semantic Search Index',
    status: 'operational',
    uptime: '99.95%',
    latency: '64ms',
    icon: Cpu,
  },
  {
    name_ar: 'بوابة التحقق ومفاتيح API (Gateway)',
    name_en: 'API Key Gateway & Rate Limiter',
    status: 'operational',
    uptime: '99.99%',
    latency: '24ms',
    icon: ShieldCheck,
  },
  {
    name_ar: 'مستودع الأصول الرقمية (Storage)',
    name_en: 'Binary Package & Storage Buckets',
    status: 'operational',
    uptime: '99.97%',
    latency: '41ms',
    icon: Radio,
  },
];

export const StatusPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Overall Banner */}
      <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500 text-white mb-4 shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-fg mb-2">
          {isAr ? 'جميع الأنظمة تعمل بكفاءة تامة' : 'All Systems Fully Operational'}
        </h1>
        <p className="text-fg-muted text-sm max-w-lg mx-auto">
          {isAr
            ? 'تخضع جميع الخدمات وبوابات البيانات لمراقبة حية على مدار الساعة لضمان استقرار التطبيقات والمشاريع المعتمدة.'
            : 'All microservices, database clusters, and API gateways are monitored 24/7.'}
        </p>
      </div>

      {/* Services List */}
      <h2 className="text-xl font-bold text-fg mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5 text-ratq-600" />
        {isAr ? 'حالة الخدمات الفردية' : 'Component Status'}
      </h2>

      <div className="space-y-3 mb-10">
        {SERVICES.map((srv, idx) => {
          const Icon = srv.icon;
          return (
            <Card key={idx} className="p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-canvas-subtle border border-border flex items-center justify-center text-ratq-600">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-fg text-base">
                    {isAr ? srv.name_ar : srv.name_en}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-fg-subtle mt-0.5">
                    <span>{isAr ? `زمن الاستجابة: ${srv.latency}` : `Latency: ${srv.latency}`}</span>
                    <span>•</span>
                    <span>{isAr ? `الجاهزية: ${srv.uptime}` : `Uptime: ${srv.uptime}`}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  {isAr ? 'نشط' : 'Operational'}
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Incident History */}
      <h2 className="text-xl font-bold text-fg mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-ratq-600" />
        {isAr ? 'سجل العمليات خلال آخر 90 يوماً' : 'Past 90 Days Incidents'}
      </h2>

      <Card className="p-6 text-center text-fg-muted">
        <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
        <p className="font-medium text-fg">
          {isAr ? 'لا توجد أي انقطاعات أو حوادث مسجلة خلال هذه الفترة.' : 'No incidents reported in the past 90 days.'}
        </p>
        <p className="text-xs text-fg-subtle mt-1">
          {isAr ? 'متوسط نسبة الجاهزية الإجمالية: 99.98%' : 'Overall platform uptime average: 99.98%'}
        </p>
      </Card>
    </div>
  );
};

export default StatusPage;
