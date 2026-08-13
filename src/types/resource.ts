// ─── Resource Types ───────────────────────────────────────────────────────

export type ResourceType =
  | 'library' | 'sdk' | 'dataset' | 'api' | 'tafsir' | 'audio' | 'pdf' | 'json'
  // CMS-sourced categories
  | 'recitation' | 'mushaf' | 'program' | 'linguistic' | 'translation' | 'font' | 'search' | 'tajweed';

export type ResourceStatus = 'draft' | 'published' | 'archived';

// ─── Data Source Types ────────────────────────────────────────────────────
// Every resource is tagged with the source that produced it, so the UI can
// show which content is backed by live third-party data vs RATQ's own.

export type ResourceSourceId = 'ratq' | 'cms' | 'payload';

export interface Resource {
  id: number;
  name: string;
  slug: string;
  source: ResourceSourceId;
  source_url: string | null;
  type: ResourceType;
  description: string;
  short_description: string;
  documentation_url: string | null;
  github_url: string | null;
  license: string;
  itqan_badge: boolean;
  status: ResourceStatus;
  created_at: string;
  updated_at: string;
  version: string | null;
  github_stats: GithubStats | null;
  consumers?: Consumer[];

  // Preview fields (filled by publishers, auto-fetched as fallback)
  api_endpoint?: string | null;
  api_docs?: string | null;
  api_test_url?: string | null;
  sdk_install_command?: string | null;
  sdk_examples?: string | null;
  dataset_sample_data?: string | null;
  dataset_stats?: string | null;
  audio_url?: string | null;
  audio_thumbnail?: string | null;
  pdf_url?: string | null;
  pdf_excerpt?: string | null;
  json_content?: string | null;
  total_downloads: number;
  downloads: number;

  // CMS-sourced detail fields (no honest existing home)
  publisher_name?: string | null;
  publisher_description?: string | null;
  reciter_name?: string | null;
  preview_images?: string[];
}

export interface GithubStats {
  stars: number;
  forks: number;
  open_issues: number;
  last_commit: string;  // ISO 8601
}

export interface Consumer {
  name: string;
  logo_url?: string;
  website_url: string;
  category?: string;
}

// ─── Comment Types ────────────────────────────────────────────────────────

export interface Comment {
  id: number;
  author_name: string;
  content: string;
  created_at: string;
}

export interface CommentWithResource {
  comment: Comment;
  resource_name: string;
}

// ─── Access Request Types ─────────────────────────────────────────────────

export type RequestStatus = 'pending' | 'approved' | 'denied';

export interface AccessRequest {
  id: number;
  applicant_name: string;
  applicant_display_name: string;
  resource_slug: string;
  resource_name: string;
  status: RequestStatus;
  message: string;
  publisher_notes?: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Report Types ─────────────────────────────────────────────────────────

export type ReportReason = 'inaccurate' | 'inappropriate' | 'infringing' | 'spam' | 'outdated' | 'broken-link';

export type ReportStatus = 'open' | 'resolved' | 'closed';

export interface Report {
  id: number;
  reporter_name: string;
  resource_slug: string;
  reason: ReportReason;
  details: string;
  status: ReportStatus;
  created_at: string;
}

// ─── API Key Types ────────────────────────────────────────────────────────

export interface APIKey {
  id: number;
  name: string;
  resource_slug: string;
  resource_name: string;
  // Full plaintext key - only present once, in the response right after creation.
  key?: string;
  // Masked identifier shown for already-existing keys, once the full key is no longer available.
  key_prefix?: string;
  scope: string;
  created_at: string;
  last_used_at: string | null;
}

// ─── User Types ───────────────────────────────────────────────────────────

export type UserRole = 'developer' | 'publisher' | 'admin';

export interface User {
  id: number;
  email: string;
  display_name: string;
  role: UserRole;
  created_at: string;
}

// ─── API Response Types ───────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export type SortOption = 'relevance' | 'downloads' | 'newest' | 'oldest' | 'name_asc' | 'name_desc';

export interface ResourceListParams {
  type?: string;
  license?: string;
  itqan_badge?: string;
  search?: string;
  sort?: SortOption;
  page?: number;
  page_size?: number;
}

// ─── Notification Types ───────────────────────────────────────────────────

export interface NotificationItem {
  id: number;
  type: 'access_approved' | 'access_denied' | 'comment_reply' | 'report_resolved' | 'report_status_change' | 'resource_activity' | 'access_revoked';
  message: string;
  resource_name: string;
  created_at: string;
  read: boolean;
}
