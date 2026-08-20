import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoginPage from '@/app/login/page';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('next/link', () => ({
  default: ({ children, href, className }: any) => (
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
    vi.mocked(useRouter).mockReturnValue({ push: pushMock } as any);
  });

  it('redirects an active logged-in user to /dashboard', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: 1, email: 'dev@example.com', display_name: 'Test Dev', role: 'developer' } as any,
      loading: false,
      error: null,
      login: vi.fn(),
      loginWithToken: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    render(<LoginPage />);

    expect(pushMock).toHaveBeenCalledWith('/dashboard');
    expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();
  });

  it('renders login form when no active user session exists', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: false,
      error: null,
      login: vi.fn(),
      loginWithToken: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    render(<LoginPage />);

    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it('shows loading indicator and prevents form flash while auth state is resolving', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: true,
      error: null,
      login: vi.fn(),
      loginWithToken: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    render(<LoginPage />);

    expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });
});
