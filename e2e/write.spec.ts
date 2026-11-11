import { test, expect } from '@playwright/test';

// WRITES to the shared DB: use a throwaway account only (E2E_EMAIL / E2E_PASSWORD). Skipped when unset.
// A fresh account owns nothing, and the key dialog lists only published resources, so the spec creates and publishes
// its own resource (public for the few seconds the test runs), then deletes key and resource even if an assertion fails.
// Not tagged @prod: never run against prod by default.
const email = process.env.E2E_EMAIL;
const password = process.env.E2E_PASSWORD;
test.skip(!email || !password, 'E2E_EMAIL / E2E_PASSWORD not set');

test('API key: create shows the raw key once, revoke removes it', async ({ page }) => {
  test.setTimeout(120_000); // a timeout would kill the `finally` cleanup and leak data in the shared DB
  const stamp = Date.now();
  const resName = `e2e-keyres-${stamp}`;
  const keyName = `e2e-key-${stamp}`;
  page.on('dialog', (d) => void d.accept()); // window.confirm for publish + delete

  await page.goto('/auth/sign-in');
  await page.locator('input[type=email]').fill(email!);
  await page.locator('input[type=password]').fill(password!);
  await page.locator('button[type=submit]').click();
  await expect(page).toHaveURL(/\/app$/);

  const resRow = page.locator('tr', { hasText: resName });
  const keyRow = page.locator('tr', { hasText: keyName });
  try {
    // Own, published resource (keys are only issued for resources the user owns or has approved access to).
    await page.goto('/publisher/resources/new');
    await page.getByLabel(/^Name/).fill(resName);
    await page.getByLabel(/^Short description/).fill('e2e key test');
    await page.getByLabel(/^License/).fill('MIT');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page).toHaveURL(/\/publisher\/resources$/);
    await resRow.getByRole('button', { name: 'Publish' }).click();
    await expect(resRow.getByRole('button', { name: 'Unpublish' })).toBeVisible();

    await page.goto('/app/keys'); // full load: the catalog is re-hydrated with the published resource
    await page.getByRole('button', { name: 'Generate New Key' }).click();
    await page.getByPlaceholder('e.g. Web App Production').fill(keyName);
    await page.locator('form select').selectOption({ label: resName }); // the dialog's <label> is not bound to the select
    await page.getByRole('button', { name: 'Generate', exact: true }).click();

    // Raw key is shown once in the reveal dialog.
    await expect(page.locator('input[readonly]')).toHaveValue(/.{16,}/);
    await page.getByRole('button', { name: 'لقد قمت بنسخ المفتاح وحفظه' }).click();
    await expect(keyRow).toBeVisible();
    await expect(page.locator('input[readonly]')).toHaveCount(0); // gone after closing, never re-shown

    await keyRow.getByTitle('إلغاء فوري').click();
    await page.getByRole('button', { name: 'نعم، قم بالإلغاء' }).click();
    await expect(keyRow).toHaveCount(0); // revoke = DELETE
  } finally {
    await page.keyboard.press('Escape'); // a failed assertion can leave a modal open
    await page.goto('/app/keys');
    await keyRow.waitFor({ state: 'visible', timeout: 5_000 }).catch(() => {});
    if (await keyRow.count()) {
      await keyRow.getByTitle('إلغاء فوري').click();
      await page.getByRole('button', { name: 'نعم، قم بالإلغاء' }).click();
    }
    await page.goto('/publisher/resources');
    await resRow.waitFor({ state: 'visible', timeout: 10_000 }).catch(() => {});
    if (await resRow.count()) {
      await resRow.getByTitle('Delete').click();
      await expect(resRow).toHaveCount(0);
    }
  }
});
