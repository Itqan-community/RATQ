import type { PeriodType, TrendingResource } from '@/types/announcement';
import { DATA_MODE, API_BASE } from '@/shared/infrastructure/data-mode';
import { fetchResources } from './resources-api';
import { rankTrendingResources } from '../domain/services/trending-ranking';

export async function fetchTrendingResources(period: PeriodType): Promise<TrendingResource[]> {
  if (DATA_MODE === 'mock') {
    const { results } = await fetchResources({ page_size: 10_000 });
    return rankTrendingResources(results, period);
  }

  const qs = new URLSearchParams({ period, limit: '3' });
  return fetch(`${API_BASE}/api/resources/trending/?${qs}`).then((res) => {
    if (!res.ok) throw new Error('Failed to fetch trending resources');
    return res.json();
  });
}
