'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { api } from '@/lib/api-client';
import type { User } from '@/types/resource';

function getUserFromStorage(): User | null {
  if (typeof window === 'undefined') return null;
  const token = api.authHelpers.getAccessToken();
  if (!token) return null;
  const stored = localStorage.getItem('ratq_user');
  return stored ? JSON.parse(stored) : null;
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
      const data = await api.auth.login(email, password);
      api.authHelpers.setAuthTokens(data.access, data.refresh);
      localStorage.setItem('ratq_user', JSON.stringify(data.user));
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
      const data = await api.auth.loginWithToken(token);
      api.authHelpers.setAuthTokens(data.access, data.refresh);
      localStorage.setItem('ratq_user', JSON.stringify(data.user));
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
        const data = await api.auth.register(email, password, display_name, role);
        api.authHelpers.setAuthTokens(data.access, data.refresh);
        localStorage.setItem('ratq_user', JSON.stringify(data.user));
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
    api.authHelpers.clearAuth();
    localStorage.removeItem('ratq_user');
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
