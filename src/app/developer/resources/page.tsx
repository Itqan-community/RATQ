'use client';

import { useState } from 'react';
import { useDeveloperResources } from '@/hooks/useDeveloperResources';
import { ResourceTable } from '@/components/developer/ResourceTable';
import type { Resource } from '@/types/resource';

const typeFilters: { value: string; label: string }[] = [
  { value: '', label: 'الكل' },
  { value: 'library', label: 'مكتبة' },
  { value: 'sdk', label: 'SDK' },
  { value: 'api', label: 'API' },
  { value: 'dataset', label: 'بيانات' },
  { value: 'tafsir', label: 'تفسير' },
  { value: 'audio', label: 'صوت' },
  { value: 'pdf', label: 'PDF' },
  { value: 'json', label: 'JSON' },
];

export default function DeveloperResourcesPage() {
  const { data: resources, isLoading } = useDeveloperResources();
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="card p-4 animate-pulse">
            <div className="skeleton h-4 w-1/3 rounded mb-2" />
            <div className="skeleton h-3 w-1/2 rounded" />
          </div>
        ))}
      </div>
    );
  }

  const filtered = (resources ?? []).filter((r: Resource) => {
    if (statusFilter && r.status !== statusFilter) return false;
    if (typeFilter && r.type !== typeFilter) return false;
    if (searchQuery && !r.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-xl font-bold text-[var(--text-primary)]">مواردي المنشورة</h2>
        <span className="text-sm text-[var(--text-muted)]">
          {filtered.length} مورد
        </span>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="بحث بالاسم..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-field text-sm py-2 px-3"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-field text-sm py-2 px-3"
        >
          <option value="">الحالة: الكل</option>
          <option value="published">منشور</option>
          <option value="draft">مسودة</option>
          <option value="archived">أرشيف</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="input-field text-sm py-2 px-3"
        >
          {typeFilters.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
      </div>

      <ResourceTable
        resources={filtered}
        emptyLabel="لا توجد موارد مطابقة للفلاتر"
      />
    </div>
  );
}
