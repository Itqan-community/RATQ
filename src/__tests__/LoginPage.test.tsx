import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoginPage from '@/app/login/page';
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

vi.mock('@/modules/auth/components/LoginForm', () => ({
  LoginForm: () => <div data-testid="login-form">LoginForm Component</div>,
}));

vi.mock('@/shared/ui/i18n', () => ({
  useLanguage: () => ({
    t: {
      auth: {
        loginTitle: 'تسجيل الدخول',
        loginSubtitle: 'مرحباً بك في منصتنا',
        loginBenefit1: 'ميزة 1',
        loginBenefit2: 'ميزة 2',
        loginBenefit3: 'ميزة 3',
        loginPanelTitle: 'عنوان اللوحة',
        loginNote: 'ملاحظة عامة',
        noAccount: 'ليس لديك حساب؟',
        registerNow: 'سجل الآن',
        developerSpace: 'مساحة المطورين',
      },
    },
    direction: 'rtl',
  }),
}));

describe('LoginPage', () => {
  const pushMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRouter).mockReturnValue(createMockRouter({ push: pushMock }));
  });

  it('redirects an active logged-in user to /dashboard', () => {
    vi.mocked(useAuth).mockReturnValue(
        createMockAuthContext({
          user: { id: 1, email: 'dev@example.com', display_name: 'Test Dev', role: 'developer', created_at: '2026-01-01T00:00:00Z' },
          loading: false,
        })
      );

    render(<LoginPage />);

    expect(pushMock).toHaveBeenCalledWith('/dashboard');
    expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();
  });

  it('renders login form when no active user session exists', () => {
    vi.mocked(useAuth).mockReturnValue(createMockAuthContext({ loading: false }));

    render(<LoginPage />);

    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it('shows loading indicator and prevents form flash while auth state is resolving', () => {
    vi.mocked(useAuth).mockReturnValue(createMockAuthContext({ loading: true }));

    render(<LoginPage />);

    expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });
});
