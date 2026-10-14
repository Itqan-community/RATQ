import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoginForm } from '@/modules/auth/components/LoginForm';
import { SESSION_EXPIRED_REASON } from '@/shared/infrastructure/session-expiry';
import { LanguageProvider } from '@/shared/ui/i18n';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    login: vi.fn(),
    loading: false,
    error: SESSION_EXPIRED_REASON,
    clearError: vi.fn(),
  }),
}));

describe('LoginForm session expiry message', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it.each([
    ['en', 'Your session has expired. Please log in again.'],
    ['ar', 'انتهت صلاحية جلستك. يُرجى تسجيل الدخول مرة أخرى.'],
  ] as const)('shows the session-expired reason in %s', async (locale, message) => {
    localStorage.setItem('ratq_locale', locale);

    render(
      <LanguageProvider>
        <LoginForm />
      </LanguageProvider>
    );

    expect(await screen.findByText(message)).toBeInTheDocument();
  });
});

describe('LoginForm localization (#351)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows Arabic labels and no Google button on the Arabic site', async () => {
    localStorage.setItem('ratq_locale', 'ar');

    render(
      <LanguageProvider>
        <LoginForm />
      </LanguageProvider>
    );

    expect(await screen.findByText('البريد الإلكتروني')).toBeInTheDocument();
    expect(screen.getByText('كلمة المرور')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'تسجيل الدخول' })).toBeInTheDocument();
    expect(screen.getByText('المتابعة عبر GitHub')).toBeInTheDocument();
    expect(screen.queryByText(/Google/)).not.toBeInTheDocument();
  });

  it('shows English labels and no Google button on the English site', async () => {
    localStorage.setItem('ratq_locale', 'en');

    render(
      <LanguageProvider>
        <LoginForm />
      </LanguageProvider>
    );

    expect(await screen.findByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.queryByText(/Google/)).not.toBeInTheDocument();
  });
});

describe('mapAuthError (#351)', () => {
  it('maps wrong credentials and locked accounts to translated messages', async () => {
    const { mapAuthError } = await import('@/modules/auth/components/LoginForm');
    const t = {
      auth: {
        sessionExpired: 'expired',
        invalidCredentials: 'bad creds',
        accountLocked: 'locked',
      },
    } as never;
    expect(mapAuthError('Invalid login credentials', t)).toBe('bad creds');
    expect(mapAuthError('Your account has been locked. Contact support.', t)).toBe('locked');
    expect(mapAuthError(SESSION_EXPIRED_REASON, t)).toBe('expired');
    expect(mapAuthError('Something else broke', t)).toBe('Something else broke');
    expect(mapAuthError(null, t)).toBeNull();
  });
});
