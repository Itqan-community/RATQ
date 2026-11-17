import { describe, it, expect } from 'vitest';
import { safeRedirectPath, signInHref, validatePassword, mapAuthError } from '@/lib/authFlow';

describe('safeRedirectPath (same-origin allow-list)', () => {
  it('keeps same-origin paths with query and hash', () => {
    expect(safeRedirectPath('/resources/quran-api')).toBe('/resources/quran-api');
    expect(safeRedirectPath('/resources/x?tab=comments#c1')).toBe('/resources/x?tab=comments#c1');
  });

  it.each([
    null,
    '',
    'resources/x',
    'https://evil.example/x',
    'javascript:alert(1)',
    '//evil.example/x',
    '/\\evil.example/x',
    '/\t/evil.example',
    '/.//evil.example/x',
    '/../..//evil.example',
    '\\\\evil.example',
  ])('falls back to /app for %j', (v) => {
    expect(safeRedirectPath(v)).toBe('/app');
  });

  it('maps live /dashboard bookmarks to /app', () => {
    expect(safeRedirectPath('/dashboard')).toBe('/app');
  });
});

describe('signInHref', () => {
  it('encodes the return path', () => {
    expect(signInHref('/resources/x?a=1')).toBe('/auth/sign-in?redirect=%2Fresources%2Fx%3Fa%3D1');
  });
  it('supports the sign-up target', () => {
    expect(signInHref('/resources/x', 'sign-up')).toBe('/auth/sign-up?redirect=%2Fresources%2Fx');
  });
  it('omits the param when there is nothing to return to', () => {
    expect(signInHref(null)).toBe('/auth/sign-in');
    expect(signInHref('https://evil.example')).toBe('/auth/sign-in');
  });
});

describe('validatePassword (8-64 chars)', () => {
  it('accepts the boundaries and rejects outside them', () => {
    expect(validatePassword('1234567')).toBe(false);
    expect(validatePassword('12345678')).toBe(true);
    expect(validatePassword('a'.repeat(64))).toBe(true);
    expect(validatePassword('a'.repeat(65))).toBe(false);
    expect(validatePassword('')).toBe(false);
  });
});

describe('mapAuthError', () => {
  const tr = { sessionExpired: 'EXP', invalidCredentials: 'BAD', accountLocked: 'LOCK' };
  it('localizes expiry, lockout and bad credentials', () => {
    expect(mapAuthError('session_expired', tr)).toBe('EXP');
    expect(mapAuthError('This user is locked due to having too many failed login attempts.', tr)).toBe('LOCK');
    expect(mapAuthError('The email or password provided is incorrect.', tr)).toBe('BAD');
    expect(mapAuthError('Invalid login', tr)).toBe('BAD');
  });
  it('passes other errors through and tolerates null', () => {
    expect(mapAuthError('Email already in use', tr)).toBe('Email already in use');
    expect(mapAuthError(null, tr)).toBeNull();
  });
});
