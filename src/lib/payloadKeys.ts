// Payload `api-keys` <-> design ApiKey. The server generates the secret, stores only its hash + prefix, returns the
// full key exactly once on create, and enforces ownership / approved-request rules. Nothing secret is ever kept here.
import { errorMessage, isLive, payloadBase } from './payloadAuth';
import { mockRepo } from './supabase';
import type { ApiKey } from '@/types';

interface PayloadKeyDoc {
  id: number;
  name: string;
  resource: number | { id: number; name?: string };
  key_prefix: string;
  scope: string;
  createdAt: string;
}

const relId = (r: PayloadKeyDoc['resource']) => (typeof r === 'object' ? r.id : r);

export function toDesignKey(doc: PayloadKeyDoc): ApiKey {
  const resource_id = `payload_${relId(doc.resource)}`;
  return {
    id: `payload_key_${doc.id}`,
    resource_id,
    owner_profile_id: '',
    name_ar: doc.name,
    key_prefix: doc.key_prefix.replace(/^ratq_live_/, ''),
    scopes: doc.scope.split(','),
    rate_limit_per_hour: 0, // not enforced/tracked by Payload
    rate_limit_per_day: 0,
    status: 'active', // a key that exists is active; revoking deletes it
    expires_at: '', // Payload keys do not expire
    usage_count: 0,
    created_at: doc.createdAt,
    resource_title_ar: mockRepo.getResources().find((r) => r.id === resource_id)?.title_ar,
  };
}

const NOT_PAYLOAD = 'API keys are only available for live resources.';
const numericId = (id: string, prefix: string) => (id.startsWith(prefix) ? Number(id.slice(prefix.length)) : NaN);

export async function createKey(resourceId: string, name: string): Promise<{ key: string | null; error: string | null }> {
  const resource = numericId(resourceId, 'payload_');
  if (Number.isNaN(resource)) return { key: null, error: NOT_PAYLOAD };
  try {
    const res = await fetch(`${payloadBase()}/api-keys`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, resource, scope: 'read' }),
    });
    if (!res.ok) return { key: null, error: await errorMessage(res, 'Could not create key') };
    return { key: (await res.json()).doc?.key ?? null, error: null };
  } catch {
    return { key: null, error: 'Network error, please try again.' };
  }
}

export async function revokeKey(keyId: string): Promise<string | null> {
  const id = numericId(keyId, 'payload_key_');
  if (Number.isNaN(id)) return NOT_PAYLOAD;
  try {
    const res = await fetch(`${payloadBase()}/api-keys/${id}`, { method: 'DELETE', credentials: 'include' });
    return res.ok ? null : await errorMessage(res, 'Could not revoke key');
  } catch {
    return 'Network error, please try again.';
  }
}

// Payload has no rotate. Create the replacement first so a failure never leaves the user without a working key.
export async function rotateKey(
  keyId: string,
  resourceId: string,
  name: string
): Promise<{ key: string | null; error: string | null }> {
  const created = await createKey(resourceId, name);
  if (!created.key) return created;
  return { key: created.key, error: await revokeKey(keyId) };
}

// Server returns only the signed-in user's keys.
export async function hydrateKeys(): Promise<void> {
  if (!isLive()) return;
  try {
    const res = await fetch(`${payloadBase()}/api-keys?depth=0&limit=100&sort=-createdAt`, { credentials: 'include' });
    if (!res.ok) return mockRepo.setLiveKeys([]);
    const { docs } = (await res.json()) as { docs: PayloadKeyDoc[] };
    mockRepo.setLiveKeys(docs.map(toDesignKey));
  } catch {
    // keep existing state
  }
}
