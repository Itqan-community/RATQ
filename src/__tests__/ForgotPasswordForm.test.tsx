import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ForgotPasswordForm } from '@/modules/auth/components/ForgotPasswordForm';
import { useAuth } from '@/hooks/useAuth';

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
        forgotPasswordTitle: 'Forgot password',
        forgotPasswordSubtitle: 'Please enter your email below.',
        forgotPasswordButton: 'Continue',
        resetLinkSentHeading: 'Email Sent',
        resetLinkSentSubtitle: 'If the email address is associated with an account, you will receive instructions.',
        resetLinkSentButton: 'Resend Email',
        sendingEmail: 'Sending email...',
        didntReceiveEmail: "Didn't receive the email?",
        resentAvailableIn: 'Email sent again. You can resend after 30 seconds.',
        email: 'Email',
      },
    },
    direction: 'rtl',
  }),
}));

describe('ForgotPasswordForm', () => {
  const forgotPassword = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: false,
      error: null,
      login: vi.fn(),
      loginWithCode: vi.fn(),
      register: vi.fn(),
      forgotPassword,
      resetPassword: vi.fn(),
      verifyEmail: vi.fn(),
      logout: vi.fn(),
    });
  });

  it('calls forgotPassword and shows the sent state on success', async () => {
    forgotPassword.mockResolvedValue({ success: true });
    render(<ForgotPasswordForm />);

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'dev@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    await waitFor(() => {
      expect(forgotPassword).toHaveBeenCalledWith('dev@example.com');
    });
    expect(await screen.findByText('Email Sent')).toBeInTheDocument();
    expect(screen.getByText('dev@example.com')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Resend Email' })).toBeInTheDocument();
  });

  it('stays on the form when forgotPassword fails', async () => {
    forgotPassword.mockResolvedValue({ success: false });
    render(<ForgotPasswordForm />);

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'dev@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    await waitFor(() => {
      expect(forgotPassword).toHaveBeenCalledWith('dev@example.com');
    });
    expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();
    expect(screen.queryByText('Email Sent')).not.toBeInTheDocument();
  });
});
