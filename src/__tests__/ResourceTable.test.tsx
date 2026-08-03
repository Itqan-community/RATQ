import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { ResourceTable } from '@/components/developer/ResourceTable';
import { LanguageProvider } from '@/i18n/LanguageContext';
import type { Resource } from '@/types/resource';

// Mock next/link — render children as a <span>
vi.mock('next/link', () => ({
  default: ({ children, className, href }: any) => (
    <span className={className} data-href={href}>
      {children}
    </span>
  ),
}));

function createResource(overrides: Partial<Resource> = {}): Resource {
  return {
    id: 1,
    name: 'Test Resource',
    slug: 'test-resource',
    type: 'api',
    description: 'A test resource',
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
    total_downloads: 100,
    downloads: 100,
    source: 'ratq',
    source_url: null,
    ...overrides,
  };
}

function renderWithProvider(ui: React.ReactElement) {
  localStorage.setItem('ratq_locale', 'en');
  const result = render(<LanguageProvider>{ui}</LanguageProvider>);
  act(() => {});
  return result;
}

describe('ResourceTable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders resource list', () => {
    const resources: Resource[] = [
      createResource(),
      createResource({ id: 2, name: 'Another Resource', slug: 'another-resource' }),
    ];
    renderWithProvider(<ResourceTable resources={resources} />);
    expect(screen.getByText('Test Resource')).toBeInTheDocument();
    expect(screen.getByText('Another Resource')).toBeInTheDocument();
  });

  it('shows empty state when no resources', () => {
    renderWithProvider(<ResourceTable resources={[]} emptyLabel="No resources here" />);
    expect(screen.getByText('No resources here')).toBeInTheDocument();
  });

  it('uses default empty label', () => {
    renderWithProvider(<ResourceTable resources={[]} />);
    expect(screen.getByText('لا توجد موارد')).toBeInTheDocument();
  });

  it('renders resource type badge', () => {
    renderWithProvider(<ResourceTable resources={[createResource({ type: 'sdk' })]} />);
    expect(screen.getByText('SDK')).toBeInTheDocument();
  });

  it('renders published status label', () => {
    renderWithProvider(<ResourceTable resources={[createResource({ status: 'published' })]} />);
    expect(screen.getByText('منشور')).toBeInTheDocument();
  });

  it('renders draft status label', () => {
    renderWithProvider(<ResourceTable resources={[createResource({ status: 'draft' })]} />);
    expect(screen.getByText('مسودة')).toBeInTheDocument();
  });

  it('renders archived status label', () => {
    renderWithProvider(<ResourceTable resources={[createResource({ status: 'archived' })]} />);
    expect(screen.getByText('أرشيف')).toBeInTheDocument();
  });

  it('renders Itqan badge when itqan_badge is true', () => {
    renderWithProvider(<ResourceTable resources={[createResource({ itqan_badge: true })]} />);
    expect(screen.getByText('★ Itqan')).toBeInTheDocument();
  });

  it('does not render Itqan badge when itqan_badge is false', () => {
    renderWithProvider(<ResourceTable resources={[createResource({ itqan_badge: false })]} />);
    expect(screen.queryByText('★ Itqan')).not.toBeInTheDocument();
  });

  it('renders API access management button for API resources', () => {
    renderWithProvider(<ResourceTable resources={[createResource({ type: 'api' })]} />);
    expect(screen.getByText('إدارة الوصول')).toBeInTheDocument();
  });

  it('does not render API access management button for non-API resources', () => {
    renderWithProvider(<ResourceTable resources={[createResource({ type: 'sdk' })]} />);
    expect(screen.queryByText('إدارة الوصول')).not.toBeInTheDocument();
  });

  it('renders version and download count', () => {
    renderWithProvider(
      <ResourceTable resources={[createResource({ version: '2.0.0', total_downloads: 250 })]} />
    );
    expect(screen.getByText('2.0.0 · 250 تحميل')).toBeInTheDocument();
  });

  it('renders "بدون إصدار" when version is null', () => {
    renderWithProvider(<ResourceTable resources={[createResource({ version: null })]} />);
    expect(screen.getByText('بدون إصدار · 100 تحميل')).toBeInTheDocument();
  });

  it('renders view button', () => {
    renderWithProvider(<ResourceTable resources={[createResource()]} />);
    expect(screen.getByText('عرض')).toBeInTheDocument();
  });
});
