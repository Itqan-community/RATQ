// src/pages/PublisherResources.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ItqanBadge } from '@/components/ui/ItqanBadge';
import { AccessBadge } from '@/components/ui/AccessBadge';
import { LicenseBadge } from '@/components/ui/LicenseBadge';
import { DEMO_RESOURCES, DEMO_PUBLISHERS } from '@/lib/mockData';
import { Plus, Search, Eye } from 'lucide-react';

export const PublisherResourcesPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const publisher = DEMO_PUBLISHERS[0];
  const [resources] = useState(
    DEMO_RESOURCES.filter((r) => r.publisher_id === publisher.id)
  );
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = resources.filter((r) => {
    const matchesType = typeFilter === 'all' || r.resource_type === typeFilter;
    const title = (isAr ? r.title_ar : (r.title_en || r.title_ar)) || '';
    const matchesSearch = search.trim() === '' || title.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-fg tracking-tight">
            {isAr ? 'إدارة الموارد البرمجية المنشورة' : 'Manage Published Resources'}
          </h1>
          <p className="text-fg-muted text-sm mt-1">
            {isAr
              ? 'متابعة إصدارات الحزم، تحديث ملفات التعريف، وإطلاق نسخ جديدة للمجتمع.'
              : 'Track package versions, update metadata, and publish patches.'}
          </p>
        </div>
        <Link to="/publisher/resources/new">
          <Button variant="primary" size="sm" className="gap-2 shrink-0">
            <Plus className="w-4 h-4 shrink-0" />
            <span>{isAr ? 'نشر مورد جديد' : 'New Resource'}</span>
          </Button>
        </Link>
      </div>

      {/* Filters Bar */}
      <Card className="p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="w-full sm:w-72 relative">
          <Search className="w-4 h-4 text-fg-muted absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isAr ? 'البحث في الموارد...' : 'Search resources...'}
            className="ps-9 text-sm"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            options={[
              { value: 'all', label: isAr ? 'جميع الأنواع' : 'All Types' },
              { value: 'library', label: isAr ? 'مكتبة برمجية' : 'Library' },
              { value: 'font', label: isAr ? 'خط طباعي' : 'Font' },
              { value: 'dataset', label: isAr ? 'مجموعة بيانات' : 'Dataset' },
              { value: 'api', label: isAr ? 'واجهة API' : 'API' },
            ]}
          />
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-sm">
            <thead className="bg-canvas-subtle border-b border-border text-fg-subtle text-xs">
              <tr>
                <th className="py-3.5 px-4 font-bold text-start">{isAr ? 'المورد' : 'Resource'}</th>
                <th className="py-3.5 px-4 font-bold text-start">{isAr ? 'الإصدار' : 'Version'}</th>
                <th className="py-3.5 px-4 font-bold text-start">{isAr ? 'الشارة' : 'Badge'}</th>
                <th className="py-3.5 px-4 font-bold text-start">{isAr ? 'الترخيص' : 'License'}</th>
                <th className="py-3.5 px-4 font-bold text-start">{isAr ? 'الوصول' : 'Access'}</th>
                <th className="py-3.5 px-4 font-bold text-start">{isAr ? 'التحميلات' : 'Downloads'}</th>
                <th className="py-3.5 px-4 font-bold text-end">{isAr ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-canvas-subtle/40 transition-colors">
                  <td className="py-4 px-4">
                    <div className="font-bold text-fg">
                      {isAr ? r.title_ar : r.title_en}
                    </div>
                    <div className="text-xs text-fg-muted font-mono">{r.slug}</div>
                  </td>
                  <td className="py-4 px-4 font-mono text-xs">
                    v{r.latest_version}
                  </td>
                  <td className="py-4 px-4">
                    <ItqanBadge level={r.itqan_level} />
                  </td>
                  <td className="py-4 px-4">
                    <LicenseBadge licenseId={r.license_id} spdx={r.license_spdx} />
                  </td>
                  <td className="py-4 px-4">
                    <AccessBadge level={r.access_level} />
                  </td>
                  <td className="py-4 px-4 font-mono text-xs">
                    {r.downloads_count.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-end">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link to={`/resources/${r.slug}`} title={isAr ? 'عرض' : 'View'}>
                        <Button variant="ghost" size="sm" className="p-1.5 h-8 w-8">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default PublisherResourcesPage;
