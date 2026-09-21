import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { ResourceDetailClient } from '@/app/resources/[slug]/ResourceDetailClient';
import { getSiteNameFromUrl } from '@/shared/utils/utils';
import { LanguageProvider } from '@/shared/ui/i18n/LanguageContext';
import type { Resource } from '@/types/resource';

function createResource(overrides: Partial<Resource> = {}): Resource {
  return {
    id: 1,
    name: 'Test Resource',
    slug: 'test-resource',
    type: 'library',
    description: 'A test resource description for testing purposes',
    short_description: 'Test resource summary',
    documentation_url: null,
    github_url: null,
    license: 'MIT',
    itqan_badge: false,
    status: 'published',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    version: '1.0.0',
    github_stats: null,
    total_downloads: 1000,
    downloads: 1000,
    source: 'ratq',
    source_url: null,
    ...overrides,
  };
}

function renderDetail(resource: Resource, locale: 'ar' | 'en' = 'en') {
  localStorage.setItem('ratq_locale', locale);
  const result = render(
    <LanguageProvider>
      <ResourceDetailClient resource={resource} repoPreview={null} />
    </LanguageProvider>,
  );
  act(() => {});
  return result;
}

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

describe('getSiteNameFromUrl', () => {
  it('strips www. from hostnames', () => {
    expect(getSiteNameFromUrl('https://www.tahbeer.net/recitations')).toBe('tahbeer.net');
  });

  it('keeps non-www hostnames intact', () => {
    expect(getSiteNameFromUrl('https://surah-navigator.example.com')).toBe(
      'surah-navigator.example.com',
    );
  });

  it('returns null for empty or unparseable values', () => {
    expect(getSiteNameFromUrl('')).toBeNull();
    expect(getSiteNameFromUrl('not-a-url')).toBeNull();
  });
});

describe('website visit-site CTA', () => {
  it('renders with the correct site name and destination when website_url exists', () => {
    const resource = createResource({ website_url: 'https://www.tahbeer.net/recitations' });
    renderDetail(resource, 'en');

    expect(screen.getByRole('heading', { name: 'Visit the resource site' })).toBeInTheDocument();
    expect(screen.getByText('Opens tahbeer.net in a new tab')).toBeInTheDocument();

    const link = screen.getByRole('link', { name: 'Visit tahbeer.net' });
    expect(link).toHaveAttribute('href', 'https://www.tahbeer.net/recitations');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('does not render when website_url is absent', () => {
    renderDetail(createResource({ website_url: null }), 'en');

    expect(screen.queryByRole('heading', { name: 'Visit the resource site' })).not.toBeInTheDocument();
  });

  it('does not render when website_url has no parseable site name', () => {
    renderDetail(createResource({ website_url: 'not-a-url' }), 'en');

    expect(screen.queryByRole('heading', { name: 'Visit the resource site' })).not.toBeInTheDocument();
  });

  it('renders Arabic strings for the website banner', () => {
    const resource = createResource({ website_url: 'https://tahbeer.net' });
    renderDetail(resource, 'ar');

    expect(screen.getByRole('heading', { name: 'زيارة موقع المورد' })).toBeInTheDocument();
    expect(screen.getByText('يفتح tahbeer.net في تبويب جديد')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'زيارة tahbeer.net' })).toBeInTheDocument();
  });

  it('lets the Arabic description inherit the section direction (no hardcoded dir="ltr", issue #299 RTL fix)', () => {
    const resource = createResource({ website_url: 'https://tahbeer.net' });
    renderDetail(resource, 'ar');

    const description = screen.getByText('يفتح tahbeer.net في تبويب جديد');
    const bannerSection = description.closest('section');
    expect(bannerSection).toHaveAttribute('dir', 'rtl');
    expect(description).not.toHaveAttribute('dir');
  });
});

describe('use-API CTA', () => {
  it('renders with endpoint description when api_endpoint and api_docs exist', () => {
    const resource = createResource({
      type: 'api',
      api_endpoint: 'https://api.example.com/v1/search',
      api_docs: 'https://api.example.com/docs',
    });
    renderDetail(resource, 'en');

    expect(screen.getByRole('heading', { name: 'Use the API' })).toBeInTheDocument();
    expect(screen.getByText('Endpoint: https://api.example.com/v1/search')).toBeInTheDocument();

    const link = screen.getByRole('link', { name: 'Open API docs' });
    expect(link).toHaveAttribute('href', 'https://api.example.com/docs');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders without the endpoint description when only api_docs exists', () => {
    const resource = createResource({ type: 'api', api_docs: 'https://api.example.com/docs' });
    renderDetail(resource, 'en');

    expect(screen.getByRole('heading', { name: 'Use the API' })).toBeInTheDocument();
    expect(screen.queryByText(/Endpoint:/)).not.toBeInTheDocument();
  });

  it('does not render when no API data exists', () => {
    renderDetail(createResource({ type: 'api', api_endpoint: null, api_docs: null }), 'en');

    expect(screen.queryByRole('heading', { name: 'Use the API' })).not.toBeInTheDocument();
  });

  it('renders Arabic strings for the API banner', () => {
    const resource = createResource({
      type: 'api',
      api_endpoint: 'https://api.example.com/v1/search',
      api_docs: 'https://api.example.com/docs',
    });
    renderDetail(resource, 'ar');

    expect(screen.getByRole('heading', { name: 'استخدم الـ API' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'افتح توثيق الـ API' })).toBeInTheDocument();
  });
});

describe('mock data propagation (ratq-native source)', () => {
  it('populates website_url for mock resources that have one and renders their banner', () => {
    const resource = createResource({
      slug: 'quranic-search-api',
      website_url: 'https://quran-search.example.com',
    });
    renderDetail(resource, 'en');

    expect(
      screen.getByRole('link', { name: 'Visit quran-search.example.com' }),
    ).toHaveAttribute('href', 'https://quran-search.example.com');
  });
});
