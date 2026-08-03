'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useDeveloperResources } from '@/hooks/useDeveloperResources';
import { useDeveloperAPIKeys } from '@/hooks/useDeveloperAPIKeys';
import { useDeveloperNotifications } from '@/hooks/useDeveloperNotifications';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { ResourceBadge } from '@/components/ui/Badge';
import type { Resource } from '@/types/resource';

export default function DeveloperOverviewPage() {
  const { user } = useAuth();
  const { data: resources, isLoading: resourcesLoading } = useDeveloperResources();
  const { data: apiKeys, isLoading: keysLoading } = useDeveloperAPIKeys();
  const { data: notifications, isLoading: notifsLoading } = useDeveloperNotifications();

  const publishedCount = resources?.filter((r: Resource) => r.status === 'published').length ?? 0;
  const accessedCount = 3; // Mock: would come from API
  const activeKeyCount = apiKeys?.filter((k) => k.last_used_at !== null).length ?? 0;
  const pendingCount = notifications?.filter((n) => !n.read).length ?? 0;

  return (
    <div>
      {/* Welcome */}
      <div className="mb-8">
        <h2 className="font-heading text-2xl font-bold text-[var(--text-primary)] mb-2">
          مرحباً بعودتك، {user?.display_name}
        </h2>
        <p className="text-[var(--text-secondary)]">إليك ملخص نشاطك على منصة RATQ</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[var(--text-muted)]">الموارد المنشورة</span>
            <svg className="w-5 h-5 text-[var(--accent-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          {resourcesLoading ? (
            <div className="skeleton h-7 w-12 rounded" />
          ) : (
            <p className="text-2xl font-bold text-[var(--text-primary)]">{publishedCount}</p>
          )}
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[var(--text-muted)]">الوصول لدي</span>
            <svg className="w-5 h-5 text-[var(--accent-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          {resourcesLoading ? (
            <div className="skeleton h-7 w-12 rounded" />
          ) : (
            <p className="text-2xl font-bold text-[var(--text-primary)]">{accessedCount}</p>
          )}
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[var(--text-muted)]">مفاتيح API النشطة</span>
            <svg className="w-5 h-5 text-[var(--warning)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          {keysLoading ? (
            <div className="skeleton h-7 w-12 rounded" />
          ) : (
            <p className="text-2xl font-bold text-[var(--text-primary)]">{activeKeyCount}</p>
          )}
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[var(--text-muted)]">إشعارات غير مقروءة</span>
            <svg className="w-5 h-5 text-[var(--danger)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          {notifsLoading ? (
            <div className="skeleton h-7 w-12 rounded" />
          ) : (
            <p className="text-2xl font-bold text-[var(--text-primary)]">{pendingCount}</p>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="mb-8 flex gap-3">
        <Link
          href="/developer/resources"
          className="btn-primary text-sm py-2.5 px-5 inline-block"
        >
          + إضافة مورد جديد
        </Link>
        <Link
          href="/resources"
          className="btn-outline text-sm py-2.5 px-5 inline-block"
        >
          تصفح الموارد
        </Link>
      </div>

      {/* Recent activity */}
      <div>
        <h3 className="font-heading text-lg font-semibold mb-4">النشاط الأخير</h3>
        {notifsLoading ? (
          <div className="space-y-3">
            <div className="card p-4 animate-pulse">
              <div className="skeleton h-4 w-3/4 rounded" />
            </div>
            <div className="card p-4 animate-pulse">
              <div className="skeleton h-4 w-1/2 rounded" />
            </div>
          </div>
        ) : notifications && notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.slice(0, 3).map((notif) => (
              <div
                key={notif.id}
                className={`card p-4 flex items-start gap-3 ${!notif.read ? 'border-r-4 border-r-[var(--accent-primary)]' : ''}`}
              >
                <div className="flex-grow">
                  <p className="text-sm text-[var(--text-secondary)]">{notif.message}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    {new Date(notif.created_at).toLocaleDateString('ar', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                {!notif.read && (
                  <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)] flex-shrink-0 mt-2" />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center">
            <p className="text-[var(--text-muted)]">لا يوجد نشاط حديث</p>
          </div>
        )}
      </div>

      {/* My resources quick view */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-lg font-semibold">مواردي المنشورة</h3>
          <Link href="/developer/resources" className="text-xs text-[var(--accent-primary)] hover:underline">
            عرض الكل
          </Link>
        </div>
        {resourcesLoading ? (
          <div className="space-y-3">
            <div className="card p-4 animate-pulse"><div className="skeleton h-4 w-1/2 rounded" /></div>
            <div className="card p-4 animate-pulse"><div className="skeleton h-4 w-1/2 rounded" /></div>
          </div>
        ) : resources && resources.length > 0 ? (
          <div className="space-y-3">
            {resources.slice(0, 3).map((resource: Resource) => (
              <div
                key={resource.id}
                className="card p-4 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <ResourceBadge type={resource.type} />
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
                  <h4 className="font-heading font-semibold text-sm">{resource.name}</h4>
                </div>
                <Link
                  href={`/developer/resources/${resource.slug}`}
                  className="text-xs text-[var(--accent-primary)] hover:underline"
                >
                  عرض
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center">
            <p className="text-[var(--text-muted)] mb-4">لم تقم بنشر أي موارد بعد</p>
            <Link href="/developer/resources" className="btn-primary text-sm py-2 px-5 inline-block">
              إضافة أول مورد
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
