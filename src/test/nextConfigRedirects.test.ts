import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import { LEGACY_REDIRECTS } from '@/lib/legacyRoutes';

// next.config.mjs resolves its JSON table via import.meta.url (a file: URL only under plain Node), so load it in Node.
describe('next.config redirects', () => {
  it('nextConfigRedirects_LegacyTable_ArePermanentServerRedirects', () => {
    const out = execFileSync(
      process.execPath,
      ['--input-type=module', '-e', "import c from './next.config.mjs'; console.log(JSON.stringify(await c.redirects()))"],
      { cwd: process.cwd(), encoding: 'utf8' },
    );
    const rules = JSON.parse(out) as { source: string; destination: string; permanent: boolean }[];
    expect(rules).toHaveLength(Object.keys(LEGACY_REDIRECTS).length);
    for (const [from, to] of Object.entries(LEGACY_REDIRECTS)) {
      expect(rules).toContainEqual({ source: from, destination: to, permanent: true });
    }
  });
});
