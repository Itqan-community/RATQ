import type { Resource } from '@/types/resource';

export const NO_PUBLISHER_VALUE = '__no_publisher__';

// The URL carries a publisher key (source + id), not a name, so a selection
// survives switching the site language between Arabic and English names. The
// source is part of the key because ids are only unique within one source
// (CMS id 2 and a future Payload id 2 are different publishers).
export function publisherKey(resource: Pick<Resource, 'source' | 'publisher'>): string | null {
  return resource.publisher ? `${resource.source}:${resource.publisher.id}` : null;
}

export function matchesPublisherFilter(
  key: string | null | undefined,
  selectedPublishers: string[] | undefined,
): boolean {
  if (!selectedPublishers || selectedPublishers.length === 0) return true;

  const wantsNoPublisher = selectedPublishers.includes(NO_PUBLISHER_VALUE);
  const matchesKey = key != null && selectedPublishers.includes(key);

  return (wantsNoPublisher && key == null) || matchesKey;
}
