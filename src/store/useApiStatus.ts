// src/store/useApiStatus.ts
// Whether the live resource sources answered at boot. `down` = none did (catalog pages show a retry state);
// `failed` lists sources that did not (catalog is partial). Always up in mock mode.
import { create } from 'zustand';
import { hydrateResources } from '@/lib/payloadResources';

interface ApiStatusState {
  down: boolean;
  failed: ('cms' | 'payload')[];
  retrying: boolean;
  set: (r: { ok: boolean; failed: ('cms' | 'payload')[] }) => void;
  retry: () => Promise<void>;
}

export const useApiStatus = create<ApiStatusState>((set) => ({
  down: false,
  failed: [],
  retrying: false,
  set: ({ ok, failed }) => set({ down: !ok, failed }),
  retry: async () => {
    set({ retrying: true });
    try {
      const r = await hydrateResources();
      set({ down: !r.ok, failed: r.failed });
    } finally {
      set({ retrying: false });
    }
  },
}));
