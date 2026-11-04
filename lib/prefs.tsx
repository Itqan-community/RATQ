"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type Prefs = {
  theme: "light" | "dark";
  locale: "ar" | "en";
  palette: "ratq" | "gold" | "olive" | "navy";
  font: "suisse" | "plex" | "thmanyah";
  radius: "4px" | "8px" | "12px" | "20px";
};

// Defaults mirror the live site on first visit (gold palette, Suisse Intl, 4px).
export const DEFAULTS: Prefs = {
  theme: "light",
  locale: "ar",
  palette: "gold",
  font: "suisse",
  radius: "4px",
};

// localStorage key per pref, as used by the live site.
export const KEYS: Record<keyof Prefs, string> = {
  theme: "ratq_theme",
  locale: "ratq_locale",
  palette: "ratq_palette",
  font: "ratq_font",
  radius: "ratq_radius",
};

const ALLOWED: { [K in keyof Prefs]: readonly Prefs[K][] } = {
  theme: ["light", "dark"],
  locale: ["ar", "en"],
  palette: ["ratq", "gold", "olive", "navy"],
  font: ["suisse", "plex", "thmanyah"],
  radius: ["4px", "8px", "12px", "20px"],
};

function read(): Prefs {
  const out = { ...DEFAULTS };
  for (const k of Object.keys(KEYS) as (keyof Prefs)[]) {
    try {
      const v = localStorage.getItem(KEYS[k]);
      if (v && (ALLOWED[k] as readonly string[]).includes(v)) (out as Record<string, string>)[k] = v;
    } catch {}
  }
  return out;
}

// <option> elements cannot contain the usual bilingual spans, so generated pages carry data-ar/data-en and are swapped here.
export function syncOptions(locale: Prefs["locale"]) {
  document.querySelectorAll<HTMLOptionElement>("option[data-ar]").forEach((o) => {
    const t = (locale === "en" ? o.dataset.en : o.dataset.ar) ?? "";
    if (o.textContent !== t) o.textContent = t;
  });
}

export function applyToDom(p: Prefs) {
  const r = document.documentElement;
  r.dataset.theme = p.theme;
  r.classList.toggle("dark", p.theme === "dark");
  r.dataset.palette = p.palette;
  r.dataset.font = p.font;
  r.dataset.radius = p.radius;
  r.lang = p.locale;
  r.dir = p.locale === "ar" ? "rtl" : "ltr";
  syncOptions(p.locale);
}

// Inline in <head> so the first paint already has the stored theme/locale (no flash).
export const BOOT_SCRIPT = `(function(){try{var g=function(k,d,a){var v=localStorage.getItem(k);return v&&a.indexOf(v)>-1?v:d};var r=document.documentElement;var t=g('ratq_theme','light',['light','dark']);var l=g('ratq_locale','ar',['ar','en']);r.dataset.theme=t;if(t==='dark')r.classList.add('dark');r.dataset.palette=g('ratq_palette','gold',['ratq','gold','olive','navy']);r.dataset.font=g('ratq_font','suisse',['suisse','plex','thmanyah']);r.dataset.radius=g('ratq_radius','4px',['4px','8px','12px','20px']);r.lang=l;r.dir=l==='ar'?'rtl':'ltr'}catch(e){}})();`;

type Ctx = { prefs: Prefs; set: <K extends keyof Prefs>(k: K, v: Prefs[K]) => void; reset: () => void };
const PrefsCtx = createContext<Ctx | null>(null);

export function PrefsProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS);

  useEffect(() => {
    const p = read();
    setPrefs(p);
    syncOptions(p.locale);
    // Pages and replayed states add <option>s after load; keep them in the current language.
    const mo = new MutationObserver(() => syncOptions(document.documentElement.lang === "en" ? "en" : "ar"));
    mo.observe(document.body, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, []);

  const set = useCallback<Ctx["set"]>((k, v) => {
    setPrefs((p) => {
      const n = { ...p, [k]: v };
      applyToDom(n);
      try { localStorage.setItem(KEYS[k], v); } catch {}
      return n;
    });
  }, []);

  const reset = useCallback(() => {
    for (const k of Object.keys(KEYS) as (keyof Prefs)[]) {
      if (k === "theme" || k === "locale") continue;
      try { localStorage.removeItem(KEYS[k]); } catch {}
    }
    setPrefs((p) => {
      const n = { ...DEFAULTS, theme: p.theme, locale: p.locale };
      applyToDom(n);
      return n;
    });
  }, []);

  return <PrefsCtx.Provider value={{ prefs, set, reset }}>{children}</PrefsCtx.Provider>;
}

export function usePrefs() {
  const c = useContext(PrefsCtx);
  if (!c) throw new Error("usePrefs outside PrefsProvider");
  return c;
}
