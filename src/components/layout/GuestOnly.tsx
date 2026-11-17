import React from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { isLive } from '@/lib/payloadAuth';
import { safeRedirectPath } from '@/lib/authFlow';
import { useAuthStore } from '@/store/useAuthStore';

// Signed-in visitors are bounced off login/register/forgot/reset (live behaviour). Live mode only: in mock mode the
// demo session starts signed in, and the demo role switcher on the sign-in page must stay reachable.
// Boot awaits hydrateAuth before first render, so there is no signed-in flash.
export const GuestOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const redirect = useSearchParams()[0].get('redirect');
  if (isLive() && isAuthenticated) return <Navigate to={safeRedirectPath(redirect)} replace />;
  return <>{children}</>;
};
