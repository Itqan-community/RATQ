import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { ResourceCard } from '@/components/resources/ResourceCard';
import { LanguageProvider } from '@/i18n/LanguageContext';
import type { Resource } from '@/types/resource';

function createResource(overrides: Partial<Resource> = {}): Resource {
  return {
    id: 1,
    name: 'Test Resource',
    slug: 'test-resource',
    type: 'api',
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

function renderWithProvider(ui: React.ReactElement) {
  localStorage.setItem('ratq_locale', 'en');
  const result = render(<LanguageProvider>{ui}</LanguageProvider>);
  act(() => {});
  return result;
}

describe('ResourceCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders rank badge when rank prop is provided', () => {
    renderWithProvider(
      <ResourceCard resource={createResource()} rank={1} />
    );
    expect(screen.getByLabelText('Rank 1')).toBeInTheDocument();
    expect(screen.getByText('#1')).toBeInTheDocument();
  });

  it('renders download count in metadata row', () => {
    renderWithProvider(
      <ResourceCard resource={createResource()} downloadCount={12345} />
    );
    expect(screen.getByText('12.3k')).toBeInTheDocument();
  });

  it('renders both rank badge and download count together', () => {
    renderWithProvider(
      <ResourceCard resource={createResource()} rank={3} downloadCount={999} />
    );
    expect(screen.getByLabelText('Rank 3')).toBeInTheDocument();
    expect(screen.getByText('999')).toBeInTheDocument();
  });

  it('does not render rank badge when rank prop is omitted', () => {
    const { container } = renderWithProvider(
      <ResourceCard resource={createResource()} />
    );
    expect(container.querySelector('[aria-label^="Rank"]')).not.toBeInTheDocument();
  });

  it('does not render download count when downloadCount prop is omitted', () => {
    const { container } = renderWithProvider(
      <ResourceCard resource={createResource()} />
    );
    expect(container.textContent).not.toContain('downloads');
  });

  it('wraps card content in a Link to the resource detail page', () => {
    renderWithProvider(
      <ResourceCard resource={createResource({ slug: 'my-resource' })} />
    );
    const link = screen.getByRole('link', { name: /Test Resource/i });
    expect(link).toHaveAttribute('href', '/resources/my-resource');
  });

  it('does not render a separate Details link', () => {
    renderWithProvider(
      <ResourceCard resource={createResource()} />
    );
    expect(screen.queryByText('Details')).not.toBeInTheDocument();
  });

  it('renders github button when github_url is present', () => {
    renderWithProvider(
      <ResourceCard resource={createResource({ github_url: 'https://github.com/test/repo' })} />
    );
    const githubButton = screen.getByLabelText('GitHub');
    expect(githubButton).toHaveAttribute('aria-label', 'GitHub');
    expect(githubButton.tagName).toBe('BUTTON');
  });

  it('clamps short description to 2 lines', () => {
    renderWithProvider(
      <ResourceCard resource={createResource({
        short_description: 'This is a very long description that should be clamped to two lines maximum regardless of how much text is provided here to ensure the card stays compact.',
      })} />
    );
    const descriptionEl = screen.getByText(/This is a very long description/i);
    expect(descriptionEl.closest('p')).toHaveClass('line-clamp-2');
  });
});
