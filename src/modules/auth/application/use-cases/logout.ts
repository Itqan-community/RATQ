import { clearAuth, clearStoredUser } from '@/shared/infrastructure/token-storage';

export function logout() {
  clearAuth();
  clearStoredUser();
}
