import { describe, it, expect, afterEach, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@/i18n/config';

const API = 'https://api.example.test/api';

// Build flags are read at module load, so each case loads the modules fresh under its own env.
const load = async (env: { live: boolean; beta: boolean }) => {
  vi.resetModules();
  vi.stubEnv('NEXT_PUBLIC_PAYLOAD_API_URL', env.live ? API : '');
  vi.stubEnv('NEXT_PUBLIC_BETA', env.beta ? '1' : '');
  return {
    known: await import('@/lib/knownRoutes'),
    seo: await import('@/lib/seoMeta'),
    ui: await import('@/components/ui/SiteLink'),
  };
};
const PROD = { live: true, beta: false }, BETA = { live: true, beta: true }, MOCK = { live: false, beta: false };

afterEach(() => { cleanup(); vi.unstubAllEnvs(); vi.resetModules(); });

describe('isKnownPath (drives the server 404)', () => {
  it.each(['/categories', '/publishers', '/publishers/some-slug', '/resources/roadmap', '/resources/stacks', '/resources/wizard',
    '/stacks/tech-spec-table', '/licenses', '/status', '/changelog', '/roadmap', '/faq', '/ux-study', '/standards/checklist',
    '/standards/revocations', '/app/saved', '/review', '/review/abc', '/admin', '/admin/users', '/publisher/claim',
    '/publisher/analytics', '/publisher/webhooks'])('isKnownPath_ProductionMockRoute_False (%s)', async (p) =>
    expect((await load(PROD)).known.isKnownPath(p)).toBe(false));

  // react-router matches paths case-insensitively, so a different letter case must not slip past the hiding.
  it.each(['/FAQ', '/Admin/users', '/Publishers/x', '/Resources/Roadmap'])('isKnownPath_ProductionMockRouteOtherCase_False (%s)', async (p) =>
    expect((await load(PROD)).known.isKnownPath(p)).toBe(false));

  it.each(['/', '/resources', '/resources/some-real-slug', '/standards', '/about', '/contributors', '/moderation', '/app',
    '/app/keys', '/publisher', '/publisher/resources', '/auth/sign-in'])('isKnownPath_ProductionRealRoute_True (%s)', async (p) =>
    expect((await load(PROD)).known.isKnownPath(p)).toBe(true));

  it.each(['/categories', '/publishers/some-slug', '/resources/roadmap', '/admin/users'])(
    'isKnownPath_BetaMockRoute_True (%s)', async (p) => expect((await load(BETA)).known.isKnownPath(p)).toBe(true));

  it('isKnownPath_MockModeMockRoute_True', async () => expect((await load(MOCK)).known.isKnownPath('/categories')).toBe(true));

  it('isKnownPath_UnknownPath_FalseEverywhere', async () => {
    for (const env of [PROD, BETA, MOCK]) expect((await load(env)).known.isKnownPath('/no-such-page')).toBe(false);
  });

  it('PUBLIC_PATHS_Sitemap_NeverListsMockRoutes', async () => {
    const { isMockRoute } = await import('@/lib/mockRoutes');
    for (const env of [PROD, BETA]) {
      const { PUBLIC_PATHS } = (await load(env)).known;
      expect(PUBLIC_PATHS.filter(isMockRoute)).toEqual([]);
      expect(PUBLIC_PATHS).toContain('/resources');
    }
  });
});

describe('SiteLink', () => {
  const show = async (env: typeof PROD, to: string) => {
    const { SiteLink } = (await load(env)).ui;
    render(<MemoryRouter><SiteLink to={to}>label</SiteLink></MemoryRouter>);
    return screen.queryByRole('link', { name: 'label' });
  };

  it.each(['/categories', '/publishers/some-slug', '/status'])('SiteLink_ProductionMockRoute_RendersNothing (%s)', async (to) =>
    expect(await show(PROD, to)).toBeNull());

  it('SiteLink_ProductionRealRoute_RendersLink', async () =>
    expect((await show(PROD, '/resources'))?.getAttribute('href')).toBe('/resources'));

  it('SiteLink_BetaMockRoute_RendersLink', async () =>
    expect((await show(BETA, '/categories'))?.getAttribute('href')).toBe('/categories'));

  it('SiteLink_ProductionMockRouteWithFallback_RendersPlainText', async () => {
    const { SiteLink } = (await load(PROD)).ui;
    render(<MemoryRouter><SiteLink to="/publishers/x" fallback>Publisher name</SiteLink></MemoryRouter>);
    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.getByText('Publisher name')).toBeTruthy();
  });
});

describe('HiddenRouteGate (client-side navigation)', () => {
  const at = async (env: typeof PROD, path: string) => {
    const { HiddenRouteGate } = (await load(env)).ui;
    render(<MemoryRouter initialEntries={[path]}><HiddenRouteGate fallback={<p>not found</p>}><p>page</p></HiddenRouteGate></MemoryRouter>);
    return screen.queryByText('page') ? 'page' : 'not found';
  };

  it.each(['/categories', '/publisher/analytics/x'])('HiddenRouteGate_ProductionMockRoute_ShowsNotFound (%s)', async (p) =>
    expect(await at(PROD, p)).toBe('not found'));
  it('HiddenRouteGate_ProductionRealRoute_ShowsPage', async () => expect(await at(PROD, '/moderation')).toBe('page'));
  it('HiddenRouteGate_BetaMockRoute_ShowsPage', async () => expect(await at(BETA, '/categories')).toBe('page'));
});

describe('share image', () => {
  it('ogImages_NoResourceImage_FallsBackToDefault', async () => {
    const { ogImages, DEFAULT_OG_IMAGE } = (await load(PROD)).seo;
    expect(DEFAULT_OG_IMAGE).toBe('/og-default.png');
    expect(ogImages(undefined)).toEqual([{ url: '/og-default.png', width: 1200, height: 630 }]);
  });

  it('ogImages_ResourceImage_Wins', async () => {
    const { ogImages } = (await load(PROD)).seo;
    expect(ogImages('https://cdn.example.test/a.png')).toEqual(['https://cdn.example.test/a.png']);
  });
});
