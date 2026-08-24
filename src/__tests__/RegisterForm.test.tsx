import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { RegisterForm } from '@/modules/auth/components/RegisterForm';
import { useAuth } from '@/hooks/useAuth';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/shared/ui/i18n', () => ({
  useLanguage: () => ({
    t: {
      auth: {
        displayName: 'Display name',
        displayNamePlaceholder: 'Your name',
        email: 'Email',
        password: 'Password',
        accountRole: 'I am joining as',
        developer: 'Developer',
        developerDescription: 'Build with Quranic resources',
        publisher: 'Publisher',
        publisherDescription: 'Share and manage resources',
        createAccount: 'Create account',
        creatingAccount: 'Creating account...',
        passwordLength: 'Password must be between 8 and 64 characters.',
      },
    },
  }),
}));

function fillRegisterForm(password: string) {
  fireEvent.change(screen.getByLabelText('Display name'), { target: { value: 'Test Dev' } });
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'dev@example.com' } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: password } });
}

describe('RegisterForm', () => {
  const register = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: false,
      error: null,
      login: vi.fn(),
      loginWithToken: vi.fn(),
      register,
      forgotPassword: vi.fn(),
      resetPassword: vi.fn(),
      verifyEmail: vi.fn(),
      logout: vi.fn(),
    });
  });

  it('shows a length error and does not call register when the password is too short', () => {
    render(<RegisterForm />);
    fillRegisterForm('short');
    fireEvent.click(screen.getByRole('button', { name: 'Create account' }));

    expect(screen.getByText('Password must be between 8 and 64 characters.')).toBeInTheDocument();
    expect(register).not.toHaveBeenCalled();
  });

  it('shows a length error and does not call register when the password is too long', () => {
    render(<RegisterForm />);
    fillRegisterForm('a'.repeat(65));
    fireEvent.click(screen.getByRole('button', { name: 'Create account' }));

    expect(screen.getByText('Password must be between 8 and 64 characters.')).toBeInTheDocument();
    expect(register).not.toHaveBeenCalled();
  });

  it('calls register when the password is valid', async () => {
    register.mockResolvedValue({ success: true });
    render(<RegisterForm />);
    fillRegisterForm('validpass');
    fireEvent.click(screen.getByRole('button', { name: 'Create account' }));

    await waitFor(() => {
      expect(register).toHaveBeenCalledWith('dev@example.com', 'validpass', 'Test Dev', 'developer');
    });
  });
});
