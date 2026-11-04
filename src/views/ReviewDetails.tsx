// src/views/ReviewDetails.tsx
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { ItqanBadge } from '@/components/ui/ItqanBadge';
import { BadgeChecklist } from '@/components/review/BadgeChecklist';
import { DEMO_RESOURCES } from '@/lib/mockData';
import { ArrowLeft, ArrowRight, CheckCircle2, ExternalLink } from 'lucide-react';
import { DirectionalIcon } from '@/components/ui/DirectionalIcon';

export const ReviewDetailsPage: React.FC = () => {
  const { resourceId } = useParams<{ resourceId: string }>();
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const navigate = useNavigate();

  const resource = DEMO_RESOURCES.find((r) => r.id === resourceId) || DEMO_RESOURCES[0];

  const [decisionFeedback, setDecisionFeedback] = useState<string | null>(null);

  const handleAward = (level: any, _notes: string) => {
    setDecisionFeedback(
      isAr
        ? `تم اعتماد الشارة (${level}) وتوثيقها في سجل التدقيق غير القابل للتعديل بنجاح.`
        : `Badge awarded (${level}) and committed to append-only audit log.`
    );
    setTimeout(() => {
      navigate('/review');
    }, 2000);
  };

  const handleReject = (_notes: string) => {
    setDecisionFeedback(
      isAr
        ? `تم إرجاع المورد للناشر مع ملاحظات التدقيق للتعديل.`
        : `Resource returned to publisher with audit notes for remediation.`
    );
    setTimeout(() => {
      navigate('/review');
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Back button */}
      <div>
        <Link
          to="/review"
          className="inline-flex items-center gap-1.5 text-xs text-fg-muted hover:text-fg font-medium mb-3"
        >
          <DirectionalIcon ltrIcon={ArrowLeft} rtlIcon={ArrowRight} className="w-4 h-4" />
          <span>{isAr ? 'العودة لطابور المراجعة' : 'Back to Review Queue'}</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-extrabold text-fg tracking-tight">
                {isAr ? resource.title_ar : resource.title_en}
              </h1>
              <ItqanBadge level={resource.itqan_level} />
            </div>
            <p className="text-xs text-fg-muted font-mono">
              ID: {resource.id} • Slug: {resource.slug} • Version: {resource.latest_version}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link to={`/resources/${resource.slug}`} target="_blank">
              <Button variant="outline" size="sm" className="gap-1.5 shrink-0">
                <span>{isAr ? 'معاينة صفحة المورد' : 'Public Page'}</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {decisionFeedback && (
        <Alert variant="success" className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{decisionFeedback}</span>
        </Alert>
      )}

      {/* Resource Spec Summary Card */}
      <Card className="p-6 bg-canvas-subtle border-border space-y-4">
        <h2 className="text-sm font-bold text-fg uppercase tracking-wider text-fg-subtle">
          {isAr ? 'بيانات الفحص التقني والأمني' : 'Technical & Security Inventory'}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-fg-subtle block mb-1">{isAr ? 'جهة النشر:' : 'Publisher:'}</span>
            <span className="font-bold text-fg">{resource.publisher?.name_ar || 'ناشر معتمد'}</span>
          </div>
          <div>
            <span className="text-fg-subtle block mb-1">{isAr ? 'الترخيص (SPDX):' : 'License:'}</span>
            <span className="font-mono text-fg">{resource.license_spdx}</span>
          </div>
          <div>
            <span className="text-fg-subtle block mb-1">{isAr ? 'النص القرآني:' : 'Sacred Text:'}</span>
            <span className={resource.contains_quranic_text ? 'text-amber-600 font-bold' : 'text-fg-muted'}>
              {resource.contains_quranic_text ? (isAr ? 'يتضمن نصاً' : 'Included') : (isAr ? 'لا يتضمن' : 'None')}
            </span>
          </div>
          <div>
            <span className="text-fg-subtle block mb-1">{isAr ? 'التقنيات المستخدمة:' : 'Tech Stack:'}</span>
            <span className="font-mono text-fg">{resource.tech_stack?.join(', ') || 'TypeScript'}</span>
          </div>
        </div>
      </Card>

      {/* Audit Checklist Widget */}
      <BadgeChecklist
        resource={resource}
        onAward={handleAward}
        onReject={handleReject}
      />
    </div>
  );
};

export default ReviewDetailsPage;
