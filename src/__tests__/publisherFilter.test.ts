import { describe, expect, it } from 'vitest';
import { matchesPublisherFilter, NO_PUBLISHER_VALUE, publisherKey } from '@/shared/utils/publisher-filter';

describe('publisherKey', () => {
  it('namespaces the publisher id with its source, since ids are only unique per source', () => {
    expect(publisherKey({ source: 'cms', publisher: { id: 3, name: 'Alpha' } })).toBe('cms:3');
    expect(publisherKey({ source: 'payload', publisher: { id: 3, name: 'Alpha' } })).toBe('payload:3');
    expect(publisherKey({ source: 'cms', publisher: { id: 0, name: 'Zero' } })).toBe('cms:0');
  });

  it('is null when the resource has no publisher', () => {
    expect(publisherKey({ source: 'cms', publisher: null })).toBeNull();
    expect(publisherKey({ source: 'cms' })).toBeNull();
  });
});

describe('matchesPublisherFilter', () => {
  it('matches resources without a publisher when the reserved value is selected', () => {
    expect(matchesPublisherFilter(null, [NO_PUBLISHER_VALUE])).toBe(true);
    expect(matchesPublisherFilter(undefined, [NO_PUBLISHER_VALUE])).toBe(true);
  });

  it('matches named publishers when their key is selected', () => {
    expect(matchesPublisherFilter('cms:3', ['cms:3'])).toBe(true);
    expect(matchesPublisherFilter('cms:3', ['cms:4'])).toBe(false);
  });

  it('does not confuse the same id from two different sources', () => {
    expect(matchesPublisherFilter('payload:3', ['cms:3'])).toBe(false);
  });

  it('uses OR semantics for named and no-publisher selections', () => {
    const selected = ['cms:3', NO_PUBLISHER_VALUE];

    expect(matchesPublisherFilter('cms:3', selected)).toBe(true);
    expect(matchesPublisherFilter(null, selected)).toBe(true);
    expect(matchesPublisherFilter('cms:9', selected)).toBe(false);
  });

  it('matches every resource when no publisher filter is selected', () => {
    expect(matchesPublisherFilter(null, undefined)).toBe(true);
    expect(matchesPublisherFilter('cms:3', [])).toBe(true);
  });
});
