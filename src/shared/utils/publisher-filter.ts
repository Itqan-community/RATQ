export const NO_PUBLISHER_VALUE = '__no_publisher__';

// The URL carries publisher ids (as strings), not names, so a selection
// survives switching the site language between Arabic and English names.
export function matchesPublisherFilter(
  publisherId: number | null | undefined,
  selectedPublishers: string[] | undefined,
): boolean {
  if (!selectedPublishers || selectedPublishers.length === 0) return true;

  const wantsNoPublisher = selectedPublishers.includes(NO_PUBLISHER_VALUE);
  const matchesPublisherId = publisherId != null && selectedPublishers.includes(String(publisherId));

  return (wantsNoPublisher && publisherId == null) || matchesPublisherId;
}
