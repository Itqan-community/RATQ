import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import { LEGACY_REDIRECTS } from '@/lib/legacyRoutes';

// next.config.mjs resolves its JSON table via import.meta.url (a file: URL only under plain Node), so load it in Node.
type Rule = { source: string; destination: string; permanent: boolean; has?: { type: string; value: string }[] };

const loadRules = () =>
  JSON.parse(
    execFileSync(
      process.execPath,
      ['--input-type=module', '-e', "import c from './next.config.mjs'; console.log(JSON.stringify(await c.redirects()))"],
      { cwd: process.cwd(), encoding: 'utf8' },
    ),
  ) as Rule[];

describe('next.config redirects', () => {
  it('nextConfigRedirects_LegacyTable_ArePermanentServerRedirects', () => {
    const rules = loadRules().filter((r) => !r.has);
    expect(rules).toHaveLength(Object.keys(LEGACY_REDIRECTS).length);
    for (const [from, to] of Object.entries(LEGACY_REDIRECTS)) {
      expect(rules).toContainEqual({ source: from, destination: to, permanent: true });
    }
  });

  it('nextConfigRedirects_QuranTechAuthPages_GoToCanonicalHostOnly', () => {
    const hostRules = loadRules().filter((r) => r.has);
    expect(hostRules.map((r) => r.source).sort()).toEqual(
      ['/admin/:path*', '/app/:path*', '/auth/:path*', '/moderation/:path*', '/oauth/:path*', '/publisher/:path*', '/review/:path*'],
    );
    for (const r of hostRules) {
      expect(r.has).toEqual([{ type: 'host', value: 'quran.tech' }]);
      expect(r.destination.startsWith('https://ratq.itqan.dev/')).toBe(true);
      expect(r.permanent).toBe(false);
    }
  });
});
