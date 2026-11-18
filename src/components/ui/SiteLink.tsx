// Production shows real-data pages only (isHiddenRoute). These keep links and client-side navigation in step with the
// server, which already answers hidden routes with a 404.
import React from 'react';
import { Link, useLocation, type LinkProps } from 'react-router-dom';
import { isHiddenRoute } from '@/lib/mockRoutes';

// A Link that disappears when its target is hidden. `fallback` keeps the label as plain text instead.
export const SiteLink: React.FC<LinkProps & { fallback?: boolean }> = ({ fallback, ...props }) => {
  const path = typeof props.to === 'string' ? props.to : props.to.pathname ?? '';
  if (!isHiddenRoute(path.split(/[?#]/)[0])) return <Link {...props} />;
  return fallback ? <>{props.children}</> : null;
};

export const HiddenRouteGate: React.FC<{ fallback: React.ReactNode; children: React.ReactNode }> = ({ fallback, children }) =>
  isHiddenRoute(useLocation().pathname) ? <>{fallback}</> : <>{children}</>;
