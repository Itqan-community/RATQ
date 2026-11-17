// src/views/PublisherAnalytics.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import {
  TrendingUp,
  Download,
  Eye,
  Zap,
  Globe,
  FileDown,
  BarChart3,
} from 'lucide-react';

export const PublisherAnalyticsPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const [timeRange, setTimeRange] = useState('30d');

  const monthlyData = [
    { label: isAr ? 'أكتوبر' : 'Oct', value: 3200, height: '40%' },
    { label: isAr ? 'نوفمبر' : 'Nov', value: 4800, height: '60%' },
    { label: isAr ? 'ديسمبر' : 'Dec', value: 5900, height: '75%' },
    { label: isAr ? 'يناير' : 'Jan', value: 7200, height: '90%' },
    { label: isAr ? 'فبراير' : 'Feb', value: 6800, height: '85%' },
    { label: isAr ? 'مارس' : 'Mar', value: 8400, height: '100%' },
  ];

  const countries = [
    { name_ar: 'المملكة العربية السعودية', name_en: 'Saudi Arabia', pct: 42, count: '14,280' },
    { name_ar: 'مصر', name_en: 'Egypt', pct: 21, count: '7,140' },
    { name_ar: 'الإمارات العربية المتحدة', name_en: 'UAE', pct: 15, count: '5,100' },
    { name_ar: 'إندونيسيا', name_en: 'Indonesia', pct: 12, count: '4,080' },
    { name_ar: 'دول أخرى', name_en: 'Other', pct: 10, count: '3,400' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-fg tracking-tight">
            {isAr ? 'لوحة تحليلات الاستخدام والتحميلات' : 'Usage & Download Analytics'}
          </h1>
          <p className="text-fg-muted text-sm mt-1">
            {isAr
              ? 'مؤشرات الأداء، استهلاك الموارد، والتوزيع الجغرافي للمطورين المستفيدين.'
              : 'Performance indicators, package downloads, and geographic distribution.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            options={[
              { value: '7d', label: isAr ? 'آخر 7 أيام' : 'Last 7 Days' },
              { value: '30d', label: isAr ? 'آخر 30 يوماً' : 'Last 30 Days' },
              { value: '90d', label: isAr ? 'آخر 3 أشهر' : 'Last 90 Days' },
              { value: '1y', label: isAr ? 'العام الحالي' : 'Current Year' },
            ]}
          />
          <Button variant="outline" size="sm" className="gap-2">
            <FileDown className="w-4 h-4" />
            <span>{isAr ? 'تصدير (CSV)' : 'Export CSV'}</span>
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-fg-muted font-medium">{isAr ? 'إجمالي التنزيلات' : 'Total Downloads'}</span>
            <Download className="w-4 h-4 text-ratq-600" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-fg">34,000</div>
          <div className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+24.5% {isAr ? 'مقارنة بالشهر السابق' : 'vs last month'}</span>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-fg-muted font-medium">{isAr ? 'مشاهدات الموارد' : 'Page Views'}</span>
            <Eye className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-fg">89,200</div>
          <div className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.2%</span>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-fg-muted font-medium">{isAr ? 'استدعاءات API الحية' : 'Live API Calls'}</span>
            <Zap className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-fg">412,850</div>
          <div className="text-xs text-fg-subtle font-mono mt-1">
            99.98% {isAr ? 'معدل النجاح' : 'Success rate'}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-fg-muted font-medium">{isAr ? 'متوسط سرعة الاستجابة' : 'Avg Latency'}</span>
            <BarChart3 className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-fg">28 ms</div>
          <div className="text-xs text-emerald-600 font-medium mt-1">
            {isAr ? 'أداء فائق السرعة' : 'Ultra-low latency'}
          </div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Monthly Download Chart */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-fg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-ratq-600" />
              <span>{isAr ? 'نمو التحميلات خلال الأشهر الستة الماضية' : '6-Month Download Growth'}</span>
            </h2>
            <Badge variant="primary">+{isAr ? '١٦٢٪ إجمالي' : '162% overall'}</Badge>
          </div>

          <div className="h-64 flex items-end justify-between gap-4 pt-8 px-2 border-b border-border">
            {monthlyData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-xs font-mono text-fg-subtle opacity-0 group-hover:opacity-100 transition-opacity">
                  {d.value.toLocaleString()}
                </span>
                <div
                  style={{ height: d.height }}
                  className="w-full max-w-[48px] rounded-t-lg bg-gradient-to-t from-ratq-700 to-ratq-500 hover:from-ratq-600 hover:to-ratq-400 transition-all cursor-pointer shadow-sm"
                />
                <span className="text-xs font-semibold text-fg-muted mt-2">
                  {d.label}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Right 1 Col: Geo Breakdown */}
        <Card className="p-6">
          <h2 className="text-base font-bold text-fg mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-ratq-600" />
            <span>{isAr ? 'التوزيع الجغرافي للطلبات' : 'Geographic Reach'}</span>
          </h2>

          <div className="space-y-4">
            {countries.map((c, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-fg">{isAr ? c.name_ar : c.name_en}</span>
                  <span className="font-mono text-fg-muted">{c.pct}% ({c.count})</span>
                </div>
                <div className="w-full h-2 rounded-full bg-canvas-subtle overflow-hidden">
                  <div
                    style={{ width: `${c.pct}%` }}
                    className="h-full bg-ratq-600 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PublisherAnalyticsPage;
