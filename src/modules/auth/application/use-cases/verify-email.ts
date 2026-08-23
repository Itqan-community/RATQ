import { verifyEmail as verifyEmailRepo } from '../../infrastructure/payload-auth-repository';

export function verifyEmail(token: string) {
  return verifyEmailRepo(token);
}
