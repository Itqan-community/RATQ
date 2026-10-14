import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import DashboardResourcesPage from '@/app/dashboard/resources/page';
import { LanguageProvider } from '@/shared/ui/i18n/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { listDeveloperResources } from '@/modules/developer/application/use-cases/list-developer-resources';
import { updateResource } from '@/modules/developer/application/use-cases/update-developer-resource';
import type { Resource } from '@/types/resource';
import { createMockRouter } from './test-utils/mockRouter';
import { createMockAuthContext } from './test-utils/mockAuth';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('next/link', () => ({
  default: ({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/shared/ui/layout/Sidebar', () => ({
  Sidebar: () => <aside data-testid="sidebar" />,
}));

vi.mock('@/modules/developer/application/use-cases/list-developer-resources', () => ({
  listDeveloperResources: vi.fn(),
}));

vi.mock('@/modules/developer/application/use-cases/create-developer-resource', () => ({
  createResource: vi.fn(),
}));

vi.mock('@/modules/developer/application/use-cases/update-developer-resource', () => ({
  updateResource: vi.fn(),
}));

vi.mock('@/modules/developer/application/use-cases/delete-developer-resource', () => ({
  deleteResource: vi.fn(),
}));

const mockUser = {
  id: 1,
  email: 'dev@example.com',
  display_name: 'Test Dev',
  role: 'developer' as const,
  created_at: '2026-01-01T00:00:00Z',
};

function makeResource(overrides: Partial<Resource>): Resource {
  return {
    id: 1,
    name: 'Resource',
    slug: 'resource',
    source: 'ratq',
    source_url: null,
    type: 'library',
    description: 'Description',
    short_description: 'Short description',
    documentation_url: null,
    github_url: null,
    license: 'MIT',
    itqan_badge: false,
    status: 'published',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    version: null,
    github_stats: null,
    ...overrides,
  } as Resource;
}

const resourceA = makeResource({
  id: 1,
  name: 'Alpha',
  slug: 'alpha',
  short_description: 'Alpha summary',
  description: 'Alpha description',
  license: 'MIT',
  github_url: 'https://github.com/example/alpha',
});

const resourceB = makeResource({
  id: 2,
  name: 'Beta',
  slug: 'beta',
  short_description: 'Beta summary',
  description: 'Beta description',
  license: 'Apache-2.0',
  github_url: 'https://github.com/example/beta',
});

async function renderPage() {
  render(
    <LanguageProvider>
      <DashboardResourcesPage />
    </LanguageProvider>
  );
  // The page lists resources in an effect; wait for them to appear.
  await screen.findByText('Alpha');
}

const nameField = () => screen.getByPlaceholderText('Resource name') as HTMLInputElement;
const shortDescriptionField = () => screen.getByPlaceholderText('Brief one-line summary shown in listings') as HTMLInputElement;

describe('DashboardResourcesPage edit form (src/app/dashboard/resources/page.tsx)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem('ratq_locale', 'en');
    vi.mocked(useRouter).mockReturnValue(createMockRouter());
    vi.mocked(useAuth).mockReturnValue(createMockAuthContext({ user: mockUser, loading: false }));
    vi.mocked(listDeveloperResources).mockResolvedValue([resourceA, resourceB]);
    vi.mocked(updateResource).mockImplementation(async (id, data) => ({ ...(id === 1 ? resourceA : resourceB), ...data }) as Resource);
  });

  it('DashboardResourcesPage_SwitchEditTarget_ShowsNewResourceValues', async () => {
    await renderPage();
    const editButtons = screen.getAllByRole('button', { name: 'Edit' });

    fireEvent.click(editButtons[0]);
    expect(nameField().value).toBe('Alpha');

    // Switch to the second resource without closing the form.
    fireEvent.click(editButtons[1]);

    expect(screen.getByRole('heading', { name: 'Edit: Beta' })).toBeInTheDocument();
    expect(nameField().value).toBe('Beta');
    expect(shortDescriptionField().value).toBe('Beta summary');
  });

  it('saves the values of the resource being edited after switching targets', async () => {
    await renderPage();
    const editButtons = screen.getAllByRole('button', { name: 'Edit' });

    fireEvent.click(editButtons[0]);
    fireEvent.click(editButtons[1]);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
    });

    await waitFor(() => expect(updateResource).toHaveBeenCalledTimes(1));
    expect(updateResource).toHaveBeenCalledWith(2, expect.objectContaining({ name: 'Beta', license: 'Apache-2.0' }));
  });

  it('opens an empty create form when switching from an edit to Add resource', async () => {
    await renderPage();

    fireEvent.click(screen.getAllByRole('button', { name: 'Edit' })[0]);
    expect(nameField().value).toBe('Alpha');

    fireEvent.click(screen.getByRole('button', { name: 'Add resource' }));

    expect(screen.getByRole('heading', { name: 'Add resource' })).toBeInTheDocument();
    expect(nameField().value).toBe('');
    expect(shortDescriptionField().value).toBe('');
  });
});
