// src/pages/Forbidden.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ShieldAlert, Home, LogIn } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export const ForbiddenPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const { currentRole, switchRole } = useAuthStore();

  return (
    <div className="container mx-auto px-4 py-20 flex items-center justify-center min-h-[calc(100vh-16rem)]">
      <div className="max-w-md text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-red-500/10 text-red-600 flex items-center justify-center mx-auto shadow-xs">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <div className="text-4xl font-extrabold text-fg tracking-tight">
          {isAr ? 'غير مصرح بالوصول (403)' : 'Access Forbidden (403)'}
        </div>
        <p className="text-fg-muted text-sm leading-relaxed">
          {isAr
            ? `حسابك الحالي (${currentRole}) لا يمتلك الصلاحيات الكافية للوصول إلى هذه اللوحة أو العملية.`
            : `Your current role (${currentRole}) does not have permission to view this resource.`}
        </p>

        {/* Demo Helper Switcher */}
        <Card className="p-4 bg-canvas-subtle border-border text-xs">
          <span className="font-semibold text-fg block mb-2">
            {isAr ? 'في وضع العرض التجريبي: يمكنك تبديل دورك لتجربة اللوحة:' : 'Demo Mode: Switch role to proceed:'}
          </span>
          <div className="flex flex-wrap justify-center gap-2">
            <Button size="sm" variant="outline" onClick={() => switchRole('admin')}>
              {isAr ? 'التبديل إلى مدير (Admin)' : 'Admin'}
            </Button>
            <Button size="sm" variant="outline" onClick={() => switchRole('reviewer')}>
              {isAr ? 'التبديل إلى محكّم (Reviewer)' : 'Reviewer'}
            </Button>
            <Button size="sm" variant="outline" onClick={() => switchRole('publisher_owner')}>
              {isAr ? 'التبديل إلى ناشر (Publisher)' : 'Publisher'}
            </Button>
          </div>
        </Card>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link to="/">
            <Button variant="primary" className="gap-2">
              <Home className="w-4 h-4" />
              <span>{isAr ? 'الصفحة الرئيسية' : 'Home'}</span>
            </Button>
          </Link>
          <Link to="/auth/sign-in">
            <Button variant="outline" className="gap-2">
              <LogIn className="w-4 h-4" />
              <span>{isAr ? 'تسجيل الدخول بحساب آخر' : 'Sign in as another user'}</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForbiddenPage;
