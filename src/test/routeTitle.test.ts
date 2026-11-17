import { describe, it, expect } from 'vitest';
import { routeTitle } from '@/lib/routeTitle';

describe('routeTitle', () => {
  it('uses the longest matching prefix', () => {
    expect(routeTitle('/resources/roadmap', 'en')).toBe('Dev Roadmap | RATQ Community Platform');
    expect(routeTitle('/resources/payload-tanzil', 'en')).toBe('Resource | RATQ Community Platform');
    expect(routeTitle('/resources', 'ar')).toBe('مكتبة الموارد | منصة مجتمع RATQ');
  });
  it('returns the site default for home and unknown paths', () => {
    expect(routeTitle('/', 'en')).toBe('RATQ Community Platform');
    expect(routeTitle('/nope', 'ar')).toBe('منصة مجتمع RATQ');
  });
  it('does not match on a partial segment', () => {
    expect(routeTitle('/aboutx', 'en')).toBe('RATQ Community Platform');
  });
});
