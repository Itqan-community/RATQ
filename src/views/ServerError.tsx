// src/views/ServerError.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { RotateCw, Home, AlertOctagon, ChevronDown } from 'lucide-react';

export const ServerErrorPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="container mx-auto px-4 py-20 flex items-center justify-center min-h-[calc(100vh-16rem)]">
      <div className="max-w-md text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
          <AlertOctagon className="w-10 h-10" />
        </div>
        <div className="text-4xl font-extrabold text-fg tracking-tight">
          {isAr ? 'حدث خطأ غير متوقع (500)' : 'Internal Server Error (500)'}
        </div>
        <p className="text-fg-muted text-sm leading-relaxed">
          {isAr
            ? 'نعتذر، واجه الخادم مشكلة غير متوقعة أثناء معالجة طلبك. تم تسجيل الخطأ في نظام المتابعة.'
            : 'An unexpected server error occurred. Our engineering team has been notified.'}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button variant="primary" onClick={() => window.location.reload()} className="gap-2 shrink-0">
            <RotateCw className="w-4 h-4 shrink-0" />
            <span>{isAr ? 'إعادة المحاولة' : 'Try Again'}</span>
          </Button>
          <Link to="/">
            <Button variant="outline" className="gap-2 shrink-0">
              <Home className="w-4 h-4 shrink-0" />
              <span>{isAr ? 'الرئيسية' : 'Home'}</span>
            </Button>
          </Link>
        </div>

        <div className="pt-4">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-fg-subtle hover:text-fg inline-flex items-center gap-1"
          >
            <span>{isAr ? 'التفاصيل التقنية' : 'Diagnostic Details'}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showDetails ? 'rotate-180' : ''}`} />
          </button>
          {showDetails && (
            <pre className="mt-3 p-3 rounded-lg bg-canvas-subtle border border-border text-[11px] font-mono text-left text-fg-subtle overflow-x-auto" dir="ltr">
              {`Error: Platform Internal Error at Handler
Trace-ID: req_err_${Date.now()}
Environment: Netlify Edge / Node 20`}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServerErrorPage;
