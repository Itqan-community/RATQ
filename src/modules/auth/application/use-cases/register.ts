import { register as registerRepo } from '../../infrastructure/payload-auth-repository';

export function register(
  email: string,
  password: string,
  display_name: string,
  role?: 'developer' | 'publisher'
) {
  return registerRepo(email, password, display_name, role);
}
