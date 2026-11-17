import { describe, it, expect, vi } from 'vitest';

vi.mock('../../app/seo', () => ({ getResources: async () => [] }));

import sitemap from '../../app/sitemap';
import { MOCK_ROUTES, isMockRoute } from '@/lib/mockRoutes';

describe('sitemap demo-content gate', () => {
  it('sitemap_MockOnlyRoutes_NeverListed', async () => {
    const paths = (await sitemap()).map((e) => new URL(e.url).pathname);
    expect(paths.length).toBeGreaterThan(0);
    for (const p of paths) expect(isMockRoute(p), p).toBe(false);
    for (const r of [...MOCK_ROUTES, '/status', '/changelog', '/standards/revocations']) expect(paths, r).not.toContain(r);
  });
});
