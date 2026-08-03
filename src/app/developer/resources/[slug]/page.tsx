'use client';

import { useState } from 'react';

export const runtime = 'edge';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useDeveloperResources } from '@/hooks/useDeveloperResources';
import { ResourceBadge } from '@/components/ui/Badge';
import type { Resource } from '@/types/resource';

const tabs = [
  { id: 'overview', label: 'نظرة عامة' },
  { id: 'access', label: 'إدارة الوصول' },
  { id: 'reports', label: 'التقارير الواردة' },
  { id: 'analytics', label: 'التحليلات' },
];

export default function ResourceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: resources, isLoading } = useDeveloperResources();
  const resource = resources?.find((r: Resource) => r.slug === slug) as Resource | undefined;
  const [activeTab, setActiveTab] = useState('overview');

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

  if (!resource) {
    return (
      <div className="card p-8 text-center">
        <p className="text-[var(--text-muted)]">لم يتم العثور على المورد</p>
        <Link href="/developer/resources" className="text-sm text-[var(--accent-primary)] hover:underline mt-2 inline-block">
          العودة للموارد
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Resource header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <ResourceBadge type={resource.type} />
          {resource.itqan_badge && (
            <span className="badge bg-[var(--accent-gold-light)] text-[var(--accent-gold)] text-xs">
              ★ Itqan
            </span>
          )}
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            resource.status === 'published'
              ? 'bg-green-100 text-green-700'
              : resource.status === 'draft'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-gray-100 text-gray-700'
          }`}>
            {resource.status === 'published' ? 'منشور' : resource.status === 'draft' ? 'مسودة' : 'أرشيف'}
          </span>
        </div>
        <h2 className="font-heading text-xl font-bold text-[var(--text-primary)]">{resource.name}</h2>
        <p className="text-sm text-[var(--text-secondary)] mt-1">{resource.description}</p>
        <div className="flex items-center gap-4 mt-2 text-xs text-[var(--text-muted)]">
          {resource.version && <span>الإصدار: {resource.version}</span>}
          <span>{resource.total_downloads} تحميل</span>
          <span>{resource.license}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[var(--border-color)] mb-6">
        <nav className="flex gap-1 -mb-px" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-heading transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-[var(--accent-primary)] text-[var(--accent-primary)] font-semibold'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && (
        <div role="tabpanel" className="card p-6">
          <h3 className="font-heading font-semibold mb-3">معلومات المورد</h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-[var(--text-muted)] mb-1">الرابط</dt>
              <dd className="text-[var(--text-secondary)]">{resource.slug}</dd>
            </div>
            <div>
              <dt className="text-[var(--text-muted)] mb-1">الرخصة</dt>
              <dd className="text-[var(--text-secondary)]">{resource.license}</dd>
            </div>
            {resource.documentation_url && (
              <div>
                <dt className="text-[var(--text-muted)] mb-1">التوثيق</dt>
                <dd><Link href={resource.documentation_url} className="text-[var(--accent-primary)] hover:underline">{resource.documentation_url}</Link></dd>
              </div>
            )}
            {resource.github_url && (
              <div>
                <dt className="text-[var(--text-muted)] mb-1">GitHub</dt>
                <dd><Link href={resource.github_url} className="text-[var(--accent-primary)] hover:underline">{resource.github_url}</Link></dd>
              </div>
            )}
          </dl>
        </div>
      )}

      {activeTab === 'access' && resource.type === 'api' && (
        <div role="tabpanel" className="card p-6">
          <h3 className="font-heading font-semibold mb-4">إدارة الوصول</h3>
          <p className="text-sm text-[var(--text-muted)] mb-4">
            هذه الميزة تتيح دعوة مطورين بالبريد الإلكتروني أو الموافقة على طلبات الوصول.
          </p>
          {/* Invite form placeholder - TODO: connect to backend API */}
          <div className="flex gap-3 mb-4">
            <input
              type="email"
              placeholder="email@example.com"
              disabled
              className="input-field text-sm py-2 px-3 flex-grow"
            />
            <select disabled className="input-field text-sm py-2 px-3">
              <option value="read">قراءة فقط</option>
              <option value="read,write">قراءة وكتابة</option>
            </select>
            <button type="button" disabled className="btn-primary text-sm py-2 px-4">دعوة</button>
          </div>
          {/* Access requests list placeholder */}
          <div className="card p-4 bg-[var(--bg-secondary)]">
            <p className="text-sm text-[var(--text-muted)]">لا توجد طلبات وصول معلقة</p>
          </div>
        </div>
      )}

      {activeTab === 'access' && resource.type !== 'api' && (
        <div role="tabpanel" className="card p-6">
          <p className="text-sm text-[var(--text-muted)]">إدارة الوصول متاحة فقط للموارد من نوع API</p>
        </div>
      )}

      {activeTab === 'reports' && (
        <div role="tabpanel" className="card p-6">
          <h3 className="font-heading font-semibold mb-3">التقارير الواردة</h3>
          <p className="text-sm text-[var(--text-muted)]">لا توجد تقارير على هذا المورد</p>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div role="tabpanel" className="card p-6">
          <h3 className="font-heading font-semibold mb-3">التحليلات</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-[var(--text-primary)]">{resource.total_downloads}</p>
              <p className="text-xs text-[var(--text-muted)]">إجمالي التحميلات</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[var(--text-primary)]">{resource.downloads}</p>
              <p className="text-xs text-[var(--text-muted)]">تحميلات الشهر</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[var(--text-primary)]">0</p>
              <p className="text-xs text-[var(--text-muted)]">مفاتيح API نشطة</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[var(--text-primary)]">0</p>
              <p className="text-xs text-[var(--text-muted)]">المطورين النشطين</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
