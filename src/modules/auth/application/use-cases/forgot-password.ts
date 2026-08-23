import { forgotPassword as forgotPasswordRepo } from '../../infrastructure/payload-auth-repository';

export function forgotPassword(email: string) {
  return forgotPasswordRepo(email);
}