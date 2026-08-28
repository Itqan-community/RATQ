import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import VerifyEmailPage from '@/app/verify-email/page';
import { useAuth } from '@/hooks/useAuth';
import { useSearchParams } from 'next/navigation';

vi.mock('next/navigation', () => ({
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

vi.mock('next/image', () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

vi.mock('@/shared/ui/i18n', () => ({
  useLanguage: () => ({
    t: {
      auth: {
        verifyingEmailTitle: 'Verifying email',
        verifyingEmailSubtitle: 'Please wait while we confirm your email address.',
        verifyEmailTitle: 'Email verified',
        verifyEmailSuccess: 'Your email has been verified. You can log in now.',
        invalidVerifyLink: 'Invalid verification link',
        invalidVerifyLinkSubtitle:
          'This verification link is missing or invalid. Please use the link from your email, or log in if you already verified.',
        loginNow: 'Log in',
      },
    },
    direction: 'rtl',
  }),
}));

describe('VerifyEmailPage', () => {
  const verifyEmail = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
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
      verifyEmail,
      logout: vi.fn(),
    });
  });

  it('shows an invalid-link message when the token is missing', () => {
    vi.mocked(useSearchParams).mockReturnValue({
      get: () => null,
    } as unknown as ReturnType<typeof useSearchParams>);

    render(<VerifyEmailPage />);

    expect(verifyEmail).not.toHaveBeenCalled();
    expect(screen.getByText('Invalid verification link')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Log in' })).toHaveAttribute('href', '/login');
  });

  it('verifies the email when a token is present', async () => {
    verifyEmail.mockResolvedValue({ success: true });
    vi.mocked(useSearchParams).mockReturnValue({
      get: (key: string) => (key === 'token' ? 'verify-token' : null),
    } as ReturnType<typeof useSearchParams>);

    render(<VerifyEmailPage />);

    await waitFor(() => {
      expect(verifyEmail).toHaveBeenCalledWith('verify-token');
    });
    expect(await screen.findByText('Email verified')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Log in' })).toHaveAttribute('href', '/login');
  });

  it('shows an invalid-link message when verification fails', async () => {
    verifyEmail.mockResolvedValue({ success: false });
    vi.mocked(useSearchParams).mockReturnValue({
      get: (key: string) => (key === 'token' ? 'verify-token' : null),
    } as ReturnType<typeof useSearchParams>);

    render(<VerifyEmailPage />);

    await waitFor(() => {
      expect(verifyEmail).toHaveBeenCalledWith('verify-token');
    });
    expect(await screen.findByText('Invalid verification link')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Log in' })).toHaveAttribute('href', '/login');
  });

  it('shows an invalid-link message when verification throws', async () => {
    verifyEmail.mockRejectedValue(new Error('Email verification failed'));
    vi.mocked(useSearchParams).mockReturnValue({
      get: (key: string) => (key === 'token' ? 'bad-token' : null),
    } as ReturnType<typeof useSearchParams>);

    render(<VerifyEmailPage />);

    await waitFor(() => {
      expect(verifyEmail).toHaveBeenCalledWith('bad-token');
    });
    expect(await screen.findByText('Invalid verification link')).toBeInTheDocument();
  });
});
