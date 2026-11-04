'use client';
import '@/i18n/config';
import App from '@/App';

// The design is a react-router SPA; BrowserRouter handles every path under the catch-all.
export default function ClientApp() {
  return <App />;
}
