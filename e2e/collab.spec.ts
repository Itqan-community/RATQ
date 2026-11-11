import { test, expect, request as pwRequest, type Page } from '@playwright/test';

// Two throwaway accounts (A publishes, B consumes): E2E_EMAIL/E2E_PASSWORD and E2E_EMAIL_B/E2E_PASSWORD_B.
// WRITES to the shared DB, but only to its own published test resource (public for the duration of the run),
// which it deletes in `finally`. Skipped when the credentials are not set.
// KNOWN RESIDUE per run: one comment and a few notifications. The live API returns 403 when their author deletes them
// (only an admin can), so an admin has to purge them from Payload admin. Do not run this in a loop against prod data.
const A = { email: process.env.E2E_EMAIL, password: process.env.E2E_PASSWORD };
const B = { email: process.env.E2E_EMAIL_B, password: process.env.E2E_PASSWORD_B };
test.skip(!A.email || !A.password || !B.email || !B.password, 'two e2e accounts not set');

const API = 'https://api.ratq.itqan.dev/api/';
const ORIGIN = 'https://beta.ratq.itqan.dev';

async function signIn(page: Page, who: { email?: string; password?: string }) {
  await page.goto('/auth/sign-in');
  await page.locator('input[type=email]').fill(who.email!);
  await page.locator('input[type=password]').fill(who.password!);
  await page.locator('button[type=submit]').click();
  await expect(page).toHaveURL(/\/app$/);
}

test('request access, approve, notify, key, comment and report across two accounts', async ({ browser }) => {
  test.setTimeout(240_000);
  const stamp = Date.now();
  const name = `e2e-collab-${stamp}`;
  const purpose = `e2e purpose text ${stamp}`;

  // A owns a published resource (created via the API so this spec does not depend on the publish UI).
  const apiA = await pwRequest.newContext({ baseURL: API, extraHTTPHeaders: { Origin: ORIGIN } });
  await apiA.post('users/login', { data: { email: A.email, password: A.password } });
  const created = await (await apiA.post('resources', {
    data: { name, type: 'library', short_description: 'e2e collab', description: 'e2e collab', license: 'MIT', status: 'published' },
  })).json();
  const rid = created.doc.id as number;
  const slug = created.doc.slug as string;

  const ctxA = await browser.newContext({ storageState: undefined });
  const ctxB = await browser.newContext({ storageState: undefined });
  for (const c of [ctxA, ctxB]) {
    await c.addInitScript(() => {
      localStorage.setItem('ratq_locale', 'en');
      localStorage.setItem('ratq_theme_customizer_first_visit_v1', 'true');
    });
  }
  const pageA = await ctxA.newPage();
  const pageB = await ctxB.newPage();
  pageA.on('dialog', (d) => void d.accept());
  pageB.on('dialog', (d) => void d.accept());

  try {
    // B requests access from the resource page.
    await signIn(pageB, B);
    await pageB.goto(`/resources/payload-${slug}`);
    await pageB.getByRole('button', { name: /طلب وصول/ }).click();
    await pageB.getByRole('dialog').getByRole('textbox').first().fill(purpose); // purpose textarea
    await pageB.getByText(/أتعهد بالالتزام/).click(); // the checkbox input is visually hidden (sr-only); click its label
    await pageB.getByRole('button', { name: 'تقديم الطلب' }).click();
    await expect(pageB.getByText('طلب وصول لمورد مقيّد')).toHaveCount(0); // dialog closed = server accepted
    await pageB.goto('/app/requests');
    await expect(pageB.getByText(name)).toBeVisible();
    await expect(pageB.locator('main span', { hasText: /^Under Review$/ }).first()).toBeVisible(); // badge, not the <option>

    // A sees it in the inbox and approves.
    await signIn(pageA, A);
    await pageA.goto('/publisher/requests');
    const row = pageA.locator('tr', { hasText: name });
    await expect(row).toBeVisible();
    await row.getByRole('button', { name: 'Approve Request' }).click();
    await pageA.getByRole('button', { name: 'Confirm Approval' }).click();
    await expect(row.getByText('Approved')).toBeVisible();

    // B is notified, then issues a key for the approved resource.
    await pageB.goto('/app/notifications');
    await expect(pageB.locator('#main-content')).toContainText(/approved|الموافقة|موافق/i); // the approval notification
    await pageB.getByRole('button', { name: 'Mark all read' }).click();
    await pageB.goto('/app/keys');
    await pageB.getByRole('button', { name: 'Generate New Key' }).click();
    await pageB.getByPlaceholder('e.g. Web App Production').fill(`k-${stamp}`);
    await pageB.locator('form select').selectOption({ label: name });
    await pageB.getByRole('button', { name: 'Generate', exact: true }).click();
    await expect(pageB.locator('input[readonly]')).toHaveValue(/.{16,}/);
    await pageB.getByRole('button', { name: 'لقد قمت بنسخ المفتاح وحفظه' }).click();
    const keyRow = pageB.locator('tr', { hasText: `k-${stamp}` });
    await expect(keyRow).toBeVisible();
    await keyRow.getByTitle('إلغاء فوري').click();
    await pageB.getByRole('button', { name: 'نعم، قم بالإلغاء' }).click();
    await expect(keyRow).toHaveCount(0);

    // B comments, sees it, and reports the resource.
    await pageB.goto(`/resources/payload-${slug}`);
    await pageB.getByRole('button', { name: /التقييمات والمراجعات/ }).click();
    const text = `e2e review ${stamp}`;
    await pageB.getByPlaceholder(/شارك تجربتك/).fill(text);
    await pageB.getByRole('button', { name: 'إرسال التقييم' }).click();
    await expect(pageB.getByText(text)).toBeVisible();

    await pageB.locator('[aria-label="الإبلاغ عن مشكلة في هذا المورد"], [title="الإبلاغ عن مشكلة في هذا المورد"]').first().click();
    await pageB.getByPlaceholder(/يرجى وصف المشكلة/).fill(`e2e report ${stamp}`);
    await pageB.getByRole('button', { name: 'إرسال البلاغ' }).click();
    // (role=alert also matches Next's empty route announcer, so verify against the server instead of the page.)
    const apiB = await pwRequest.newContext({ baseURL: API, extraHTTPHeaders: { Origin: ORIGIN } });
    await apiB.post('users/login', { data: { email: B.email, password: B.password } });
    await expect
      .poll(async () => ((await (await apiB.get(`reports?where[resource][equals]=${rid}&depth=0`)).json()).docs ?? []).length)
      .toBe(1);
    const comments = (await (await apiB.get(`comments?where[resource][equals]=${rid}&depth=0`)).json()).docs ?? [];
    expect(comments.map((c: { body?: string; content?: string }) => c.body ?? c.content ?? '').join(' ')).toContain(text);
  } finally {
    // The resource delete also removes what hangs off it; sweep B's leftovers explicitly first.
    const apiB = await pwRequest.newContext({ baseURL: API, extraHTTPHeaders: { Origin: ORIGIN } });
    await apiB.post('users/login', { data: { email: B.email, password: B.password } });
    for (const k of (await (await apiB.get('api-keys?depth=0&limit=100')).json()).docs ?? []) await apiB.delete(`api-keys/${k.id}`);
    for (const r of (await (await apiB.get(`reports?where[resource][equals]=${rid}&depth=0&limit=100`)).json()).docs ?? []) await apiB.delete(`reports/${r.id}`);
    for (const c of (await (await apiB.get(`comments?where[resource][equals]=${rid}&depth=0&limit=100`)).json()).docs ?? []) await apiB.delete(`comments/${c.id}`);
    console.log('cleanup resource', (await apiA.delete(`resources/${rid}`)).status());
    await ctxA.close();
    await ctxB.close();
  }
});
