// src/components/layout/ErrorBoundary.tsx
// A render exception in one page must not unmount the whole app (header/footer/nav stay). Reset on navigation.
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

class Boundary extends React.Component<{ children: React.ReactNode; fallback: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.error('Page render failed:', error);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export const PageErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();
  const { t } = useTranslation('errors');
  const fallback = (
    <div role="alert" className="container mx-auto px-4 py-20 text-center space-y-3">
      <h1 className="text-xl font-bold text-fg">{t('ERR_BOUNDARY_TITLE')}</h1>
      <p className="text-sm text-fg-muted">{t('ERR_BOUNDARY_BODY')}</p>
      <div className="flex justify-center gap-4 text-sm font-semibold">
        <button className="underline" onClick={() => window.location.reload()}>{t('API_RETRY')}</button>
        <a className="underline" href="/">/</a>
      </div>
    </div>
  );
  // key = pathname remounts the boundary on navigation, clearing a previous failure.
  return <Boundary key={pathname} fallback={fallback}>{children}</Boundary>;
};
