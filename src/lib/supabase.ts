// src/lib/supabase.ts
// Supabase Client and Demo Repository Provider

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  DEMO_RESOURCES,
  DEMO_PUBLISHERS,
  DEMO_CATEGORIES,
  DEMO_LICENSES,
  DEMO_ACCESS_REQUESTS,
  DEMO_API_KEYS,
  DEMO_REVIEWS,
  DEMO_REPORTS,
  DEMO_AUDIT_LOGS,
  DEMO_NOTIFICATIONS,
  DEMO_PROFILES,
} from './mockData';
import {
  Resource,
  Publisher,
  AccessRequest,
  ApiKey,
  Review,
  Report,
  AuditLogItem,
  NotificationItem,
} from '@/types';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';
export const isLiveSupabase = Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('https://'));

export const supabase: SupabaseClient | null = isLiveSupabase
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ============================================================
// Interactive Demo Repository (In-Memory / LocalStorage)
// Guarantees zero-config instant functionality & verification
// ============================================================

class MockRepository {
  private resources: Resource[];
  private publishers: Publisher[];
  private requests: AccessRequest[];
  private keys: ApiKey[];
  private reviews: Review[];
  private reports: Report[];
  private auditLogs: AuditLogItem[];
  private notifications: NotificationItem[];

  constructor() {
    this.resources = [...DEMO_RESOURCES];
    this.publishers = [...DEMO_PUBLISHERS];
    this.requests = [...DEMO_ACCESS_REQUESTS];
    this.keys = [...DEMO_API_KEYS];
    this.reviews = [...DEMO_REVIEWS];
    this.reports = [...DEMO_REPORTS];
    this.auditLogs = [...DEMO_AUDIT_LOGS];
    this.notifications = [...DEMO_NOTIFICATIONS];
  }

  // Replace previously hydrated live (Payload) resources; mock/beta-snapshot entries are kept.
  setLiveResources(live: Resource[]) {
    this.resources = [...live, ...this.resources.filter((r) => !r.id.startsWith('payload_'))];
  }

  // Resources
  getResources() {
    return [...this.resources];
  }

  getResourceBySlug(slug: string) {
    return this.resources.find((r) => r.slug === slug);
  }

  addResource(res: Partial<Resource>): Resource {
    const newRes: Resource = {
      id: 'res_' + Date.now(),
      slug: res.slug || 'resource-' + Date.now(),
      title_ar: res.title_ar || 'مورد جديد',
      summary_ar: res.summary_ar || 'وصف المورد',
      description_ar: res.description_ar || 'تفاصيل المورد',
      resource_type: res.resource_type || 'library',
      publisher_id: res.publisher_id || 'pub_quran_tech',
      created_by: 'user_pub_001',
      license_id: res.license_id || 'cc-by-sa',
      access_level: res.access_level || 'open',
      status: 'published',
      itqan_level: 'basic',
      downloads_count: 0,
      views_count: 1,
      rating_avg: 5.0,
      rating_count: 1,
      is_featured: false,
      featured_rank: 0,
      tech_stack: res.tech_stack || [],
      languages: res.languages || ['ar'],
      categories: res.categories || ['cat_dev'],
      tags: res.tags || [],
      contains_quranic_text: res.contains_quranic_text || false,
      quran_source_authority: res.quran_source_authority,
      quran_source_url: res.quran_source_url,
      latest_version: res.latest_version || '1.0.0',
      latest_released_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      publisher: this.publishers.find((p) => p.id === res.publisher_id) || this.publishers[0],
      license: DEMO_LICENSES.find((l) => l.id === res.license_id) || DEMO_LICENSES[2],
    };

    this.resources.unshift(newRes);
    this.addAuditLog({
      action: 'resource.created',
      actor_role: 'publisher_owner',
      target_kind: 'resource',
      target_name: newRes.title_ar,
      reason_ar: 'إنشاء مورد جديد من بوابة الناشر.',
    });

    return newRes;
  }

  // Access Requests
  getRequests() {
    return [...this.requests];
  }

  createRequest(payload: {
    resource_id: string;
    purpose_ar: string;
    intended_use: any;
    requested_days: number;
  }): AccessRequest {
    const resource = this.resources.find((r) => r.id === payload.resource_id);
    const newReq: AccessRequest = {
      id: 'req_' + Date.now(),
      resource_id: payload.resource_id,
      requester_profile_id: 'user_dev_001',
      purpose_ar: payload.purpose_ar,
      intended_use: payload.intended_use,
      requested_scope: { scopes: ['resources:read', 'resources:download'] },
      requested_days: payload.requested_days,
      status: 'submitted',
      submitted_at: new Date().toISOString(),
      sla_due_at: new Date(Date.now() + 5 * 86400000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      resource,
      requester: DEMO_PROFILES.developer,
    };

    this.requests.unshift(newReq);
    return newReq;
  }

  updateRequestStatus(requestId: string, status: any, decisionNote?: string) {
    const req = this.requests.find((r) => r.id === requestId);
    if (req) {
      req.status = status;
      req.decision_note_ar = decisionNote;
      req.decided_at = new Date().toISOString();
      req.updated_at = new Date().toISOString();

      if (status === 'approved') {
        req.expires_at = new Date(Date.now() + req.requested_days * 86400000).toISOString();
      }
    }
    return req;
  }

  // API Keys
  getKeys() {
    return [...this.keys];
  }

  createApiKey(resourceId: string, requestId: string = '', name: string = 'مفتاح وصول جديد'): { keyRecord: ApiKey; fullSecretKey: string } {
    const prefix = Math.random().toString(16).substring(2, 10);
    const secretPart = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
    const fullSecretKey = `ratq_live_${prefix}_${secretPart}`;

    const newKey: ApiKey = {
      id: 'key_' + Date.now(),
      resource_id: resourceId,
      access_request_id: requestId,
      owner_profile_id: 'user_dev_001',
      name_ar: name,
      key_prefix: prefix,
      scopes: ['resources:read', 'resources:download'],
      rate_limit_per_hour: 1000,
      rate_limit_per_day: 10000,
      status: 'active',
      expires_at: new Date(Date.now() + 90 * 86400000).toISOString(),
      usage_count: 0,
      created_at: new Date().toISOString(),
      resource_title_ar: this.resources.find((r) => r.id === resourceId)?.title_ar,
    };

    this.keys.unshift(newKey);
    return { keyRecord: newKey, fullSecretKey };
  }

  rotateApiKey(keyId: string): { newKey: ApiKey; fullSecretKey: string } | null {
    const oldKey = this.keys.find((k) => k.id === keyId);
    if (!oldKey) return null;
    oldKey.status = 'rotating';

    const { keyRecord, fullSecretKey } = this.createApiKey(
      oldKey.resource_id,
      oldKey.access_request_id || '',
      `${oldKey.name_ar} (مُدوّر)`
    );
    keyRecord.rotated_from_id = oldKey.id;
    return { newKey: keyRecord, fullSecretKey };
  }

  revokeApiKey(keyId: string, reason = 'إلغاء يدوي من المستخدم') {
    const key = this.keys.find((k) => k.id === keyId);
    if (key) {
      key.status = 'revoked';
      key.revoked_at = new Date().toISOString();
      key.revoked_reason_ar = reason;
    }
    return key;
  }

  // Reviews
  getReviews(resourceId: string) {
    return this.reviews.filter((r) => r.resource_id === resourceId);
  }

  addReview(resourceId: string, rating: number, body_ar: string) {
    const review: Review = {
      id: 'rev_' + Date.now(),
      resource_id: resourceId,
      profile_id: 'user_dev_001',
      rating,
      body_ar,
      status: 'published',
      helpful_count: 0,
      created_at: new Date().toISOString(),
      profile: DEMO_PROFILES.developer,
    };
    this.reviews.unshift(review);
    return review;
  }

  // Moderation & Reports
  getReports() {
    return [...this.reports];
  }

  addReport(report: Partial<Report>) {
    const newReport: Report = {
      id: 'rep_' + Date.now(),
      reporter_profile_id: 'user_dev_001',
      target_kind: report.target_kind || 'resource',
      target_id: report.target_id || '',
      reason: report.reason || 'other',
      details_ar: report.details_ar || '',
      evidence_urls: report.evidence_urls || [],
      priority: report.priority || 'normal',
      status: 'open',
      sla_due_at: new Date(Date.now() + 24 * 3600000).toISOString(),
      created_at: new Date().toISOString(),
      reporter: DEMO_PROFILES.developer,
      target_title: report.target_title || 'مورد',
    };
    this.reports.unshift(newReport);
    return newReport;
  }

  // Audit Logs
  getAuditLogs() {
    return [...this.auditLogs];
  }

  addAuditLog(entry: Partial<AuditLogItem>) {
    const item: AuditLogItem = {
      id: 'audit_' + Date.now(),
      actor_name: entry.actor_name || 'أحمد المنصور',
      actor_role: entry.actor_role || 'developer',
      action: entry.action || 'system.event',
      target_kind: entry.target_kind || 'resource',
      target_name: entry.target_name,
      reason_ar: entry.reason_ar || 'إجراء نظامي مسجل.',
      ts: new Date().toISOString(),
    };
    this.auditLogs.unshift(item);
    return item;
  }

  // Notifications
  getNotifications() {
    return [...this.notifications];
  }

  markNotificationRead(id: string) {
    const notif = this.notifications.find((n) => n.id === id);
    if (notif) notif.read_at = new Date().toISOString();
  }

  markAllNotificationsRead() {
    this.notifications.forEach((n) => {
      n.read_at = new Date().toISOString();
    });
  }

  // Publishers & Categories & Licenses
  getPublishers() {
    return [...this.publishers];
  }

  getCategories() {
    return [...DEMO_CATEGORIES];
  }

  getLicenses() {
    return [...DEMO_LICENSES];
  }
}

export const mockRepo = new MockRepository();
