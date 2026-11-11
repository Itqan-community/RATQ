import { test, expect } from '@playwright/test';

// Read-only specs: safe against beta and prod. Old live-RATQ paths must land on a real page, never the 404.
const OLD_PATHS: Record<string, string> = {
  '/login': '/auth/sign-in',
  '/register': '/auth/sign-up',
  '/forgot-password': '/auth/forgot',
  '/privacy': '/legal/privacy',
  '/dashboard': '/auth/sign-in', // guests are bounced to sign-in
  '/dashboard/api-keys': '/auth/sign-in',
  '/developer': '/auth/sign-in',
  '/developer/notifications': '/auth/sign-in',
};

for (const [from, to] of Object.entries(OLD_PATHS)) {
  test(`@prod legacy ${from} -> ${to}`, async ({ page }) => {
    await page.goto(from);
    await expect(page).toHaveURL(new RegExp(`${to}$`));
  });
}

test('@prod legacy query string survives (reset-password)', async ({ page }) => {
  await page.goto('/reset-password?token=abc');
  await expect(page).toHaveURL(/\/reset-password\?token=abc$/);
});

test('@prod unknown path shows the not-found page', async ({ page }) => {
  await page.goto('/definitely-not-a-page');
  await expect(page).toHaveURL(/definitely-not-a-page$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('home page shows no announcement strip', async ({ page }) => {
  // The CMS still serves the announcement (old prod shows it); the new home page intentionally does not.
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByText('Catalog links now work everywhere')).toHaveCount(0);
  await expect(page.getByText('Browse resources | تصفح الموارد')).toHaveCount(0);
});

test('@prod catalog lists resources from the API', async ({ page }) => {
  await page.goto('/resources');
  // payload- prefix: plain `/resources/` also matches nav links such as /resources/roadmap.
  await expect(page.locator('a[href^="/resources/payload-"]').first()).toBeVisible();
});

test('@prod guest is redirected from the developer portal', async ({ page }) => {
  await page.goto('/app/keys');
  await expect(page).toHaveURL(/\/auth\/sign-in$/);
});

test('@prod wrong password shows an error and stays on sign-in', async ({ page }) => {
  await page.goto('/auth/sign-in');
  await page.locator('input[type=email]').fill('nobody-e2e@example.invalid');
  await page.locator('input[type=password]').fill('wrong-password-123');
  await page.locator('button[type=submit]').click();
  await expect(page).toHaveURL(/\/auth\/sign-in$/);
  await expect(page.getByRole('alert')).toBeVisible();
});

test('@prod /logout sends a guest home', async ({ page }) => {
  await page.goto('/logout');
  await expect(page).toHaveURL(/\/$/);
});
