import { describe, it, expect, vi } from 'vitest';
import { dynamic, runtime } from '@/app/resources/page';

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/resources',
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

describe('catalog page rendering mode', () => {
  // A prerendered /resources makes Next reuse the first URL's search string for
  // later router.push calls, so filters, sort, search and paging do nothing
  // after a deep link load.
  it('is rendered on demand so router.push keeps the new query string', () => {
    expect(dynamic).toBe('force-dynamic');
  });

  it('opts into the edge runtime that the Cloudflare build requires', () => {
    expect(runtime).toBe('edge');
  });
});
