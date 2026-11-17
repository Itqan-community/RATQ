'use client';
import { useEffect, useState } from 'react';
import '@/i18n/config';
import App from '@/App';
import { hydrateResources } from '@/lib/payloadResources';
import { useApiStatus } from '@/store/useApiStatus';
import { isLive } from '@/lib/payloadAuth';
import { hydrateUserData } from '@/lib/hydrateUserData';
import { useAuthStore } from '@/store/useAuthStore';
import { isStaticPath } from '@/lib/staticRoutes';
import { Skeleton } from '@/components/ui/Skeleton';

// The design is a react-router SPA; BrowserRouter handles every path under the catch-all.
// Pages read the repo synchronously, so live data must land before the first render.
export default function ClientApp() {
  const [ready, setReady] = useState(false);
  // Entry on a static page (about, legal, ...) needs no data, so render at once instead of a blank wait.
  const [early] = useState(() => isStaticPath(window.location.pathname));
  useEffect(() => {
    // Requests need the resource list (join) and the session, so they hydrate last.
    Promise.all([hydrateResources(), isLive() ? useAuthStore.getState().hydrateAuth() : undefined])
      .then(([status]) => {
        // Down state is rendered per data route by ApiDownGate; static pages keep working.
        useApiStatus.getState().set(status);
        return useAuthStore.getState().isAuthenticated && isLive() ? hydrateUserData() : undefined;
      })
      .finally(() => setReady(true));
  }, []);
  if (!ready && !early) {
    return (
      <div role="status" aria-busy="true" className="container mx-auto px-4 py-16 space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }
  // ponytail: key remounts App once data lands so a user who left the static entry page mid-hydrate sees real data.
  return <App key={ready ? 'ready' : 'early'} />;
}
