import type { Resource } from '@/types/resource';
import type { PeriodType, TrendingResource } from '@/types/announcement';

// The ranking rule behind the mock-mode branch of trending-api.ts: only
// resources with at least one download in the period, ranked by that
// period's download count, top 3. Kept separate from the fetch so the rule
// itself (not the HTTP/mock plumbing around it) is what a future change to
// "what counts as trending" would touch.
export function rankTrendingResources(
  resources: Resource[],
  period: PeriodType
): TrendingResource[] {
  const isAllTime = period === 'all-time';
  return resources
    .filter((r) => (isAllTime ? r.total_downloads > 0 : r.downloads > 0))
    .sort((a, b) => (isAllTime ? b.total_downloads - a.total_downloads : b.downloads - a.downloads))
    .slice(0, 3)
    .map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      type: r.type,
      description: r.description,
      short_description: r.short_description,
      version: r.version,
      license: r.license,
      downloads: isAllTime ? r.total_downloads : r.downloads,
    }));
}
