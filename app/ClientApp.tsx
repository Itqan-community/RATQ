'use client';
import { useEffect, useState } from 'react';
import '@/i18n/config';
import App from '@/App';
import { hydrateFromPayload } from '@/lib/payloadResources';

// The design is a react-router SPA; BrowserRouter handles every path under the catch-all.
// Pages read the repo synchronously, so live data must land before the first render.
export default function ClientApp() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    hydrateFromPayload().finally(() => setReady(true));
  }, []);
  return ready ? <App /> : null;
}
