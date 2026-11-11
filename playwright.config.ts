import { defineConfig } from '@playwright/test';

// BASE_URL defaults to beta; set it to https://ratq.itqan.dev for the read-only @prod specs.
const baseURL = process.env.BASE_URL || 'https://beta.ratq.itqan.dev';

export default defineConfig({
  testDir: 'e2e',
  timeout: 30_000,
  expect: { timeout: 15_000 },
  retries: 1,
  workers: 1, // the authenticated specs share one account; parallel logins/logouts invalidate each other's session
  use: {
    baseURL,
    // Local: system Chrome (no download). CI: bundled Chromium (`npx playwright install chromium`).
    channel: process.env.CI ? undefined : 'chrome',
    storageState: {
      cookies: [],
      origins: [
        {
          origin: baseURL,
          localStorage: [
            { name: 'ratq_locale', value: 'en' },
            // Pre-dismiss the first-visit theme popover: its backdrop would block clicks.
            { name: 'ratq_theme_customizer_first_visit_v1', value: 'true' },
          ],
        },
      ],
    },
  },
});
