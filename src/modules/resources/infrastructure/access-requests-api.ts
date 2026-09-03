import type { AccessRequest, RequestStatus, updatableStatus } from "@/types/resource";
import { getCurrentUserId } from "@/shared/infrastructure/token-storage";
import { payloadErrorMessage } from "@/shared/infrastructure/payload-error";
import { PAYLOAD_API_BASE } from "@/shared/infrastructure/payload-config";

// Only payload-sourced resources have a real backing doc - resourceId is the
// aggregator-facing id, undone the same way comments-api.ts does.

interface PayloadAccessRequestDoc {
  id: number;
  status: RequestStatus;
  message: string;
  publisher_notes?: string | null;
  createdAt: string;
  updatedAt: string;
  applicant:
    | number
    | { id: number; display_name?: string | null; email: string };
  resource: number | { id: number; slug: string; name: string; owner: number };
}

function toAccessRequest(doc: PayloadAccessRequestDoc): AccessRequest {
  const applicantName =
    typeof doc.applicant === "object"
      ? doc.applicant.display_name || doc.applicant.email
      : "Unknown";
  const resourceSlug =
    typeof doc.resource === "object"
      ? `payload-${doc.resource.slug}`
      : String(doc.resource);
  const resourceName =
    typeof doc.resource === "object" ? doc.resource.name : "";
    const resourceOwnerId =
    typeof doc.resource === "object" ? doc.resource.owner : -1;
  return {
    id: doc.id,
    applicant_name: applicantName,
    applicant_display_name: applicantName,
    resource_owner_id: resourceOwnerId,
    resource_slug: resourceSlug,
    resource_name: resourceName,
    status: doc.status,
    message: doc.message,
    publisher_notes: doc.publisher_notes,
    created_at: doc.createdAt,
    updated_at: doc.updatedAt,
  };
}

export async function submitAccessRequest(
  resourceId: number,
  message: string,
): Promise<AccessRequest> {
  const res = await fetch(`${PAYLOAD_API_BASE}/access-requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify({ resource: resourceId - 200_000, message }),
  });
  if (!res.ok) {
    throw new Error(
      await payloadErrorMessage(res, "Failed to submit request", {
        authenticated: true,
      }),
    );
  }
  const result: { doc: PayloadAccessRequestDoc } = await res.json();
  return toAccessRequest(result.doc);
}

export async function fetchMyRequests(): Promise<AccessRequest[]> {
  const userId = getCurrentUserId();
  if (!userId) return [];

  const res = await fetch(
    `${PAYLOAD_API_BASE}/access-requests?where[applicant][equals]=${userId}&sort=-createdAt&depth=1&limit=100`,
    { credentials: 'include' }
  );
  if (!res.ok) throw new Error("Failed to fetch requests");
  const data: { docs: PayloadAccessRequestDoc[] } = await res.json();
  return data.docs.map(toAccessRequest);
}






// Everyone with live access to a resource, for the publisher's access-management
// tab. Ownership is not filtered here on purpose: canReadAccessRequest already
// scopes reads to `applicant = me OR resource.owner = me`, so a publisher gets
// every approved request on their own resource and a non-owner only ever sees
// their own. Revoked requests are excluded rather than shown greyed out - the
// tab answers "who has access", and a revoked row is a past state, still
// readable through the requests list.
// The 100 cap matches every other list query in the app (api-keys, resources,
// comments). `total` comes back alongside so the UI can say when it is showing
// a truncated list rather than quietly implying that is everyone.
export const RESOURCE_ACCESS_PAGE_SIZE = 100;

export async function fetchResourceAccessGrants(
  resourceId: number,
): Promise<{ grants: AccessRequest[]; total: number }> {
  const res = await fetch(
    `${PAYLOAD_API_BASE}/access-requests?where[resource][equals]=${resourceId - 200_000}&where[status][equals]=approved&sort=-updatedAt&depth=1&limit=${RESOURCE_ACCESS_PAGE_SIZE}`,
    { credentials: 'include' },
  );
  if (!res.ok) throw new Error("Failed to fetch resource access");
  const data: { docs: PayloadAccessRequestDoc[]; totalDocs: number } = await res.json();
  return { grants: data.docs.map(toAccessRequest), total: data.totalDocs };
}

type updateAccessRequestType = {
  status: updatableStatus;
};

async function patchAccessRequestStatus(
  id: number,
  status: RequestStatus,
  failureMessage: string,
): Promise<AccessRequest> {
  const res = await fetch(`${PAYLOAD_API_BASE}/access-requests/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    throw new Error(
      await payloadErrorMessage(res, failureMessage, {
        authenticated: true,
      }),
    );
  }
  const result: { doc: PayloadAccessRequestDoc } = await res.json();
  return toAccessRequest(result.doc);
}

export async function fetchUpdateAccessRequest(
  id: number,
  data: updateAccessRequestType,
): Promise<AccessRequest> {
  return patchAccessRequestStatus(id, data.status, "Failed to update access request");
}

// Kept separate from fetchUpdateAccessRequest rather than widening
// updatableStatus: approving/denying decides a pending request, revoking
// withdraws access already granted. The backend enforces that difference too -
// only approved -> revoked is permitted.
export async function fetchRevokeAccessRequest(id: number): Promise<AccessRequest> {
  return patchAccessRequestStatus(id, "revoked", "Failed to revoke access");
}
