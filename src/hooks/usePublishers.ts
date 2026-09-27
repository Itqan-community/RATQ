import useSWR from 'swr';
import { fetchPublishers } from '@/modules/resources/infrastructure/publishers-api';
import type { Publisher } from '@/types/resource';

export function usePublishers() {
  return useSWR<Publisher[], Error>('/api/resources/publishers', fetchPublishers);
}
