"use client";

import { useEffect, useState } from "react";
import { Box, Check, CircleCheck, Moon, Palette, RotateCcw, Sparkles, Sun, Type, X } from "lucide-react";
import { usePrefs, type Prefs } from "@/lib/prefs";

type L = "ar" | "en";
const PALETTE: { v: Prefs["palette"]; dots: [string, string]; name: Record<L, string> }[] = [
  { v: "gold", dots: ["rgb(148, 110, 55)", "rgb(190, 165, 110)"], name: { ar: "الثيم الذهبي (الافتراضي)", en: "Golden Amber (Default)" } },
  { v: "ratq", dots: ["rgb(5, 150, 105)", "rgb(31, 78, 78)"], name: { ar: "ثيم رتق (زمردي)", en: "Ratq (Emerald)" } },
  { v: "olive", dots: ["rgb(107, 124, 51)", "rgb(168, 184, 104)"], name: { ar: "ثيم أخضر زيتوني", en: "Olive Green" } },
  { v: "navy", dots: ["rgb(22, 47, 82)", "rgb(41, 104, 169)"], name: { ar: "الأسود الكحلي", en: "Midnight Navy" } },
];
const FONT: { v: Prefs["font"]; family: string; label: string; sub: Record<L, string> }[] = [
  { v: "suisse", family: 'SuisseIntl, "IBM Plex Sans Arabic", sans-serif', label: "SuisseIntl", sub: { ar: "سويس إنتل (الافتراضي)", en: "Suisse Intl (Default)" } },
  { v: "plex", family: '"IBM Plex Sans Arabic", sans-serif', label: "IBM Plex Sans", sub: { ar: "آي بي إم بلكس", en: "IBM Plex" } },
  { v: "thmanyah", family: '"Thmanyah Sans", "IBM Plex Sans Arabic", sans-serif', label: "خط ثمانية", sub: { ar: "Thmanyah", en: "Thmanyah" } },
];
const RADIUS: Prefs["radius"][] = ["4px", "8px", "12px", "20px"];

const T = {
  ar: { title: "تخصيص الثيم والمظهر", mode: "نمط الإضاءة", light: "الوضع النهاري", dark: "الوضع الليلي", palette: "طابع الألوان", font: "خط المنصة", radius: "استدارة الحواف", reset: "استعادة الافتراضي", saved: "يحفظ تلقائياً", close: "إغلاق", tip: "تخصيص المظهر والخط", btnTitle: "تخصيص الثيم والخط", sr: "تخصيص الثيم والمظهر", aside: "زر تخصيص الثيم والمظهر" },
  en: { title: "Appearance & Theme", mode: "Color Mode", light: "Light", dark: "Dark", palette: "Color Palette", font: "Platform Font", radius: "Border Radius", reset: "Reset Defaults", saved: "Auto-saved", close: "Close", tip: "Theme & Font Customizer", btnTitle: "Customize theme and font", sr: "Customize Theme & Appearance", aside: "Theme customizer button" },
};

const FIRST_VISIT = "ratq_theme_customizer_first_visit_v1";
const sel = "border-ratq-500 bg-ratq-50/50 dark:bg-ratq-950/30 ring-1 ring-ratq-500 shadow-xs";
const unsel = "border-border bg-subtle/50 hover:bg-muted/70 hover:border-border-strong";
const label = "flex items-center gap-1.5 text-[10px] font-bold text-fg-muted uppercase tracking-wider mb-1.5";
const tick = (
  <div className="absolute top-1.5 end-1.5 w-3 h-3 rounded-full bg-ratq-600 text-white flex items-center justify-center">
    <Check className="w-2 h-2 stroke-[3]" />
  </div>
);

// Markup mirrors the live site's customizer. Its "hero layout" row is intentionally absent: the clone ships the Cards hero only.
export function AppearancePanel() {
  const { prefs, set, reset } = usePrefs();
  const [open, setOpen] = useState(false);
  const [dot, setDot] = useState(false);
  const t = T[prefs.locale];

  useEffect(() => {
    // First visit: the live site opens this panel (with a dimmed backdrop) once, then remembers it did.
    try {
      const seen = localStorage.getItem(FIRST_VISIT) === "true";
      setDot(!seen);
      if (!seen) { setOpen(true); localStorage.setItem(FIRST_VISIT, "true"); }
    } catch { setDot(true); }
  }, []);

  const toggle = () => { setOpen((o) => !o); setDot(false); };

  return (
    <>
      <aside aria-label={t.aside} className="fixed bottom-4 sm:bottom-6 left-3 sm:left-4 z-40 flex items-center gap-2.5 print:hidden group" dir="ltr">
        <button
          type="button"
          onClick={toggle}
          title={t.btnTitle}
          aria-haspopup="dialog"
          aria-expanded={open}
          className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white dark:bg-slate-50 text-slate-800 hover:bg-slate-100 dark:hover:bg-white shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95 border border-slate-200 dark:border-slate-300 focus:outline-hidden focus:ring-4 focus:ring-ratq-500/30 cursor-pointer"
        >
          <Palette className="w-5 h-5 text-ratq-600 dark:text-ratq-700 group-hover:rotate-12 transition-transform duration-300" />
          <span className="sr-only">{t.sr}</span>
          {dot && <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-ratq-500 rounded-full border-2 border-white animate-pulse" />}
        </button>
        <div dir={prefs.locale === "ar" ? "rtl" : "ltr"} className="opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none bg-white dark:bg-slate-50 text-slate-800 text-xs font-semibold py-1.5 px-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-300 whitespace-nowrap transform -translate-x-1 group-hover:translate-x-0">
          {t.tip}
        </div>
      </aside>
      {open && <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] transition-opacity animate-in fade-in duration-150" aria-hidden="true" onClick={() => setOpen(false)} />}
      {open && (
        <div role="dialog" aria-modal="true" aria-labelledby="theme-customizer-title" className="fixed bottom-16 sm:bottom-20 left-3 sm:left-4 z-50 w-[calc(100vw-1.5rem)] sm:w-[380px] max-w-[380px] bg-canvas text-fg rounded-2xl border border-border shadow-xl overflow-hidden flex flex-col transition-all duration-200 animate-in fade-in zoom-in-95 origin-bottom-left" dir={prefs.locale === "ar" ? "rtl" : "ltr"}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/80 bg-subtle/40">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-ratq-600/10 dark:bg-ratq-400/10 text-ratq-700 dark:text-ratq-300 flex items-center justify-center"><Palette className="w-4 h-4" /></div>
              <div><h2 id="theme-customizer-title" className="text-xs sm:text-sm font-bold text-fg leading-tight">{t.title}</h2></div>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="p-1 text-fg-muted hover:text-fg hover:bg-muted rounded-lg transition-colors" aria-label={t.close}><X className="w-4 h-4" /></button>
          </div>
          <div className="p-3.5 space-y-3.5 text-start">
            <div>
              <div className="text-[10px] font-bold text-fg-muted uppercase tracking-wider mb-1.5">{t.mode}</div>
              <div className="grid grid-cols-2 p-1 rounded-xl bg-subtle border border-border/60 gap-1">
                {(["light", "dark"] as const).map((m) => (
                  <button key={m} type="button" onClick={() => set("theme", m)} className={"flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg transition-all text-xs font-medium " + (prefs.theme === m ? "bg-canvas text-fg shadow-xs border border-border/60 font-semibold" : "text-fg-muted hover:text-fg")}>
                    {m === "light" ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 text-fg-subtle" />}
                    <span>{m === "light" ? t.light : t.dark}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5"><div className="flex items-center gap-1.5 text-[10px] font-bold text-fg-muted uppercase tracking-wider"><Sparkles className="w-3 h-3 text-ratq-500" /><span>{t.palette}</span></div></div>
              <div className="grid grid-cols-2 gap-2">
                {PALETTE.map((p) => (
                  <button key={p.v} type="button" onClick={() => set("palette", p.v)} className={"flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all relative cursor-pointer " + (prefs.palette === p.v ? sel : unsel)}>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      {p.dots.map((c) => <div key={c} className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-xs" style={{ backgroundColor: c }} />)}
                    </div>
                    <span className="text-[11px] font-bold text-fg leading-tight truncate w-full">{p.name[prefs.locale]}</span>
                    {prefs.palette === p.v && tick}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className={label}><Type className="w-3 h-3 text-ratq-500" /><span>{t.font}</span></div>
              <div className="grid grid-cols-3 gap-2">
                {FONT.map((f) => (
                  <button key={f.v} type="button" onClick={() => set("font", f.v)} className={"flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all relative " + (prefs.font === f.v ? sel : unsel)}>
                    <span className="font-bold text-xs text-fg leading-tight truncate w-full" style={{ fontFamily: f.family }}>{f.label}</span>
                    <span className="text-[10px] text-fg-muted leading-tight mt-0.5 truncate w-full">{f.sub[prefs.locale]}</span>
                    {prefs.font === f.v && tick}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-fg-muted uppercase tracking-wider"><Box className="w-3 h-3 text-ratq-500" /><span>{t.radius}</span></div>
                <span className="text-[10px] font-mono font-medium text-fg-muted px-1.5 py-0.2 rounded bg-subtle border border-border/60">{prefs.radius}</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {RADIUS.map((r) => (
                  <button key={r} type="button" onClick={() => set("radius", r)} style={{ borderRadius: r }} className={"py-1.5 px-2 text-center text-xs font-mono font-semibold border transition-all " + (prefs.radius === r ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 border-transparent shadow-xs" : "border-border bg-subtle hover:bg-muted text-fg-muted hover:text-fg")}>{r}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-border/80 bg-subtle/40">
            <button type="button" onClick={reset} className="flex items-center gap-1.5 text-[11px] font-medium text-fg-muted hover:text-fg transition-colors py-1 px-1.5 rounded-lg hover:bg-muted"><RotateCcw className="w-3 h-3" /><span>{t.reset}</span></button>
            <div className="flex items-center gap-1 text-[10px] text-fg-muted font-medium"><CircleCheck className="w-3 h-3 text-ratq-500" /><span>{t.saved}</span></div>
          </div>
        </div>
      )}
    </>
  );
}
