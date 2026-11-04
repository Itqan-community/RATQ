import { describe, it, expect, afterEach, vi } from 'vitest';
import { portalAccess } from '@/lib/portalAccess';

afterEach(() => vi.unstubAllEnvs());
const live = () => vi.stubEnv('NEXT_PUBLIC_PAYLOAD_API_URL', 'http://payload.test/api');

describe('portalAccess (live mode)', () => {
  it('sends guests to sign-in for every portal', () => {
    live();
    for (const p of ['app', 'publisher', 'review', 'moderation', 'admin'] as const)
      expect(portalAccess(p, 'guest', false)).toBe('sign-in');
  });

  it('lets any signed-in user into the developer console', () => {
    live();
    expect(portalAccess('app', 'developer', true)).toBe('allow');
  });

  it('lets any signed-in user into the publisher portal (live /developer only requires login; ownership is server-side)', () => {
    live();
    expect(portalAccess('publisher', 'developer', true)).toBe('allow');
    expect(portalAccess('publisher', 'publisher_owner', true)).toBe('allow');
  });

  it('keeps non-admins out of admin/review/moderation (403)', () => {
    live();
    for (const role of ['developer', 'publisher_owner'] as const)
      for (const p of ['review', 'moderation', 'admin'] as const)
        expect(portalAccess(p, role, true)).toBe('forbidden');
  });

  it('lets admins into everything', () => {
    live();
    for (const p of ['app', 'publisher', 'review', 'moderation', 'admin'] as const)
      expect(portalAccess(p, 'admin', true)).toBe('allow');
  });

  it('treats an authenticated flag with a guest role as signed out', () => {
    live();
    expect(portalAccess('app', 'guest', true)).toBe('sign-in');
  });
});

describe('portalAccess (mock mode)', () => {
  it('allows everything so the design demo stays explorable', () => {
    vi.stubEnv('NEXT_PUBLIC_PAYLOAD_API_URL', '');
    expect(portalAccess('admin', 'guest', false)).toBe('allow');
  });
});
