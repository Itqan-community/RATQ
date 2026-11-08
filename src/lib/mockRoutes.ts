// Routes backed only by mockRepo (no live-main equivalent). Keep in sync with MOCKED.md.
export const MOCK_ROUTES = [
  '/publishers', '/publisher/claim', '/publisher/analytics', '/publisher/webhooks',
  '/review', '/admin', // /moderation is Reports (live), so not listed
  '/categories', '/licenses', '/resources/stacks', '/resources/roadmap', '/resources/wizard',
  '/standards/checklist', '/standards/revocations',
  '/app/saved', '/status', '/changelog', '/roadmap', '/faq', '/ux-study',
];

export const isMockRoute = (path: string) => MOCK_ROUTES.some((r) => path === r || path.startsWith(`${r}/`));
