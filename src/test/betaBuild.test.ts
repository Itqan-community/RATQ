import { describe, it, expect, afterEach, vi } from 'vitest';
import { execFileSync } from 'node:child_process';
import { isHiddenRoute } from '@/lib/mockRoutes';

const LIVE = true, MOCK = false, BETA = true, PROD = false;

describe('isHiddenRoute', () => {
  it.each(['/categories', '/resources/roadmap', '/resources/stacks', '/publishers/some-slug', '/publisher/analytics/x', '/admin/users'])(
    'isHiddenRoute_LiveProductionMockPath_True (%s)',
    (p) => expect(isHiddenRoute(p, LIVE, PROD)).toBe(true)
  );

  it.each(['/', '/resources', '/resources/payload-foo', '/moderation', '/publisher/resources', '/categoriesx'])(
    'isHiddenRoute_LiveProductionRealPath_False (%s)',
    (p) => expect(isHiddenRoute(p, LIVE, PROD)).toBe(false)
  );

  it.each(['/categories', '/publishers/some-slug', '/admin'])(
    'isHiddenRoute_BetaBuild_False (%s)',
    (p) => expect(isHiddenRoute(p, LIVE, BETA)).toBe(false)
  );

  it('isHiddenRoute_MockModeBuild_False', () => {
    expect(isHiddenRoute('/categories', MOCK, PROD)).toBe(false);
  });
});

describe('beta build flag', () => {
  afterEach(() => { vi.unstubAllEnvs(); vi.resetModules(); });

  const load = async (beta: string | undefined) => {
    vi.resetModules();
    vi.stubEnv('NEXT_PUBLIC_BETA', beta as string);
    return { routes: await import('@/lib/mockRoutes'), robots: (await import('../../app/robots')).default() };
  };

  it('IS_BETA_FlagIsOne_True', async () => expect((await load('1')).routes.IS_BETA).toBe(true));

  it.each([undefined, '', '0', 'true'])('IS_BETA_FlagIsNotOne_False (%s)', async (v) =>
    expect((await load(v)).routes.IS_BETA).toBe(false));

  it('robots_BetaBuild_DisallowsEverything', async () => {
    const { robots } = await load('1');
    expect(robots.rules).toEqual({ userAgent: '*', disallow: '/' });
    expect(robots.sitemap).toBeUndefined();
  });

  // A page that returns a `robots` key replaces the layout's value (even with undefined), so pages must carry it too.
  const loadMockRobots = async (beta: string | undefined) => {
    vi.resetModules();
    vi.stubEnv('NEXT_PUBLIC_BETA', beta as string);
    vi.stubEnv('NEXT_PUBLIC_PAYLOAD_API_URL', 'https://api.example.test/api');
    return (await import('@/lib/mockRoutes')).mockRobots;
  };

  it.each(['/about', '/contributors', '/categories'])('mockRobots_BetaBuild_NoindexOnEveryPage (%s)', async (p) =>
    expect((await loadMockRobots('1'))(p)).toEqual({ index: false, follow: false }));

  it('mockRobots_ProductionBuildRealPage_LeavesIndexingAlone', async () =>
    expect((await loadMockRobots(undefined))('/about')).toBeUndefined());

  it('mockRobots_ProductionBuildMockPage_Noindex', async () =>
    expect((await loadMockRobots(undefined))('/categories')).toEqual({ index: false, follow: false }));

  it('robots_ProductionBuild_AllowsSiteAndListsSitemap', async () => {
    const { robots } = await load(undefined);
    expect(robots.rules).toMatchObject({ userAgent: '*', allow: '/' });
    expect(robots.sitemap).toMatch(/\/sitemap\.xml$/);
  });
});

// next.config.mjs must load under plain Node (see nextConfigRedirects.test.ts).
describe('next.config beta guard', () => {
  const loadConfig = (env: Record<string, string>) =>
    execFileSync(process.execPath, ['--input-type=module', '-e', "await import('./next.config.mjs'); console.log('ok')"], {
      cwd: process.cwd(), encoding: 'utf8', stdio: 'pipe', env: { PATH: process.env.PATH ?? '', NODE_ENV: 'test', ...env },
    });

  it('nextConfig_BetaFlagOnMainBranch_RefusesBuild', () => {
    expect(() => loadConfig({ NEXT_PUBLIC_BETA: '1', CF_PAGES_BRANCH: 'main' })).toThrow(/NEXT_PUBLIC_BETA/);
  });

  it('nextConfig_BetaFlagOnBetaBranch_Loads', () => {
    expect(loadConfig({ NEXT_PUBLIC_BETA: '1', CF_PAGES_BRANCH: 'beta' })).toContain('ok');
  });

  it('nextConfig_NoBetaFlagOnMainBranch_Loads', () => {
    expect(loadConfig({ CF_PAGES_BRANCH: 'main' })).toContain('ok');
  });
});
