// Single source of truth for the Payload REST API base used by the
// application layer (auth, comments, access-requests, reports, api-keys,
// developer resource CRUD). repositories/payload.ts intentionally keeps its
// own separate copy - it's the resource repository's own encapsulated
// detail, not part of this shared surface.
export const PAYLOAD_API_BASE =
  process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 'https://api.ratq.itqan.dev/api';
