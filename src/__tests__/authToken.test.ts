import { describe, it, expect } from 'vitest';
import { AuthToken } from '@/modules/auth/domain/auth-token';

function jwtWithExp(exp: number): string {
  const header = btoa(JSON.stringify({ alg: 'HS256' }));
  const payload = btoa(JSON.stringify({ exp }));
  return `${header}.${payload}.signature`;
}

describe('AuthToken.isExpired', () => {
  it('is true once exp has passed (issue #165)', () => {
    const token = jwtWithExp(Math.floor(Date.now() / 1000) - 60);
    expect(AuthToken.from(token).isExpired()).toBe(true);
  });

  it('is false while exp is still in the future', () => {
    const token = jwtWithExp(Math.floor(Date.now() / 1000) + 3600);
    expect(AuthToken.from(token).isExpired()).toBe(false);
  });

  it('is false right up to the exp boundary, true right after', () => {
    const expSeconds = 1_700_000_000;
    const token = jwtWithExp(expSeconds);
    const authToken = AuthToken.from(token);
    expect(authToken.isExpired(expSeconds * 1000 - 1)).toBe(false);
    expect(authToken.isExpired(expSeconds * 1000)).toBe(true);
  });

  it('treats a non-JWT token as never-expiring rather than throwing', () => {
    expect(AuthToken.from('opaque-token-without-dots').isExpired()).toBe(false);
  });
});
