'use client';
import { useEffect, useState } from 'react';
import '@/i18n/config';
import App from '@/App';
import { hydrateFromPayload } from '@/lib/payloadResources';
import { isLive } from '@/lib/payloadAuth';
import { hydrateRequests } from '@/lib/payloadRequests';
import { useAuthStore } from '@/store/useAuthStore';

// The design is a react-router SPA; BrowserRouter handles every path under the catch-all.
// Pages read the repo synchronously, so live data must land before the first render.
export default function ClientApp() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    // Requests need the resource list (join) and the session, so they hydrate last.
    Promise.all([hydrateFromPayload(), isLive() ? useAuthStore.getState().hydrateAuth() : undefined])
      .then(() => (useAuthStore.getState().isAuthenticated && isLive() ? hydrateRequests() : undefined))
      .finally(() => setReady(true));
  }, []);
  return ready ? <App /> : null;
}
