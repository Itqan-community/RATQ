// ─── Announcement Types ───────────────────────────────────────────────────

export type AnnouncementType = 'release' | 'new_resource' | 'maintenance' | 'breaking_change';

export interface Announcement {
  id: string;
  type: AnnouncementType;
  title: string;
  description: string;
  resource_id?: string;
  cta_url?: string;
  cta_label?: string;
  created_at: string;
  expires_at?: string;
  is_active: boolean;
}

// ─── Trending Types ───────────────────────────────────────────────────────

export type TrendingPeriod = '7d' | '30d' | 'all-time';

export interface TrendingResource {
  id: number;
  name: string;
  slug: string;
  type: string;
  description: string;
  short_description: string;
  version: string | null;
  license: string;
  downloads: number;
}
