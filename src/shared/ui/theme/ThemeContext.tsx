'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'ratq_theme';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

function applyThemeClass(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Default matches the server-rendered markup (no 'dark' class). The
  // blocking inline script in layout.tsx already applied the correct
  // class to <html> before hydration to avoid a flash - this effect
  // just brings React's own state in sync with it on mount.
  const [theme, setThemeState] = useState<Theme>('light');
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const initial: Theme =
      saved === 'light' || saved === 'dark'
        ? saved
        : window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Sync React state with the theme the blocking pre-hydration script already applied to <html>; SSR-safe because useState initializer runs on the server with the 'light' fallback.
    setThemeState(initial);
    setInitialized(true);
  }, []);

  // Keep <html class="dark"> in sync whenever the theme state changes
  // (covers both the initial sync above and later explicit toggles).
  useEffect(() => {
    if (!initialized) return;
    applyThemeClass(theme);
  }, [theme, initialized]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark';
      return next;
    });
  }, []);
  // Persist whenever the theme changes, so it stays correct regardless of
  // how many times the updater above runs (React may invoke it more than
  // once, e.g. under StrictMode or batched retries).
  useEffect(() => {
    if (!initialized) return;
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme, initialized]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}

// Static (no interpolated data) - safe to inline as a blocking <head> script.
// Runs before React hydrates so the correct theme applies with no flash.
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}if(t==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`;
