import { act } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import {
  SESSION_EXPIRED_REASON,
  notifySessionExpired,
} from '@/shared/infrastructure/session-expiry';
import type { User } from '@/types/resource';

const mockForgotPassword = vi.fn();
const mockResetPassword = vi.fn();
const mockVerifyEmail = vi.fn();

vi.mock('@/modules/auth/application/use-cases/forgot-password', () => ({
  forgotPassword: (...args: unknown[]) => mockForgotPassword(...args),
}));

vi.mock('@/modules/auth/application/use-cases/reset-password', () => ({
  resetPassword: (...args: unknown[]) => mockResetPassword(...args),
}));

vi.mock('@/modules/auth/application/use-cases/verify-email', () => ({
  verifyEmail: (...args: unknown[]) => mockVerifyEmail(...args),
}));

const mockFetchUserDetails = vi.fn();
const mockLogoutRequest = vi.fn();

vi.mock('@/modules/auth/infrastructure/payload-auth-repository', () => ({
  fetchUserDetails: (...args: unknown[]) => mockFetchUserDetails(...args),
  logout: (...args: unknown[]) => mockLogoutRequest(...args),
}));

const mockReplace = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

const storedUser: User = {
  id: 42,
  email: 'developer@example.com',
  display_name: 'Test Developer',
  role: 'developer',
  created_at: '2026-08-14T00:00:00.000Z',
};

function storeStoredUser() {
  localStorage.setItem('ratq_user', JSON.stringify(storedUser));
}

function AuthStateProbe() {
  const { user, loading, error } = useAuth();

  return (
    <>
      <p data-testid="auth-state">
        {loading ? 'loading' : user?.email ?? 'anonymous'}
      </p>
      {error && <p data-testid="auth-error">{error}</p>}
    </>
  );
}

describe('AuthProvider hydration', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    mockFetchUserDetails.mockReset();
    mockLogoutRequest.mockReset();
    mockReplace.mockClear();
  });

  it('hydrates without a mismatch and restores the cookie session', async () => {
    mockFetchUserDetails.mockResolvedValue(storedUser);

    const serverHtml = renderToString(
      <AuthProvider>
        <AuthStateProbe />
      </AuthProvider>
    );
    expect(serverHtml).toContain('loading');

    const container = document.createElement('div');
    container.innerHTML = serverHtml;
    document.body.appendChild(container);

    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const root = await act(() =>
      hydrateRoot(
        container,
        <AuthProvider>
          <AuthStateProbe />
        </AuthProvider>
      )
    );

    await waitFor(() => {
      expect(container).toHaveTextContent(storedUser.email);
    });

    const errors = consoleError.mock.calls.flat().map(String).join(' ');
    expect(errors).not.toMatch(/hydration|did not match|server rendered html/i);

    await act(async () => root.unmount());
    container.remove();
  });

  it('restores the cookie-session user after mounting', async () => {
    mockFetchUserDetails.mockResolvedValue(storedUser);

    render(
      <AuthProvider>
        <AuthStateProbe />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-state')).toHaveTextContent(storedUser.email);
    });
  });

  it('resolves to anonymous when there is no cookie session', async () => {
    mockFetchUserDetails.mockRejectedValue(new Error('Failed to load user'));

    render(
      <AuthProvider>
        <AuthStateProbe />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-state')).toHaveTextContent('anonymous');
    });
  });

  it('clears the stored user when the cookie session is gone', async () => {
    storeStoredUser();
    mockFetchUserDetails.mockRejectedValue(new Error('Failed to load user'));

    render(
      <AuthProvider>
        <AuthStateProbe />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-state')).toHaveTextContent('anonymous');
    });
    expect(localStorage.getItem('ratq_user')).toBeNull();
  });

  it('clears the session and directs the user to log in again', async () => {
    mockFetchUserDetails.mockResolvedValue(storedUser);

    render(
      <AuthProvider>
        <AuthStateProbe />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-state')).toHaveTextContent(storedUser.email);
    });

    act(() => notifySessionExpired());

    await waitFor(() => {
      expect(screen.getByTestId('auth-state')).toHaveTextContent('anonymous');
    });
    expect(mockLogoutRequest).toHaveBeenCalled();
    expect(localStorage.getItem('ratq_user')).toBeNull();
    expect(screen.getByTestId('auth-error')).toHaveTextContent(SESSION_EXPIRED_REASON);
    expect(mockReplace).toHaveBeenCalledWith('/login');
  });
});

function PasswordFlowProbe() {
  const { forgotPassword, resetPassword, verifyEmail, error, loading } = useAuth();

  return (
    <div>
      <p data-testid="loading">{loading ? 'loading' : 'idle'}</p>
      <p data-testid="error">{error ?? ''}</p>
      <button type="button" onClick={() => void forgotPassword('dev@example.com')}>
        forgot
      </button>
      <button type="button" onClick={() => void resetPassword('reset-token', 'new-password')}>
        reset
      </button>
      <button type="button" onClick={() => void verifyEmail('verify-token')}>
        verify
      </button>
    </div>
  );
}

describe('AuthProvider password reset', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    mockFetchUserDetails.mockReset();
    mockLogoutRequest.mockReset();
    mockFetchUserDetails.mockRejectedValue(new Error('Failed to load user'));
  });

  it('forgotPassword succeeds without toggling session loading', async () => {
    mockForgotPassword.mockResolvedValue({ success: true });

    render(
      <AuthProvider>
        <PasswordFlowProbe />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('idle');
    });

    fireEvent.click(screen.getByRole('button', { name: 'forgot' }));

    await waitFor(() => {
      expect(mockForgotPassword).toHaveBeenCalledWith('dev@example.com');
    });
    expect(screen.getByTestId('loading')).toHaveTextContent('idle');
    expect(screen.getByTestId('error')).toHaveTextContent('');
  });

  it('forgotPassword stores the error and keeps session loading idle', async () => {
    mockForgotPassword.mockRejectedValue(new Error('Forgot password request failed'));

    render(
      <AuthProvider>
        <PasswordFlowProbe />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('idle');
    });

    fireEvent.click(screen.getByRole('button', { name: 'forgot' }));

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Forgot password request failed');
    });
    expect(screen.getByTestId('loading')).toHaveTextContent('idle');
  });

  it('resetPassword succeeds without toggling session loading', async () => {
    mockResetPassword.mockResolvedValue({ success: true });

    render(
      <AuthProvider>
        <PasswordFlowProbe />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('idle');
    });

    fireEvent.click(screen.getByRole('button', { name: 'reset' }));

    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalledWith('reset-token', 'new-password');
    });
    expect(screen.getByTestId('loading')).toHaveTextContent('idle');
    expect(screen.getByTestId('error')).toHaveTextContent('');
  });

  it('resetPassword stores the error and keeps session loading idle', async () => {
    mockResetPassword.mockRejectedValue(new Error('Reset password failed'));

    render(
      <AuthProvider>
        <PasswordFlowProbe />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('idle');
    });

    fireEvent.click(screen.getByRole('button', { name: 'reset' }));

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Reset password failed');
    });
    expect(screen.getByTestId('loading')).toHaveTextContent('idle');
  });

  it('verifyEmail succeeds without toggling session loading', async () => {
    mockVerifyEmail.mockResolvedValue({ success: true });

    render(
      <AuthProvider>
        <PasswordFlowProbe />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('idle');
    });

    fireEvent.click(screen.getByRole('button', { name: 'verify' }));

    await waitFor(() => {
      expect(mockVerifyEmail).toHaveBeenCalledWith('verify-token');
    });
    expect(screen.getByTestId('loading')).toHaveTextContent('idle');
    expect(screen.getByTestId('error')).toHaveTextContent('');
  });

  it('verifyEmail stores the error and keeps session loading idle', async () => {
    mockVerifyEmail.mockRejectedValue(new Error('Email verification failed'));

    render(
      <AuthProvider>
        <PasswordFlowProbe />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('idle');
    });

    fireEvent.click(screen.getByRole('button', { name: 'verify' }));

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Email verification failed');
    });
    expect(screen.getByTestId('loading')).toHaveTextContent('idle');
  });
});
