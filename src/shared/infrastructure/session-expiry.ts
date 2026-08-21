const SESSION_EXPIRED_EVENT = 'ratq:session-expired';

export const SESSION_EXPIRED_REASON = 'session_expired';

export function notifySessionExpired(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
}

export function subscribeToSessionExpiry(listener: () => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleSessionExpiry = () => listener();
  window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpiry);
  return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpiry);
}
