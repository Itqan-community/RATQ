import { describe, expect, it } from 'vitest';
import { versionLabel } from '@/lib/format';

describe('versionLabel', () => {
  it.each([
    ['1.2.0', 'v1.2.0'],
    ['2', 'v2'],
    ['v1.0', 'v1.0'],
    ['vv1', 'vv1'],
    ['vContent API v4', 'vContent API v4'],
    ['No updates', 'No updates'],
    ['API v1 (1.0.0)', 'API v1 (1.0.0)'],
  ])('versionLabel_%s_Renders_%s', (input, want) => {
    expect(versionLabel(input)).toBe(want);
  });
});
