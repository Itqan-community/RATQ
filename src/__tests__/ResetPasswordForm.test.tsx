import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ResetPasswordForm } from '@/modules/auth/components/ResetPasswordForm';
import { useAuth } from '@/hooks/useAuth';

vi.mock('next/link', () => ({
  default: ({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

vi.mock('next/image', () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/shared/ui/i18n', () => ({
  useLanguage: () => ({
    t: {
      auth: {
        resetPasswordTitle: 'Set New Password',
        resetPasswordSubtitle: 'Enter a new password for your account',
        passwordUpdated: 'Password Updated',
        resetPasswordSuccess: 'Your password has been updated.',
        newPassword: 'New password',
        confirmPassword: 'Confirm password',
        resetPasswordButton: 'Reset Password',
        passwordMismatch: 'Passwords do not match.',
        passwordLength: 'Password must be between 8 and 64 characters.',
        rememberPassword: 'Remember your password?',
        loginNow: 'Log in',
      },
    },
  }),
}));

function fillPasswords(password: string, confirm: string) {
  fireEvent.change(screen.getByLabelText('New password'), { target: { value: password } });
  fireEvent.change(screen.getByLabelText('Confirm password'), { target: { value: confirm } });
}

describe('ResetPasswordForm', () => {
  const resetPassword = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: false,
      error: null,
      login: vi.fn(),
      loginWithToken: vi.fn(),
      register: vi.fn(),
      forgotPassword: vi.fn(),
      resetPassword,
      verifyEmail: vi.fn(),
      logout: vi.fn(),
    });
  });

  it('shows a length error and does not call resetPassword when the password is too short', () => {
    render(<ResetPasswordForm token="reset-token" />);
    fillPasswords('short', 'short');
    fireEvent.click(screen.getByRole('button', { name: 'Reset Password' }));

    expect(screen.getByText('Password must be between 8 and 64 characters.')).toBeInTheDocument();
    expect(resetPassword).not.toHaveBeenCalled();
  });

  it('shows a length error and does not call resetPassword when the password is too long', () => {
    const longPassword = 'a'.repeat(65);
    render(<ResetPasswordForm token="reset-token" />);
    fillPasswords(longPassword, longPassword);
    fireEvent.click(screen.getByRole('button', { name: 'Reset Password' }));

    expect(screen.getByText('Password must be between 8 and 64 characters.')).toBeInTheDocument();
    expect(resetPassword).not.toHaveBeenCalled();
  });

  it('shows a mismatch error and does not call resetPassword when the passwords differ', () => {
    render(<ResetPasswordForm token="reset-token" />);
    fillPasswords('validpass', 'different1');
    fireEvent.click(screen.getByRole('button', { name: 'Reset Password' }));

    expect(screen.getByText('Passwords do not match.')).toBeInTheDocument();
    expect(resetPassword).not.toHaveBeenCalled();
  });

  it('calls resetPassword and shows success when the passwords are valid', async () => {
    resetPassword.mockResolvedValue({ success: true });
    render(<ResetPasswordForm token="reset-token" />);
    fillPasswords('validpass', 'validpass');
    fireEvent.click(screen.getByRole('button', { name: 'Reset Password' }));

    await waitFor(() => {
      expect(resetPassword).toHaveBeenCalledWith('reset-token', 'validpass');
    });
    expect(await screen.findByText('Password Updated')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Log in' })).toHaveAttribute('href', '/login');
  });
});
