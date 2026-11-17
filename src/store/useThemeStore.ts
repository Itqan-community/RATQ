// src/store/useThemeStore.ts
import { create } from 'zustand';
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

const themePresetKey = 'ratq_theme_preset_gold_v1';
if (typeof window !== 'undefined' && typeof window.localStorage?.getItem === 'function') {
  if (window.localStorage.getItem(themePresetKey) !== 'true') {
    window.localStorage.setItem('ratq_palette', 'gold');
    window.localStorage.setItem('ratq_font', 'suisse');
    window.localStorage.setItem('ratq_radius', '4px');
    window.localStorage.setItem(themePresetKey, 'true');
  }
}

const initialTheme = (safeGetItem('ratq_theme', 'light') as ThemeMode);
const initialPalette = (safeGetItem('ratq_palette', 'gold') as PaletteType);
const initialFont = (safeGetItem('ratq_font', 'suisse') as FontType);
const initialRadius = (safeGetItem('ratq_radius', '4px') as RadiusType);
const initialHeroLayout = (safeGetItem('ratq_hero_layout', 'split') as HeroLayoutType);
const initialLigatures = safeGetItem('ratq_ligatures', 'true') !== 'false';
const initialLocale = (safeGetItem('ratq_locale', 'ar') as 'ar' | 'en');
const initialNumeral = (safeGetItem('ratq_numeral', 'western') as 'western' | 'arabic-indic');

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
      window.localStorage.setItem('ratq_theme', theme);
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
      window.localStorage.setItem('ratq_palette', palette);
    }
    const state = get();
    applyDomAttributes(state.theme, palette, state.font, state.radius, state.ligatures);
  },

  setFont: (font: FontType) => {
    set({ font });
    if (typeof window !== 'undefined' && typeof window.localStorage?.setItem === 'function') {
      window.localStorage.setItem('ratq_font', font);
    }
    const state = get();
    applyDomAttributes(state.theme, state.palette, font, state.radius, state.ligatures);
  },

  setRadius: (radius: RadiusType) => {
    set({ radius });
    if (typeof window !== 'undefined' && typeof window.localStorage?.setItem === 'function') {
      window.localStorage.setItem('ratq_radius', radius);
    }
    const state = get();
    applyDomAttributes(state.theme, state.palette, state.font, radius, state.ligatures);
  },

  setHeroLayout: (layout: HeroLayoutType) => {
    set({ heroLayout: layout });
    if (typeof window !== 'undefined' && typeof window.localStorage?.setItem === 'function') {
      window.localStorage.setItem('ratq_hero_layout', layout);
    }
  },

  setLigatures: (enabled: boolean) => {
    set({ ligatures: enabled });
    if (typeof window !== 'undefined' && typeof window.localStorage?.setItem === 'function') {
      window.localStorage.setItem('ratq_ligatures', enabled ? 'true' : 'false');
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
      heroLayout: 'split' as HeroLayoutType,
      ligatures: true,
    };
    set(defaultState);
    if (typeof window !== 'undefined' && typeof window.localStorage?.setItem === 'function') {
      window.localStorage.setItem('ratq_theme', 'light');
      window.localStorage.setItem('ratq_palette', 'gold');
      window.localStorage.setItem('ratq_font', 'suisse');
      window.localStorage.setItem('ratq_radius', '4px');
      window.localStorage.setItem('ratq_hero_layout', 'split');
      window.localStorage.setItem('ratq_ligatures', 'true');
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
      window.localStorage.setItem('ratq_numeral', sys);
    }
  },
}));

// Apply initial settings on execution
if (typeof document !== 'undefined') {
  applyDomAttributes(initialTheme, initialPalette, initialFont, initialRadius, initialLigatures);
}
