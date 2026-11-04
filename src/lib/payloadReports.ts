// Design report form -> Payload `reports`. Server owns reporter/status and the one-open-report-per-resource rule.
import { errorMessage, payloadBase } from './payloadAuth';
import type { Report } from '@/types';

type PayloadReason = 'inaccurate' | 'inappropriate' | 'infringing' | 'spam' | 'outdated' | 'broken-link';

// Lossy: Payload has 6 reasons, the design 8. The original design reason is kept in `details` (see buildDetails).
const REASON: Record<Report['reason'], PayloadReason> = {
  inappropriate: 'inappropriate',
  inaccurate: 'inaccurate',
  copyright: 'infringing',
  misleading: 'inaccurate',
  abuse: 'spam',
  broken: 'broken-link',
  sacred_error: 'inaccurate',
  other: 'inaccurate',
};

export const toPayloadReason = (r: Report['reason']): PayloadReason => REASON[r];

const MAX_DETAILS = 500; // Reports.details maxLength

export function buildDetails(reason: Report['reason'], details: string, evidenceUrl: string): string {
  const evidence = evidenceUrl.trim() ? `\n${evidenceUrl.trim()}` : '';
  const head = `[${reason}] `;
  // Truncate the free text, never the tag or the evidence link beyond the cap.
  const room = Math.max(0, MAX_DETAILS - head.length - evidence.length);
  return `${head}${details.slice(0, room)}${evidence}`.slice(0, MAX_DETAILS);
}

export async function submitReport(
  resourceId: string,
  reason: Report['reason'],
  details: string,
  evidenceUrl: string
): Promise<string | null> {
  const resource = resourceId.startsWith('payload_') ? Number(resourceId.slice('payload_'.length)) : NaN;
  if (Number.isNaN(resource)) return 'Reports are only available for live resources.';
  try {
    const res = await fetch(`${payloadBase()}/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ resource, reason: toPayloadReason(reason), details: buildDetails(reason, details, evidenceUrl) }),
    });
    return res.ok ? null : await errorMessage(res, 'Could not submit report');
  } catch {
    return 'Network error, please try again.';
  }
}

// ---- Admin moderation: list + resolve ----

interface PayloadReportDoc {
  id: number;
  resource: number | { id: number; name?: string };
  reporter: number | { id: number };
  reason: string;
  details?: string | null;
  status: string;
  createdAt: string;
}

const REVERSE_REASON: Record<string, Report['reason']> = {
  inaccurate: 'inaccurate',
  inappropriate: 'inappropriate',
  infringing: 'copyright',
  spam: 'abuse',
  outdated: 'inaccurate',
  'broken-link': 'broken',
};

const DESIGN_REASONS: Report['reason'][] = [
  'inappropriate', 'inaccurate', 'copyright', 'misleading', 'abuse', 'broken', 'sacred_error', 'other',
];

const relId = (r: number | { id: number }) => (typeof r === 'object' ? r.id : r);

export function toDesignReport(doc: PayloadReportDoc): Report {
  // submitReport stores the original design reason as a "[reason] " prefix (the mapping to Payload is lossy).
  const m = /^\[([a-z_]+)\] ?([\s\S]*)$/.exec(doc.details ?? '');
  const tagged = m && (DESIGN_REASONS as string[]).includes(m[1]) ? (m[1] as Report['reason']) : null;
  const reason = tagged ?? REVERSE_REASON[doc.reason] ?? 'other';
  return {
    id: `payload_report_${doc.id}`,
    reporter_profile_id: `payload_user_${relId(doc.reporter)}`,
    target_kind: 'resource',
    target_id: `payload_${relId(doc.resource)}`,
    reason,
    details_ar: tagged ? m![2] : doc.details ?? '',
    evidence_urls: [],
    priority: reason === 'sacred_error' ? 'critical' : 'normal',
    status: doc.status === 'resolved' ? 'resolved' : doc.status === 'closed' ? 'dismissed' : 'open',
    sla_due_at: doc.createdAt,
    created_at: doc.createdAt,
    target_title: typeof doc.resource === 'object' ? doc.resource.name : undefined,
  };
}

// Admin sees all reports; the server limits anyone else to their own / their resources'.
export async function fetchReports(): Promise<Report[]> {
  try {
    const res = await fetch(`${payloadBase()}/reports?depth=1&limit=100&sort=-createdAt`, { credentials: 'include' });
    if (!res.ok) return [];
    const { docs } = (await res.json()) as { docs: PayloadReportDoc[] };
    return docs.map(toDesignReport);
  } catch {
    return [];
  }
}

// Admin-only on the server (update: isAdmin).
export async function resolveReport(reportId: string): Promise<string | null> {
  const n = reportId.startsWith('payload_report_') ? Number(reportId.slice('payload_report_'.length)) : NaN;
  if (Number.isNaN(n)) return 'Only live reports can be resolved.';
  try {
    const res = await fetch(`${payloadBase()}/reports/${n}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ status: 'resolved' }),
    });
    return res.ok ? null : await errorMessage(res, 'Could not resolve report');
  } catch {
    return 'Network error, please try again.';
  }
}
