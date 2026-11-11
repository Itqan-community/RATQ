// src/store/useAuthStore.ts
import { create } from 'zustand';
import { UserRole, Profile } from '@/types';
import { DEMO_PROFILES } from '@/lib/mockData';
import * as payloadAuth from '@/lib/payloadAuth';

interface AuthState {
  isAuthenticated: boolean;
  currentRole: UserRole;
  profile: Profile;
  switchRole: (role: UserRole) => void;
  signIn: (email?: string) => void;
  signOut: () => void;
  // Live (Payload) auth. Each returns an error message, or null on success.
  signInLive: (email: string, password: string) => Promise<string | null>;
  signUpLive: (email: string, password: string, displayName: string) => Promise<string | null>;
  hydrateAuth: () => Promise<void>;
  signOutLive: () => Promise<void>;
}

const guest = { isAuthenticated: false, currentRole: 'guest' as UserRole };
const authed = (doc: Parameters<typeof payloadAuth.toProfile>[0]) => ({
  isAuthenticated: true,
  currentRole: payloadAuth.toRole(doc.role),
  profile: payloadAuth.toProfile(doc),
});
const msg = (e: unknown) => (e instanceof Error ? e.message : 'Something went wrong');

export const useAuthStore = create<AuthState>((set) => ({
  // Mock mode starts signed in as the demo developer; live mode starts as a guest until the session is verified.
  isAuthenticated: !payloadAuth.isLive(),
  currentRole: payloadAuth.isLive() ? 'guest' : 'developer',
  profile: DEMO_PROFILES.developer,

  switchRole: (role: UserRole) => {
    // Demo-only. In live mode the role comes solely from the server session; a client-side switch would unlock
    // admin/review screens for any visitor (data stays server-protected, but the screens must not open).
    if (payloadAuth.isLive()) return;
    let newProfile = DEMO_PROFILES.developer;
    if (role === 'publisher_owner' || role === 'publisher_member') newProfile = DEMO_PROFILES.publisher;
    else if (role === 'reviewer') newProfile = DEMO_PROFILES.reviewer;
    else if (role === 'moderator' || role === 'compliance') newProfile = DEMO_PROFILES.moderator;
    else if (role === 'admin') newProfile = DEMO_PROFILES.admin;

    set({
      currentRole: role,
      profile: newProfile,
      isAuthenticated: role !== 'guest',
    });
  },

  signIn: () => {
    set({
      isAuthenticated: true,
      currentRole: 'developer',
      profile: DEMO_PROFILES.developer,
    });
  },

  signOut: () => {
    set({
      isAuthenticated: false,
      currentRole: 'guest',
    });
  },

  signInLive: async (email, password) => {
    try {
      set(authed(await payloadAuth.login(email, password)));
      return null;
    } catch (e) {
      set(guest);
      return msg(e);
    }
  },

  signUpLive: async (email, password, displayName) => {
    try {
      await payloadAuth.register(email, password, displayName);
      set(authed(await payloadAuth.login(email, password)));
      return null;
    } catch (e) {
      set(guest);
      return msg(e);
    }
  },

  hydrateAuth: async () => {
    try {
      const doc = await payloadAuth.fetchMe();
      set(doc ? authed(doc) : guest);
    } catch {
      set(guest);
    }
  },

  signOutLive: async () => {
    try {
      await payloadAuth.logout();
    } catch {
      // fail safe: always drop local state even if the request failed
    }
    set(guest);
  },
}));
