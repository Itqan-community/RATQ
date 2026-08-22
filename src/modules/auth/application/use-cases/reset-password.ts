import { resetPassword as resetPasswordRepo } from '../../infrastructure/payload-auth-repository';

export function resetPassword(token: string, password: string) {
  return resetPasswordRepo(token, password);
}
