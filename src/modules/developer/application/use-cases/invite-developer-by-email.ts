import { inviteDeveloperByEmail } from '../../infrastructure/access-api';

export function inviteByEmail(resourceSlug: string, email: string, scope: string) {
  return inviteDeveloperByEmail(resourceSlug, email, scope);
}
