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
