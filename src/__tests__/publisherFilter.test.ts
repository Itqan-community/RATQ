import { describe, expect, it } from 'vitest';
import { matchesPublisherFilter, NO_PUBLISHER_VALUE } from '@/shared/utils/publisher-filter';

describe('matchesPublisherFilter', () => {
  it('matches resources without a publisher when the reserved value is selected', () => {
    expect(matchesPublisherFilter(null, [NO_PUBLISHER_VALUE])).toBe(true);
    expect(matchesPublisherFilter(undefined, [NO_PUBLISHER_VALUE])).toBe(true);
  });

  it('matches named publishers when their id is selected', () => {
    expect(matchesPublisherFilter(3, ['3'])).toBe(true);
    expect(matchesPublisherFilter(3, ['4'])).toBe(false);
  });

  it('uses OR semantics for named and no-publisher selections', () => {
    const selected = ['3', NO_PUBLISHER_VALUE];

    expect(matchesPublisherFilter(3, selected)).toBe(true);
    expect(matchesPublisherFilter(null, selected)).toBe(true);
    expect(matchesPublisherFilter(9, selected)).toBe(false);
  });

  it('matches every resource when no publisher filter is selected', () => {
    expect(matchesPublisherFilter(null, undefined)).toBe(true);
    expect(matchesPublisherFilter(3, [])).toBe(true);
  });
});
