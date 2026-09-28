import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { RelatedResources } from '@/modules/resources/components/RelatedResources';
import { LanguageProvider } from '@/shared/ui/i18n/LanguageContext';
import type { Resource } from '@/types/resource';

const mockUseResources = vi.fn();

vi.mock('@/hooks/useResources', () => ({
  useResources: (...args: unknown[]) => mockUseResources(...args),
}));

const cmsResource = {
  id: 2,
  name: 'Ad-Douri Mushaf',
  slug: 'cms-27',
  type: 'mushaf',
  description: 'English description',
  short_description: 'English description',
  name_ar: 'المصحف المرتل برواية الدوري',
  description_ar: 'وصف عربي',
  content_language: 'en',
  title_language: 'en',
} as Resource;

function renderRelated(locale: 'ar' | 'en') {
  localStorage.setItem('ratq_locale', locale);
  render(
    <LanguageProvider>
      <RelatedResources currentResourceId={1} currentResourceType="mushaf" />
    </LanguageProvider>,
  );
  act(() => {});
}

beforeEach(() => {
  localStorage.clear();
  mockUseResources.mockReturnValue({ data: { results: [cmsResource] }, isLoading: false });
});

describe('RelatedResources', () => {
  it('shows the Arabic name and description on the Arabic site', () => {
    renderRelated('ar');

    expect(screen.getByRole('heading', { name: 'المصحف المرتل برواية الدوري' })).toHaveAttribute('dir', 'rtl');
    expect(screen.getByText('وصف عربي')).toHaveAttribute('dir', 'rtl');
    expect(screen.queryByText('Ad-Douri Mushaf')).not.toBeInTheDocument();
  });

  it('shows the English name and description on the English site', () => {
    renderRelated('en');

    expect(screen.getByRole('heading', { name: 'Ad-Douri Mushaf' })).toHaveAttribute('dir', 'ltr');
    expect(screen.getByText('English description')).toBeInTheDocument();
  });
});
