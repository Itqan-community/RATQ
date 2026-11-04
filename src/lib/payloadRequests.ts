// Payload `access-requests` <-> design AccessRequest. The server owns every invariant (applicant, pending-only
// duplicates, terminal statuses, owner-only decisions); this layer maps vocabulary and sends only what it accepts.
import { DEMO_PROFILES } from './mockData';
import { errorMessage, isLive, payloadBase } from './payloadAuth';
import { mockRepo } from './supabase';
import type { AccessRequest, AccessRequestStatus } from '@/types';

interface PayloadRequestDoc {
  id: number;
  status: string;
  message: string;
  resource: number | { id: number; name?: string };
  applicant: number | { id: number; display_name?: string | null };
  createdAt: string;
  updatedAt: string;
}

const relId = (r: number | { id: number }) => (typeof r === 'object' ? r.id : r);

// Pending maps to 'under_review': the publisher UI only offers approve/reject for that state.
// Unknown statuses fall back to it too, never to a granted state.
export function toDesignStatus(s: string): AccessRequestStatus {
  switch (s) {
    case 'approved': return 'approved';
    case 'denied': return 'rejected';
    case 'revoked': return 'cancelled'; // design has no 'revoked'
    default: return 'under_review';
  }
}

export function toDesignRequest(doc: PayloadRequestDoc): AccessRequest {
  const resourceId = `payload_${relId(doc.resource)}`;
  return {
    id: `payload_req_${doc.id}`,
    resource_id: resourceId,
    requester_profile_id: `payload_user_${relId(doc.applicant)}`,
    purpose_ar: doc.message,
    intended_use: 'research', // Payload stores only the message
    requested_scope: { scopes: ['resources:read'] },
    requested_days: 90,
    status: toDesignStatus(doc.status),
    submitted_at: doc.createdAt,
    created_at: doc.createdAt,
    updated_at: doc.updatedAt,
    resource: mockRepo.getResources().find((r) => r.id === resourceId),
    // Name only (never email); falls back to a neutral label if the applicant wasn't populated.
    requester: {
      ...DEMO_PROFILES.developer,
      id: `payload_user_${relId(doc.applicant)}`,
      handle: `user${relId(doc.applicant)}`,
      display_name: (typeof doc.applicant === 'object' && doc.applicant.display_name) || `user${relId(doc.applicant)}`,
    },
  };
}

const NOT_PAYLOAD = 'Access requests are only available for live resources.';
const numericId = (id: string, prefix: string) => (id.startsWith(prefix) ? Number(id.slice(prefix.length)) : NaN);

async function send(path: string, method: 'POST' | 'PATCH', body: unknown): Promise<string | null> {
  try {
    const res = await fetch(`${payloadBase()}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
    });
    return res.ok ? null : await errorMessage(res, 'Request failed');
  } catch {
    return 'Network error, please try again.';
  }
}

export async function submitRequest(resourceId: string, message: string): Promise<string | null> {
  const resource = numericId(resourceId, 'payload_');
  if (Number.isNaN(resource)) return NOT_PAYLOAD;
  return send('/access-requests', 'POST', { resource, message });
}

export async function decideRequest(
  requestId: string,
  decision: 'approved' | 'rejected',
  note: string
): Promise<string | null> {
  const id = numericId(requestId, 'payload_req_');
  if (Number.isNaN(id)) return NOT_PAYLOAD;
  return send(`/access-requests/${id}`, 'PATCH', {
    status: decision === 'rejected' ? 'denied' : 'approved',
    publisher_notes: note,
  });
}

// Live mode: the server already limits the set to my requests + those on my resources; split it per view.
export function requestsFor(all: AccessRequest[], view: 'mine' | 'inbound', myProfileId: string): AccessRequest[] {
  if (!isLive()) return all;
  return all.filter(
    (r) => r.id.startsWith('payload_req_') && (r.requester_profile_id === myProfileId) === (view === 'mine')
  );
}

// Needs a session; the server returns only my own requests plus those on my resources.
export async function hydrateRequests(): Promise<void> {
  if (!isLive()) return;
  try {
    const res = await fetch(`${payloadBase()}/access-requests?depth=1&limit=100&sort=-createdAt`, { credentials: 'include' });
    if (!res.ok) return mockRepo.setLiveRequests([]);
    const { docs } = (await res.json()) as { docs: PayloadRequestDoc[] };
    mockRepo.setLiveRequests(docs.map(toDesignRequest));
  } catch {
    // keep existing state
  }
}
