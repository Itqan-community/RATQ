import { describe, it, expect, vi, beforeEach, afterAll, Mock } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { SWRConfig } from 'swr';
import { useUpdateAccessRequest } from '@/hooks/useUpdateAccessRequest';
import { updateAccessRequest } from '@/modules/resources/application/use-cases/update-access-requests';
import type { AccessRequest } from '@/types/resource';

// Mock the use-case function
vi.mock('@/modules/resources/application/use-cases/update-access-requests', () => ({
  updateAccessRequest: vi.fn(),
}));

function SWRWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        provider: () => new Map(),
        dedupingInterval: 0,
      }}
    >
      {children}
    </SWRConfig>
  );
}

const mockAccessRequestBase: Omit<AccessRequest, 'status'> = {
  id: 1,
  applicant_name: 'test_user',
  applicant_display_name: 'Test User',
  resource_slug: 'quran-api',
  resource_name: 'Quran API',
  message: 'I want access to the API.',
  publisher_notes: null,
  created_at: '2023-10-27T10:00:00Z',
  updated_at: '2023-10-27T10:00:00Z',
};

describe('useUpdateAccessRequest', () => {
  const mockUpdateAccessRequest = updateAccessRequest as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  it('initially has isMutating set to false', () => {
    const { result } = renderHook(() => useUpdateAccessRequest(), {
      wrapper: SWRWrapper,
    });
    
    expect(result.current.isMutating).toBe(false);
    expect(result.current.error).toBeUndefined();
  });

  it('calls updateAccessRequest and validates full return data for "approved" status', async () => {
    const mockResponse: AccessRequest = {
      ...mockAccessRequestBase,
      status: 'approved',
      updated_at: '2023-10-28T12:00:00Z',
    };
    mockUpdateAccessRequest.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useUpdateAccessRequest(), {
      wrapper: SWRWrapper,
    });

    let triggerResult: AccessRequest | undefined;
    await act(async () => {
      triggerResult = await result.current.trigger([1, 'approved']);
    });

    expect(mockUpdateAccessRequest).toHaveBeenCalledWith(1, { status: 'approved' });
    
    // Validate the full returned data matches the expected AccessRequest structure and values
    expect(triggerResult).toBeDefined();
    expect(triggerResult).toEqual(mockResponse);
    expect(triggerResult?.id).toBe(1);
    expect(triggerResult?.status).toBe('approved');
    expect(triggerResult?.applicant_name).toBe('test_user');
    expect(triggerResult?.resource_slug).toBe('quran-api');
    
    expect(result.current.isMutating).toBe(false);
    expect(result.current.error).toBeUndefined();
  });

  it('calls updateAccessRequest and validates full return data for "denied" status', async () => {
    const mockResponse: AccessRequest = {
      ...mockAccessRequestBase,
      status: 'denied',
      publisher_notes: 'Insufficient reasons provided.',
      updated_at: '2023-10-28T12:05:00Z',
    };
    mockUpdateAccessRequest.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useUpdateAccessRequest(), {
      wrapper: SWRWrapper,
    });

    let triggerResult: AccessRequest | undefined;
    await act(async () => {
      triggerResult = await result.current.trigger([1, 'denied']);
    });

    expect(mockUpdateAccessRequest).toHaveBeenCalledWith(1, { status: 'denied' });
    
    // Validate the full returned data matches the expected AccessRequest structure and values
    expect(triggerResult).toBeDefined();
    expect(triggerResult).toEqual(mockResponse);
    expect(triggerResult?.id).toBe(1);
    expect(triggerResult?.status).toBe('denied');
    expect(triggerResult?.publisher_notes).toBe('Insufficient reasons provided.');
    
    expect(result.current.isMutating).toBe(false);
    expect(result.current.error).toBeUndefined();
  });

  it('handles errors when updateAccessRequest fails', async () => {
    const mockError = new Error('Failed to update status');
    mockUpdateAccessRequest.mockRejectedValue(mockError);

    const { result } = renderHook(() => useUpdateAccessRequest(), {
      wrapper: SWRWrapper,
    });

    await act(async () => {
      try {
        await result.current.trigger([1, 'denied']);
      } catch (e) {
        // ignore thrown error during trigger in test
      }
    });

    expect(mockUpdateAccessRequest).toHaveBeenCalledWith(1, { status: 'denied' });
    expect(result.current.error).toEqual(mockError);
    expect(result.current.isMutating).toBe(false);
  });
});
