import { describe, it, expect, afterEach, vi } from 'vitest';
import { useAuthStore } from '@/store/useAuthStore';

// The demo role switcher (403 page, mobile menu) must never change the role of a real signed-in user:
// in live mode the role comes only from the server session (Payload), never from the client.
afterEach(() => vi.unstubAllEnvs());

describe('switchRole', () => {
  it('switchRole_LiveMode_DoesNotChangeRoleOrProfile', () => {
    vi.stubEnv('NEXT_PUBLIC_PAYLOAD_API_URL', 'http://payload.test/api');
    useAuthStore.setState({ isAuthenticated: true, currentRole: 'developer' });
    const before = useAuthStore.getState().profile;
    useAuthStore.getState().switchRole('admin');
    expect(useAuthStore.getState().currentRole).toBe('developer');
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().profile).toBe(before);
  });

  it('switchRole_LiveMode_GuestCannotBecomeAdmin', () => {
    vi.stubEnv('NEXT_PUBLIC_PAYLOAD_API_URL', 'http://payload.test/api');
    useAuthStore.setState({ isAuthenticated: false, currentRole: 'guest' });
    useAuthStore.getState().switchRole('admin');
    expect(useAuthStore.getState().currentRole).toBe('guest');
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('switchRole_MockMode_StillSwitchesForTheDemo', () => {
    useAuthStore.setState({ isAuthenticated: true, currentRole: 'developer' });
    useAuthStore.getState().switchRole('admin');
    expect(useAuthStore.getState().currentRole).toBe('admin');
  });
});
