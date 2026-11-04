// src/views/Changelog.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { History, ShieldCheck, Sparkles, Zap, Bug } from 'lucide-react';

interface Release {
  version: string;
  date: string;
  title_ar: string;
  title_en: string;
  tag: 'major' | 'security' | 'feature' | 'patch';
  items: Array<{
    type: 'feature' | 'security' | 'perf' | 'fix';
    text_ar: string;
    text_en: string;
  }>;
}

const RELEASES: Release[] = [
  {
    version: 'v1.2.0',
    date: '2026-03-20',
    title_ar: 'تحديث الحماية المتكاملة ومطابقة الأداء',
    title_en: 'Comprehensive Security & Performance Update',
    tag: 'feature',
    items: [
      {
        type: 'security',
        text_ar: 'تفعيل تجزئة مفاتيح API باستخدام SHA-256 مع تشفير الفلفل (Pepper) وإلغاء تخزين المفاتيح الخام نهائياً.',
        text_en: 'Enforced SHA-256 + Pepper API key hashing with zero raw key persistence.',
      },
      {
        type: 'feature',
        text_ar: 'إطلاق معالج النشر المتدرج ذي الـ 7 مراحل لناشري المصادر القرآنية.',
        text_en: 'Launched 7-step wizard for Quranic package publishing with schema checks.',
      },
      {
        type: 'perf',
        text_ar: 'تحسين سرعة استعلامات البحث الهجين pgvector مع مؤشرات ivfflat بنسبة 40%.',
        text_en: 'Optimized hybrid pgvector query latency with ivfflat indices by 40%.',
      },
    ],
  },
  {
    version: 'v1.1.0',
    date: '2026-02-15',
    title_ar: 'إطلاق نظام شارات الإتقان الأربعة والتحكيم الفني',
    title_en: 'Itqan Badges (1-4) & Peer Review Workflow Launch',
    tag: 'major',
    items: [
      {
        type: 'feature',
        text_ar: 'إتاحة معايير الإتقان الـ 14 المعتمدة مع التدقيق الآلي واليدوي.',
        text_en: 'Enabled 14-criteria verification matrix with automated and peer workflows.',
      },
      {
        type: 'security',
        text_ar: 'قفل التعديل على سجلات التدقيق (Append-only Audit Log) لمنع التلاعب في القرارات.',
        text_en: 'Hardened immutable append-only audit log triggers in Postgres.',
      },
      {
        type: 'fix',
        text_ar: 'معالجة اتجاه الأيقونات السهمية في واجهات RTL الصرفة.',
        text_en: 'Fixed directional icon flip logic across pure RTL components.',
      },
    ],
  },
  {
    version: 'v1.0.0',
    date: '2026-01-01',
    title_ar: 'إطلاق المنصة الأولية لمجتمع رتق (RATQ Community)',
    title_en: 'Initial Production Release of RATQ Community Platform',
    tag: 'major',
    items: [
      {
        type: 'feature',
        text_ar: 'توفير فهرس الموارد المفتوحة (مكتبات، خطوط، مجموعات بيانات، تفاسير، تراجم).',
        text_en: 'Unified open catalog for Quranic computing assets and scholarly datasets.',
      },
      {
        type: 'security',
        text_ar: 'قواعد نزاهة القرآن الكريم: منع التوليد الآلي للنصوص القرآنية بحماية قواعد البيانات.',
        text_en: 'Sacred text rule: prohibited automated generative text in sacred fields via triggers.',
      },
      {
        type: 'feature',
        text_ar: 'دعم كامل للخط الرسمي المعتمد IBM Plex Sans Arabic.',
        text_en: 'Full typography integration of IBM Plex Sans Arabic with strict zero-italic rule.',
      },
    ],
  },
];

export const ChangelogPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <Badge variant="primary" className="mb-3">
          <History className="w-3.5 h-3.5 me-1.5" />
          {isAr ? 'سجل التحديثات' : 'System Changelog'}
        </Badge>
        <h1 className="text-3xl md:text-5xl font-extrabold text-fg tracking-tight mb-4">
          {isAr ? 'تطورات منصة رتق' : 'Platform Changelog & Releases'}
        </h1>
        <p className="text-fg-muted text-lg max-w-2xl mx-auto">
          {isAr
            ? 'توثيق دقيق لكل إصدار جديد، تحسين أمني، وإضافة وظيفية لمنظومة خدمة المصحف الشريف.'
            : 'Detailed release logs of platform enhancements, security patches, and features.'}
        </p>
      </div>

      <div className="space-y-8 relative before:absolute before:inset-y-0 before:start-4 md:before:start-8 before:w-0.5 before:bg-border">
        {RELEASES.map((release) => (
          <div key={release.version} className="relative ps-10 md:ps-16">
            {/* Timeline node */}
            <div className="absolute start-2 md:start-6 top-1 -translate-x-1/2 w-5 h-5 rounded-full bg-ratq-600 border-4 border-canvas flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>

            <Card className="p-6 md:p-8 hover:border-ratq-400 transition-all">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <span className="text-xl font-mono font-extrabold text-fg">
                    {release.version}
                  </span>
                  <Badge variant={release.tag === 'major' ? 'gold' : 'primary'}>
                    {release.tag.toUpperCase()}
                  </Badge>
                </div>
                <time className="text-sm font-mono text-fg-muted">
                  {release.date}
                </time>
              </div>

              <h3 className="text-xl font-bold text-fg mb-4">
                {isAr ? release.title_ar : release.title_en}
              </h3>

              <ul className="space-y-3">
                {release.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-fg-muted">
                    {item.type === 'security' && (
                      <ShieldCheck className="w-4 h-4 text-ratq-600 shrink-0 mt-0.5" />
                    )}
                    {item.type === 'feature' && (
                      <Sparkles className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                    )}
                    {item.type === 'perf' && (
                      <Zap className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    )}
                    {item.type === 'fix' && (
                      <Bug className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    )}
                    <span className="leading-relaxed">
                      {isAr ? item.text_ar : item.text_en}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChangelogPage;
