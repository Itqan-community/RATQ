import React from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { SidebarNav, SidebarNavItem } from './SidebarNav';
import { useAuthStore } from '@/store/useAuthStore';
import { portalAccess } from '@/lib/portalAccess';
import { isLive } from '@/lib/payloadAuth';
import { isMockRoute } from '@/lib/mockRoutes';
import {
  LayoutDashboard,
  Key,
  Send,
  Bookmark,
  Bell,
  Settings,
  Package,
  PlusCircle,
  TrendingUp,
  ShieldCheck,
  Webhook,
  Sliders,
  Users,
  ShieldAlert,
  FileCheck,
} from 'lucide-react';

interface PortalLayoutProps {
  children: React.ReactNode;
  portal: 'app' | 'publisher' | 'review' | 'moderation' | 'admin';
}

export const PortalLayout: React.FC<PortalLayoutProps> = ({ children, portal }) => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const role = useAuthStore((s) => s.currentRole);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const configs: Record<
    string,
    { title_ar: string; title_en: string; items: SidebarNavItem[] }
  > = {
    app: {
      title_ar: 'بوابة المطور',
      title_en: 'Developer Console',
      items: [
        {
          href: '/app',
          label: isAr ? 'لوحة التحكم' : 'Overview',
          icon: <LayoutDashboard className="w-4 h-4" />,
        },
        {
          href: '/app/keys',
          label: isAr ? 'مفاتيح API' : 'API Keys',
          icon: <Key className="w-4 h-4" />,
        },
        {
          href: '/app/requests',
          label: isAr ? 'طلبات التصاريح' : 'Permits',
          icon: <Send className="w-4 h-4" />,
          badge: 2,
        },
        {
          href: '/app/saved',
          label: isAr ? 'المحفوظات' : 'Saved',
          icon: <Bookmark className="w-4 h-4" />,
        },
        {
          href: '/app/notifications',
          label: isAr ? 'الإشعارات' : 'Notifications',
          icon: <Bell className="w-4 h-4" />,
          badge: 1,
        },
        {
          href: '/app/settings',
          label: isAr ? 'إعدادات الحساب' : 'Settings',
          icon: <Settings className="w-4 h-4" />,
        },
      ],
    },
    publisher: {
      title_ar: 'لوحة الناشر المعتمد',
      title_en: 'Publisher Hub',
      items: [
        {
          href: '/publisher',
          label: isAr ? 'الرئيسية' : 'Dashboard',
          icon: <LayoutDashboard className="w-4 h-4" />,
        },
        {
          href: '/publisher/resources',
          label: isAr ? 'موارد جهة النشر' : 'Resources',
          icon: <Package className="w-4 h-4" />,
          end: true,
        },
        {
          href: '/publisher/resources/new',
          label: isAr ? 'نشر مورد جديد' : 'New Resource',
          icon: <PlusCircle className="w-4 h-4" />,
        },
        {
          href: '/publisher/requests',
          label: isAr ? 'طلبات الوصول الواردة' : 'Inbound Requests',
          icon: <Send className="w-4 h-4" />,
          badge: 1,
        },
        {
          href: '/publisher/analytics',
          label: isAr ? 'تحليلات الاستهلاك' : 'Analytics',
          icon: <TrendingUp className="w-4 h-4" />,
        },
        {
          href: '/publisher/claim',
          label: isAr ? 'توثيق الهوية' : 'Claim Verification',
          icon: <ShieldCheck className="w-4 h-4" />,
        },
        {
          href: '/publisher/webhooks',
          label: isAr ? 'خطافات الويب' : 'Webhooks',
          icon: <Webhook className="w-4 h-4" />,
        },
      ],
    },
    review: {
      title_ar: 'مجلس التحكيم والإتقان',
      title_en: 'Peer Review Council',
      items: [
        {
          href: '/review',
          label: isAr ? 'طابور التحكيم' : 'Review Queue',
          icon: <FileCheck className="w-4 h-4" />,
          badge: 3,
        },
      ],
    },
    moderation: {
      title_ar: 'الإشراف والامتثال',
      title_en: 'Moderation Console',
      items: [
        {
          href: '/moderation',
          label: isAr ? 'طابور البلاغات' : 'Reports Queue',
          icon: <ShieldAlert className="w-4 h-4" />,
          badge: 1,
        },
      ],
    },
    admin: {
      title_ar: 'الإدارة المركزية',
      title_en: 'Administration',
      items: [
        {
          href: '/admin',
          label: isAr ? 'لوحة القيادة' : 'Dashboard',
          icon: <LayoutDashboard className="w-4 h-4" />,
        },
        {
          href: '/admin/users',
          label: isAr ? 'المستخدمون والأدوار' : 'Users & Roles',
          icon: <Users className="w-4 h-4" />,
        },
        {
          href: '/admin/resources',
          label: isAr ? 'الموارد والشارات' : 'Resources & Badges',
          icon: <Package className="w-4 h-4" />,
        },
        {
          href: '/admin/audit',
          label: isAr ? 'سجل التدقيق (ADR-005)' : 'Audit Ledger',
          icon: <ShieldCheck className="w-4 h-4" />,
        },
        {
          href: '/admin/flags',
          label: isAr ? 'أعلام الميزات' : 'Feature Flags',
          icon: <Sliders className="w-4 h-4" />,
        },
      ],
    },
  };

  const currentConfig = configs[portal] || configs.app;

  const access = portalAccess(portal, role, isAuthenticated);
  if (access === 'sign-in') return <Navigate to="/auth/sign-in" replace />;
  if (access === 'forbidden') return <Navigate to="/403" replace />;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <SidebarNav
          title={isAr ? currentConfig.title_ar : currentConfig.title_en}
          // Badge counts are static demo numbers; in live mode replace them with a Demo tag on mock-only pages.
          items={
            isLive()
              ? currentConfig.items.map((i) => ({
                  ...i,
                  badge: isMockRoute(i.href) ? (isAr ? 'تجريبي' : 'Demo') : undefined,
                }))
              : currentConfig.items
          }
        />
        <main className="flex-1 min-w-0 w-full">{children}</main>
      </div>
    </div>
  );
};

export default PortalLayout;
