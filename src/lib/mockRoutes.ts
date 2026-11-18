// Routes backed only by mockRepo (no live-main equivalent). Keep in sync with MOCKED.md.
export const MOCK_ROUTES = [
  '/publishers', '/publisher/claim', '/publisher/analytics', '/publisher/webhooks',
  '/review', '/admin', // /moderation is Reports (live), so not listed
  '/categories', '/licenses', '/stacks', '/resources/stacks', '/resources/roadmap', '/resources/wizard',
  '/standards/checklist', '/standards/revocations',
  '/app/saved', '/status', '/changelog', '/roadmap', '/faq', '/ux-study',
];

// Lowercased first: react-router matches paths case-insensitively, so /FAQ serves the same page as /faq.
export const isMockRoute = (path: string) => {
  const p = path.toLowerCase();
  return MOCK_ROUTES.some((r) => p === r || p.startsWith(`${r}/`));
};

// Set only on the beta Pages project (built from the `beta` branch). Build-time, so it never depends on the host.
export const IS_BETA = process.env.NEXT_PUBLIC_BETA === '1';

// Production shows real-data pages only: mock-only pages exist on beta and in local mock mode.
export const isHiddenRoute = (path: string, live = Boolean(process.env.NEXT_PUBLIC_PAYLOAD_API_URL), beta = IS_BETA) =>
  live && !beta && isMockRoute(path);

// Per-page robots. Live mode keeps mock-only pages out of the index; a beta build is never indexed. Pages must return
// this themselves: a page-level `robots` key replaces the layout's value in Next, even when it is undefined.
export const mockRobots = (path: string, live = Boolean(process.env.NEXT_PUBLIC_PAYLOAD_API_URL), beta = IS_BETA) =>
  beta || (live && isMockRoute(path)) ? { index: false, follow: false } : undefined;
