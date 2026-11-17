import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { subscribeToSessionExpiry } from '@/lib/sessionExpiry';
import { signInHref } from '@/lib/authFlow';
import { useAuthStore } from '@/store/useAuthStore';

// A confirmed-dead session on any authenticated call: clear auth state, then land on sign-in with the
// "session expired" notice and a way back to the page the visitor was on.
export function SessionExpiryRedirect() {
  const navigate = useNavigate();
  const location = useLocation();
  const here = location.pathname + location.search;

  useEffect(
    () =>
      subscribeToSessionExpiry(() => {
        void useAuthStore
          .getState()
          .handleSessionExpired()
          .then(() => {
            if (useAuthStore.getState().sessionExpired) navigate(signInHref(here), { replace: true });
          });
      }),
    [navigate, here],
  );
  return null;
}
