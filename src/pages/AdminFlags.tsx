// src/pages/AdminFlags.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Switch } from '@/components/ui/Switch';
import { Alert } from '@/components/ui/Alert';
import { CheckCircle2 } from 'lucide-react';

interface FeatureFlag {
  key: string;
  name_ar: string;
  name_en: string;
  desc_ar: string;
  desc_en: string;
  enabled: boolean;
  category: 'core' | 'ai' | 'security';
}

export const AdminFlagsPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const [flags, setFlags] = useState<FeatureFlag[]>([
    {
      key: 'vector_hybrid_search',
      name_ar: 'البحث الهجين المتجهي (pgvector)',
      name_en: 'pgvector Hybrid Semantic Search',
      desc_ar: 'تفعيل الدمج بين مطابقة المتجهات والبحث النصي الكامل (BM25) في فهرس الموارد.',
      desc_en: 'Enable pgvector cosine similarity ranking merged with BM25 full-text indexing.',
      enabled: true,
      category: 'ai',
    },
    {
      key: 'strict_sacred_guard',
      name_ar: 'الحماية الصارمة للقرآن الكريم (Zero-AI)',
      name_en: 'Strict Sacred Text Zero-AI Guard',
      desc_ar: 'تفعيل الحظر الجبري لأي محاولات توليد آلي لنصوص الآيات والتفاسير في قاعدة البيانات.',
      desc_en: 'Enforce database-level triggers blocking generative AI text in sacred fields.',
      enabled: true,
      category: 'security',
    },
    {
      key: 'open_self_registration',
      name_ar: 'التسجيل الذاتي المفتوح للباحثين',
      name_en: 'Open Self-Registration',
      desc_ar: 'السماح للزوار بإنشاء حسابات مطورين مباشرة دون الحاجة لدعوة مسبقة.',
      desc_en: 'Permit public self-service developer account registration.',
      enabled: true,
      category: 'core',
    },
    {
      key: 'flarum_sso_bridge',
      name_ar: 'جسر الدخول الموحد لمنتدى Flarum',
      name_en: 'Flarum SSO Forum Bridge',
      desc_ar: 'مزامنة جلسات المصادقة بين منصة رتق ومجتمع النقاش الفني الخارجي.',
      desc_en: 'Synchronize JWT authentication sessions with external discussion forums.',
      enabled: false,
      category: 'core',
    },
    {
      key: 'sla_auto_escalation',
      name_ar: 'التصعيد التلقائي لانتهاء مهلة SLA',
      name_en: 'Automated SLA Escalation',
      desc_ar: 'إرسال تنبيهات بريدية فورية للمشرفين عند تأخر الناشر عن الرد على طلب وصول أكثر من 5 أيام.',
      desc_en: 'Auto-dispatch notifications to moderators when requests exceed 5 days.',
      enabled: true,
      category: 'security',
    },
  ]);

  const [feedback, setFeedback] = useState<string | null>(null);

  const toggleFlag = (key: string) => {
    setFlags((prev) =>
      prev.map((f) => (f.key === key ? { ...f, enabled: !f.enabled } : f))
    );
    setFeedback(isAr ? 'تم تحديث حالة علم الميزة بنجاح.' : 'Feature flag updated.');
    setTimeout(() => setFeedback(null), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-fg tracking-tight">
          {isAr ? 'أعلام الميزات البرمجية (Feature Flags)' : 'Feature Flags Management'}
        </h1>
        <p className="text-fg-muted text-sm mt-1">
          {isAr
            ? 'تفعيل وتعطيل الوظائف البرمجية لحظياً دون الحاجة لإعادة نشر الكود أو إعادة تشغيل الخوادم.'
            : 'Toggle runtime platform features dynamically without code redeployments.'}
        </p>
      </div>

      {feedback && (
        <Alert variant="success" className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </Alert>
      )}

      <div className="space-y-4">
        {flags.map((flag) => (
          <Card key={flag.key} className="p-6 border-border flex items-start justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h3 className="font-bold text-fg text-base">
                  {isAr ? flag.name_ar : flag.name_en}
                </h3>
                <span className="font-mono text-2xs px-2 py-0.5 rounded bg-canvas-subtle border border-border text-fg-subtle">
                  {flag.key}
                </span>
                <Badge variant={flag.category === 'security' ? 'danger' : flag.category === 'ai' ? 'primary' : 'outline'} className="text-[10px]">
                  {flag.category}
                </Badge>
              </div>

              <p className="text-xs text-fg-muted leading-relaxed max-w-xl">
                {isAr ? flag.desc_ar : flag.desc_en}
              </p>
            </div>

            <div className="shrink-0 pt-1">
              <Switch
                checked={flag.enabled}
                onChange={() => toggleFlag(flag.key)}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminFlagsPage;
