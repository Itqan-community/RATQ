import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { ResourceDetailClient } from '@/app/resources/[slug]/ResourceDetailClient';
import { GithubStatsCard } from '@/modules/resources/components/GithubStatsCard';
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

function renderWithProvider(ui: React.ReactElement) {
  localStorage.setItem('ratq_locale', 'en');
  const result = render(<LanguageProvider>{ui}</LanguageProvider>);
  act(() => {});
  return result;
}

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

describe('GithubStatsCard (unit)', () => {
  it('renders stats values and a View GitHub link for a real GitHub URL', () => {
    renderWithProvider(
      <GithubStatsCard
        githubUrl="https://github.com/example/repo"
        stats={{ stars: 342, forks: 58, open_issues: 7, last_commit: '2026-04-20T10:30:00Z' }}
      />,
    );

    expect(screen.getByRole('heading', { name: /github statistics/i })).toBeInTheDocument();
    expect(screen.getByText('342')).toBeInTheDocument();
    expect(screen.getByText('58')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();

    const link = screen.getByRole('link', { name: 'View GitHub' });
    expect(link).toHaveAttribute('href', 'https://github.com/example/repo');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders the not-connected note when stats are null but the URL is real', () => {
    renderWithProvider(<GithubStatsCard githubUrl="https://github.com/example/repo" stats={null} />);

    expect(screen.getByRole('heading', { name: /github statistics/i })).toBeInTheDocument();
    expect(
      screen.getByText('GitHub statistics have not been connected for this resource yet.'),
    ).toBeInTheDocument();
  });
});

describe('ResourceDetailClient GitHub stats gating (issue #299 regression)', () => {
  it('shows the GitHub stats box and View GitHub button for a genuine GitHub resource', () => {
    const resource = createResource({
      github_url: 'https://github.com/example/repo',
      github_stats: { stars: 10, forks: 2, open_issues: 1, last_commit: '2026-04-01T00:00:00Z' },
    });
    renderWithProvider(<ResourceDetailClient resource={resource} repoPreview={null} />);

    expect(screen.getByRole('heading', { name: /github statistics/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/example/repo',
    );
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('shows no GitHub stats box and no View GitHub button when github_url is null', () => {
    const resource = createResource({ github_url: null, documentation_url: null });
    renderWithProvider(<ResourceDetailClient resource={resource} repoPreview={null} />);

    expect(screen.queryByRole('heading', { name: /github statistics/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'View GitHub' })).not.toBeInTheDocument();
  });

  it('does not treat a documentation_url-only resource as a GitHub resource (old fallback removed)', () => {
    const resource = createResource({
      github_url: null,
      documentation_url: 'https://docs.example.com/surah-navigator',
    });
    renderWithProvider(<ResourceDetailClient resource={resource} repoPreview={null} />);

    expect(screen.queryByRole('heading', { name: /github statistics/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'View GitHub' })).not.toBeInTheDocument();
  });

  it('does not show GitHub stats for a non-GitHub git URL', () => {
    const resource = createResource({ github_url: 'https://gitlab.com/example/repo' });
    renderWithProvider(<ResourceDetailClient resource={resource} repoPreview={null} />);

    expect(screen.queryByRole('heading', { name: /github statistics/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'View GitHub' })).not.toBeInTheDocument();
  });
});
