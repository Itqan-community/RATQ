// src/views/AdminDashboard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DEMO_AUDIT_LOGS } from '@/lib/mockData';
import {
  Users,
  Package,
  Shield,
  Sliders,
  Database,
  Lock,
  Cpu,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="primary" className="bg-ratq-900 text-ratq-200">
              <Lock className="w-3.5 h-3.5 me-1" />
              {isAr ? 'لوحة الإدارة المركزية (Admin Console)' : 'System Admin Console'}
            </Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-fg tracking-tight">
            {isAr ? 'إدارة المنصة والبنية التحتية' : 'Platform & Governance Administration'}
          </h1>
          <p className="text-fg-muted text-sm mt-1">
            {isAr
              ? 'مراقبة العمليات الحية، إدارة حسابات المستخدمين، تفعيل أعلام الميزات، ومتابعة سجل التدقيق.'
              : 'Monitor operations, manage user roles, toggle feature flags, and inspect audit logs.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/admin/flags">
            <Button variant="outline" size="sm" className="gap-2">
              <Sliders className="w-4 h-4" />
              <span>{isAr ? 'أعلام الميزات' : 'Feature Flags'}</span>
            </Button>
          </Link>
          <Link to="/admin/audit">
            <Button variant="primary" size="sm" className="gap-2">
              <Shield className="w-4 h-4" />
              <span>{isAr ? 'سجل التدقيق' : 'Audit Log'}</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-ratq-500/10 text-ratq-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-fg">1,240</div>
            <div className="text-xs text-fg-muted font-medium">{isAr ? 'المستخدمون المسجلون' : 'Registered Users'}</div>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-fg">48</div>
            <div className="text-xs text-fg-muted font-medium">{isAr ? 'الموارد المعتمدة' : 'Active Resources'}</div>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-fg">99.98%</div>
            <div className="text-xs text-fg-muted font-medium">{isAr ? 'جاهزية البنية التحتية' : 'System Uptime'}</div>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-fg">412K</div>
            <div className="text-xs text-fg-muted font-medium">{isAr ? 'استدعاءات هذا الشهر' : 'API Calls This Month'}</div>
          </div>
        </Card>
      </div>

      {/* Shortcuts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 hover:border-ratq-400 transition-all flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-ratq-500/10 text-ratq-600 flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-fg text-lg mb-1">
              {isAr ? 'إدارة المستخدمين والصلاحيات' : 'User Accounts & Roles'}
            </h3>
            <p className="text-xs text-fg-muted leading-relaxed mb-4">
              {isAr
                ? 'تعديل أدوار الحسابات (مطور، ناشر، محكّم، مشرف، مدير)، حظر الحسابات المخالفة.'
                : 'Manage user profiles, assign roles, and handle account restrictions.'}
            </p>
          </div>
          <Link to="/admin/users">
            <Button variant="outline" size="sm" className="w-full">
              {isAr ? 'فتح إدارة المستخدمين' : 'Manage Users'}
            </Button>
          </Link>
        </Card>

        <Card className="p-6 hover:border-ratq-400 transition-all flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-3">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-fg text-lg mb-1">
              {isAr ? 'إدارة الموارد والفهارس' : 'Resource Catalog Oversight'}
            </h3>
            <p className="text-xs text-fg-muted leading-relaxed mb-4">
              {isAr
                ? 'استعراض جميع الموارد وتعديل شارات الإتقان وحجب الموارد المعيبة أو غير المرخصة.'
                : 'Global resource registry management and badge assignments.'}
            </p>
          </div>
          <Link to="/admin/resources">
            <Button variant="outline" size="sm" className="w-full">
              {isAr ? 'فتح إدارة الموارد' : 'Manage Resources'}
            </Button>
          </Link>
        </Card>

        <Card className="p-6 hover:border-ratq-400 transition-all flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-3">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-fg text-lg mb-1">
              {isAr ? 'أعلام الميزات (Feature Flags)' : 'System Feature Flags'}
            </h3>
            <p className="text-xs text-fg-muted leading-relaxed mb-4">
              {isAr
                ? 'تفعيل وتعطيل الميزات البرمجية (البحث المتجهي، التسجيل المفتوح، المنتدى) لحظياً.'
                : 'Toggle runtime features dynamically without deployments.'}
            </p>
          </div>
          <Link to="/admin/flags">
            <Button variant="outline" size="sm" className="w-full">
              {isAr ? 'فتح أعلام الميزات' : 'Manage Flags'}
            </Button>
          </Link>
        </Card>
      </div>

      {/* Recent Audit Log Preview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-fg flex items-center gap-2">
            <Shield className="w-4 h-4 text-ratq-600" />
            <span>{isAr ? 'سجل التدقيق غير القابل للتعديل (ADR-005)' : 'Immutable Audit Log Stream'}</span>
          </h2>
          <Link to="/admin/audit" className="text-xs text-ratq-600 hover:underline font-semibold">
            {isAr ? 'عرض كامل السجل' : 'View Full Log'}
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="bg-canvas-subtle border-b border-border text-fg-subtle">
              <tr>
                <th className="py-2.5 px-3 font-bold text-start">{isAr ? 'المستخدم' : 'Actor'}</th>
                <th className="py-2.5 px-3 font-bold text-start">{isAr ? 'الدور' : 'Role'}</th>
                <th className="py-2.5 px-3 font-bold text-start">{isAr ? 'الإجراء' : 'Action'}</th>
                <th className="py-2.5 px-3 font-bold text-start">{isAr ? 'الهدف' : 'Target'}</th>
                <th className="py-2.5 px-3 font-bold text-start">{isAr ? 'التفاصيل' : 'Details'}</th>
                <th className="py-2.5 px-3 font-bold text-end">{isAr ? 'الوقت' : 'Timestamp'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {DEMO_AUDIT_LOGS.map((log) => (
                <tr key={log.id} className="hover:bg-canvas-subtle/50">
                  <td className="py-2.5 px-3 font-bold text-fg">{log.actor_name}</td>
                  <td className="py-2.5 px-3 font-mono">{log.actor_role}</td>
                  <td className="py-2.5 px-3 font-mono text-ratq-600">{log.action}</td>
                  <td className="py-2.5 px-3">{log.target_name}</td>
                  <td className="py-2.5 px-3 text-fg-muted">{log.reason_ar}</td>
                  <td className="py-2.5 px-3 text-end font-mono text-fg-subtle">
                    {new Date(log.ts).toLocaleString()}
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

export default AdminDashboardPage;
