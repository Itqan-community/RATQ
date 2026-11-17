// src/components/layout/ApiDownGate.tsx
// Pages that read the resource catalog show a retry state when no live source answered, and a slim notice when
// only some did. Static pages (about, docs, legal, contributors, auth...) are never gated: an API outage must not
// blank the whole site.
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useApiStatus } from '@/store/useApiStatus';

const DATA_PREFIXES = ['/resources', '/categories', '/publishers'];
export const isDataRoute = (pathname: string): boolean =>
  pathname === '/' || DATA_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

export const ApiDownGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();
  const { t } = useTranslation('errors');
  const { down, failed, retrying, retry } = useApiStatus();
  if (!isDataRoute(pathname)) return <>{children}</>;

  if (down) {
    return (
      <div role="alert" className="container mx-auto px-4 py-20 flex items-center justify-center">
        <div className="max-w-md text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-fg">{t('API_DOWN_TITLE')}</h1>
          <p className="text-sm text-fg-muted leading-relaxed">{t('API_DOWN_BODY')}</p>
          <Button variant="primary" onClick={() => void retry()} disabled={retrying} className="gap-2">
            <RotateCw className={`w-4 h-4 shrink-0 ${retrying ? 'animate-spin' : ''}`} />
            <span>{retrying ? t('API_RETRYING') : t('API_RETRY')}</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {failed.length > 0 && (
        <div role="status" className="bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs px-4 py-2 text-center">
          {t('API_DEGRADED')}{' '}
          <button className="underline font-semibold" onClick={() => void retry()} disabled={retrying}>
            {retrying ? t('API_RETRYING') : t('API_RETRY')}
          </button>
        </div>
      )}
      {children}
    </>
  );
};
