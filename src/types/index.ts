// src/types/index.ts
// Comprehensive TypeScript Data Types for RATQ Platform

export type UserRole =
  | 'guest'
  | 'member'
  | 'developer'
  | 'publisher_owner'
  | 'publisher_member'
  | 'reviewer'
  | 'moderator'
  | 'compliance'
  | 'admin';

export type ItqanBadgeLevel = 'none' | 'basic' | 'verified' | 'certified' | 'gold';

export type AccessLevel = 'open' | 'request' | 'institutional';

export type ResourceStatus =
  | 'draft'
  | 'pending_review'
  | 'published'
  | 'suspended'
  | 'archived'
  | 'rejected';

export type AccessRequestStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'needs_info'
  | 'approved'
  | 'rejected'
  | 'cancelled'
  | 'expired'
  | 'suspended'
  | 'appealed';

export type ApiKeyStatus = 'active' | 'revoked' | 'expired' | 'rotating';

export type ReportStatus = 'open' | 'triaged' | 'resolved' | 'dismissed';

export type ReportPriority = 'low' | 'normal' | 'high' | 'critical';

export interface Profile {
  id: string;
  handle: string;
  display_name: string;
  locale: 'ar' | 'en';
  direction: 'rtl' | 'ltr';
  numeral_system: 'western' | 'arabic-indic';
  timezone: string;
  avatar_url?: string;
  bio?: string;
  website?: string;
  github_login?: string;
  skills: string[];
  is_public: boolean;
  is_blocked: boolean;
  blocked_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface Publisher {
  id: string;
  slug: string;
  name_ar: string;
  name_en?: string;
  kind: 'publisher' | 'institute' | 'individual' | 'organization' | 'university';
  logo_url?: string;
  avatar_url?: string;
  description_ar: string;
  bio_ar?: string;
  bio_en?: string;
  website?: string;
  website_url?: string;
  country_code?: string;
  verification_status: 'unverified' | 'pending' | 'verified' | 'rejected';
  is_verified?: boolean;
  verification_method?: string;
  verified_at?: string;
  public_contact_email?: string;
  owner_profile_id: string;
  access_policy: 'open' | 'request' | 'institutional' | 'mixed';
  default_sla_days: number;
  is_active: boolean;
  created_at: string;
}

export interface License {
  id: string;
  name_ar: string;
  name_en: string;
  url: string;
  allows_commercial: boolean;
  requires_attribution: boolean;
  requires_share_alike: boolean;
  allows_modification: boolean;
  is_osi_approved: boolean;
  notes_ar?: string;
}

export interface Category {
  id: string;
  slug: string;
  name_ar: string;
  name_en: string;
  parent_id?: string;
  path: string;
  depth: number;
  icon?: string;
  description_ar?: string;
  resource_count: number;
  sort_order: number;
}

export interface ResourceTypeInfo {
  code: string;
  name_ar: string;
  name_en: string;
  icon: string;
  color_token: string;
  requires_scientific_review: boolean;
  sort_order: number;
}

export interface ResourceVersion {
  id: string;
  resource_id: string;
  version: string;
  released_at: string;
  changelog_ar: string;
  change_kind: 'major' | 'minor' | 'patch';
  breaking_change: boolean;
  status: 'draft' | 'published' | 'deprecated' | 'yanked';
  file_count: number;
  total_size_bytes: number;
}

export interface ResourceFile {
  id: string;
  version_id: string;
  file_name: string;
  storage_path: string;
  size_bytes: number;
  mime_type: string;
  sha256: string;
  download_count: number;
  is_primary: boolean;
  scan_status: 'pending' | 'clean' | 'infected' | 'skipped';
}

export interface Resource {
  id: string;
  slug: string;
  title_ar: string;
  title_en?: string;
  summary_ar: string;
  summary_en?: string;
  description_ar: string;
  resource_type: string;
  publisher_id: string;
  created_by: string;
  license_id: string;
  license_spdx?: string;
  license_custom_text?: string;
  access_level: AccessLevel;
  status: ResourceStatus;
  itqan_level: ItqanBadgeLevel;
  itqan_awarded_at?: string;
  itqan_expires_at?: string;
  itqan_suspended_reason?: string;
  repo_url?: string;
  docs_url?: string;
  homepage_url?: string;
  demo_url?: string;
  install_instructions?: Record<string, string>;
  tech_stack: string[];
  languages: string[];
  categories: string[];
  tags: string[];
  contains_quranic_text: boolean;
  quran_source_authority?: string;
  quran_source_url?: string;
  quran_source_version?: string;
  quran_source_license_id?: string;
  latest_version?: string;
  latest_released_at?: string;
  downloads_count: number;
  views_count: number;
  rating_avg: number;
  rating_count: number;
  is_featured: boolean;
  featured_rank: number;
  published_at?: string;
  is_demo?: boolean;
  created_at: string;
  updated_at: string;

  // Joined fields for view
  publisher?: Publisher;
  license?: License;
  versions?: ResourceVersion[];
}

export interface AccessRequest {
  id: string;
  resource_id: string;
  requester_profile_id: string;
  org_id?: string;
  purpose_ar: string;
  intended_use: 'personal' | 'education' | 'research' | 'commercial' | 'nonprofit' | 'government';
  requested_scope: { scopes: string[] };
  requested_days: number;
  status: AccessRequestStatus;
  decided_by_profile_id?: string;
  decision_note_ar?: string;
  info_request_ar?: string;
  submitted_at?: string;
  sla_due_at?: string;
  decided_at?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;

  // Joined
  resource?: Resource;
  requester?: Profile;
}

export interface ApiKey {
  id: string;
  resource_id: string;
  access_request_id?: string;
  org_id?: string;
  owner_profile_id: string;
  name_ar: string;
  key_prefix: string;
  scopes: string[];
  rate_limit_per_hour: number;
  rate_limit_per_day: number;
  status: ApiKeyStatus;
  expires_at: string;
  last_used_at?: string;
  rotated_from_id?: string;
  revoked_at?: string;
  revoked_reason_ar?: string;
  usage_count: number;
  created_at: string;

  // Joined
  resource_title_ar?: string;
}

export interface Review {
  id: string;
  resource_id: string;
  profile_id: string;
  rating: number;
  body_ar?: string;
  status: 'published' | 'hidden' | 'removed';
  helpful_count: number;
  publisher_reply?: string;
  publisher_replied_at?: string;
  created_at: string;
  profile?: Profile;
}

export interface Report {
  id: string;
  reporter_profile_id: string;
  target_kind: 'resource' | 'review' | 'comment' | 'publisher' | 'profile' | 'api_key';
  target_id: string;
  reason: 'inappropriate' | 'inaccurate' | 'copyright' | 'misleading' | 'abuse' | 'broken' | 'sacred_error' | 'other';
  details_ar: string;
  evidence_urls: string[];
  priority: ReportPriority;
  status: ReportStatus;
  resolved_by?: string;
  resolution_note_ar?: string;
  resolved_at?: string;
  sla_due_at: string;
  created_at: string;

  // Joined
  reporter?: Profile;
  target_title?: string;
}

export interface NotificationItem {
  id: string;
  profile_id: string;
  kind: string;
  title_ar: string;
  body_ar: string;
  link_url?: string;
  read_at?: string;
  created_at: string;
  priority: 'low' | 'normal' | 'high' | 'critical';
}

export interface AuditLogItem {
  id: string;
  actor_profile_id?: string;
  actor_name?: string;
  actor_role: string;
  action: string;
  target_kind: string;
  target_id?: string;
  target_name?: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  reason_ar?: string;
  ts: string;
}

export interface FeatureFlag {
  key: string;
  enabled: boolean;
  description_ar: string;
  rules?: Record<string, unknown>;
}

export interface CatalogFilterState {
  q: string;
  types: string[];
  licenses: string[];
  access: string[];
  itqan: string[];
  tech: string[];
  languages: string[];
  category?: string;
  publisher?: string;
  sort: 'relevance' | 'newest' | 'rating' | 'usage' | 'alpha';
  page: number;
}

export interface EcosystemApp {
  id: string;
  name_ar: string;
  name_en: string;
  tagline_ar?: string;
  description_ar?: string;
  icon_url: string;
  app_type: 'mushaf' | 'ai' | 'memorize' | 'web';
  live_url?: string;
  used_resource_slugs: string[];
  used_resource_names?: string[];
}
