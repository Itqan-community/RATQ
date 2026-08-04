import { revokeDeveloperAccess } from '../../infrastructure/access-api';

export function revokeAccess(resourceSlug: string, userEmail: string) {
  return revokeDeveloperAccess(resourceSlug, userEmail);
}
