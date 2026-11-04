// Owner-side resource CRUD against Payload `resources`. The server sets owner, slug and ignores privileged
// fields (itqan_badge is admin-only); delete is owner-only. New resources are created as DRAFT: Payload has no
// review step, so nothing unreviewed goes public from this UI.
import { errorMessage, payloadBase } from './payloadAuth';
import { toDesignResource, type PayloadResourceDoc } from './payloadResources';
import type { Resource } from '@/types';

// Mirrors payload-backend Resources.ts RESOURCE_TYPES.
const PAYLOAD_TYPES = [
  'library', 'sdk', 'dataset', 'api', 'tafsir', 'audio', 'pdf', 'json',
  'recitation', 'mushaf', 'program', 'linguistic', 'translation', 'font', 'search', 'tajweed',
];

export const toPayloadType = (t: string): string => (PAYLOAD_TYPES.includes(t) ? t : 'library');

interface WizardForm {
  title_ar: string;
  summary_ar: string;
  readme_ar: string;
  resource_type: string;
  license_spdx: string;
  version: string;
  repository_url: string;
}

export function toPayloadBody(f: WizardForm) {
  return {
    name: f.title_ar,
    type: toPayloadType(f.resource_type),
    short_description: f.summary_ar,
    description: f.readme_ar || f.summary_ar,
    license: f.license_spdx,
    version: f.version,
    ...(f.repository_url ? { github_url: f.repository_url } : {}),
    status: 'draft' as const,
  };
}

export async function createResource(f: WizardForm): Promise<string | null> {
  try {
    const res = await fetch(`${payloadBase()}/resources`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(toPayloadBody(f)),
    });
    return res.ok ? null : await errorMessage(res, 'Could not create resource');
  } catch {
    return 'Network error, please try again.';
  }
}

// Includes the owner's drafts (Payload read access allows owner or published).
export async function fetchMyResources(profileId: string): Promise<Resource[]> {
  const owner = profileId.startsWith('payload_user_') ? Number(profileId.slice('payload_user_'.length)) : NaN;
  if (Number.isNaN(owner)) return [];
  try {
    const res = await fetch(
      `${payloadBase()}/resources?where[owner][equals]=${owner}&depth=0&limit=100&sort=-createdAt`,
      { credentials: 'include' }
    );
    if (!res.ok) return [];
    const { docs } = (await res.json()) as { docs: PayloadResourceDoc[] };
    return docs.map(toDesignResource);
  } catch {
    return [];
  }
}

export async function deleteResource(resourceId: string): Promise<string | null> {
  const n = resourceId.startsWith('payload_') ? Number(resourceId.slice('payload_'.length)) : NaN;
  if (Number.isNaN(n)) return 'Only live resources can be deleted.';
  try {
    const res = await fetch(`${payloadBase()}/resources/${n}`, { method: 'DELETE', credentials: 'include' });
    return res.ok ? null : await errorMessage(res, 'Could not delete resource');
  } catch {
    return 'Network error, please try again.';
  }
}
