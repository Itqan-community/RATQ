import type { Announcement } from '@/types/announcement';
import { DATA_MODE, API_BASE } from '@/shared/infrastructure/data-mode';
import { mockAnnouncements } from './mock-data';

export function fetchAnnouncements(): Promise<Announcement[]> {
  if (DATA_MODE === 'mock') {
    const now = new Date();
    return Promise.resolve(
      mockAnnouncements.filter((a) => {
        if (!a.is_active) return false;
        if (a.expires_at && new Date(a.expires_at) < now) return false;
        return true;
      })
    );
  }

  return fetch(`${API_BASE}/api/announcements/`).then((res) => {
    if (!res.ok) throw new Error('Failed to fetch announcements');
    return res.json();
  });
}
