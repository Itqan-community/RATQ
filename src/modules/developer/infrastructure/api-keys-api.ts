import type { APIKey } from '@/types/resource';
import { payloadErrorMessage } from '@/shared/infrastructure/payload-error';
import { getAccessToken, getCurrentUserId } from '@/shared/infrastructure/token-storage';
import { PAYLOAD_API_BASE } from '@/shared/infrastructure/payload-config';

// resourceId is the aggregator-facing id, undone the same way comments-api.ts
// does. keyId is a real Payload api-keys doc id (not offset - these records
// are only ever listed/managed via this dashboard, never aggregated).

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

export async function fetchDeveloperAPIKeys(): Promise<APIKey[]> {
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

export async function createDeveloperApiKey(resourceId: number, scope: string, name?: string): Promise<APIKey> {
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

export async function revokeDeveloperApiKey(keyId: number) {
  const res = await fetch(`${PAYLOAD_API_BASE}/api-keys/${keyId}`, {
    method: 'DELETE',
    headers: { Authorization: `JWT ${getAccessToken()}` },
  });
  if (!res.ok) throw new Error(await payloadErrorMessage(res, 'Failed to revoke API key'));
  return res.json();
}
