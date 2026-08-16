import { act } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ReportModal } from '@/modules/resources/components/ReportModal';
import { LanguageProvider } from '@/shared/ui/i18n/LanguageContext';

function renderModal(locale: 'ar' | 'en') {
  localStorage.setItem('ratq_locale', locale);

  render(
    <LanguageProvider>
      <ReportModal
        isOpen
        onClose={() => {}}
        resourceId={1}
        resourceName="Test resource"
      />
    </LanguageProvider>,
  );

  act(() => {});
}

describe('ReportModal', () => {
  it('renders the report placeholders in Arabic', () => {
    renderModal('ar');

    expect(screen.getByRole('option', { name: 'اختر سببا' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('قدم تفاصيل إضافية...')).toBeInTheDocument();
  });

  it('renders the report placeholders in English', () => {
    renderModal('en');

    expect(screen.getByRole('option', { name: 'Select a reason' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Provide additional context...')).toBeInTheDocument();
  });
});
