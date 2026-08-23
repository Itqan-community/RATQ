'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { login as loginUseCase } from '@/modules/auth/application/use-cases/login';
import { register as registerUseCase } from '@/modules/auth/application/use-cases/register';
import { forgotPassword as forgotPasswordUseCase } from '@/modules/auth/application/use-cases/forgot-password';
import { resetPassword as resetPasswordUseCase } from '@/modules/auth/application/use-cases/reset-password';
import { verifyEmail as verifyEmailUseCase } from '@/modules/auth/application/use-cases/verify-email';
import { completeOAuth } from '@/modules/auth/application/use-cases/complete-oauth';
import { logout as logoutUseCase } from '@/modules/auth/application/use-cases/logout';
import { AuthToken } from '@/modules/auth/domain/auth-token';
import {
  getAccessToken,
  setAuthTokens,
  getStoredUser,
  setStoredUser,
} from '@/shared/infrastructure/token-storage';
import {
  SESSION_EXPIRED_REASON,
  subscribeToSessionExpiry,
} from '@/shared/infrastructure/session-expiry';
import type { User } from '@/types/resource';

// Discards a stale session up front instead of letting an expired token fail
// silently on the first authenticated API call (issue #165).
function getUserFromStorage(): User | null {
  const token = getAccessToken();
  if (!token) return null;
  if (AuthToken.from(token).isExpired()) {
    logoutUseCase();
    return null;
  }
  return getStoredUser();
}

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithToken: (token: string) => Promise<{ success: boolean; error?: string }>;
  register: (
    email: string,
    password: string,
    display_name: string,
    role?: 'developer' | 'publisher'
  ) => Promise<{ success: boolean; error?: string }>;
  forgotPassword: (email: string) => Promise<{success: boolean; error?: string}>;
  resetPassword: (token: string, password: string) => Promise<{ success: boolean; error?: string }>;
  verifyEmail: (token: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const logout = useCallback(() => {
    logoutUseCase();
    setUser(null);
  }, []);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- Restore browser-only auth state after hydration so the server and first client render match. */
    setUser(getUserFromStorage());
    setLoading(false);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(
    () =>
      subscribeToSessionExpiry(() => {
        logout();
        setError(SESSION_EXPIRED_REASON);
        router.replace('/login');
      }),
    [logout, router]
  );

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginUseCase(email, password);
      setAuthTokens(data.access, data.refresh);
      setStoredUser(data.user);
      setUser(data.user);
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const loginWithToken = useCallback(async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await completeOAuth(token);
      setAuthTokens(data.access, data.refresh);
      setStoredUser(data.user);
      setUser(data.user);
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(
    async (email: string, password: string, display_name: string, role?: 'developer' | 'publisher') => {
      setLoading(true);
      setError(null);
      try {
        const data = await registerUseCase(email, password, display_name, role);
        setAuthTokens(data.access, data.refresh);
        setStoredUser(data.user);
        setUser(data.user);
        return { success: true };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Registration failed';
        setError(message);
        return { success: false, error: message };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const forgotPassword = useCallback(async (email: string) => {
    setError(null);
    try {
      await forgotPasswordUseCase(email);
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Forgot password request failed';
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  const resetPassword = useCallback(async (token: string, password: string) => {
    setError(null);
    try {
      await resetPasswordUseCase(token, password);
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Reset password failed';
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  const verifyEmail = useCallback(async (token: string) => {
    setError(null);
    try {
      await verifyEmailUseCase(token);
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Email verification failed';
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        loginWithToken,
        register,
        logout,
        forgotPassword,
        resetPassword,
        verifyEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
