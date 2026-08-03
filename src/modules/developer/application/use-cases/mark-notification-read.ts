import { markNotificationAsRead } from '../../infrastructure/notifications-api';

export function markNotificationRead(notificationId: number) {
  return markNotificationAsRead(notificationId);
}
