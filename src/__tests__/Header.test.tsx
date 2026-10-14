import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { Header } from '@/shared/ui/layout/Header';
import { LanguageProvider } from '@/shared/ui/i18n/LanguageContext';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/',
}));

const mockUseAuth = vi.fn();

vi.mock('@/hooks/useAuth', () => ({
  useAuth: (...args: unknown[]) => mockUseAuth(...args),
}));

function setup(locale: 'ar' | 'en' = 'en', user: unknown = null) {
  mockUseAuth.mockReturnValue({ user, logout: vi.fn() });
  localStorage.setItem('ratq_locale', locale);
  const result = render(
    <LanguageProvider>
      <Header />
    </LanguageProvider>
  );
  act(() => {});
  return result;
}

describe('Header tablet login control (#348)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it.each(['ar', 'en'] as const)(
    'shows the login control from the md breakpoint in %s',
    (locale) => {
      const { container } = setup(locale);
      const login = screen.getByRole('link', {
        name: locale === 'ar' ? 'تسجيل الدخول' : 'Log in',
      });
      expect(login.className).toContain('md:inline-flex');
      expect(login.className).not.toContain('lg:inline-flex');
      expect(container.querySelector('header')).toBeInTheDocument();
    }
  );

  it('shows the logout control from the md breakpoint when signed in', () => {
    setup('en', { id: 1, email: 'a@x.com' });
    const logout = screen.getByRole('button', { name: 'Log out' });
    expect(logout.className).toContain('md:inline-flex');
    expect(logout.className).not.toContain('lg:inline-flex');
  });
});
