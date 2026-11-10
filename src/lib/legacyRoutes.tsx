// Old live-RATQ paths that the new router does not serve natively -> new-design equivalents (see PORTING.md).
// Old bookmarks and already-sent emails keep resolving. Targets must be real routes, never another entry here.
import React from 'react';
import { Navigate, Route, useLocation, useParams } from 'react-router-dom';

export const LEGACY_REDIRECTS: Record<string, string> = {
  '/login': '/auth/sign-in',
  '/register': '/auth/sign-up',
  '/forgot-password': '/auth/forgot',
  '/privacy': '/legal/privacy',
  '/dashboard': '/app',
  '/dashboard/requests': '/app/requests',
  '/dashboard/api-keys': '/app/keys',
  '/dashboard/settings': '/app/settings',
  '/dashboard/resources': '/publisher/resources',
  '/developer': '/publisher',
  '/developer/resources': '/publisher/resources',
  '/developer/resources/:slug': '/resources/:slug',
  '/developer/requests': '/publisher/requests',
  '/developer/access': '/publisher/requests',
  '/developer/comments': '/publisher/resources',
  '/developer/reports': '/moderation',
  '/developer/notifications': '/app/notifications',
  '/developer/settings': '/app/settings',
};

const Redirect: React.FC<{ to: string }> = ({ to }) => {
  const { search, hash } = useLocation();
  const { slug = '' } = useParams();
  return <Navigate replace to={{ pathname: to.replace(':slug', encodeURIComponent(slug)), search, hash }} />;
};

export const legacyRoutes = Object.entries(LEGACY_REDIRECTS).map(([from, to]) => (
  <Route key={from} path={from} element={<Redirect to={to} />} />
));
