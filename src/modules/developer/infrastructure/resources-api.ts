import type { Resource, ResourceType } from '@/types/resource';
import { payloadErrorMessage } from '@/shared/infrastructure/payload-error';
import { getAccessToken } from '@/shared/infrastructure/token-storage';
import { toResource, type PayloadResourceDoc } from '@/shared/infrastructure/payload-resource-mapper';
import { PAYLOAD_API_BASE } from '@/shared/infrastructure/payload-config';

// list/create always hit the real Payload backend (like auth) - these back
// the dashboard's "my resources" + publish flow, independent of DATA_MODE.

export async function fetchDeveloperResources(userId: number): Promise<Resource[]> {
  const res = await fetch(
    `${PAYLOAD_API_BASE}/resources?where[owner][equals]=${userId}&limit=100`,
    { headers: { Authorization: `JWT ${getAccessToken()}` } }
  );
  if (!res.ok) throw new Error('Failed to fetch developer resources');
  const data: { docs: PayloadResourceDoc[] } = await res.json();
  return data.docs.map(toResource);
}

export interface CreateResourceInput {
  name: string;
  type: ResourceType;
  short_description: string;
  description: string;
  license: string;
  github_url: string;
  documentation_url: string;
  status: 'draft' | 'published';
}

export async function createDeveloperResource(data: CreateResourceInput): Promise<Resource> {
  const res = await fetch(`${PAYLOAD_API_BASE}/resources`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${getAccessToken()}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await payloadErrorMessage(res, 'Failed to publish resource'));
  const result: { doc: PayloadResourceDoc } = await res.json();
  return toResource(result.doc);
}

// id is the aggregator-facing id (200_000 + raw Payload id, see
// repositories/payload.ts toResource) - undo the offset to hit the real
// Payload doc.
export type UpdateResourceInput = Omit<CreateResourceInput, 'status'>;

export async function updateDeveloperResource(id: number, data: UpdateResourceInput): Promise<Resource> {
  const res = await fetch(`${PAYLOAD_API_BASE}/resources/${id - 200_000}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${getAccessToken()}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await payloadErrorMessage(res, 'Failed to update resource'));
  const result: { doc: PayloadResourceDoc } = await res.json();
  return toResource(result.doc);
}

export async function deleteDeveloperResource(id: number) {
  const res = await fetch(`${PAYLOAD_API_BASE}/resources/${id - 200_000}`, {
    method: 'DELETE',
    headers: { Authorization: `JWT ${getAccessToken()}` },
  });
  if (!res.ok) throw new Error(await payloadErrorMessage(res, 'Failed to delete resource'));
  return res.json();
}
