'use client';

import { useState } from 'react';
import { useDeveloperNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '@/hooks/useDeveloperNotifications';

const notificationIcons: Record<string, string> = {
  access_approved: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  access_denied: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
  comment_reply: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z',
  report_resolved: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  report_status_change: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  resource_activity: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
  access_revoked: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z',
};

const notificationColors: Record<string, string> = {
  access_approved: 'text-green-600',
  access_denied: 'text-red-600',
  comment_reply: 'text-blue-600',
  report_resolved: 'text-green-600',
  report_status_change: 'text-amber-600',
  resource_activity: 'text-purple-600',
  access_revoked: 'text-red-600',
};

export default function DeveloperNotificationsPage() {
  const { data: notifications, isLoading } = useDeveloperNotifications();
  const { markRead } = useMarkNotificationRead();
  const { markAllRead } = useMarkAllNotificationsRead();
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="card p-4 animate-pulse">
            <div className="skeleton h-4 w-3/4 rounded" />
            <div className="skeleton h-3 w-1/2 rounded mt-2" />
          </div>
        ))}
      </div>
    );
  }

  const filtered = activeTab === 'unread'
    ? (notifications ?? []).filter((n) => !n.read)
    : (notifications ?? []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-xl font-bold text-[var(--text-primary)]">الإشعارات</h2>
        <button
          type="button"
          onClick={() => markAllRead()}
          className="text-xs text-[var(--accent-primary)] hover:underline"
        >
          تحديد الكل كمقروء
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-[var(--border-color)] mb-6">
        <nav className="flex gap-1 -mb-px">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2.5 text-sm font-heading transition-colors border-b-2 ${
              activeTab === 'all'
                ? 'border-[var(--accent-primary)] text-[var(--accent-primary)] font-semibold'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            الكل
          </button>
          <button
            onClick={() => setActiveTab('unread')}
            className={`px-4 py-2.5 text-sm font-heading transition-colors border-b-2 ${
              activeTab === 'unread'
                ? 'border-[var(--accent-primary)] text-[var(--accent-primary)] font-semibold'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            غير مقروء
          </button>
        </nav>
      </div>

      {/* Notifications list */}
      {filtered.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-[var(--text-muted)]">لا توجد إشعارات</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((notif) => (
            <div
              key={notif.id}
              className={`card p-4 flex items-start gap-3 cursor-pointer transition-colors ${
                !notif.read ? 'border-r-4 border-r-[var(--accent-primary)]' : ''
              }`}
              onClick={async () => {
                if (!notif.read) {
                  await markRead(notif.id);
                }
              }}
            >
              <svg
                className={`w-5 h-5 flex-shrink-0 mt-0.5 ${notificationColors[notif.type] || 'text-[var(--text-muted)]'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={notificationIcons[notif.type] || notificationIcons.resource_activity} />
              </svg>
              <div className="flex-grow">
                <p className="text-sm text-[var(--text-secondary)]">{notif.message}</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  {new Date(notif.created_at).toLocaleDateString('ar', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              {!notif.read && (
                <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)] flex-shrink-0 mt-2" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
