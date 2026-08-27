import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoginForm } from '@/modules/auth/components/LoginForm';
import { SESSION_EXPIRED_REASON } from '@/shared/infrastructure/session-expiry';
import { LanguageProvider } from '@/shared/ui/i18n';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
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
