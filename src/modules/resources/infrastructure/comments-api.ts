import type { Comment, CommentWithResource } from '@/types/resource';
import { getCurrentUserId } from '@/shared/infrastructure/token-storage';
import { payloadErrorMessage } from '@/shared/infrastructure/payload-error';
import { PAYLOAD_API_BASE } from '@/shared/infrastructure/payload-config';

// Only payload-sourced resources have a real backing doc to comment on - the
// caller passes the aggregator-facing id (200_000 + payload id, see
// repositories/payload.ts toResource), undone here the same way
// updateDeveloperResource/deleteDeveloperResource already do.

interface PayloadCommentDoc {
  id: number;
  content: string;
  createdAt: string;
  author_name: string;
  resource?: number | { id: number; name: string };
}

function toComment(doc: PayloadCommentDoc): Comment {
  return { id: doc.id, author_name: doc.author_name, content: doc.content, created_at: doc.createdAt };
}

function toCommentWithResource(doc: PayloadCommentDoc): CommentWithResource {
  const resourceName = typeof doc.resource === 'object' ? doc.resource.name : 'Unknown';
  return { comment: toComment(doc), resource_name: resourceName };
}

export async function fetchComments(resourceId: number): Promise<Comment[]> {
  const res = await fetch(
    `${PAYLOAD_API_BASE}/comments?where[resource][equals]=${resourceId - 200_000}&sort=-createdAt&limit=100`,
    { credentials: 'include' }
  );
  if (!res.ok) throw new Error('Failed to fetch comments');
  const data: { docs: PayloadCommentDoc[] } = await res.json();
  return data.docs.map(toComment);
}

export async function postComment(resourceId: number, content: string): Promise<Comment> {
  const res = await fetch(`${PAYLOAD_API_BASE}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({ content, resource: resourceId - 200_000 }),
  });
  if (!res.ok) {
    throw new Error(
      await payloadErrorMessage(res, 'Failed to post comment', { authenticated: true })
    );
  }
  const result: { doc: PayloadCommentDoc } = await res.json();
  return toComment(result.doc);
}

export async function fetchMyComments(): Promise<CommentWithResource[]> {
  const userId = getCurrentUserId();
  if (!userId) return [];

  const res = await fetch(
    `${PAYLOAD_API_BASE}/comments?where[author][equals]=${userId}&sort=-createdAt&depth=1&limit=100`,
    { credentials: 'include' }
  );
  if (!res.ok) throw new Error('Failed to fetch comments');
  const data: { docs: PayloadCommentDoc[] } = await res.json();
  return data.docs.map(toCommentWithResource);
}
