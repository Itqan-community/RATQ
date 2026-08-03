import { loginWithToken } from '../../infrastructure/payload-auth-repository';

export function completeOAuth(token: string) {
  return loginWithToken(token);
}
