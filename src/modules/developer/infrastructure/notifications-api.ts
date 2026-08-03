import type { NotificationItem } from '@/types/resource';
import { DATA_MODE, API_BASE } from '@/shared/infrastructure/data-mode';
import { getAccessToken } from '@/shared/infrastructure/token-storage';
import { mockDeveloperNotifications } from './mock-data';

export async function fetchDeveloperNotifications(): Promise<NotificationItem[]> {
  if (DATA_MODE === 'mock') {
    return mockDeveloperNotifications;
  }

  const res = await fetch(`${API_BASE}/api/v1/developer/notifications/`, {
    headers: { Authorization: `Bearer ${getAccessToken()}` },
  });
  if (!res.ok) throw new Error('Failed to fetch notifications');
  return res.json();
}

export async function markNotificationAsRead(notificationId: number) {
  if (DATA_MODE === 'mock') {
    return { success: true };
  }

  const res = await fetch(`${API_BASE}/api/v1/developer/notifications/${notificationId}/read/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });
  if (!res.ok) throw new Error('Failed to mark notification as read');
  return res.json();
}

export async function markAllNotificationsAsRead() {
  if (DATA_MODE === 'mock') {
    return { success: true };
  }

  const res = await fetch(`${API_BASE}/api/v1/developer/notifications/read-all/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });
  if (!res.ok) throw new Error('Failed to mark all notifications as read');
  return res.json();
}
