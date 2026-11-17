import { test, expect } from '@playwright/test';

// WRITES to the shared DB: throwaway account only (E2E_EMAIL / E2E_PASSWORD). Skipped when unset.
// Covers the owner flow: create draft with cover -> edit -> publish -> public page -> unpublish. Always deletes its resource.
const email = process.env.E2E_EMAIL;
const password = process.env.E2E_PASSWORD;
test.skip(!email || !password, 'E2E_EMAIL / E2E_PASSWORD not set');

// 1x1 transparent PNG.
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGNgYGD4DwABBAEAHnOcQAAAAABJRU5ErkJggg==', 'base64');

test('owner: draft with cover, edit, publish, public page, unpublish, delete', async ({ page }) => {
  test.setTimeout(120_000); // a timeout would kill the `finally` cleanup and leak a resource in the shared DB
  const name = `e2e-res-${Date.now()}`;
  page.on('dialog', (d) => void d.accept()); // window.confirm for status change + delete

  await page.goto('/auth/sign-in');
  await page.locator('input[type=email]').fill(email!);
  await page.locator('input[type=password]').fill(password!);
  await page.locator('button[type=submit]').click();
  await expect(page).toHaveURL(/\/app$/);

  const row = page.locator('tr', { hasText: name });
  try {
    // Create: saved as a DRAFT, cover uploaded to /media (alt via _payload).
    await page.goto('/publisher/resources/new');
    await page.getByLabel(/^Name/).fill(name);
    await page.getByLabel(/^Short description/).fill('e2e short description');
    await page.getByLabel(/^License/).fill('MIT');
    await page.locator('#cover').setInputFiles({ name: 'cover.png', mimeType: 'image/png', buffer: PNG });
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page).toHaveURL(/\/publisher\/resources$/);
    await expect(row).toBeVisible();
    await expect(row.getByText('Draft')).toBeVisible();

    // Edit: loads from the raw doc, owner only.
    // NOTE 2026-11-11: saving (and publish/unpublish below) fails against the deployed backend, which rejects EVERY
    // resource update with "Owner is required" (beforeChange `delete data.owner` runs before field validation, #341).
    // This spec fails here until that backend bug is fixed; it is the check that proves the fix.
    await row.getByTitle('Edit').click();
    await expect(page).toHaveURL(/\/publisher\/resources\/\d+\/edit$/);
    await expect(page.getByLabel(/^Name/)).toHaveValue(name);
    await page.getByLabel(/^Short description/).fill('e2e edited description');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page).toHaveURL(/\/publisher\/resources$/);

    // Publish: becomes public at its slug.
    await row.getByRole('button', { name: 'Publish' }).click();
    await expect(row.getByRole('button', { name: 'Unpublish' })).toBeVisible();
    const href = await row.locator('a[href^="/resources/"]').first().getAttribute('href');
    await page.goto(href!);
    await expect(page.getByRole('heading', { name })).toBeVisible();

    // Unpublish: back to draft.
    await page.goto('/publisher/resources');
    await row.getByRole('button', { name: 'Unpublish' }).click();
    await expect(row.getByText('Draft')).toBeVisible();
  } finally {
    await page.goto('/publisher/resources');
    await row.waitFor({ state: 'visible', timeout: 10_000 }).catch(() => {}); // the list loads async: count() right away would be 0
    if (await row.count()) {
      await row.getByTitle('Delete').click();
      await expect(row).toHaveCount(0);
    }
  }
});
