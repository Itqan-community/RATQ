// Payload `comments` <-> design Review. Payload comments have no rating (rating = 0, hidden in live mode).
// author / author_name are server-set; only the author (or admin) may delete, enforced server-side.
import { DEMO_PROFILES } from './mockData';
import { errorMessage, payloadBase } from './payloadAuth';
import type { Review } from '@/types';

interface PayloadCommentDoc {
  id: number;
  content: string;
  author: number | { id: number };
  author_name: string;
  resource: number | { id: number; name?: string };
  createdAt: string;
}

const relId = (r: number | { id: number }) => (typeof r === 'object' ? r.id : r);
const liveResourceId = (id: string) => (id.startsWith('payload_') ? Number(id.slice('payload_'.length)) : NaN);
const NOT_LIVE = 'Comments are only available for live resources.';

export function toDesignReview(doc: PayloadCommentDoc): Review {
  const authorId = relId(doc.author);
  return {
    id: `payload_comment_${doc.id}`,
    resource_id: `payload_${relId(doc.resource)}`,
    profile_id: `payload_user_${authorId}`,
    rating: 0,
    body_ar: doc.content,
    status: 'published',
    helpful_count: 0,
    created_at: doc.createdAt,
    profile: { ...DEMO_PROFILES.developer, id: `payload_user_${authorId}`, display_name: doc.author_name },
  };
}

export async function fetchComments(resourceId: string): Promise<Review[]> {
  const n = liveResourceId(resourceId);
  if (Number.isNaN(n)) return [];
  try {
    const res = await fetch(
      `${payloadBase()}/comments?where[resource][equals]=${n}&sort=-createdAt&limit=100&depth=0`,
      { credentials: 'include' }
    );
    if (!res.ok) return [];
    const { docs } = (await res.json()) as { docs: PayloadCommentDoc[] };
    return docs.map(toDesignReview);
  } catch {
    return [];
  }
}

// Every comment I wrote, newest first, with the resource name (depth=1) so the list can say where it was posted.
export async function fetchMyComments(profileId: string): Promise<{ review: Review; resourceName?: string }[]> {
  const me = /^payload_user_(\d+)$/.exec(profileId);
  if (!me) return [];
  try {
    const res = await fetch(
      `${payloadBase()}/comments?where[author][equals]=${me[1]}&sort=-createdAt&depth=1&limit=100`,
      { credentials: 'include' }
    );
    if (!res.ok) return [];
    const { docs } = (await res.json()) as { docs: PayloadCommentDoc[] };
    return docs.map((d) => ({ review: toDesignReview(d), resourceName: typeof d.resource === 'object' ? d.resource.name : undefined }));
  } catch {
    return [];
  }
}

export async function postComment(resourceId: string, content: string): Promise<string | null> {
  const resource = liveResourceId(resourceId);
  if (Number.isNaN(resource)) return NOT_LIVE;
  try {
    const res = await fetch(`${payloadBase()}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ resource, content }),
    });
    return res.ok ? null : await errorMessage(res, 'Could not post comment', { authenticated: true });
  } catch {
    return 'Network error, please try again.';
  }
}

export async function deleteComment(commentId: string): Promise<string | null> {
  const n = commentId.startsWith('payload_comment_') ? Number(commentId.slice('payload_comment_'.length)) : NaN;
  if (Number.isNaN(n)) return NOT_LIVE;
  try {
    const res = await fetch(`${payloadBase()}/comments/${n}`, { method: 'DELETE', credentials: 'include' });
    return res.ok ? null : await errorMessage(res, 'Could not delete comment', { authenticated: true });
  } catch {
    return 'Network error, please try again.';
  }
}
