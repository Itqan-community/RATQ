// Tiny event bus: the Payload error helper raises it, the auth store listens. Mirrors live's session-expiry.ts.
const SESSION_EXPIRED_EVENT = 'qtd:session-expired';

export function notifySessionExpired(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
}

export function subscribeToSessionExpiry(listener: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(SESSION_EXPIRED_EVENT, listener);
  return () => window.removeEventListener(SESSION_EXPIRED_EVENT, listener);
}
