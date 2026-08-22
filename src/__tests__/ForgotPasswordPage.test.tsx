import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ForgotPasswordPage from '@/app/forgot-password/page';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('next/link', () => ({
  default: ({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/modules/auth/components/ForgotPasswordForm', () => ({
  ForgotPasswordForm: () => <div data-testid="forgot-password-form">ForgotPasswordForm</div>,
}));

vi.mock('@/shared/ui/i18n', () => ({
  useLanguage: () => ({
    t: {
      auth: {
        rememberPassword: 'Remember your password?',
        loginNow: 'Log in',
      },
    },
    direction: 'rtl',
  }),
}));

describe('ForgotPasswordPage', () => {
  const pushMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRouter).mockReturnValue({ push: pushMock } as ReturnType<typeof useRouter>);
  });

  it('redirects an active logged-in user to /dashboard', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: 1, email: 'dev@example.com', display_name: 'Test Dev', role: 'developer' } as never,
      loading: false,
      error: null,
      login: vi.fn(),
      loginWithToken: vi.fn(),
      register: vi.fn(),
      forgotPassword: vi.fn(),
      resetPassword: vi.fn(),
      logout: vi.fn(),
    });

    render(<ForgotPasswordPage />);

    expect(pushMock).toHaveBeenCalledWith('/dashboard');
    expect(screen.queryByTestId('forgot-password-form')).not.toBeInTheDocument();
  });

  it('renders the form when no active user session exists', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: false,
      error: null,
      login: vi.fn(),
      loginWithToken: vi.fn(),
      register: vi.fn(),
      forgotPassword: vi.fn(),
      resetPassword: vi.fn(),
      logout: vi.fn(),
    });

    render(<ForgotPasswordPage />);

    expect(screen.getByTestId('forgot-password-form')).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
    expect(screen.getByRole('link', { name: 'Log in' })).toHaveAttribute('href', '/login');
  });

  it('shows loading indicator and prevents form flash while auth state is resolving', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: true,
      error: null,
      login: vi.fn(),
      loginWithToken: vi.fn(),
      register: vi.fn(),
      forgotPassword: vi.fn(),
      resetPassword: vi.fn(),
      logout: vi.fn(),
    });

    render(<ForgotPasswordPage />);

    expect(screen.queryByTestId('forgot-password-form')).not.toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });
});
