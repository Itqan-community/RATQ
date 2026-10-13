import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm, safeRedirectPath } from '@/modules/auth/components/LoginForm';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, useSearchParams } from 'next/navigation';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/modules/auth/application/use-cases/get-github-oauth-url', () => ({
  githubOAuthUrl: 'https://github.com/login/oauth/authorize?test=1',
}));

vi.mock('@/shared/ui/i18n', () => ({
  useLanguage: () => ({
    t: {
      header: { auth: {} },
      auth: { sessionExpired: 'Session expired', forgotPassword: 'Forgot password?' },
    },
    direction: 'ltr',
    locale: 'en',
  }),
}));

describe('safeRedirectPath', () => {
  it('keeps internal absolute paths', () => {
    expect(safeRedirectPath('/resources/some-slug')).toBe('/resources/some-slug');
    expect(safeRedirectPath('/resources/كتاب')).toBe(
      `/resources/${encodeURIComponent('كتاب')}`,
    );
    expect(safeRedirectPath('/resources/x?tab=comments#main')).toBe(
      '/resources/x?tab=comments#main',
    );
  });

  it('falls back to the dashboard otherwise', () => {
    expect(safeRedirectPath(null)).toBe('/dashboard');
    expect(safeRedirectPath('')).toBe('/dashboard');
    expect(safeRedirectPath('https://evil.example/phish')).toBe('/dashboard');
    expect(safeRedirectPath('//evil.example/phish')).toBe('/dashboard');
    expect(safeRedirectPath('dashboard')).toBe('/dashboard');
  });

  it('rejects backslash and control-character bypasses', () => {
    // WHATWG strips these, turning the value protocol-relative.
    expect(safeRedirectPath('/\\evil.example/phish')).toBe('/dashboard');
    expect(safeRedirectPath('/\t/evil.example/phish')).toBe('/dashboard');
    expect(safeRedirectPath('/\n/evil.example/phish')).toBe('/dashboard');
  });

  it('rejects dot-segment collapses back to protocol-relative', () => {
    expect(safeRedirectPath('/.//evil.example/x')).toBe('/dashboard');
    expect(safeRedirectPath('/a/..//evil.example/x')).toBe('/dashboard');
    expect(safeRedirectPath('/%2e//evil.example')).toBe('/dashboard');
  });

  it('keeps percent-encoded separators on-site (inert, no off-site hop)', () => {
    expect(safeRedirectPath('/%09/evil.example/phish')).toBe(
      '/%09/evil.example/phish',
    );
    expect(safeRedirectPath('/%5cevil.example/phish')).toBe(
      '/%5cevil.example/phish',
    );
  });
});

describe('LoginForm redirect (#345)', () => {
  const push = vi.fn();
  const refresh = vi.fn();
  const login = vi.fn();

  const renderForm = (redirect: string | null) => {
    vi.mocked(useRouter).mockReturnValue({ push, refresh } as never);
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams(
        redirect ? `redirect=${redirect}` : '',
      ) as unknown as ReturnType<typeof useSearchParams>,
    );
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: false,
      error: null,
      clearError: vi.fn(),
      login,
      loginWithCode: vi.fn(),
      register: vi.fn(),
      forgotPassword: vi.fn(),
      resetPassword: vi.fn(),
      verifyEmail: vi.fn(),
    } as never);
    render(<LoginForm />);
  };

  const submit = async () => {
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'secret123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));
  };

  beforeEach(() => {
    vi.clearAllMocks();
    document.body.replaceChildren();
    login.mockResolvedValue({ success: true });
  });

  it('returns to the redirect target after a successful login', async () => {
    renderForm('/resources/some-slug');
    await submit();
    await waitFor(() => expect(login).toHaveBeenCalled());
    expect(push).toHaveBeenCalledWith('/resources/some-slug');
  });

  it('lands on the dashboard when no redirect is given', async () => {
    renderForm(null);
    await submit();
    await waitFor(() => expect(login).toHaveBeenCalled());
    expect(push).toHaveBeenCalledWith('/dashboard');
  });

  it('sends an evil redirect to the dashboard', async () => {
    renderForm('https://evil.example/phish');
    await submit();
    await waitFor(() => expect(login).toHaveBeenCalled());
    expect(push).toHaveBeenCalledWith('/dashboard');
  });
});
