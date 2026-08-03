// ─── API Client ────────────────────────────────────────────────────────────
// Abstract data layer: mock mode (default) or real mode (Django backend)
// Switch via NEXT_PUBLIC_DATA_MODE env var
// ───────────────────────────────────────────────────────────────────────────

import type {
  Resource,
  ResourceType,
  Comment,
  AccessRequest,
  Report,
  ReportReason,
  ReportStatus,
  APIKey,
  User,
  PaginatedResponse,
  ResourceListParams,
  RequestStatus,
  NotificationItem,
} from '@/types/resource';
import type { Announcement, TrendingResource } from '@/types/announcement';
import { toResource, type PayloadResourceDoc } from './sources/payload';

import {
  mockAnnouncements,
  mockDeveloperNotifications,
} from './mock-data';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const DATA_MODE = process.env.NEXT_PUBLIC_DATA_MODE || 'mock';

// Auth always hits the real Payload backend, independent of DATA_MODE (which
// still gates the other endpoints below against the not-yet-built Django API).
const PAYLOAD_API_BASE = process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 'https://api.ratq.itqan.dev/api';
// The OAuth routes are custom Next.js routes on the payload backend, not
// part of Payload's own REST API - they live outside the /api prefix (see
// payload-backend/src/app/oauth for why).
const PAYLOAD_ORIGIN = PAYLOAD_API_BASE.replace(/\/api\/?$/, '');
const githubOAuthUrl = `${PAYLOAD_ORIGIN}/oauth/github`;

// ─── Resource Endpoints ───────────────────────────────────────────────────

// Resource listing/detail is always backed by the multi-source aggregator
// (src/lib/sources/) - it includes RATQ's own mock resources as one source
// alongside live sources like CMS, independent of DATA_MODE (which still
// governs auth/requests/api-keys/reports below, unchanged).
//
// This client code calls RATQ's own /api/resources route rather than the
// aggregator directly, so source fetches (e.g. CMS) run server-side where
// Next's fetch cache/revalidate applies, instead of once per visitor's browser.
async function fetchResources(
  params: ResourceListParams = {}
): Promise<PaginatedResponse<Resource>> {
  const qs = new URLSearchParams();
  if (params.type) qs.set('type', params.type);
  if (params.license) qs.set('license', params.license);
  if (params.itqan_badge !== undefined) qs.set('itqan_badge', params.itqan_badge);
  if (params.search) qs.set('search', params.search);
  if (params.sort) qs.set('sort', params.sort);
  if (params.page) qs.set('page', String(params.page));
  if (params.page_size) qs.set('page_size', String(params.page_size));

  const res = await fetch(`/api/resources?${qs}`);
  if (!res.ok) throw new Error('Failed to fetch resources');
  return res.json();
}

async function fetchResource(slug: string): Promise<Resource> {
  const res = await fetch(`/api/resources/${slug}`);
  if (!res.ok) throw new Error('Resource not found');
  return res.json();
}

// ─── Comment Endpoints ────────────────────────────────────────────────────
// Only payload-sourced resources have a real backing doc to comment on - the
// caller passes the aggregator-facing id (200_000 + payload id, see
// sources/payload.ts toResource), undone here the same way
// updateDeveloperResource/deleteDeveloperResource already do.

interface PayloadCommentDoc {
  id: number;
  content: string;
  createdAt: string;
  author_name: string;
}

function toComment(doc: PayloadCommentDoc): Comment {
  return { id: doc.id, author_name: doc.author_name, content: doc.content, created_at: doc.createdAt };
}

async function fetchComments(resourceId: number): Promise<Comment[]> {
  const token = getAccessToken();
  const res = await fetch(
    `${PAYLOAD_API_BASE}/comments?where[resource][equals]=${resourceId - 200_000}&sort=-createdAt&limit=100`,
    { headers: token ? { Authorization: `JWT ${token}` } : {} }
  );
  if (!res.ok) throw new Error('Failed to fetch comments');
  const data: { docs: PayloadCommentDoc[] } = await res.json();
  return data.docs.map(toComment);
}

async function postComment(resourceId: number, content: string): Promise<Comment> {
  const res = await fetch(`${PAYLOAD_API_BASE}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${getAccessToken()}`,
    },
    body: JSON.stringify({ content, resource: resourceId - 200_000 }),
  });
  if (!res.ok) throw new Error(await payloadErrorMessage(res, 'Failed to post comment'));
  const result: { doc: PayloadCommentDoc } = await res.json();
  return toComment(result.doc);
}

// ─── Auth Endpoints ───────────────────────────────────────────────────────
// Backed by Payload's built-in auth API (staging.api.ratq.itqan.dev/api/users).
// Payload issues a single JWT (no separate refresh token), so it's stored as
// both access and refresh to keep the existing authHelpers/localStorage shape.

interface PayloadUserDoc {
  id: number;
  email: string;
  display_name?: string | null;
  role?: 'developer' | 'publisher' | 'admin' | null;
  createdAt: string;
}

function toUser(doc: PayloadUserDoc): User {
  return {
    id: doc.id,
    email: doc.email,
    display_name: doc.display_name || doc.email.split('@')[0],
    role: doc.role || 'developer',
    created_at: doc.createdAt,
  };
}

async function payloadErrorMessage(res: Response, fallback: string): Promise<string> {
  const data = await res.json().catch(() => null);
  return data?.errors?.[0]?.data?.errors?.[0]?.message || data?.errors?.[0]?.message || fallback;
}

async function login(email: string, password: string) {
  const res = await fetch(`${PAYLOAD_API_BASE}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(await payloadErrorMessage(res, 'Login failed'));
  const data: { token: string; user: PayloadUserDoc } = await res.json();
  return { access: data.token, refresh: data.token, user: toUser(data.user) };
}

async function loginWithToken(token: string) {
  const res = await fetch(`${PAYLOAD_API_BASE}/users/me`, {
    headers: { Authorization: `JWT ${token}` },
  });
  if (!res.ok) throw new Error('Failed to load user');
  const data: { user: PayloadUserDoc | null } = await res.json();
  if (!data.user) throw new Error('Failed to load user');
  return { access: token, refresh: token, user: toUser(data.user) };
}

async function register(
  email: string,
  password: string,
  display_name: string,
  role: 'developer' | 'publisher' = 'developer'
) {
  const res = await fetch(`${PAYLOAD_API_BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, display_name, role }),
  });
  if (!res.ok) throw new Error(await payloadErrorMessage(res, 'Registration failed'));
  return login(email, password);
}

// ─── Access Request Endpoints ─────────────────────────────────────────────
// Only payload-sourced resources have a real backing doc - resourceId is the
// aggregator-facing id, undone the same way fetchComments does above.

interface PayloadAccessRequestDoc {
  id: number;
  status: RequestStatus;
  message: string;
  publisher_notes?: string | null;
  createdAt: string;
  updatedAt: string;
  applicant: number | { id: number; display_name?: string | null; email: string };
  resource: number | { id: number; slug: string; name: string };
}

function toAccessRequest(doc: PayloadAccessRequestDoc): AccessRequest {
  const applicantName =
    typeof doc.applicant === 'object' ? doc.applicant.display_name || doc.applicant.email : 'Unknown';
  const resourceSlug = typeof doc.resource === 'object' ? `payload-${doc.resource.slug}` : String(doc.resource);
  const resourceName = typeof doc.resource === 'object' ? doc.resource.name : '';
  return {
    id: doc.id,
    applicant_name: applicantName,
    applicant_display_name: applicantName,
    resource_slug: resourceSlug,
    resource_name: resourceName,
    status: doc.status,
    message: doc.message,
    publisher_notes: doc.publisher_notes,
    created_at: doc.createdAt,
    updated_at: doc.updatedAt,
  };
}

async function submitAccessRequest(resourceId: number, message: string): Promise<AccessRequest> {
  const res = await fetch(`${PAYLOAD_API_BASE}/access-requests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${getAccessToken()}`,
    },
    body: JSON.stringify({ resource: resourceId - 200_000, message }),
  });
  if (!res.ok) throw new Error(await payloadErrorMessage(res, 'Failed to submit request'));
  const result: { doc: PayloadAccessRequestDoc } = await res.json();
  return toAccessRequest(result.doc);
}

async function fetchMyRequests(): Promise<AccessRequest[]> {
  const userId = getCurrentUserId();
  if (!userId) return [];

  const res = await fetch(
    `${PAYLOAD_API_BASE}/access-requests?where[applicant][equals]=${userId}&sort=-createdAt&depth=1&limit=100`,
    { headers: { Authorization: `JWT ${getAccessToken()}` } }
  );
  if (!res.ok) throw new Error('Failed to fetch requests');
  const data: { docs: PayloadAccessRequestDoc[] } = await res.json();
  return data.docs.map(toAccessRequest);
}

// ─── API Key Endpoints ────────────────────────────────────────────────────
// Only payload-sourced resources have a real backing doc - resourceId is the
// aggregator-facing id, undone the same way fetchComments does above.

interface PayloadApiKeyDoc {
  id: number;
  name: string;
  resource: number | { id: number; slug: string; name: string };
  key?: string; // present only once, in the create response (see APIKeys.ts afterChange)
  key_prefix?: string;
  scope: string;
  createdAt: string;
  last_used_at: string | null;
}

function toApiKey(doc: PayloadApiKeyDoc): APIKey {
  const resourceSlug = typeof doc.resource === 'object' ? `payload-${doc.resource.slug}` : String(doc.resource);
  const resourceName = typeof doc.resource === 'object' ? doc.resource.name : '';
  return {
    id: doc.id,
    name: doc.name,
    resource_slug: resourceSlug,
    resource_name: resourceName,
    key: doc.key,
    key_prefix: doc.key_prefix,
    scope: doc.scope,
    created_at: doc.createdAt,
    last_used_at: doc.last_used_at,
  };
}

// ─── Report Endpoint ──────────────────────────────────────────────────────
// Only payload-sourced resources have a real backing doc - resourceId is the
// aggregator-facing id, undone the same way fetchComments does above.

interface PayloadReportDoc {
  id: number;
  reason: ReportReason;
  details: string;
  status: ReportStatus;
  createdAt: string;
  reporter: number | { id: number; display_name?: string | null; email: string };
  resource: number | { id: number; slug: string };
}

function toReport(doc: PayloadReportDoc): Report {
  const reporterName =
    typeof doc.reporter === 'object' ? doc.reporter.display_name || doc.reporter.email : 'Unknown';
  const resourceSlug = typeof doc.resource === 'object' ? `payload-${doc.resource.slug}` : String(doc.resource);
  return {
    id: doc.id,
    reporter_name: reporterName,
    resource_slug: resourceSlug,
    reason: doc.reason,
    details: doc.details,
    status: doc.status,
    created_at: doc.createdAt,
  };
}

async function submitReport(resourceId: number, reason: ReportReason, details: string): Promise<Report> {
  const res = await fetch(`${PAYLOAD_API_BASE}/reports`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${getAccessToken()}`,
    },
    body: JSON.stringify({ resource: resourceId - 200_000, reason, details }),
  });
  if (!res.ok) throw new Error(await payloadErrorMessage(res, 'Failed to submit report'));
  const result: { doc: PayloadReportDoc } = await res.json();
  return toReport(result.doc);
}

async function fetchMyReports(): Promise<Report[]> {
  const userId = getCurrentUserId();
  if (!userId) return [];

  const res = await fetch(
    `${PAYLOAD_API_BASE}/reports?where[reporter][equals]=${userId}&sort=-createdAt&depth=1&limit=100`,
    { headers: { Authorization: `JWT ${getAccessToken()}` } }
  );
  if (!res.ok) throw new Error('Failed to fetch reports');
  const data: { docs: PayloadReportDoc[] } = await res.json();
  return data.docs.map(toReport);
}

// ─── Auth Helpers ─────────────────────────────────────────────────────────

function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('ratq_access_token');
}

function setAuthTokens(access: string, refresh: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('ratq_access_token', access);
  localStorage.setItem('ratq_refresh_token', refresh);
}

function clearAuth() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('ratq_access_token');
  localStorage.removeItem('ratq_refresh_token');
}

// Mirrors useAuth's getUserFromStorage - the current user's numeric Payload
// id, needed to scope "my requests/reports/api-keys" queries by owner.
function getCurrentUserId(): number | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('ratq_user');
  if (!stored) return null;
  try {
    return (JSON.parse(stored) as { id: number }).id;
  } catch {
    return null;
  }
}

// ─── Announcement Endpoints ──────────────────────────────────────────────

function fetchAnnouncements(): Promise<Announcement[]> {
  if (DATA_MODE === 'mock') {
    const now = new Date();
    return Promise.resolve(
      mockAnnouncements.filter((a) => {
        if (!a.is_active) return false;
        if (a.expires_at && new Date(a.expires_at) < now) return false;
        return true;
      })
    );
  }

  return fetch(`${API_BASE}/api/announcements/`).then((res) => {
    if (!res.ok) throw new Error('Failed to fetch announcements');
    return res.json();
  });
}

// ─── Trending Resource Endpoints ─────────────────────────────────────────

async function fetchTrendingResources(period: '7d' | '30d' | 'all-time'): Promise<TrendingResource[]> {
  if (DATA_MODE === 'mock') {
    const isAllTime = period === 'all-time';
    const { results } = await fetchResources({ page_size: 10_000 });
    const sorted = results
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
    return sorted;
  }

  const qs = new URLSearchParams({ period, limit: '3' });
  return fetch(`${API_BASE}/api/resources/trending/?${qs}`).then((res) => {
    if (!res.ok) throw new Error('Failed to fetch trending resources');
    return res.json();
  });
}

// ─── Developer Resource Endpoints ─────────────────────────────────────────
// list/create always hit the real Payload backend (like auth above) - these
// back the dashboard's "my resources" + publish flow, independent of
// DATA_MODE, which still gates the Django-backed endpoints below.

async function fetchDeveloperResources(userId: number): Promise<Resource[]> {
  const res = await fetch(
    `${PAYLOAD_API_BASE}/resources?where[owner][equals]=${userId}&limit=100`,
    { headers: { Authorization: `JWT ${getAccessToken()}` } }
  );
  if (!res.ok) throw new Error('Failed to fetch developer resources');
  const data: { docs: PayloadResourceDoc[] } = await res.json();
  return data.docs.map(toResource);
}

interface CreateResourceInput {
  name: string;
  type: ResourceType;
  short_description: string;
  description: string;
  license: string;
  github_url: string;
  documentation_url: string;
  status: 'draft' | 'published';
}

async function createDeveloperResource(data: CreateResourceInput): Promise<Resource> {
  const res = await fetch(`${PAYLOAD_API_BASE}/resources`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${getAccessToken()}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await payloadErrorMessage(res, 'Failed to publish resource'));
  const result: { doc: PayloadResourceDoc } = await res.json();
  return toResource(result.doc);
}

// id is the aggregator-facing id (200_000 + raw Payload id, see sources/payload.ts
// toResource) - undo the offset to hit the real Payload doc.
type UpdateResourceInput = Omit<CreateResourceInput, 'status'>;

async function updateDeveloperResource(id: number, data: UpdateResourceInput): Promise<Resource> {
  const res = await fetch(`${PAYLOAD_API_BASE}/resources/${id - 200_000}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${getAccessToken()}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await payloadErrorMessage(res, 'Failed to update resource'));
  const result: { doc: PayloadResourceDoc } = await res.json();
  return toResource(result.doc);
}

async function deleteDeveloperResource(id: number) {
  const res = await fetch(`${PAYLOAD_API_BASE}/resources/${id - 200_000}`, {
    method: 'DELETE',
    headers: { Authorization: `JWT ${getAccessToken()}` },
  });
  if (!res.ok) throw new Error(await payloadErrorMessage(res, 'Failed to delete resource'));
  return res.json();
}

// ─── Developer API Key Endpoints ──────────────────────────────────────────
// resourceId is the aggregator-facing id, undone the same way fetchComments
// does above. keyId is a real Payload api-keys doc id (not offset - these
// records are only ever listed/managed via this dashboard, never aggregated).

async function fetchDeveloperAPIKeys(): Promise<APIKey[]> {
  const userId = getCurrentUserId();
  if (!userId) return [];

  const res = await fetch(
    `${PAYLOAD_API_BASE}/api-keys?where[owner][equals]=${userId}&depth=1&limit=100`,
    { headers: { Authorization: `JWT ${getAccessToken()}` } }
  );
  if (!res.ok) throw new Error('Failed to fetch API keys');
  const data: { docs: PayloadApiKeyDoc[] } = await res.json();
  return data.docs.map(toApiKey);
}

async function createDeveloperApiKey(resourceId: number, scope: string, name?: string): Promise<APIKey> {
  const res = await fetch(`${PAYLOAD_API_BASE}/api-keys`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${getAccessToken()}`,
    },
    body: JSON.stringify({ name: name || `key-${resourceId}`, resource: resourceId - 200_000, scope }),
  });
  if (!res.ok) throw new Error(await payloadErrorMessage(res, 'Failed to create API key'));
  const result: { doc: PayloadApiKeyDoc } = await res.json();
  return toApiKey(result.doc);
}

async function revokeDeveloperApiKey(keyId: number) {
  const res = await fetch(`${PAYLOAD_API_BASE}/api-keys/${keyId}`, {
    method: 'DELETE',
    headers: { Authorization: `JWT ${getAccessToken()}` },
  });
  if (!res.ok) throw new Error(await payloadErrorMessage(res, 'Failed to revoke API key'));
  return res.json();
}

// ─── Developer Notifications Endpoints ──────────────────────────────────────

async function fetchDeveloperNotifications(): Promise<NotificationItem[]> {
  if (DATA_MODE === 'mock') {
    return mockDeveloperNotifications;
  }

  const res = await fetch(`${API_BASE}/api/v1/developer/notifications/`, {
    headers: { Authorization: `Bearer ${getAccessToken()}` },
  });
  if (!res.ok) throw new Error('Failed to fetch notifications');
  return res.json();
}

async function markNotificationAsRead(notificationId: number) {
  if (DATA_MODE === 'mock') {
    return { success: true };
  }

  const res = await fetch(`${API_BASE}/api/v1/developer/notifications/${notificationId}/read/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });
  if (!res.ok) throw new Error('Failed to mark notification as read');
  return res.json();
}

async function markAllNotificationsAsRead() {
  if (DATA_MODE === 'mock') {
    return { success: true };
  }

  const res = await fetch(`${API_BASE}/api/v1/developer/notifications/read-all/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });
  if (!res.ok) throw new Error('Failed to mark all notifications as read');
  return res.json();
}

// ─── Developer Access Management Endpoints ────────────────────────────────

async function inviteDeveloperByEmail(resourceSlug: string, email: string, scope: string) {
  if (DATA_MODE === 'mock') {
    return {
      id: Date.now(),
      email,
      resource_slug: resourceSlug,
      key: `ratq_live_${Math.random().toString(36).substring(2, 18)}`,
      scope,
    };
  }

  const res = await fetch(`${API_BASE}/api/v1/developer/resources/${resourceSlug}/invite/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAccessToken()}`,
    },
    body: JSON.stringify({ email, scope }),
  });
  if (!res.ok) throw new Error('Failed to send invite');
  return res.json();
}

async function revokeDeveloperAccess(resourceSlug: string, userEmail: string) {
  if (DATA_MODE === 'mock') {
    return { success: true };
  }

  const res = await fetch(`${API_BASE}/api/v1/developer/resources/${resourceSlug}/access/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAccessToken()}`,
    },
    body: JSON.stringify({ email: userEmail }),
  });
  if (!res.ok) throw new Error('Failed to revoke access');
  return res.json();
}

// ─── Export ───────────────────────────────────────────────────────────────

export const api = {
  resources: { list: fetchResources, detail: fetchResource },
  comments: { list: fetchComments, post: postComment },
  auth: { login, register, loginWithToken },
  requests: { submit: submitAccessRequest, myRequests: fetchMyRequests },
  reports: { submit: submitReport, myReports: fetchMyReports },
  authHelpers: { getAccessToken, setAuthTokens, clearAuth, githubOAuthUrl },
  announcements: { list: fetchAnnouncements },
  trending: { list: fetchTrendingResources },
  // Developer endpoints
  developer: {
    resources: { list: fetchDeveloperResources, create: createDeveloperResource, update: updateDeveloperResource, delete: deleteDeveloperResource },
    apiKeys: {
      list: fetchDeveloperAPIKeys,
      create: createDeveloperApiKey,
      revoke: revokeDeveloperApiKey,
    },
    notifications: {
      list: fetchDeveloperNotifications,
      markRead: markNotificationAsRead,
      markAllRead: markAllNotificationsAsRead,
    },
    access: {
      inviteByEmail: inviteDeveloperByEmail,
      revoke: revokeDeveloperAccess,
    },
  },
};

export { DATA_MODE };
