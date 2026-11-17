import { hydrateRequests } from './payloadRequests';
import { hydrateKeys } from './payloadKeys';
import { hydrateNotifications } from './payloadNotifications';
import { mockRepo } from './supabase';

// Per-user lists live in the mock repo; load them for the session that just started...
// allSettled: a failing list must never turn a successful login into a failed one.
export const hydrateUserData = (): Promise<unknown> => Promise.allSettled([hydrateRequests(), hydrateKeys(), hydrateNotifications()]);

// ...and drop them on logout so the next sign-in in the same tab never sees the previous user's rows.
export function clearUserData(): void {
  mockRepo.setLiveRequests([]);
  mockRepo.setLiveKeys([]);
  mockRepo.setLiveNotifications([]);
}
