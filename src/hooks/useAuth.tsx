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
import {
  setStoredUser,
} from '@/shared/infrastructure/token-storage';
import {
  SESSION_EXPIRED_REASON,
  subscribeToSessionExpiry,
} from '@/shared/infrastructure/session-expiry';
import type { User } from '@/types/resource';
import {
  fetchUserDetails,
  logout as logoutRequest,
} from '@/modules/auth/infrastructure/payload-auth-repository';

// Discards a stale session up front instead of letting an expired token fail
// silently on the first authenticated API call (issue #165).
// function getUserFromStorage(): User | null {
//   const token = getAccessToken();
//   if (!token) return null;
//   if (AuthToken.from(token).isExpired()) {
//     logoutUseCase();
//     return null;
//   }
//   const user = getStoredUser();
//   if(!user) {

//   }

//   return getStoredUser();
// }


type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  clearError: (options?: { preserveSessionExpiry?: boolean }) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithCode: (code: string) => Promise<{ success: boolean; error?: string }>;
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

  const clearError = useCallback(
    ({ preserveSessionExpiry = false }: { preserveSessionExpiry?: boolean } = {}) => {
      setError((current) =>
        preserveSessionExpiry && current === SESSION_EXPIRED_REASON ? current : null
      );
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } catch {
      /* best-effort: clear local state even if the server call fails */
    }
    logoutUseCase();
    setUser(null);
  }, []);

  useEffect(() => {
    const restoreUser = async () => {
      /* eslint-disable react-hooks/set-state-in-effect -- Restore browser-only auth state after hydration so the server and first client render match. */
      // setUser(getUserFromStorage());
      setUser(await getUserData());
      setLoading(false);
      /* eslint-enable react-hooks/set-state-in-effect */
    };

    void restoreUser();
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
      // setAuthTokens(data.access, data.refresh);
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

  
  const getUserData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const userData = await fetchUserDetails();
      return userData
    } catch(err: unknown) {
      /* Logout case */
      logoutUseCase();
      return null;
    } finally {
      setLoading(false)
    }

  }, []);

  const loginWithCode = useCallback(async (code: string) => {
    setLoading(true);
    setError(null);
    try {
      const user = await completeOAuth(code);
      // setAuthTokens(data.access, data.refresh);
      setStoredUser(user);
      setUser(user);
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
        /* Login with same credentials (To retrieve cookie) */
        await loginUseCase(email, password);
        // setAuthTokens(data.access, data.refresh);
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
        clearError,
        login,
        loginWithCode,
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
