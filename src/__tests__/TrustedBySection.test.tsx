import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TrustedBySection } from '@/components/resources/TrustedBySection';
import { LanguageProvider } from '@/i18n/LanguageContext';
import type { Consumer } from '@/types/resource';

const makeConsumers = (count: number): Consumer[] =>
  Array.from({ length: count }, (_, i) => ({
    name: `Consumer ${i + 1}`,
    website_url: `https://consumer${i + 1}.app`,
    category: i % 2 === 0 ? 'Enterprise' : 'Platform',
  }));

function renderWithProvider(ui: React.ReactElement, locale: 'ar' | 'en' = 'ar') {
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: (key: string) => key === 'ratq_locale' ? locale : null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
    },
    writable: true,
  });
  return render(ui, {
    wrapper: ({ children }) => (
      <LanguageProvider>{children}</LanguageProvider>
    ),
  });
}

describe('TrustedBySection — Sidebar', () => {
  it('renders null when consumers is empty', () => {
    const { container } = renderWithProvider(<TrustedBySection consumers={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders heading and count (English)', () => {
    const consumers = makeConsumers(5);
    renderWithProvider(<TrustedBySection consumers={consumers} />, 'en');
    expect(screen.getByText('Trusted By')).toBeTruthy();
    expect(screen.getByText('Trusted by 5 applications')).toBeTruthy();
  });

  it('renders heading and count (Arabic)', () => {
    const consumers = makeConsumers(5);
    renderWithProvider(<TrustedBySection consumers={consumers} />, 'ar');
    expect(screen.getByText('موثوق من قبل')).toBeTruthy();
    expect(screen.getByText('موثوق من قبل 5 تطبيق')).toBeTruthy();
  });

  it('renders all consumers at once (no expand/collapse)', () => {
    const consumers = makeConsumers(5);
    const { container } = renderWithProvider(<TrustedBySection consumers={consumers} />, 'en');
    const avatars = container.querySelectorAll('[class*="aspect-square"]');
    expect(avatars.length).toBe(5);
  });

  it('does not show expand/collapse button', () => {
    const consumers = makeConsumers(8);
    renderWithProvider(<TrustedBySection consumers={consumers} />, 'en');
    expect(screen.queryByText(/Show all|Show less|عرض الكل|عرض أقل/)).toBeNull();
  });

  it('shows hover tooltip with name when logo is hovered', () => {
    const consumers = makeConsumers(3);
    const { container } = renderWithProvider(<TrustedBySection consumers={consumers} />, 'en');
    const wrappers = container.querySelectorAll('[class*="transition-transform"]');
    expect(wrappers.length).toBeGreaterThan(0);
    fireEvent.mouseEnter(wrappers[0]);
    expect(screen.getByText('Consumer 1')).toBeTruthy();
    fireEvent.mouseLeave(wrappers[0]);
    expect(screen.queryByText('Consumer 1')).toBeNull();
  });

  it('shows category in tooltip when available', () => {
    const consumers = makeConsumers(3);
    const { container } = renderWithProvider(<TrustedBySection consumers={consumers} />, 'en');
    const wrappers = container.querySelectorAll('[class*="transition-transform"]');
    expect(wrappers.length).toBeGreaterThan(0);
    fireEvent.mouseEnter(wrappers[0]);
    expect(screen.getByText('Enterprise')).toBeTruthy();
  });

  it('renders consumer avatars as clickable links', () => {
    const consumers = makeConsumers(1);
    const { container } = renderWithProvider(<TrustedBySection consumers={consumers} />, 'en');
    const avatar = container.querySelector('[class*="aspect-square"]');
    const link = avatar?.closest('a');
    expect(link).toBeTruthy();
    expect(link?.getAttribute('href')).toBe('https://consumer1.app');
    expect(link?.getAttribute('target')).toBe('_blank');
  });

  it('renders exactly the number of logos matching consumers count', () => {
    const consumers = makeConsumers(8);
    const { container } = renderWithProvider(<TrustedBySection consumers={consumers} />, 'en');
    const avatars = container.querySelectorAll('[class*="aspect-square"]');
    expect(avatars.length).toBe(8);
  });
});
