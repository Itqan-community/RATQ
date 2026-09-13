import { useState } from 'react';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuth } from '@/hooks/useAuth';

import { AuthProvider } from '@/hooks/useAuth';
import ForgotPasswordPage from '@/app/forgot-password/page';
import LoginPage from '@/app/login/page';
import RegisterPage from '@/app/register/page';
import {
  notifySessionExpired,
  SESSION_EXPIRED_REASON,
} from '@/shared/infrastructure/session-expiry';

const mockRegisterUseCase = vi.fn();
const mockLoginUseCase = vi.fn();

vi.mock('@/modules/auth/application/use-cases/register', () => ({
  register: (...args: unknown[]) => mockRegisterUseCase(...args),
}));

vi.mock('@/modules/auth/application/use-cases/login', () => ({
  login: (...args: unknown[]) => mockLoginUseCase(...args),
}));

const mockFetchUserDetails = vi.fn();
const mockLogoutRequest = vi.fn();

vi.mock('@/modules/auth/infrastructure/payload-auth-repository', () => ({
  fetchUserDetails: (...args: unknown[]) => mockFetchUserDetails(...args),
  logout: (...args: unknown[]) => mockLogoutRequest(...args),
}));

const mockPush = vi.fn();
const mockReplace = vi.fn();
const mockRefresh = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    refresh: mockRefresh,
  }),
}));

vi.mock('@/shared/ui/i18n', () => ({
  useLanguage: () => ({
    direction: 'ltr',
    locale: 'en',

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

        registerTitle: 'Create your account',
        registerSubtitle: 'Join RATQ.',
        registerBenefit1: 'Build resources',
        registerBenefit2: 'Publish resources',
        registerBenefit3: 'Collaborate',
        registerBadge: 'Developer space',
        registerPanelTitle: 'Grow with RATQ',
        registerNote: 'Create an account to continue.',
        haveAccount: 'Already have an account?',
        loginNow: 'Log in',
        loginTitle: 'Log in',
        loginSubtitle: 'Welcome back.',
        loginBenefit1: 'Build resources',
        loginBenefit2: 'Publish resources',
        loginBenefit3: 'Collaborate',
        loginPanelTitle: 'RATQ workspace',
        loginNote: 'Continue to your account.',
        noAccount: 'Need an account?',
        registerNow: 'Register',
        developerSpace: 'Developer space',

        passwordLength:
          'Password must be between 8 and 64 characters.',

        forgotPassword: 'Forgot password?',
        sessionExpired: 'Your session has expired.',

        forgotPasswordTitle: 'Forgot password',
        forgotPasswordSubtitle:
          'Enter your email to receive a password reset link.',

        resetLinkSentHeading: 'Reset link sent',
        resetLinkSentSubtitle: 'Check your email.',

        forgotPasswordButton: 'Send reset link',
        didntReceiveEmail: 'Did not receive the email?',
        resetLinkSentButton: 'Resend email',
        sendingEmail: 'Sending...',
        resentAvailableIn: 'You can resend shortly.',
      },

      header: {
        auth: {},
      },
    },
  }),
}));

type AuthPage = 'register' | 'login' | 'forgot';

function AuthFlowHarness({
  initialPage = 'register',
}: {
  initialPage?: AuthPage;
}) {
  const [page, setPage] = useState<AuthPage>(initialPage);

  return (
    <>
      <nav>
        <button
          type="button"
          onClick={() => setPage('register')}
        >
          Go to register
        </button>

        <button
          type="button"
          onClick={() => setPage('login')}
        >
          Go to login
        </button>

        <button
          type="button"
          onClick={() => setPage('forgot')}
        >
          Go to forgot password
        </button>
      </nav>

      {page === 'register' && <RegisterPage />}

      {page === 'login' && <LoginPage />}

      {page === 'forgot' && <ForgotPasswordPage />}
    </>
  );
}

function fillRegisterForm(password: string) {
  fireEvent.change(
    screen.getByLabelText('Display name'),
    {
      target: {
        value: 'Test Dev',
      },
    }
  );

  fireEvent.change(
    screen.getByLabelText('Email'),
    {
      target: {
        value: 'dev@example.com',
      },
    }
  );

  fireEvent.change(
    screen.getByLabelText('Password'),
    {
      target: {
        value: password,
      },
    }
  );
}

function fillLoginForm(
  email = 'dev@example.com',
  password = 'wrong-password'
) {
  fireEvent.change(
    screen.getByLabelText('Email'),
    {
      target: {
        value: email,
      },
    }
  );

  fireEvent.change(
    screen.getByLabelText('Password'),
    {
      target: {
        value: password,
      },
    }
  );
}

describe('auth error navigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchUserDetails.mockReset();
    mockLogoutRequest.mockReset();
    mockFetchUserDetails.mockRejectedValue(new Error('Failed to load user'));
    localStorage.clear();
  });

  it('does not show a stale registration error after moving to login', async () => {
    mockRegisterUseCase.mockRejectedValue(
      new Error('Email already exists')
    );

    // This test needs a variant of AuthFlowHarness that also surfaces
    // AuthProvider.error. RegisterPage's guard (loading || user) unmounts
    // RegisterForm while AuthProvider.register is in flight, which destroys
    // RegisterForm's local formError state before it can be rendered.
    // The error that survives the remount is AuthProvider.error (context-level).
    // AuthContextErrorDisplay surfaces it so the assertion below can find it.
    function AuthContextErrorDisplay() {
      const { error } = useAuth();
      return error ? <p data-testid="auth-context-error">{error}</p> : null;
    }

    function HarnessWithErrorDisplay() {
      const [page, setPage] = useState<'register' | 'login'>('register');
      return (
        <>
          <nav>
            <button type="button" onClick={() => setPage('login')}>Go to login</button>
          </nav>
          <AuthContextErrorDisplay />
          {page === 'register' && <RegisterPage />}
          {page === 'login' && <LoginPage />}
        </>
      );
    }

    render(
      <AuthProvider>
        <HarnessWithErrorDisplay />
      </AuthProvider>
    );

    // AuthProvider starts with loading:true while it checks for an existing
    // session. RegisterPage's guard shows a spinner until that resolves.
    // fetchUserDetails is mocked to reject in beforeEach, so the check
    // settles quickly — but we still need to wait for it before filling the form.
    await waitFor(() => {
      expect(screen.getByLabelText('Display name')).toBeInTheDocument();
    });

    fillRegisterForm('validpass');

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Create account',
      })
    );

    // Wait for AuthProvider.error to be set. RegisterForm's local state is
    // gone (form unmounted during loading), but context-level error persists.
    await waitFor(() => {
      expect(
        screen.getByTestId('auth-context-error')
      ).toHaveTextContent('Email already exists');
    });

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Go to login',
      })
    );

    // LoginPage mounts and calls clearError() — the stale registration error
    // must be cleared from context before the user sees the login form.
    expect(
      screen.queryByTestId('auth-context-error')
    ).not.toBeInTheDocument();
  });

  it('does not show a stale login error after moving to forgot password', async () => {
    mockLoginUseCase.mockRejectedValue(
      new Error(
        'The email or password provided is incorrect.'
      )
    );

    render(
      <AuthProvider>
        <AuthFlowHarness initialPage="login" />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    fillLoginForm();

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Log in',
      })
    );


    await waitFor(() => {
      expect(
        screen.getByText(
          'The email or password provided is incorrect.'
        )
      ).toBeInTheDocument();
    });

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Go to forgot password',
      })
    );

    expect(
      screen.queryByText(
        'The email or password provided is incorrect.'
      )
    ).not.toBeInTheDocument();
  });

  it('keeps a failed login error after the loading spinner remounts LoginForm', async () => {
    let rejectLogin!: (reason?: unknown) => void;
    mockLoginUseCase.mockReturnValue(
      new Promise((_, reject) => {
        rejectLogin = reject;
      })
    );

    render(
      <AuthProvider>
        <AuthFlowHarness initialPage="login" />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    fillLoginForm();
    fireEvent.click(screen.getByRole('button', { name: 'Log in' }));

    await waitFor(() => {
      expect(screen.queryByLabelText('Email')).not.toBeInTheDocument();
    });

    rejectLogin(new Error('The email or password provided is incorrect.'));

    await waitFor(() => {
      expect(
        screen.getByText('The email or password provided is incorrect.')
      ).toBeInTheDocument();
    });
  });

  it('does not restore an old login error after leaving login and returning', async () => {
    mockLoginUseCase.mockRejectedValue(
      new Error(
        'The email or password provided is incorrect.'
      )
    );

    render(
      <AuthProvider>
        <AuthFlowHarness initialPage="login" />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    fillLoginForm();

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Log in',
      })
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          'The email or password provided is incorrect.'
        )
      ).toBeInTheDocument();
    });

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Go to register',
      })
    );

    expect(
      screen.queryByText(
        'The email or password provided is incorrect.'
      )
    ).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Go to login',
      })
    );


    expect(
      screen.queryByText(
        'The email or password provided is incorrect.'
      )
    ).not.toBeInTheDocument();
  });

  it('shows the session-expired message on login but does not leak it into another auth flow', async () => {
    render(
      <AuthProvider>
        <AuthFlowHarness initialPage="register" />
      </AuthProvider>
    );


    act(() => {
      notifySessionExpired();
    });

    expect(mockReplace).toHaveBeenCalledWith('/login');

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Go to login',
      })
    );

    await waitFor(() => {
      expect(
        screen.getByText('Your session has expired.')
      ).toBeInTheDocument();
    });

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Go to forgot password',
      })
    );

    expect(
      screen.queryByText('Your session has expired.')
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText(SESSION_EXPIRED_REASON)
    ).not.toBeInTheDocument();

  });
});
