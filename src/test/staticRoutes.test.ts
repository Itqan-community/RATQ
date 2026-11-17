import { describe, it, expect } from 'vitest';
import { isStaticPath } from '@/lib/staticRoutes';

describe('isStaticPath', () => {
  it.each(['/about', '/contact', '/docs', '/contributors', '/faq', '/legal', '/legal/privacy', '/privacy', '/standards', '/standards/checklist', '/about/'])(
    '%s renders without waiting for the API',
    (p) => expect(isStaticPath(p)).toBe(true)
  );
  it.each(['/', '/resources', '/resources/x', '/app', '/publisher/resources', '/aboutx', '/legalese', '/admin'])(
    '%s waits for hydrate',
    (p) => expect(isStaticPath(p)).toBe(false)
  );
});
