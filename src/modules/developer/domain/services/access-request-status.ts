import type { AccessRequest, RequestStatus } from '@/types/resource';

// Mirrors payload-backend/src/collections/AccessRequests.ts's beforeChange
// hook: "once a request has been decided, its status is final - no
// re-opening and no switching between approved/denied." The pending-only
// gate is currently duplicated inline in RequestCard.tsx
// (`request.status === 'pending' && onApprove && onDeny`) - this is the
// single place that invariant should be read from. Display-correctness only;
// the backend hook is what actually enforces it.
export function isActionable(status: RequestStatus): boolean {
  return status === 'pending';
}

export function canApproveOrDeny(request: AccessRequest): boolean {
  return isActionable(request.status);
}
