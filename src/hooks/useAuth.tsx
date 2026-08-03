'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { login as loginUseCase } from '@/modules/auth/application/use-cases/login';
import { register as registerUseCase } from '@/modules/auth/application/use-cases/register';
import { completeOAuth } from '@/modules/auth/application/use-cases/complete-oauth';
import { logout as logoutUseCase } from '@/modules/auth/application/use-cases/logout';
import { AuthToken } from '@/modules/auth/domain/auth-token';
import {
  getAccessToken,
  setAuthTokens,
  getStoredUser,
  setStoredUser,
} from '@/shared/infrastructure/token-storage';
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
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getUserFromStorage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const logout = useCallback(() => {
    logoutUseCase();
    setUser(null);
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
