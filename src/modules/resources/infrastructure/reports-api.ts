import type { Report, ReportReason, ReportStatus } from '@/types/resource';
import { getCurrentUserId } from '@/shared/infrastructure/token-storage';
import { payloadErrorMessage } from '@/shared/infrastructure/payload-error';
import { PAYLOAD_API_BASE } from '@/shared/infrastructure/payload-config';

// Only payload-sourced resources have a real backing doc - resourceId is the
// aggregator-facing id, undone the same way comments-api.ts does.

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

export async function submitReport(resourceId: number, reason: ReportReason, details: string): Promise<Report> {
  const res = await fetch(`${PAYLOAD_API_BASE}/reports`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({ resource: resourceId - 200_000, reason, details }),
  });
  if (!res.ok) {
    throw new Error(
      await payloadErrorMessage(res, 'Failed to submit report', { authenticated: true })
    );
  }
  const result: { doc: PayloadReportDoc } = await res.json();
  return toReport(result.doc);
}

export async function fetchMyReports(): Promise<Report[]> {
  const userId = getCurrentUserId();
  if (!userId) return [];

  const res = await fetch(
    `${PAYLOAD_API_BASE}/reports?where[reporter][equals]=${userId}&sort=-createdAt&depth=1&limit=100`,
    { credentials: 'include' }
  );
  if (!res.ok) throw new Error('Failed to fetch reports');
  const data: { docs: PayloadReportDoc[] } = await res.json();
  return data.docs.map(toReport);
}
