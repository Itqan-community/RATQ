// src/views/AdminResources.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { ItqanBadge } from '@/components/ui/ItqanBadge';
import { LicenseBadge } from '@/components/ui/LicenseBadge';
import { AccessBadge } from '@/components/ui/AccessBadge';
import { DEMO_RESOURCES } from '@/lib/mockData';
import { Resource, ItqanBadgeLevel } from '@/types';
import { Search, Eye, Award, Ban } from 'lucide-react';

export const AdminResourcesPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const [resources, setResources] = useState<Resource[]>(DEMO_RESOURCES);
  const [search, setSearch] = useState('');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [newBadgeLevel, setNewBadgeLevel] = useState<ItqanBadgeLevel>('basic');

  const filtered = resources.filter((r) => {
    const title = ((isAr ? r.title_ar : r.title_en) || '').toLowerCase();
    const slug = r.slug.toLowerCase();
    return title.includes(search.toLowerCase()) || slug.includes(search.toLowerCase());
  });

  const handleUpdateBadge = () => {
    if (!selectedResource) return;
    setResources((prev) =>
      prev.map((r) => (r.id === selectedResource.id ? { ...r, itqan_level: newBadgeLevel } : r))
    );
    setSelectedResource(null);
  };

  const handleToggleSuspend = (id: string) => {
    setResources((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: r.status === 'published' ? 'suspended' : 'published' }
          : r
      )
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-fg tracking-tight">
          {isAr ? 'إدارة الموارد والفهرس العام' : 'Global Resource Management'}
        </h1>
        <p className="text-fg-muted text-sm mt-1">
          {isAr
            ? 'الإشراف على كافة الحزم والمكتبات والخطوط والمصادر القرآنية وتعيين الشارات المركزية.'
            : 'Supervise all published assets, adjust Itqan badges, and manage suspensions.'}
        </p>
      </div>

      {/* Search Bar */}
      <Card className="p-4">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-fg-muted absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isAr ? 'البحث بالاسم أو المعرف...' : 'Search resources...'}
            className="ps-9"
          />
        </div>
      </Card>

      {/* Resources Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-sm">
            <thead className="bg-canvas-subtle border-b border-border text-fg-subtle text-xs">
              <tr>
                <th className="py-3.5 px-4 font-bold text-start">{isAr ? 'المورد' : 'Resource'}</th>
                <th className="py-3.5 px-4 font-bold text-start">{isAr ? 'الناشر' : 'Publisher'}</th>
                <th className="py-3.5 px-4 font-bold text-start">{isAr ? 'الشارة' : 'Badge'}</th>
                <th className="py-3.5 px-4 font-bold text-start">{isAr ? 'الترخيص' : 'License'}</th>
                <th className="py-3.5 px-4 font-bold text-start">{isAr ? 'الوصول' : 'Access'}</th>
                <th className="py-3.5 px-4 font-bold text-start">{isAr ? 'الحالة' : 'Status'}</th>
                <th className="py-3.5 px-4 font-bold text-end">{isAr ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-canvas-subtle/50">
                  <td className="py-4 px-4">
                    <div className="font-bold text-fg">
                      {isAr ? r.title_ar : r.title_en}
                    </div>
                    <div className="text-xs text-fg-muted font-mono">{r.slug}</div>
                  </td>
                  <td className="py-4 px-4 text-xs font-semibold text-fg">
                    {r.publisher?.name_ar || 'ناشر'}
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
                  <td className="py-4 px-4">
                    <Badge variant={r.status === 'published' ? 'success' : 'danger'}>
                      {r.status === 'published' ? (isAr ? 'منشور' : 'Published') : (isAr ? 'معلق' : 'Suspended')}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 text-end">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedResource(r);
                          setNewBadgeLevel(r.itqan_level);
                        }}
                        className="text-xs gap-1"
                        title={isAr ? 'تعديل الشارة' : 'Set Badge'}
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>{isAr ? 'الشارة' : 'Badge'}</span>
                      </Button>
                      <Link to={`/resources/${r.slug}`} target="_blank">
                        <Button variant="ghost" size="sm" className="p-1.5 h-8 w-8">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleToggleSuspend(r.id)}
                        className={`text-xs p-1.5 h-8 w-8 ${
                          r.status === 'published' ? 'text-red-600' : 'text-emerald-600'
                        }`}
                        title={r.status === 'published' ? 'تعليق المورد' : 'إلغاء التعليق'}
                      >
                        <Ban className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Set Badge Modal */}
      <Modal
        isOpen={Boolean(selectedResource)}
        onClose={() => setSelectedResource(null)}
        title={isAr ? `تعيين شارة الإتقان: ${selectedResource?.title_ar}` : 'Assign Itqan Badge'}
      >
        <div className="space-y-4">
          <p className="text-xs text-fg-muted">
            {isAr
              ? 'اختر مستوى الشارة بناءً على نتائج التدقيق الفني واستيفاء معايير مجلس الإتقان.'
              : 'Set the official Itqan tier for this resource.'}
          </p>

          <div>
            <label className="block text-xs font-semibold text-fg mb-1.5">
              {isAr ? 'مستوى شارة الإتقان' : 'Itqan Tier'}
            </label>
            <Select
              value={newBadgeLevel}
              onChange={(e) => setNewBadgeLevel(e.target.value as ItqanBadgeLevel)}
              options={[
                { value: 'none', label: isAr ? 'بدون شارة' : 'None' },
                { value: 'basic', label: isAr ? 'إتقان أساسي (مستوى 1)' : 'Basic (Tier 1)' },
                { value: 'verified', label: isAr ? 'موثّق تقنياً (مستوى 2)' : 'Verified (Tier 2)' },
                { value: 'certified', label: isAr ? 'معتمد (مستوى 3)' : 'Certified (Tier 3)' },
                { value: 'gold', label: isAr ? 'إتقان ذهبي (مستوى 4)' : 'Gold (Tier 4)' },
              ]}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setSelectedResource(null)}>
              {isAr ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button variant="primary" onClick={handleUpdateBadge}>
              {isAr ? 'تحديث الشارة' : 'Update Badge'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminResourcesPage;
