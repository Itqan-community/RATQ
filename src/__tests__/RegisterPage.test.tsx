import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import RegisterPage from '@/app/register/page';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { createMockRouter } from './test-utils/mockRouter';
import { createMockAuthContext } from './test-utils/mockAuth';

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

// Stub RegisterForm with a stable testid so tests can assert presence/absence
// without depending on the form's internal markup or i18n strings.
vi.mock('@/modules/auth/components/RegisterForm', () => ({
  RegisterForm: () => <div data-testid="register-form">RegisterForm Component</div>,
}));

vi.mock('@/shared/ui/i18n', () => ({
  useLanguage: () => ({
    t: {
      auth: {
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
      },
    },
    direction: 'ltr',
  }),
}));

describe('RegisterPage', () => {
  const pushMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRouter).mockReturnValue(createMockRouter({ push: pushMock }));
  });

  it('redirects an authenticated user to /dashboard and does not render the registration form', () => {
    vi.mocked(useAuth).mockReturnValue(
      createMockAuthContext({
        user: { id: 1, email: 'dev@example.com', display_name: 'Test Dev', role: 'developer', created_at: '2026-01-01T00:00:00Z' },
        loading: false,
      })
    );

    render(<RegisterPage />);

    expect(pushMock).toHaveBeenCalledWith('/dashboard');
    expect(screen.queryByTestId('register-form')).not.toBeInTheDocument();
  });

  it('renders the registration form and does not redirect when no user is authenticated', () => {
    vi.mocked(useAuth).mockReturnValue(createMockAuthContext({ loading: false }));

    render(<RegisterPage />);

    expect(screen.getByTestId('register-form')).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it('shows the loading spinner and does not render the form or redirect while auth state is resolving', () => {
    vi.mocked(useAuth).mockReturnValue(createMockAuthContext({ loading: true }));

    render(<RegisterPage />);

    expect(screen.queryByTestId('register-form')).not.toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });
});
