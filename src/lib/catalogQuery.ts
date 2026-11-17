// Catalog URL state and filter semantics, ported from live (?search,type,license xN,publisher xN,sort) so
// bookmarked links keep working. Pure functions only; the Catalog view owns the router wiring.
import { normalizeArabic } from './format';
import type { Resource } from '@/types';

export const SORT_OPTIONS = ['relevance', 'downloads', 'newest', 'oldest', 'name_asc', 'name_desc'] as const;
export type SortOption = (typeof SORT_OPTIONS)[number];

export interface CatalogQuery {
  search: string;
  types: string[];
  licenses: string[];
  publishers: string[];
  sort: SortOption;
}

export function parseCatalogQuery(p: URLSearchParams): CatalogQuery {
  const sort = p.get('sort');
  return {
    // ?q is the beta-era alias (home hero search used it); ?search wins when both exist.
    search: p.get('search') ?? p.get('q') ?? '',
    types: p.getAll('type'),
    licenses: p.getAll('license'),
    publishers: p.getAll('publisher'),
    sort: SORT_OPTIONS.includes(sort as SortOption) ? (sort as SortOption) : 'relevance',
  };
}

// Returns a copy of `prev` with the patched keys rewritten in live's shape. Any change resets pagination.
export function withQuery(prev: URLSearchParams, patch: Partial<CatalogQuery>): URLSearchParams {
  const p = new URLSearchParams(prev);
  p.delete('page');
  if (patch.search !== undefined) {
    p.delete('q');
    p.delete('search');
    if (patch.search) p.set('search', patch.search);
  }
  const repeated: [keyof CatalogQuery, string][] = [['types', 'type'], ['licenses', 'license'], ['publishers', 'publisher']];
  for (const [field, key] of repeated) {
    const v = patch[field] as string[] | undefined;
    if (!v) continue;
    p.delete(key);
    v.forEach((x) => p.append(key, x));
  }
  if (patch.sort !== undefined) {
    p.delete('sort');
    if (patch.sort !== 'relevance') p.set('sort', patch.sort);
  }
  return p;
}

export function matchesSearch(r: Resource, query: string): boolean {
  const q = normalizeArabic(query.trim());
  if (!q) return true;
  return [r.title_ar, r.title_en, r.summary_ar, r.summary_en, r.description_ar, r.description_en, ...r.tags].some(
    (t) => t && normalizeArabic(t).includes(q),
  );
}

// Undated (CMS) items count as time 0: they sink under 'newest' and lead under 'oldest', no date is invented.
const sortTime = (d?: string) => {
  const t = Date.parse(d ?? '');
  return Number.isNaN(t) ? 0 : t;
};

export function sortResources(list: Resource[], sort: SortOption): Resource[] {
  const out = [...list];
  switch (sort) {
    case 'downloads': return out.sort((a, b) => b.downloads_count - a.downloads_count);
    case 'newest': return out.sort((a, b) => sortTime(b.created_at) - sortTime(a.created_at));
    case 'oldest': return out.sort((a, b) => sortTime(a.created_at) - sortTime(b.created_at));
    case 'name_asc': return out.sort((a, b) => a.title_ar.localeCompare(b.title_ar, 'ar'));
    case 'name_desc': return out.sort((a, b) => b.title_ar.localeCompare(a.title_ar, 'ar'));
    default: return out;
  }
}

export const newestResources = (list: Resource[], n: number) => sortResources(list, 'newest').slice(0, n);

// Live's CC_LICENSE_ROWS (shared/utils/license-filter.ts): `values` are every raw license string the sources store
// for the row; the URL carries raw values, so bookmarks like ?license=CC0 keep working. `id` is the design license id.
export const CC_LICENSE_ROWS = [
  { id: 'cc0', values: ['CC0', 'CC0-1.0', 'CC0 1.0'] },
  { id: 'cc-by', values: ['CC-BY-4.0', 'CC-BY-3.0', 'CC-BY-2.0'] },
  { id: 'cc-by-sa', values: ['CC-BY-SA-4.0', 'CC-BY-SA-3.0', 'CC-BY-SA 4.0'] },
  { id: 'cc-by-nd', values: ['CC-BY-ND-4.0', 'CC-BY-ND-3.0', 'CC-BY-ND'] },
  { id: 'cc-by-nc-sa', values: ['CC-BY-NC-SA-4.0', 'CC-BY-NC-SA-3.0'] },
  { id: 'cc-by-nc-nd', values: ['CC-BY-NC-ND-4.0', 'CC-BY-NC-ND-3.0', 'CC-BY-NC-ND'] },
];

const TRACKED = new Set(CC_LICENSE_ROWS.flatMap((r) => r.values));

export const licenseRowIdFor = (raw: string): string | undefined => CC_LICENSE_ROWS.find((r) => r.values.includes(raw))?.id;

// Catalog link for a design license id: the URL carries every raw value of the row (live's shape).
export function licenseRowHref(id: string): string {
  const values = CC_LICENSE_ROWS.find((r) => r.id === id)?.values ?? [];
  const qs = withQuery(new URLSearchParams(), { licenses: values }).toString();
  return qs ? `/resources?${qs}` : '/resources';
}

// Only the 6 CC rows are filterable; any other license (MIT, Unspecified, Waqf...) is never hidden. Stale or
// hand-edited URL values are ignored rather than hiding everything.
export function matchesLicenseFilter(resourceLicense: string, selected: string[] | undefined): boolean {
  const valid = selected?.filter((v) => TRACKED.has(v));
  if (!valid?.length || !TRACKED.has(resourceLicense)) return true;
  return valid.includes(resourceLicense);
}

export const NO_PUBLISHER_VALUE = '__no_publisher__';

// Live key shape "cms:17": source + id, language independent. Mock-mode demo publishers get "demo:<id>". A Payload doc
// with no owner is attributed to the community publisher for display, but is "no publisher" here exactly as in live.
export function publisherKey(r: Pick<Resource, 'source' | 'publisher_id'>): string | null {
  const m = r.publisher_id.match(/^(cms|payload)_pub_(.+)$/);
  if (m) return `${m[1]}:${m[2]}`;
  return r.source ? null : r.publisher_id ? `demo:${r.publisher_id}` : null;
}

export function matchesPublisherFilter(key: string | null, selected: string[]): boolean {
  if (selected.length === 0) return true;
  return key == null ? selected.includes(NO_PUBLISHER_VALUE) : selected.includes(key);
}

export interface PublisherOption { key: string; name: string }

export function publisherOptions(list: Resource[]): PublisherOption[] {
  const byKey = new Map<string, PublisherOption>();
  for (const r of list) {
    const key = publisherKey(r);
    if (key && r.publisher && !byKey.has(key)) byKey.set(key, { key, name: r.publisher.name_ar || r.publisher.name_en || key });
  }
  return [...byKey.values()].sort((a, b) => a.name.localeCompare(b.name, 'ar'));
}
