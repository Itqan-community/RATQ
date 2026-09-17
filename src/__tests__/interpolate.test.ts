import { describe, it, expect } from 'vitest';
import { interpolate } from '@/shared/utils/utils';

describe('interpolate', () => {
  it('replaces a single placeholder', () => {
    expect(interpolate('Hello {{name}}', { name: 'Sara' })).toBe('Hello Sara');
  });

  it('replaces multiple placeholders', () => {
    expect(
      interpolate('Showing {{count}} of {{total}} resources', { count: 12, total: 47 }),
    ).toBe('Showing 12 of 47 resources');
  });

  it('converts number values to strings', () => {
    expect(interpolate('{{count}} results', { count: 0 })).toBe('0 results');
  });

  it('replaces every occurrence of the same placeholder', () => {
    expect(interpolate('{{x}} and {{x}}', { x: 'a' })).toBe('a and a');
  });

  it('leaves unknown placeholders untouched', () => {
    expect(interpolate('Hi {{name}}', {})).toBe('Hi {{name}}');
  });

  it('returns the template unchanged when it has no placeholders', () => {
    expect(interpolate('No placeholders here', { count: 5 })).toBe('No placeholders here');
  });
});