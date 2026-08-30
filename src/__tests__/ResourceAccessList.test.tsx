import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SWRConfig } from 'swr';
import { ResourceAccessList } from '@/modules/developer/components/ResourceAccessList';
import { listResourceAccess } from '@/modules/resources/application/use-cases/list-resource-access';
import { revokeAccessRequest } from '@/modules/resources/application/use-cases/revoke-access-request';
import { LanguageProvider } from '@/shared/ui/i18n/LanguageContext';
import { ToastProvider } from '@/shared/ui/Toast';
import type { AccessRequest } from '@/types/resource';

vi.mock('@/modules/resources/application/use-cases/list-resource-access', () => ({
  listResourceAccess: vi.fn(),
}));

vi.mock('@/modules/resources/application/use-cases/revoke-access-request', () => ({
  revokeAccessRequest: vi.fn(),
}));

const mockList = listResourceAccess as Mock;
const mockRevoke = revokeAccessRequest as Mock;

function grant(overrides: Partial<AccessRequest> = {}): AccessRequest {
  return {
    id: 1,
    applicant_name: 'sara',
    applicant_display_name: 'Sara Ahmed',
    resource_slug: 'payload-verse-search',
    resource_name: 'Verse Search API',
    status: 'approved',
    message: 'Please grant access.',
    publisher_notes: null,
    created_at: '2026-08-01T10:00:00Z',
    updated_at: '2026-08-02T10:00:00Z',
    ...overrides,
  };
}

function renderList(resourceId = 200_001) {
  localStorage.setItem('ratq_locale', 'en');
  return render(
    <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
      <LanguageProvider>
        <ToastProvider>
          <ResourceAccessList resourceId={resourceId} />
        </ToastProvider>
      </LanguageProvider>
    </SWRConfig>,
  );
}

const revokeButtonFor = (name: string) =>
  screen.getByRole('button', { name: `Revoke access - ${name}` });

describe('ResourceAccessList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('lists everyone holding access to the resource', async () => {
    mockList.mockResolvedValue({
      grants: [
        grant({ id: 1, applicant_display_name: 'Sara Ahmed' }),
        grant({ id: 2, applicant_display_name: 'Bilal Nour' }),
      ],
      total: 2,
    });

    renderList();

    expect(await screen.findByText('Sara Ahmed')).toBeInTheDocument();
    expect(screen.getByText('Bilal Nour')).toBeInTheDocument();
    expect(mockList).toHaveBeenCalledWith(200_001);
  });

  it('shows the empty state when nobody has access', async () => {
    mockList.mockResolvedValue({ grants: [], total: 0 });

    renderList();

    expect(
      await screen.findByText('No one has access to this resource yet.'),
    ).toBeInTheDocument();
  });

  it('shows a failure, not an empty list, when the grants cannot be loaded', async () => {
    // "No one has access" and "we could not find out who has access" are very
    // different statements to make to a publisher.
    mockList.mockRejectedValue(new Error('500'));

    renderList();

    expect(
      await screen.findByText("Couldn't load the access list."),
    ).toBeInTheDocument();
    expect(
      screen.queryByText('No one has access to this resource yet.'),
    ).not.toBeInTheDocument();
  });

  it('offers a retry that refetches the list', async () => {
    mockList.mockRejectedValueOnce(new Error('500')).mockResolvedValue({ grants: [grant()], total: 1 });

    renderList();
    fireEvent.click(await screen.findByRole('button', { name: 'Try again' }));

    expect(await screen.findByText('Sara Ahmed')).toBeInTheDocument();
  });

  it('does not revoke on the first click - it asks for confirmation', async () => {
    mockList.mockResolvedValue({ grants: [grant()], total: 1 });

    renderList();
    fireEvent.click(await screen.findByRole('button', { name: /Revoke access - Sara Ahmed/ }));

    expect(mockRevoke).not.toHaveBeenCalled();
    expect(screen.getByText(/Revoke access for Sara Ahmed\?/)).toBeInTheDocument();
  });

  it('revokes the right request once confirmed', async () => {
    mockList.mockResolvedValue({ grants: [grant({ id: 77, applicant_display_name: 'Sara Ahmed' })], total: 1 });
    mockRevoke.mockResolvedValue(grant({ id: 77, status: 'revoked' }));

    renderList();
    fireEvent.click(await screen.findByRole('button', { name: /Revoke access - Sara Ahmed/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Confirm revoke' }));

    await waitFor(() => expect(mockRevoke).toHaveBeenCalledWith(77));
    expect(mockRevoke).toHaveBeenCalledTimes(1);
  });

  it('cancelling leaves the access in place', async () => {
    mockList.mockResolvedValue({ grants: [grant()], total: 1 });

    renderList();
    fireEvent.click(await screen.findByRole('button', { name: /Revoke access - Sara Ahmed/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(mockRevoke).not.toHaveBeenCalled();
    expect(revokeButtonFor('Sara Ahmed')).toBeInTheDocument();
  });

  it('surfaces a failure instead of pretending the revoke worked', async () => {
    mockList.mockResolvedValue({ grants: [grant()], total: 1 });
    mockRevoke.mockRejectedValue(new Error('403'));

    renderList();
    fireEvent.click(await screen.findByRole('button', { name: /Revoke access - Sara Ahmed/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Confirm revoke' }));

    expect(
      await screen.findByText("Couldn't revoke access. Please try again later."),
    ).toBeInTheDocument();
    // The row is still there - a failed revoke must not look like a success.
    expect(screen.getByText('Sara Ahmed')).toBeInTheDocument();
  });

  it('keeps the confirm and cancel labels distinct', async () => {
    // In Arabic the resting label is "إلغاء الوصول" and Cancel is "إلغاء";
    // reusing the resting label to confirm makes the two easy to mix up.
    mockList.mockResolvedValue({ grants: [grant()], total: 1 });

    renderList();
    fireEvent.click(await screen.findByRole('button', { name: /Revoke access - Sara Ahmed/ }));

    expect(screen.getByRole('button', { name: 'Confirm revoke' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Revoke access' })).not.toBeInTheDocument();
  });

  it('says so when the list is capped, instead of implying it is everyone', async () => {
    mockList.mockResolvedValue({ grants: [grant()], total: 137 });

    renderList();

    expect(await screen.findByText(/Showing the first 1 of 137/)).toBeInTheDocument();
  });

  it('says nothing about paging when the whole list fits', async () => {
    mockList.mockResolvedValue({ grants: [grant()], total: 1 });

    renderList();
    await screen.findByText('Sara Ahmed');

    expect(screen.queryByText(/Showing the first/)).not.toBeInTheDocument();
  });

  it('names the person on each revoke button so the controls are distinguishable', async () => {
    mockList.mockResolvedValue({
      grants: [
        grant({ id: 1, applicant_display_name: 'Sara Ahmed' }),
        grant({ id: 2, applicant_display_name: 'Bilal Nour' }),
      ],
      total: 2,
    });

    renderList();

    expect(await screen.findByRole('button', { name: /Revoke access - Sara Ahmed/ })).toBeInTheDocument();
    expect(revokeButtonFor('Bilal Nour')).toBeInTheDocument();
  });
});
