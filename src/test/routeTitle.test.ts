import { describe, it, expect } from 'vitest';
import { routeTitle } from '@/lib/routeTitle';

describe('routeTitle', () => {
  it('uses the longest matching prefix', () => {
    expect(routeTitle('/resources/roadmap', 'en')).toBe('Dev Roadmap | Quran Tech Directory');
    expect(routeTitle('/resources/payload-tanzil', 'en')).toBe('Resource | Quran Tech Directory');
    expect(routeTitle('/resources', 'ar')).toBe('مكتبة الموارد | دليل التقنيات القرآنية');
  });
  it('returns the site default for home and unknown paths', () => {
    expect(routeTitle('/', 'en')).toBe('Quran Tech Directory');
    expect(routeTitle('/nope', 'ar')).toBe('دليل التقنيات القرآنية');
  });
  it('does not match on a partial segment', () => {
    expect(routeTitle('/aboutx', 'en')).toBe('Quran Tech Directory');
  });
});
