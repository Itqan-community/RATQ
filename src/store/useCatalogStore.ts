// src/store/useCatalogStore.ts
import { create } from 'zustand';

interface CatalogStoreState {
  searchQuery: string;
  selectedTypes: string[];
  selectedLicenses: string[];
  selectedAccess: string[];
  selectedBadges: string[];
  selectedTech: string[];
  selectedCategory: string | null;
  commercialOnly: boolean;
  sortBy: 'relevance' | 'newest' | 'rating' | 'usage' | 'alpha';
  viewMode: 'grid' | 'list';
  isCompact: boolean;
  page: number;

  setSearchQuery: (q: string) => void;
  toggleType: (type: string) => void;
  setSelectedTypes: (types: string[]) => void;
  toggleLicense: (lic: string) => void;
  toggleAccess: (acc: string) => void;
  toggleBadge: (badge: string) => void;
  toggleTech: (tech: string) => void;
  setCategory: (cat: string | null) => void;
  setCommercialOnly: (val: boolean) => void;
  setSortBy: (sort: 'relevance' | 'newest' | 'rating' | 'usage' | 'alpha') => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  setIsCompact: (isCompact: boolean) => void;
  setPage: (p: number) => void;
  resetFilters: () => void;
}

const safeGetBool = (key: string, fallback: boolean): boolean => {
  if (typeof window !== 'undefined' && typeof window.localStorage?.getItem === 'function') {
    const val = window.localStorage.getItem(key);
    return val !== null ? val === 'true' : fallback;
  }
  return fallback;
};

export const useCatalogStore = create<CatalogStoreState>((set) => ({
  searchQuery: '',
  selectedTypes: [],
  selectedLicenses: [],
  selectedAccess: [],
  selectedBadges: [],
  selectedTech: [],
  selectedCategory: null,
  commercialOnly: false,
  sortBy: 'relevance',
  viewMode: 'grid',
  isCompact: safeGetBool('retq_catalog_compact_mode', false),
  page: 1,

  setSearchQuery: (searchQuery) => set({ searchQuery, page: 1 }),
  toggleType: (type) =>
    set((state) => ({
      selectedTypes: state.selectedTypes.includes(type)
        ? state.selectedTypes.filter((t) => t !== type)
        : [...state.selectedTypes, type],
      page: 1,
    })),
  setSelectedTypes: (selectedTypes) => set({ selectedTypes, page: 1 }),
  toggleLicense: (lic) =>
    set((state) => ({
      selectedLicenses: state.selectedLicenses.includes(lic)
        ? state.selectedLicenses.filter((l) => l !== lic)
        : [...state.selectedLicenses, lic],
      page: 1,
    })),
  toggleAccess: (acc) =>
    set((state) => ({
      selectedAccess: state.selectedAccess.includes(acc)
        ? state.selectedAccess.filter((a) => a !== acc)
        : [...state.selectedAccess, acc],
      page: 1,
    })),
  toggleBadge: (badge) =>
    set((state) => ({
      selectedBadges: state.selectedBadges.includes(badge)
        ? state.selectedBadges.filter((b) => b !== badge)
        : [...state.selectedBadges, badge],
      page: 1,
    })),
  toggleTech: (tech) =>
    set((state) => ({
      selectedTech: state.selectedTech.includes(tech)
        ? state.selectedTech.filter((t) => t !== tech)
        : [...state.selectedTech, tech],
      page: 1,
    })),
  setCategory: (selectedCategory) => set({ selectedCategory, page: 1 }),
  setCommercialOnly: (commercialOnly) => set({ commercialOnly, page: 1 }),
  setSortBy: (sortBy) => set({ sortBy }),
  setViewMode: (viewMode) => set({ viewMode }),
  setIsCompact: (isCompact) => {
    if (typeof window !== 'undefined' && typeof window.localStorage?.setItem === 'function') {
      window.localStorage.setItem('retq_catalog_compact_mode', String(isCompact));
    }
    set({ isCompact });
  },
  setPage: (page) => set({ page }),
  resetFilters: () =>
    set({
      searchQuery: '',
      selectedTypes: [],
      selectedLicenses: [],
      selectedAccess: [],
      selectedBadges: [],
      selectedTech: [],
      selectedCategory: null,
      commercialOnly: false,
      sortBy: 'relevance',
      page: 1,
    }),
}));
