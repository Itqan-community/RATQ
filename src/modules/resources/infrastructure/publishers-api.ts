import type { PublisherOption } from '@/types/resource';

export async function fetchPublishers(): Promise<PublisherOption[]> {
  const res = await fetch('/api/resources/publishers');
  if (!res.ok) throw new Error('Failed to fetch publishers');
  return res.json();
}
