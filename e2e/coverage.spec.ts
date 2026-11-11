import { test, expect } from '@playwright/test';

// Read-only smoke: every public page loads in English and Arabic without console/page errors or the app's error screen.
const ROUTES = [
  '/', '/resources', '/resources/roadmap', '/resources/wizard', '/resources/stacks', '/categories', '/publishers',
  '/standards', '/standards/checklist', '/standards/revocations', '/licenses', '/about', '/roadmap', '/faq',
  '/ux-study', '/changelog', '/status', '/legal/privacy', '/contact', '/docs', '/contributors',
  '/auth/sign-in', '/auth/sign-up', '/auth/forgot',
];

for (const lang of ['en', 'ar'] as const) {
  for (const route of ROUTES) {
    test(`@prod smoke ${lang} ${route}`, async ({ page }) => {
      const problems: string[] = [];
      page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`));
      page.on('console', (m) => {
        if (m.type() === 'error') problems.push(`console: ${m.text()}`);
      });
      await page.addInitScript((l) => localStorage.setItem('ratq_locale', l), lang);
      await page.goto(route);
      await expect(page.getByRole('heading').first()).toBeVisible();
      await expect(page.locator('html')).toHaveAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
      await expect(page.getByText(/something went wrong|حدث خطأ ما/i)).toHaveCount(0);
      expect(problems, problems.join('\n')).toEqual([]);
    });
  }
}

// NB: `a[href^="/resources/"]` also matches nav links such as /resources/roadmap; real API resources are /resources/payload-<slug>.
const API = 'https://api.ratq.itqan.dev/api';

test('@prod live resource detail shows the real resource', async ({ page, request }) => {
  const problems: string[] = [];
  page.on('pageerror', (e) => problems.push(e.message));
  const res = await request.get(`${API}/resources?limit=1&depth=0&where[status][equals]=published`);
  const doc = (await res.json()).docs[0] as { name: string; slug: string };
  await page.goto(`/resources/payload-${doc.slug}`);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(doc.name);
  expect(problems).toEqual([]);
});

test('@prod catalog shows the real resources and its filter narrows them', async ({ page, request }) => {
  const res = await request.get(`${API}/resources?limit=200&depth=0&where[status][equals]=published`);
  const docs = (await res.json()).docs as { name: string; slug: string }[];
  await page.goto('/resources');
  const cards = page.locator('a[href^="/resources/payload-"]');
  await expect(cards.first()).toBeVisible();
  const total = await cards.count();
  expect(total).toBeGreaterThan(0);
  // Every API resource is reachable from the catalog page (cards may be grouped/collapsed, so check links in the DOM).
  const hrefs = await cards.evaluateAll((els) => els.map((e) => e.getAttribute('href')));
  for (const d of docs) expect(hrefs, `missing ${d.slug}`).toContain(`/resources/payload-${d.slug}`);

  const filter = page.locator('input[type=text]').first();
  await filter.fill('zzzz-no-such-resource-zzzz');
  await expect(cards).toHaveCount(0);
  await filter.fill(docs[0].name);
  await expect(cards.first()).toBeVisible();
});

test('@prod dark mode and language toggles work', async ({ page }) => {
  await page.goto('/');
  const html = page.locator('html');
  const wasDark = await html.evaluate((e) => e.classList.contains('dark'));
  await page.getByRole('button', { name: 'تبديل المظهر' }).click();
  await expect.poll(() => html.evaluate((e) => e.classList.contains('dark'))).toBe(!wasDark);
  await page.getByRole('button', { name: 'تبديل اللغة' }).click();
  await expect(html).toHaveAttribute('dir', 'rtl'); // storageState starts in en
});

test('contact page shows the real channels, not a form that fakes sending', async ({ page }) => {
  await page.goto('/contact');
  await expect(page.locator('a[href="mailto:connect@itqan.dev"]').first()).toBeVisible();
  await expect(page.locator('a[href="https://github.com/Itqan-community/RATQ/issues"]').first()).toBeVisible();
  await expect(page.locator('a[href="https://community.itqan.dev"]').first()).toBeVisible();
  await expect(page.locator('form')).toHaveCount(0);
});

test('@prod theme customizer changes the palette', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-palette', 'gold');
  await page.getByTitle('Customize theme and font').click();
  await page.getByRole('button', { name: /Midnight Navy/ }).click();
  await expect(page.locator('html')).toHaveAttribute('data-palette', 'navy');
});
