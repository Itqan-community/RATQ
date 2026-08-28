import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ResetPasswordPage from '@/app/reset-password/page';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, useSearchParams } from 'next/navigation';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
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

vi.mock('@/modules/auth/components/ResetPasswordForm', () => ({
  ResetPasswordForm: () => <div data-testid="reset-password-form">ResetPasswordForm</div>,
}));

vi.mock('next/image', () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

vi.mock('@/shared/ui/i18n', () => ({
  useLanguage: () => ({
    t: {
      auth: {
        invalidResetLink: 'Invalid Reset Link',
        invalidResetLinkSubtitle: 'The password reset link is missing, invalid, or may have expired. Please request a new link.',
        requestNewResetLink: 'Request a new link',
      },
    },
    direction: 'rtl',
  }),
}));

describe('ResetPasswordPage', () => {
  const pushMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
      vi.mocked(useRouter).mockReturnValue({ push: pushMock } as unknown as ReturnType<typeof useRouter>);
      vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: false,
      error: null,
      clearError: vi.fn(),
      login: vi.fn(),
      loginWithCode: vi.fn(),
      register: vi.fn(),
      forgotPassword: vi.fn(),
      resetPassword: vi.fn(),
      logout: vi.fn(),
      verifyEmail: vi.fn(),
    });
  });

  it('renders the form when a token is present', () => {
    vi.mocked(useSearchParams).mockReturnValue({
      get: (key: string) => (key === 'token' ? 'reset-token' : null),
    } as ReturnType<typeof useSearchParams>);

    render(<ResetPasswordPage />);

    expect(screen.getByTestId('reset-password-form')).toBeInTheDocument();
  });

  it('shows an invalid-link message when the token is missing', () => {
    vi.mocked(useSearchParams).mockReturnValue({
      get: () => null,
    } as unknown as ReturnType<typeof useSearchParams>);

    render(<ResetPasswordPage />);

    expect(screen.queryByTestId('reset-password-form')).not.toBeInTheDocument();
    expect(screen.getByText('Invalid Reset Link')).toBeInTheDocument();
    expect(
      screen.getByText(
        'The password reset link is missing, invalid, or may have expired. Please request a new link.'
      )
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Request a new link' })).toHaveAttribute(
      'href',
      '/forgot-password'
    );
  });

  it('redirects an active logged-in user to /dashboard', () => {
    vi.mocked(useSearchParams).mockReturnValue({
      get: () => 'reset-token',
    } as unknown as ReturnType<typeof useSearchParams>);
    vi.mocked(useAuth).mockReturnValue({
      user: { id: 1, email: 'dev@example.com', display_name: 'Test Dev', role: 'developer' } as never,
      loading: false,
      error: null,
      clearError: vi.fn(),
      login: vi.fn(),
      loginWithCode: vi.fn(),
      register: vi.fn(),
      forgotPassword: vi.fn(),
      resetPassword: vi.fn(),
      logout: vi.fn(),
      verifyEmail: vi.fn(),
    });

    render(<ResetPasswordPage />);

    expect(pushMock).toHaveBeenCalledWith('/dashboard');
    expect(screen.queryByTestId('reset-password-form')).not.toBeInTheDocument();
  });
});
