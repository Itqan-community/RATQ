export const NO_PUBLISHER_VALUE = '__no_publisher__';

export function matchesPublisherFilter(
  publisherName: string | null | undefined,
  selectedPublishers: string[] | undefined,
): boolean {
  if (!selectedPublishers || selectedPublishers.length === 0) return true;

  const wantsNoPublisher = selectedPublishers.includes(NO_PUBLISHER_VALUE);
  const matchesPublisherName = publisherName
    ? selectedPublishers.includes(publisherName)
    : false;

  return (wantsNoPublisher && publisherName == null) || matchesPublisherName;
}
