import type { TrendingResource } from '@/types/announcement';
import { fetchResources } from './resources-api';
import { rankTrendingResources } from '../domain/services/trending-ranking';

// No backend trending endpoint exists, so rank the aggregated list in every mode.
export async function fetchTrendingResources(period: '7d' | '30d' | 'all-time'): Promise<TrendingResource[]> {
  const { results } = await fetchResources({ page_size: 10_000 });
  return rankTrendingResources(results, period);
}
