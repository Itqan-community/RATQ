// Payload `notifications` <-> design NotificationItem. Notifications are server-created (access-request hooks);
// a recipient may only toggle `read`, and the server scopes reads/updates to their own.
import { errorMessage, isLive, payloadBase } from './payloadAuth';
import { mockRepo } from './supabase';
import type { NotificationItem } from '@/types';

interface PayloadNotificationDoc {
  id: number;
  type: string;
  message: string;
  resource_name?: string | null;
  recipient: number | { id: number };
  read?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export function toDesignNotification(doc: PayloadNotificationDoc): NotificationItem {
  const isAccess = doc.type.startsWith('access_');
  return {
    id: `payload_notif_${doc.id}`,
    profile_id: `payload_user_${typeof doc.recipient === 'object' ? doc.recipient.id : doc.recipient}`,
    kind: doc.type === 'access_approved' ? 'request_approved' : doc.type, // design icon key
    title_ar: doc.resource_name || doc.type,
    body_ar: doc.message,
    link_url: isAccess ? '/app/requests' : undefined,
    read_at: doc.read ? doc.updatedAt : undefined,
    created_at: doc.createdAt,
    priority: doc.type === 'access_revoked' ? 'high' : 'normal',
  };
}

async function patch(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ read: true }),
    });
    return res.ok ? null : await errorMessage(res, 'Request failed');
  } catch {
    return 'Network error, please try again.';
  }
}

export async function markNotificationRead(id: string): Promise<string | null> {
  const n = id.startsWith('payload_notif_') ? Number(id.slice('payload_notif_'.length)) : NaN;
  if (Number.isNaN(n)) return 'Not a live notification.';
  return patch(`${payloadBase()}/notifications/${n}`);
}

// One bulk update scoped to unread; the server limits it to the caller's own notifications.
export function markAllNotificationsRead(): Promise<string | null> {
  return patch(`${payloadBase()}/notifications?where[read][equals]=false`);
}

export async function hydrateNotifications(): Promise<void> {
  if (!isLive()) return;
  try {
    const res = await fetch(`${payloadBase()}/notifications?depth=0&limit=100&sort=-createdAt`, { credentials: 'include' });
    if (!res.ok) return mockRepo.setLiveNotifications([]);
    const { docs } = (await res.json()) as { docs: PayloadNotificationDoc[] };
    mockRepo.setLiveNotifications(docs.map(toDesignNotification));
  } catch {
    // keep existing state
  }
}
