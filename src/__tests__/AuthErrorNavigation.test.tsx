import { useState } from 'react';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

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
    localStorage.clear();
  });

  it('does not show a stale registration error after moving to login', async () => {
    mockRegisterUseCase.mockRejectedValue(
      new Error('Email already exists')
    );

    render(
      <AuthProvider>
        <AuthFlowHarness initialPage="register" />
      </AuthProvider>
    );

    fillRegisterForm('validpass');

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Create account',
      })
    );


    await waitFor(() => {
      expect(
        screen.getByText('Email already exists')
      ).toBeInTheDocument();
    });


    fireEvent.click(
      screen.getByRole('button', {
        name: 'Go to login',
      })
    );

    expect(
      screen.queryByText('Email already exists')
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
