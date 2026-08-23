import { describe, it, expect } from 'vitest';
import { validatePassword } from '@/shared/utils/utils';

describe('validatePassword', () => {
  it('rejects passwords shorter than 8 characters', () => {
    expect(validatePassword('')).toBe(false);
    expect(validatePassword('short')).toBe(false);
    expect(validatePassword('1234567')).toBe(false);
  });

  it('rejects passwords longer than 64 characters', () => {
    expect(validatePassword('a'.repeat(65))).toBe(false);
  });

  it('accepts passwords between 8 and 64 characters', () => {
    expect(validatePassword('12345678')).toBe(true);
    expect(validatePassword('validpass')).toBe(true);
    expect(validatePassword('a'.repeat(64))).toBe(true);
  });
});
