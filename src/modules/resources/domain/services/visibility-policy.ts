// Defense-in-depth / display-correctness layer only. The real security
// enforcement for unauthenticated draft-resource reads and API-key-ownership
// lives server-side in payload-backend/src/collections/ (tracked as
// GitHub issues #151/#152) - this module must never be treated as a
// substitute for that backend fix.
//
// Report/AccessRequest visibility isn't modeled here: both types carry no
// owner id client-side (only reporter_name/applicant_name strings), and the
// real "mine only" scoping already happens entirely server-side via the
// Payload `where[...][equals]=userId` query params in
// reports-api.ts/access-requests-api.ts - there's nothing left to check
// client-side that isn't already enforced there, so no predicate is added
// for them here.

import type { Resource, User } from '@/types/resource';

// Called from get-resource.ts. Mirrors repositories/payload.ts's own
// list-time filter (`where[status][equals]=published`, see fetchPage) -
// published resources are visible to everyone, drafts only to a signed-in
// user. Resource carries no owner id client-side, so this can't be
// tightened to owner-only until that field exists (#151) - any
// authenticated user is treated as allowed to see a draft, matching the
// current absence of real client-side scoping.
export function canViewResource(resource: Resource, user: User | null): boolean {
  if (resource.status === 'published') return true;
  return user != null;
}
