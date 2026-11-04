// src/pages/ReviewQueue.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ItqanBadge } from '@/components/ui/ItqanBadge';
import { DEMO_RESOURCES } from '@/lib/mockData';
import { ShieldCheck, Award, Clock, ArrowRight, ArrowLeft } from 'lucide-react';
import { DirectionalIcon } from '@/components/ui/DirectionalIcon';

export const ReviewQueuePage: React.FC = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const [activeTab, setActiveTab] = useState<'pending' | 'in_progress' | 'completed'>('pending');

  // Let's create queue items from DEMO_RESOURCES
  const queueItems = DEMO_RESOURCES.map((r, i) => ({
    ...r,
    requested_level: i === 0 ? 'verified' : i === 2 ? 'certified' : 'gold',
    queue_status: i === 1 ? 'in_progress' : i === 3 ? 'completed' : 'pending',
    reviewer_name: i === 1 ? 'د. سليمان الخالد' : null,
    submitted_date: '2026-01-18',
  }));

  const filtered = queueItems.filter((item) => item.queue_status === activeTab);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="primary" className="bg-ratq-500/10 text-ratq-600 dark:text-ratq-400 border-ratq-500/20">
            <ShieldCheck className="w-3.5 h-3.5 me-1" />
            {isAr ? 'مجلس مراجعة الأقران وتدقيق الإتقان' : 'Peer Review & Itqan Council'}
          </Badge>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-fg tracking-tight">
          {isAr ? 'طابور تحكيم الموارد وإسناد الشارات' : 'Review Queue & Badging Board'}
        </h1>
        <p className="text-fg-muted text-sm mt-1 max-w-2xl">
          {isAr
            ? 'مراجعة الموارد البرمجية ومطابقتها وفق مصفوفة معايير إتقان الـ 14 وقواعد نص القرآن الكريم قبل إجازتها ومنح الشارات.'
            : 'Evaluate open-source tools against the 14 Itqan criteria and sacred text integrity.'}
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-fg">3</div>
            <div className="text-xs text-fg-muted font-medium">{isAr ? 'بانتظار التحكيم' : 'Pending Review'}</div>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-fg">1</div>
            <div className="text-xs text-fg-muted font-medium">{isAr ? 'قيد المراجعة الفنية' : 'In Progress'}</div>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-fg">24</div>
            <div className="text-xs text-fg-muted font-medium">{isAr ? 'شارة مُنحت هذا الشهر' : 'Badges Awarded'}</div>
          </div>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-border pb-3">
        {[
          { key: 'pending', label_ar: 'بانتظار التحكيم (3)', label_en: 'Pending (3)' },
          { key: 'in_progress', label_ar: 'قيد الإجراء (1)', label_en: 'In Progress (1)' },
          { key: 'completed', label_ar: 'مكتمل ومعتمد', label_en: 'Completed' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === tab.key
                ? 'bg-ratq-600 text-white'
                : 'text-fg-muted hover:text-fg hover:bg-canvas-subtle'
            }`}
          >
            {isAr ? tab.label_ar : tab.label_en}
          </button>
        ))}
      </div>

      {/* Queue List */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <Card key={item.id} className="p-6 border-border hover:border-ratq-400 transition-all">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-fg-subtle">{item.id}</span>
                  <span className="text-fg-subtle">•</span>
                  <span className="text-xs text-fg-muted">
                    {isAr ? `تاريخ الإرسال: ${item.submitted_date}` : `Submitted: ${item.submitted_date}`}
                  </span>
                  {item.contains_quranic_text && (
                    <Badge variant="warning" className="text-[10px]">
                      {isAr ? 'يتضمن نصاً قرآنياً (تدقيق إلزامي)' : 'Contains Sacred Text'}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-fg">
                    {isAr ? item.title_ar : item.title_en}
                  </h3>
                  <ItqanBadge level={item.itqan_level} />
                </div>

                <p className="text-xs text-fg-muted line-clamp-1">
                  {isAr ? item.summary_ar : item.summary_en}
                </p>

                <div className="flex items-center gap-3 text-xs text-fg-subtle pt-1 font-mono">
                  <span>v{item.latest_version}</span>
                  <span>•</span>
                  <span>{item.publisher?.name_ar || 'ناشر معتمد'}</span>
                  <span>•</span>
                  <span className="capitalize">{item.resource_type}</span>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-3">
                <Link to={`/review/${item.id}`}>
                  <Button variant="primary" size="sm" className="gap-2 shrink-0">
                    <span>{isAr ? 'بدء فحص المعايير' : 'Start Audit'}</span>
                    <DirectionalIcon ltrIcon={ArrowRight} rtlIcon={ArrowLeft} className="w-4 h-4 shrink-0" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReviewQueuePage;
