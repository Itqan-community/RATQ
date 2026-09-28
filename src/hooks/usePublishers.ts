import useSWR from 'swr';
import { fetchPublishers } from '@/modules/resources/infrastructure/publishers-api';
import type { PublisherOption } from '@/types/resource';

export function usePublishers() {
  return useSWR<PublisherOption[], Error>('/api/resources/publishers', fetchPublishers);
}
