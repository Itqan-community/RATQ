import { describe, it, expect } from 'vitest';
import { isMockRoute } from '@/lib/mockRoutes';

describe('isMockRoute', () => {
  it.each(['/categories', '/resources/stacks', '/resources/roadmap', '/publishers', '/publishers/ratq', '/licenses', '/status'])(
    'isMockRoute_MockOnlyPath_True (%s)',
    (p) => expect(isMockRoute(p)).toBe(true)
  );

  it.each(['/', '/resources', '/resources/payload-foo', '/standards', '/categoriesx', '/resourcesx'])(
    'isMockRoute_LiveOrLookalikePath_False (%s)',
    (p) => expect(isMockRoute(p)).toBe(false)
  );
});
