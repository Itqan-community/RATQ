import { test, expect } from '@playwright/test';

// WRITES to the shared DB: use a throwaway account only (E2E_EMAIL / E2E_PASSWORD). Skipped when unset.
// Cleans up its own key even if an assertion fails. Not tagged @prod: never run against prod by default.
const email = process.env.E2E_EMAIL;
const password = process.env.E2E_PASSWORD;
test.skip(!email || !password, 'E2E_EMAIL / E2E_PASSWORD not set');

test('API key: create shows the raw key once, revoke removes it', async ({ page }) => {
  const name = `e2e-key-${Date.now()}`;
  await page.goto('/auth/sign-in');
  await page.locator('input[type=email]').fill(email!);
  await page.locator('input[type=password]').fill(password!);
  await page.locator('button[type=submit]').click();
  await expect(page).toHaveURL(/\/app$/);

  await page.goto('/app/keys');
  await page.getByRole('button', { name: 'Generate New Key' }).click();
  await page.getByPlaceholder('e.g. Web App Production').fill(name);
  await page.getByRole('button', { name: 'Generate', exact: true }).click();

  const row = page.locator('tr', { hasText: name });
  try {
    // Raw key is shown once in the reveal dialog.
    await expect(page.locator('input[readonly]')).toHaveValue(/.{16,}/);
    await page.getByRole('button', { name: 'لقد قمت بنسخ المفتاح وحفظه' }).click();
    await expect(row).toBeVisible();
    await expect(page.locator('input[readonly]')).toHaveCount(0); // gone after closing, never re-shown
  } finally {
    await page.keyboard.press('Escape'); // a failed assertion can leave the reveal modal over the row
    if (await row.count()) {
      await row.getByTitle('إلغاء فوري').click();
      await page.getByRole('button', { name: 'نعم، قم بالإلغاء' }).click();
    }
  }
  await expect(row).toHaveCount(0); // revoke = DELETE
});
