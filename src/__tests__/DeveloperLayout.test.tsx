import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import DeveloperLayout from '@/app/developer/layout';

vi.mock('next/navigation', () => ({
  usePathname: () => '/developer',
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('next/link', () => ({
  default: ({ children, className, onClick }: any) => (
    <span className={className} onClick={onClick}>
      {children}
    </span>
  ),
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: '1', display_name: 'Test User', role: 'developer' },
    loading: false,
    logout: vi.fn(),
  }),
}));

describe('DeveloperLayout', () => {
  it('offsets the sticky top bar below the fixed root header (regression for #199)', () => {
    render(
      <DeveloperLayout>
        <div>content</div>
      </DeveloperLayout>
    );

    const topBar = screen.getByText('Test User').closest('div.sticky');
    expect(topBar).toHaveClass('top-32');
    // Guard against regressing back to top-0, which is hidden behind the
    // root Header (sticky top-0 z-50) once the page is scrolled.
    expect(topBar).not.toHaveClass('top-0');
  });
});
