// src/test/theme-customizer.test.tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeCustomizerFloatingButton } from '@/components/theme/ThemeCustomizerFloatingButton';
import { ThemeCustomizerModal } from '@/components/theme/ThemeCustomizerModal';
import { useThemeStore } from '@/store/useThemeStore';

describe('Theme Customizer Component & Store', () => {
  beforeEach(() => {
    useThemeStore.getState().resetDefaults();
    localStorage.setItem('ratq_theme_customizer_first_visit_v1', 'true');
  });

  it('renders floating button and opens modal when clicked', () => {
    render(<ThemeCustomizerFloatingButton />);
    const fab = screen.getByRole('button', { name: /تخصيص الثيم والمظهر/i });
    expect(fab).toBeInTheDocument();

    // Open modal
    fireEvent.click(fab);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'تخصيص الثيم والمظهر' })).toBeInTheDocument();
  });

  it('opens modal automatically on first visit when not previously seen', () => {
    localStorage.removeItem('ratq_theme_customizer_first_visit_v1');
    render(<ThemeCustomizerFloatingButton />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(localStorage.getItem('ratq_theme_customizer_first_visit_v1')).toBe('true');
  });

  it('switches between light and dark modes', () => {
    render(<ThemeCustomizerModal isOpen={true} onClose={() => {}} />);
    const darkBtn = screen.getByText(/الوضع الليلي/i).closest('button');
    expect(darkBtn).toBeTruthy();

    fireEvent.click(darkBtn!);
    expect(useThemeStore.getState().theme).toBe('dark');

    const lightBtn = screen.getByText(/الوضع النهاري/i).closest('button');
    fireEvent.click(lightBtn!);
    expect(useThemeStore.getState().theme).toBe('light');
  });

  it('switches color palettes (olive, gold, navy, default)', () => {
    render(<ThemeCustomizerModal isOpen={true} onClose={() => {}} />);

    const oliveBtn = screen.getByText('ثيم أخضر زيتوني').closest('button');
    expect(oliveBtn).toBeTruthy();
    fireEvent.click(oliveBtn!);
    expect(useThemeStore.getState().palette).toBe('olive');

    const goldBtn = screen.getByText(/الثيم الذهبي/i).closest('button');
    expect(goldBtn).toBeTruthy();
    fireEvent.click(goldBtn!);
    expect(useThemeStore.getState().palette).toBe('gold');

    const navyBtn = screen.getByText('الأسود الكحلي').closest('button');
    expect(navyBtn).toBeTruthy();
    fireEvent.click(navyBtn!);
    expect(useThemeStore.getState().palette).toBe('navy');
  });

  it('switches typography fonts (IBM Plex Sans vs Thmanyah Sans vs SuisseIntl)', () => {
    render(<ThemeCustomizerModal isOpen={true} onClose={() => {}} />);

    const thmanyahBtn = screen.getByText('خط ثمانية').closest('button');
    expect(thmanyahBtn).toBeTruthy();
    fireEvent.click(thmanyahBtn!);
    expect(useThemeStore.getState().font).toBe('thmanyah');

    const suisseBtn = screen.getByText('SuisseIntl').closest('button');
    expect(suisseBtn).toBeTruthy();
    fireEvent.click(suisseBtn!);
    expect(useThemeStore.getState().font).toBe('suisse');

    const defaultFontBtn = screen.getByText('IBM Plex Sans').closest('button');
    expect(defaultFontBtn).toBeTruthy();
    fireEvent.click(defaultFontBtn!);
    expect(useThemeStore.getState().font).toBe('default');
  });

  it('allows changing border radius and resets defaults', () => {
    render(<ThemeCustomizerModal isOpen={true} onClose={() => {}} />);

    const radius8Btn = screen.getByText('8px').closest('button');
    expect(radius8Btn).toBeTruthy();
    fireEvent.click(radius8Btn!);
    expect(useThemeStore.getState().radius).toBe('8px');

    const resetBtn = screen.getByText(/استعادة الافتراضي/i);
    fireEvent.click(resetBtn);
    expect(useThemeStore.getState().radius).toBe('4px');
    expect(useThemeStore.getState().palette).toBe('gold');
    expect(useThemeStore.getState().font).toBe('suisse');
    expect(useThemeStore.getState().heroLayout).toBe('split');
  });

  it('switches hero section layout (centered vs split vs third)', () => {
    render(<ThemeCustomizerModal isOpen={true} onClose={() => {}} />);

    const splitBtn = screen.getByText(/جانبي مع صورة/i).closest('button');
    expect(splitBtn).toBeTruthy();
    fireEvent.click(splitBtn!);
    expect(useThemeStore.getState().heroLayout).toBe('split');

    const centeredBtn = screen.getByText(/مركزي/i).closest('button');
    expect(centeredBtn).toBeTruthy();
    fireEvent.click(centeredBtn!);
    expect(useThemeStore.getState().heroLayout).toBe('centered');

    const thirdBtn = screen.getByText(/بطاقات/i).closest('button');
    expect(thirdBtn).toBeTruthy();
    fireEvent.click(thirdBtn!);
    expect(useThemeStore.getState().heroLayout).toBe('third');
  });
});
