// UI-level route guard for live mode. This is UX only: Payload enforces real access server-side.
// Payload has only developer | publisher | admin, so review/moderation (design-only portals) are admin-only.
import { isLive } from './payloadAuth';
import type { UserRole } from '@/types';

export type Portal = 'app' | 'publisher' | 'review' | 'moderation' | 'admin';

const ALLOWED: Record<Portal, UserRole[] | 'any'> = {
  app: 'any',
  publisher: 'any', // mirrors live /developer/*: login only; Payload scopes data to resources the user owns
  review: ['admin'],
  moderation: ['admin'],
  admin: ['admin'],
};

export function portalAccess(portal: Portal, role: UserRole, isAuthenticated: boolean): 'allow' | 'sign-in' | 'forbidden' {
  if (!isLive()) return 'allow'; // mock mode: demo stays explorable
  if (!isAuthenticated || role === 'guest') return 'sign-in';
  const allowed = ALLOWED[portal];
  return allowed === 'any' || allowed.includes(role) ? 'allow' : 'forbidden';
}
