// Owner-side resource CRUD against Payload `resources`. The server sets owner, slug and ignores privileged
// fields (itqan_badge is admin-only); delete is owner-only. New resources are created as DRAFT: Payload has no
// review step, so nothing unreviewed goes public from this UI.
import { errorMessage, payloadBase } from './payloadAuth';
import { isHttpUrl, toDesignResource, type PayloadResourceDoc } from './payloadResources';
import type { Resource } from '@/types';

// Mirrors payload-backend Resources.ts RESOURCE_TYPES.
export const PAYLOAD_TYPES = [
  'library', 'sdk', 'dataset', 'api', 'tafsir', 'audio', 'pdf', 'json',
  'recitation', 'mushaf', 'program', 'linguistic', 'translation', 'font', 'search', 'tajweed',
];

export const toPayloadType = (t: string): string => (PAYLOAD_TYPES.includes(t) ? t : 'library');

export interface WizardForm {
  title_ar: string;
  summary_ar: string;
  readme_ar: string;
  resource_type: string;
  license_spdx: string;
  version: string;
  repository_url: string;
  documentation_url?: string;
  website_url?: string;
}

export type ResourceStatus = 'draft' | 'published' | 'archived';

// Archived must pass through draft before going public again.
const TRANSITIONS: Record<ResourceStatus, ResourceStatus[]> = {
  draft: ['published', 'archived'],
  published: ['draft', 'archived'],
  archived: ['draft'],
};

export const canTransition = (from: ResourceStatus, to: ResourceStatus): boolean =>
  TRANSITIONS[from]?.includes(to) ?? false;

export { isHttpUrl };

// Strict digits only: Number('') is 0 and Number('1e2'), Number(' 7') parse, which would hit the wrong resource.
const liveId = (resourceId: string): number => {
  const m = /^payload_(\d+)$/.exec(resourceId);
  return m ? Number(m[1]) : NaN;
};

const NET_ERR = 'Network error, please try again.';

export function toPayloadBody(f: WizardForm) {
  return {
    name: f.title_ar,
    type: toPayloadType(f.resource_type),
    short_description: f.summary_ar,
    description: f.readme_ar || f.summary_ar,
    license: f.license_spdx,
    version: f.version,
    ...(f.repository_url ? { github_url: f.repository_url } : {}),
    ...(f.documentation_url ? { documentation_url: f.documentation_url } : {}),
    ...(f.website_url ? { website_url: f.website_url } : {}),
    status: 'draft' as const,
  };
}

// Edit body: never carries status (changed only via setResourceStatus), owner, slug or itqan_badge.
// Empty URL -> null clears it; image undefined = unchanged, null = remove.
export function toPayloadPatch(f: WizardForm, imageId?: number | null) {
  return {
    name: f.title_ar,
    // Unknown (legacy) type: leave it unchanged rather than silently retyping to library.
    ...(PAYLOAD_TYPES.includes(f.resource_type) ? { type: f.resource_type } : {}),
    short_description: f.summary_ar,
    description: f.readme_ar || f.summary_ar,
    license: f.license_spdx,
    version: f.version,
    github_url: f.repository_url || null,
    documentation_url: f.documentation_url || null,
    website_url: f.website_url || null,
    ...(imageId !== undefined ? { image: imageId } : {}),
  };
}

async function patch(resourceId: string, body: unknown, fallback: string): Promise<string | null> {
  const n = liveId(resourceId);
  if (Number.isNaN(n)) return 'Only live resources can be edited.';
  try {
    const res = await fetch(`${payloadBase()}/resources/${n}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
    });
    return res.ok ? null : await errorMessage(res, fallback);
  } catch {
    return NET_ERR;
  }
}

export async function setResourceStatus(resourceId: string, from: ResourceStatus, to: ResourceStatus): Promise<string | null> {
  if (!canTransition(from, to)) return `Cannot change status from ${from} to ${to}.`;
  return patch(resourceId, { status: to }, 'Could not change status');
}

export async function updateResource(resourceId: string, f: WizardForm, imageId?: number | null): Promise<string | null> {
  if (badUrl(f)) return URL_ERR;
  return patch(resourceId, toPayloadPatch(f, imageId), 'Could not update resource');
}

// Mirrors payload-backend Media.ts mimeTypes (SVG deliberately excluded).
const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];

// Media.alt is required server-side, so the caller passes the resource name.
export async function uploadCoverImage(file: File, alt: string): Promise<{ id: number | null; error: string | null }> {
  if (!IMAGE_TYPES.includes(file.type)) return { id: null, error: 'Cover must be a PNG, JPEG, GIF or WebP image.' };
  if (!alt.trim()) return { id: null, error: 'Add a name before uploading a cover.' };
  const body = new FormData();
  body.append('file', file);
  // Payload reads multipart data only from `_payload`; a plain `alt` field is ignored and Media.alt is required.
  body.append('_payload', JSON.stringify({ alt: alt.trim() }));
  try {
    // No Content-Type header: the browser sets the multipart boundary.
    const res = await fetch(`${payloadBase()}/media`, { method: 'POST', credentials: 'include', body });
    if (!res.ok) return { id: null, error: await errorMessage(res, 'Could not upload image') };
    const id = (await res.json())?.doc?.id;
    return typeof id === 'number' ? { id, error: null } : { id: null, error: 'Could not upload image' };
  } catch {
    return { id: null, error: NET_ERR };
  }
}

const badUrl = (f: WizardForm) =>
  [f.repository_url, f.documentation_url, f.website_url].some((u) => u && !isHttpUrl(u));
const URL_ERR = 'Links must start with http:// or https://.';

export async function createResource(f: WizardForm, imageId?: number): Promise<string | null> {
  if (badUrl(f)) return URL_ERR;
  try {
    const res = await fetch(`${payloadBase()}/resources`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ ...toPayloadBody(f), ...(imageId !== undefined ? { image: imageId } : {}) }),
    });
    return res.ok ? null : await errorMessage(res, 'Could not create resource');
  } catch {
    return 'Network error, please try again.';
  }
}

// Single resource for the edit form (the server's read access still applies; saving is owner-only).
export interface EditableResource {
  resource: Resource | null;
  form: WizardForm | null;
  error: string | null;
}

// Form values come from the RAW doc, not the design mapper: the mapper drops non-http(s) links, and a blank
// field would then be PATCHed as null, silently erasing a stored legacy link.
export function docToForm(doc: PayloadResourceDoc): WizardForm {
  return {
    title_ar: doc.name, summary_ar: doc.short_description, readme_ar: doc.description,
    resource_type: doc.type, license_spdx: doc.license, version: doc.version ?? '',
    repository_url: doc.github_url ?? '', documentation_url: doc.documentation_url ?? '', website_url: doc.website_url ?? '',
  };
}

const NOT_FOUND: EditableResource = { resource: null, form: null, error: 'Resource not found.' };

// Edit-form loader. Only the owner gets a form (save is owner-only server-side; this avoids a dead-end form for others).
export async function fetchResourceById(resourceId: string, ownerProfileId: string): Promise<EditableResource> {
  const n = liveId(resourceId);
  const me = /^payload_user_(\d+)$/.exec(ownerProfileId);
  if (Number.isNaN(n) || !me) return NOT_FOUND;
  try {
    const res = await fetch(`${payloadBase()}/resources/${n}?depth=0`, { credentials: 'include' });
    if (res.status === 404 || res.status === 403) return NOT_FOUND;
    if (!res.ok) return { resource: null, form: null, error: await errorMessage(res, 'Could not load resource') };
    const doc = (await res.json()) as PayloadResourceDoc & { owner?: number | { id: number } };
    const ownerId = typeof doc.owner === 'object' && doc.owner ? doc.owner.id : doc.owner;
    if (ownerId !== Number(me[1])) return NOT_FOUND;
    return { resource: toDesignResource(doc), form: docToForm(doc), error: null };
  } catch {
    return { resource: null, form: null, error: NET_ERR };
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
  const n = liveId(resourceId);
  if (Number.isNaN(n)) return 'Only live resources can be deleted.';
  try {
    const res = await fetch(`${payloadBase()}/resources/${n}`, { method: 'DELETE', credentials: 'include' });
    return res.ok ? null : await errorMessage(res, 'Could not delete resource');
  } catch {
    return 'Network error, please try again.';
  }
}
