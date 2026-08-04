import { login as loginRepo } from '../../infrastructure/payload-auth-repository';

export function login(email: string, password: string) {
  return loginRepo(email, password);
}
