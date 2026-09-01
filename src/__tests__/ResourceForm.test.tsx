import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { RESOURCE_TYPES } from '@/shared/constants/resource-types';
import { LanguageProvider } from '@/shared/ui/i18n/LanguageContext';
import { ResourceForm } from '@/modules/developer/components/ResourceForm';

function renderWithProvider(ui: React.ReactElement) {
  const result = render(<LanguageProvider>{ui}</LanguageProvider>);
  act(() => {});
  return result;
}

describe('ResourceForm — type dropdown (src/modules/developer/components/ResourceForm.tsx:33)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem('ratq_locale', 'en');
  });

  it('renders all 16 resource types as options from shared constant', () => {
    renderWithProvider(<ResourceForm onSubmit={vi.fn()} />);
    const options = screen.getAllByRole('option') as HTMLOptionElement[];
    expect(options).toHaveLength(16);
    expect(options.map((o) => o.value)).toEqual([...RESOURCE_TYPES]);
  });

  it('shows translated English labels for CMS types', () => {
    renderWithProvider(<ResourceForm onSubmit={vi.fn()} />);
    expect(screen.getByRole('option', { name: 'Recitation' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Mushaf' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Tajweed' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Translation' })).toBeInTheDocument();
  });

  it('preselects initial type even for CMS types like recitation', () => {
    renderWithProvider(<ResourceForm onSubmit={vi.fn()} initial={{ type: 'recitation' }} />);
    expect((screen.getByRole('combobox') as HTMLSelectElement).value).toBe('recitation');
  });

  it('preselects initial type for tajweed', () => {
    renderWithProvider(<ResourceForm onSubmit={vi.fn()} initial={{ type: 'tajweed' }} />);
    expect((screen.getByRole('combobox') as HTMLSelectElement).value).toBe('tajweed');
  });

  it('defaults to library when no initial type', () => {
    renderWithProvider(<ResourceForm onSubmit={vi.fn()} />);
    expect((screen.getByRole('combobox') as HTMLSelectElement).value).toBe('library');
  });

  it('switches labels to Arabic when locale is ar', () => {
    localStorage.clear();
    localStorage.setItem('ratq_locale', 'ar');
    // LanguageProvider defaults to 'ar', so no async switch needed
    const result = render(
      <LanguageProvider>
        <ResourceForm onSubmit={vi.fn()} />
      </LanguageProvider>,
    );
    act(() => {});
    expect(screen.getByRole('option', { name: 'تلاوة' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'تجويد' })).toBeInTheDocument();
    result.unmount();
  });
});
