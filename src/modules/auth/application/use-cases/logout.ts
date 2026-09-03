import {  clearStoredUser } from '@/shared/infrastructure/token-storage';

export function logout() {
  clearStoredUser();
}
