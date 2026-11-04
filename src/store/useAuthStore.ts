// src/store/useAuthStore.ts
import { create } from 'zustand';
import { UserRole, Profile } from '@/types';
import { DEMO_PROFILES } from '@/lib/mockData';

interface AuthState {
  isAuthenticated: boolean;
  currentRole: UserRole;
  profile: Profile;
  switchRole: (role: UserRole) => void;
  signIn: (email?: string) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: true,
  currentRole: 'developer',
  profile: DEMO_PROFILES.developer,

  switchRole: (role: UserRole) => {
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
}));
