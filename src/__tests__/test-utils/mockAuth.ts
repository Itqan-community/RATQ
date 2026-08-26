import { vi } from 'vitest';

import type { useAuth } from '@/hooks/useAuth';

export function createMockAuthContext(
  overrides?: Partial<ReturnType<typeof useAuth>>
): ReturnType<typeof useAuth> {
  return {
    user: null,
    loading: false,
    error: null,
    clearError: vi.fn(),
    login: vi.fn(),
    loginWithToken: vi.fn(),
    register: vi.fn(),
    forgotPassword: vi.fn(),
    resetPassword: vi.fn(),
    verifyEmail: vi.fn(),
    logout: vi.fn(),
    ...overrides,
  };
}