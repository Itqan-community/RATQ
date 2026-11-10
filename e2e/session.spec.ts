import { test, expect } from '@playwright/test';

// Needs a throwaway account: E2E_EMAIL / E2E_PASSWORD. Skipped when unset. Writes nothing to the shared DB.
const email = process.env.E2E_EMAIL;
const password = process.env.E2E_PASSWORD;
test.skip(!email || !password, 'E2E_EMAIL / E2E_PASSWORD not set');

test('sign in reaches the portal, reload keeps the session, /logout ends it', async ({ page }) => {
  await page.goto('/auth/sign-in');
  await page.locator('input[type=email]').fill(email!);
  await page.locator('input[type=password]').fill(password!);
  await page.locator('button[type=submit]').click();
  await expect(page).toHaveURL(/\/app$/);

  await page.reload();
  await expect(page).toHaveURL(/\/app$/); // httpOnly cookie session survives a reload

  await page.goto('/dashboard/api-keys'); // legacy path, signed in
  await expect(page).toHaveURL(/\/app\/keys$/);

  await page.goto('/logout');
  await expect(page).toHaveURL(/\/$/);
  await page.goto('/app');
  await expect(page).toHaveURL(/\/auth\/sign-in$/);
});
