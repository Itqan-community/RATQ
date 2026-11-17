// Old live-RATQ paths that the new router does not serve natively -> new-design equivalents (see PORTING.md).
// Old bookmarks and already-sent emails keep resolving. Targets must be real routes, never another entry here.
import React from 'react';
import { Navigate, Route, useLocation, useParams } from 'react-router-dom';

import table from './legacyRedirects.json';

// The table lives in JSON so next.config.mjs serves the same entries as real (permanent) server redirects;
// these client routes remain the fallback for SPA-internal navigation.
export const LEGACY_REDIRECTS: Record<string, string> = table;

const Redirect: React.FC<{ to: string }> = ({ to }) => {
  const { search, hash } = useLocation();
  const { slug = '' } = useParams();
  return <Navigate replace to={{ pathname: to.replace(':slug', encodeURIComponent(slug)), search, hash }} />;
};

export const legacyRoutes = Object.entries(LEGACY_REDIRECTS).map(([from, to]) => (
  <Route key={from} path={from} element={<Redirect to={to} />} />
));
