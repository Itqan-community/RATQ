// src/store/useThemeStore.ts
import { create } from 'zustand';
import { STORAGE_KEYS } from '@/lib/storageKeys';
import { setLanguage } from '@/i18n/config';

export type ThemeMode = 'light' | 'dark';
export type PaletteType = 'default' | 'olive' | 'gold' | 'navy';
export type FontType = 'default' | 'thmanyah' | 'suisse';
export type RadiusType = '4px' | '8px' | '12px' | '20px';
export type HeroLayoutType = 'centered' | 'split' | 'third';

interface ThemeState {
  theme: ThemeMode;
  palette: PaletteType;
  font: FontType;
  radius: RadiusType;
  heroLayout: HeroLayoutType;
  ligatures: boolean;
  locale: 'ar' | 'en';
  direction: 'rtl' | 'ltr';
  numeralSystem: 'western' | 'arabic-indic';
  
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setPalette: (palette: PaletteType) => void;
  setFont: (font: FontType) => void;
  setRadius: (radius: RadiusType) => void;
  setHeroLayout: (layout: HeroLayoutType) => void;
  setLigatures: (enabled: boolean) => void;
  resetDefaults: () => void;
  setLocale: (locale: 'ar' | 'en') => void;
  setNumeralSystem: (sys: 'western' | 'arabic-indic') => void;
}

const safeGetItem = (key: string, fallback: string) => {
  if (typeof window !== 'undefined' && typeof window.localStorage?.getItem === 'function') {
    return window.localStorage.getItem(key) || fallback;
  }
  return fallback;
};

const themePresetKey = STORAGE_KEYS.themePresetGold;
if (typeof window !== 'undefined' && typeof window.localStorage?.getItem === 'function') {
  if (window.localStorage.getItem(themePresetKey) !== 'true') {
    window.localStorage.setItem(STORAGE_KEYS.palette, 'gold');
    window.localStorage.setItem(STORAGE_KEYS.font, 'suisse');
    window.localStorage.setItem(STORAGE_KEYS.radius, '4px');
    window.localStorage.setItem(themePresetKey, 'true');
  }
}

const initialTheme = (safeGetItem(STORAGE_KEYS.theme, 'light') as ThemeMode);
const initialPalette = (safeGetItem(STORAGE_KEYS.palette, 'gold') as PaletteType);
const initialFont = (safeGetItem(STORAGE_KEYS.font, 'suisse') as FontType);
const initialRadius = (safeGetItem(STORAGE_KEYS.radius, '4px') as RadiusType);
const initialHeroLayout = (safeGetItem(STORAGE_KEYS.heroLayout, 'third') as HeroLayoutType);
const initialLigatures = safeGetItem(STORAGE_KEYS.ligatures, 'true') !== 'false';
const initialLocale = (safeGetItem(STORAGE_KEYS.locale, 'ar') as 'ar' | 'en');
const initialNumeral = (safeGetItem(STORAGE_KEYS.numeral, 'western') as 'western' | 'arabic-indic');

export const applyDomAttributes = (
  theme: ThemeMode,
  palette: PaletteType,
  font: FontType,
  radius: RadiusType,
  ligatures: boolean
) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  // Theme
  if (theme === 'dark') {
    root.setAttribute('data-theme', 'dark');
    root.classList.add('dark');
  } else {
    root.removeAttribute('data-theme');
    root.classList.remove('dark');
  }

  // Palette
  if (palette === 'default') {
    root.removeAttribute('data-palette');
  } else {
    root.setAttribute('data-palette', palette);
  }

  // Font
  if (font === 'default') {
    root.removeAttribute('data-font');
  } else {
    root.setAttribute('data-font', font);
  }

  // Radius
  root.setAttribute('data-radius', radius);

  // Ligatures
  if (!ligatures) {
    root.setAttribute('data-ligatures', 'disabled');
  } else {
    root.removeAttribute('data-ligatures');
  }
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: initialTheme,
  palette: initialPalette,
  font: initialFont,
  radius: initialRadius,
  heroLayout: initialHeroLayout,
  ligatures: initialLigatures,
  locale: initialLocale,
  direction: initialLocale === 'ar' ? 'rtl' : 'ltr',
  numeralSystem: initialNumeral,

  setTheme: (theme: ThemeMode) => {
    set({ theme });
    if (typeof window !== 'undefined' && typeof window.localStorage?.setItem === 'function') {
      window.localStorage.setItem(STORAGE_KEYS.theme, theme);
    }
    const state = get();
    applyDomAttributes(theme, state.palette, state.font, state.radius, state.ligatures);
  },

  toggleTheme: () => {
    const nextTheme = get().theme === 'light' ? 'dark' : 'light';
    get().setTheme(nextTheme);
  },

  setPalette: (palette: PaletteType) => {
    set({ palette });
    if (typeof window !== 'undefined' && typeof window.localStorage?.setItem === 'function') {
      window.localStorage.setItem(STORAGE_KEYS.palette, palette);
    }
    const state = get();
    applyDomAttributes(state.theme, palette, state.font, state.radius, state.ligatures);
  },

  setFont: (font: FontType) => {
    set({ font });
    if (typeof window !== 'undefined' && typeof window.localStorage?.setItem === 'function') {
      window.localStorage.setItem(STORAGE_KEYS.font, font);
    }
    const state = get();
    applyDomAttributes(state.theme, state.palette, font, state.radius, state.ligatures);
  },

  setRadius: (radius: RadiusType) => {
    set({ radius });
    if (typeof window !== 'undefined' && typeof window.localStorage?.setItem === 'function') {
      window.localStorage.setItem(STORAGE_KEYS.radius, radius);
    }
    const state = get();
    applyDomAttributes(state.theme, state.palette, state.font, radius, state.ligatures);
  },

  setHeroLayout: (layout: HeroLayoutType) => {
    set({ heroLayout: layout });
    if (typeof window !== 'undefined' && typeof window.localStorage?.setItem === 'function') {
      window.localStorage.setItem(STORAGE_KEYS.heroLayout, layout);
    }
  },

  setLigatures: (enabled: boolean) => {
    set({ ligatures: enabled });
    if (typeof window !== 'undefined' && typeof window.localStorage?.setItem === 'function') {
      window.localStorage.setItem(STORAGE_KEYS.ligatures, enabled ? 'true' : 'false');
    }
    const state = get();
    applyDomAttributes(state.theme, state.palette, state.font, state.radius, enabled);
  },

  resetDefaults: () => {
    const defaultState = {
      theme: 'light' as ThemeMode,
      palette: 'gold' as PaletteType,
      font: 'suisse' as FontType,
      radius: '4px' as RadiusType,
      heroLayout: 'third' as HeroLayoutType,
      ligatures: true,
    };
    set(defaultState);
    if (typeof window !== 'undefined' && typeof window.localStorage?.setItem === 'function') {
      window.localStorage.setItem(STORAGE_KEYS.theme, 'light');
      window.localStorage.setItem(STORAGE_KEYS.palette, 'gold');
      window.localStorage.setItem(STORAGE_KEYS.font, 'suisse');
      window.localStorage.setItem(STORAGE_KEYS.radius, '4px');
      window.localStorage.setItem(STORAGE_KEYS.heroLayout, 'third');
      window.localStorage.setItem(STORAGE_KEYS.ligatures, 'true');
    }
    applyDomAttributes('light', 'gold', 'suisse', '4px', true);
  },

  setLocale: (locale: 'ar' | 'en') => {
    set({
      locale,
      direction: locale === 'ar' ? 'rtl' : 'ltr',
    });
    setLanguage(locale);
  },

  setNumeralSystem: (sys: 'western' | 'arabic-indic') => {
    set({ numeralSystem: sys });
    if (typeof window !== 'undefined' && typeof window.localStorage?.setItem === 'function') {
      window.localStorage.setItem(STORAGE_KEYS.numeral, sys);
    }
  },
}));

// Apply initial settings on execution
if (typeof document !== 'undefined') {
  applyDomAttributes(initialTheme, initialPalette, initialFont, initialRadius, initialLigatures);
}
