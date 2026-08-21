import type { NotificationItem } from '@/types/resource';
import { getAccessToken, getCurrentUserId } from '@/shared/infrastructure/token-storage';
import { payloadErrorMessage } from '@/shared/infrastructure/payload-error';
import { PAYLOAD_API_BASE } from '@/shared/infrastructure/payload-config';

interface PayloadNotificationDoc {
  id: number;
  type: NotificationItem['type'];
  message: string;
  resource_name: string;
  read: boolean;
  createdAt: string;
}

function toNotificationItem(doc: PayloadNotificationDoc): NotificationItem {
  return {
    id: doc.id,
    type: doc.type,
    message: doc.message,
    resource_name: doc.resource_name,
    created_at: doc.createdAt,
    read: doc.read,
  };
}

export async function fetchDeveloperNotifications(): Promise<NotificationItem[]> {
  const userId = getCurrentUserId();
  if (!userId) return [];

  const res = await fetch(
    `${PAYLOAD_API_BASE}/notifications?where[recipient][equals]=${userId}&sort=-createdAt&depth=0&limit=100`,
    { headers: { Authorization: `JWT ${getAccessToken()}` } }
  );
  if (!res.ok) throw new Error('Failed to fetch notifications');
  const data: { docs: PayloadNotificationDoc[] } = await res.json();
  return data.docs.map(toNotificationItem);
}

export async function markNotificationAsRead(notificationId: number) {
  const res = await fetch(`${PAYLOAD_API_BASE}/notifications/${notificationId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${getAccessToken()}`,
    },
    body: JSON.stringify({ read: true }),
  });
  if (!res.ok) {
    throw new Error(
      await payloadErrorMessage(res, 'Failed to mark notification as read', {
        authenticated: true,
      })
    );
  }
  return res.json();
}

export async function markAllNotificationsAsRead() {
  const userId = getCurrentUserId();
  if (!userId) return { success: true };

  const res = await fetch(
    `${PAYLOAD_API_BASE}/notifications?where[recipient][equals]=${userId}&where[read][equals]=false`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${getAccessToken()}`,
      },
      body: JSON.stringify({ read: true }),
    }
  );
  if (!res.ok) {
    throw new Error(
      await payloadErrorMessage(res, 'Failed to mark all notifications as read', {
        authenticated: true,
      })
    );
  }
  return res.json();
}
