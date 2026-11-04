// src/pages/NotFound.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { Home, Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  return (
    <div className="container mx-auto px-4 py-20 flex items-center justify-center min-h-[calc(100vh-16rem)]">
      <div className="max-w-md text-center space-y-6">
        <div className="text-8xl font-black font-mono text-ratq-500/20 tracking-widest select-none">
          404
        </div>
        <h1 className="text-3xl font-extrabold text-fg tracking-tight">
          {isAr ? 'الصفحة غير موجودة' : 'Page Not Found'}
        </h1>
        <p className="text-fg-muted text-sm leading-relaxed">
          {isAr
            ? 'عذراً، الرابط الذي تحاول الوصول إليه غير موجود أو تم نقله إلى مسار آخر.'
            : 'The resource or page you requested could not be located.'}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link to="/">
            <Button variant="primary" className="gap-2">
              <Home className="w-4 h-4" />
              <span>{isAr ? 'الرئيسية' : 'Home'}</span>
            </Button>
          </Link>
          <Link to="/resources">
            <Button variant="outline" className="gap-2">
              <Compass className="w-4 h-4" />
              <span>{isAr ? 'فهرس الموارد' : 'Catalog'}</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
