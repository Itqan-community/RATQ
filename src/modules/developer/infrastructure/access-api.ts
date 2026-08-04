import { DATA_MODE, API_BASE } from '@/shared/infrastructure/data-mode';
import { getAccessToken } from '@/shared/infrastructure/token-storage';

// Currently unreferenced by any caller in the app (app/developer/access/page.tsx
// only calls the api-keys endpoints) - relocated as dead code, not wired up.

export async function inviteDeveloperByEmail(resourceSlug: string, email: string, scope: string) {
  if (DATA_MODE === 'mock') {
    return {
      id: Date.now(),
      email,
      resource_slug: resourceSlug,
      key: `ratq_live_${Math.random().toString(36).substring(2, 18)}`,
      scope,
    };
  }

  const res = await fetch(`${API_BASE}/api/v1/developer/resources/${resourceSlug}/invite/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAccessToken()}`,
    },
    body: JSON.stringify({ email, scope }),
  });
  if (!res.ok) throw new Error('Failed to send invite');
  return res.json();
}

export async function revokeDeveloperAccess(resourceSlug: string, userEmail: string) {
  if (DATA_MODE === 'mock') {
    return { success: true };
  }

  const res = await fetch(`${API_BASE}/api/v1/developer/resources/${resourceSlug}/access/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAccessToken()}`,
    },
    body: JSON.stringify({ email: userEmail }),
  });
  if (!res.ok) throw new Error('Failed to revoke access');
  return res.json();
}
