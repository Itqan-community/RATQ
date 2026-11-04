// src/views/AppNotifications.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DEMO_NOTIFICATIONS } from '@/lib/mockData';
import { NotificationItem } from '@/types';
import { Bell, CheckCheck, ShieldCheck, Sparkles, AlertTriangle, ArrowUpRight } from 'lucide-react';

export const AppNotificationsPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const [notifications, setNotifications] = useState<NotificationItem[]>(DEMO_NOTIFICATIONS);
  const [filterUnread, setFilterUnread] = useState(false);

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() }))
    );
  };

  const markItemAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
    );
  };

  const filtered = notifications.filter((n) => !filterUnread || !n.read_at);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-fg tracking-tight">
            {isAr ? 'الإشعارات والتنبيهات' : 'System Notifications'}
          </h1>
          <p className="text-fg-muted text-sm mt-1">
            {isAr
              ? 'متابعة تحديثات الحزم المصرح بها، وقرارات تصاريح الوصول، وإشعارات الحماية.'
              : 'Track package updates, permit reviews, and security notifications.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilterUnread(!filterUnread)}
          >
            {filterUnread
              ? isAr ? 'عرض الكل' : 'Show All'
              : isAr ? 'غير المقروء فقط' : 'Unread Only'}
          </Button>
          <Button variant="ghost" size="sm" onClick={markAllAsRead} className="gap-1.5">
            <CheckCheck className="w-4 h-4" />
            <span>{isAr ? 'تحديد الكل كمقروء' : 'Mark all read'}</span>
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card className="p-12 text-center text-fg-muted">
            <Bell className="w-12 h-12 text-fg-subtle mx-auto mb-3" />
            <h3 className="font-bold text-fg text-base mb-1">
              {isAr ? 'لا توجد إشعارات حالياً' : 'No notifications'}
            </h3>
            <p className="text-sm">
              {isAr ? 'ستظهر هنا جميع التنبيهات المتعلقة بحسابك والموارد المتابعة.' : 'All system notifications and alerts will appear here.'}
            </p>
          </Card>
        ) : (
          filtered.map((item) => {
            const isUnread = !item.read_at;
            return (
              <Card
                key={item.id}
                className={`p-5 transition-all ${
                  isUnread ? 'border-ratq-400 bg-ratq-50/10 dark:bg-ratq-950/10' : 'border-border'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        item.kind === 'request_approved'
                          ? 'bg-emerald-500/10 text-emerald-600'
                          : item.kind === 'version_published'
                          ? 'bg-blue-500/10 text-blue-600'
                          : 'bg-amber-500/10 text-amber-600'
                      }`}
                    >
                      {item.kind === 'request_approved' && <ShieldCheck className="w-5 h-5" />}
                      {item.kind === 'version_published' && <Sparkles className="w-5 h-5" />}
                      {item.kind !== 'request_approved' && item.kind !== 'version_published' && (
                        <AlertTriangle className="w-5 h-5" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-base text-fg">
                          {isAr ? item.title_ar : item.title_ar}
                        </h4>
                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-ratq-500 animate-pulse" />
                        )}
                      </div>
                      <p className="text-sm text-fg-muted leading-relaxed mb-3">
                        {isAr ? item.body_ar : item.body_ar}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-fg-subtle">
                        <time className="font-mono">
                          {new Date(item.created_at).toLocaleString()}
                        </time>
                        {item.link_url && (
                          <Link
                            to={item.link_url}
                            onClick={() => markItemAsRead(item.id)}
                            className="text-ratq-600 hover:underline font-semibold flex items-center gap-1"
                          >
                            <span>{isAr ? 'عرض التفاصيل' : 'View details'}</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>

                  {isUnread && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markItemAsRead(item.id)}
                      className="text-xs text-fg-muted hover:text-fg shrink-0"
                    >
                      {isAr ? 'تمت القراءة' : 'Dismiss'}
                    </Button>
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AppNotificationsPage;
