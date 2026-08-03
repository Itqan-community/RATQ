import { fetchDeveloperNotifications } from '../../infrastructure/notifications-api';

export function listNotifications() {
  return fetchDeveloperNotifications();
}
