"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CircleCheckBig, Globe, Layers, LogOut, Menu, Moon, Search, Settings, Shield, Sun, User, X } from "lucide-react";
import { usePrefs } from "@/lib/prefs";
import { dict } from "@/lib/i18n";
import { ROLES, type RoleId } from "@/lib/chrome-data";
import { setRole, useRole } from "@/lib/role";
import { CommandPalette } from "@/components/CommandPalette";

const NAV = [
  { href: "/", key: "home" },
  { href: "/resources", key: "library" },
  { href: "/resources/roadmap", key: "roadmap" },
  { href: "/resources/stacks", key: "stacks" },
  { href: "/categories", key: "categories" },
  { href: "/standards", key: "standard" },
] as const;

const MENU = [
  { href: "/app", label: "لوحة المطور", Icon: User },
  { href: "/publisher", label: "بوابة الناشر", Icon: Layers },
  { href: "/review", label: "لوحة المراجع", Icon: CircleCheckBig },
  { href: "/moderation", label: "لوحة الإشراف", Icon: Shield },
  { href: "/admin", label: "لوحة الإدارة", Icon: Settings },
] as const;
const MENU_ICON = ["text-ratq-600", "text-blue-600", "text-emerald-600", "text-amber-600", "text-purple-600"];

const BTN = "inline-flex flex-row flex-nowrap items-center justify-center whitespace-nowrap font-medium rounded-md transition-all duration-150 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ratq-500 disabled:opacity-50 disabled:pointer-events-none select-none shrink-0 text-xs px-2.5 py-1.5 gap-1.5";

export function Header() {
  const { prefs, set } = usePrefs();
  const path = usePathname();
  const router = useRouter();
  const t = dict[prefs.locale];
  const ar = prefs.locale === "ar";
  const role = useRole(); // in-memory only, as on the live site
  const [menu, setMenu] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [palette, setPalette] = useState(false);
  const avatar = useRef<HTMLDivElement>(null);
  const persona = ROLES.find((r) => r.id === role)!;
  const active = (href: string) => (href === "/" ? path === "/" : path === href || path.startsWith(href + "/"));

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setPalette((o) => !o); }
    };
    const down = (e: MouseEvent) => { if (avatar.current && !avatar.current.contains(e.target as Node)) setMenu(false); };
    window.addEventListener("keydown", key);
    document.addEventListener("mousedown", down);
    return () => { window.removeEventListener("keydown", key); document.removeEventListener("mousedown", down); };
  }, []);
  useEffect(() => { setMobile(false); setMenu(false); }, [path]);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border bg-canvas/90 backdrop-blur-md transition-colors">
        <div className="max-w-container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/" title={`${t.logoAlt} — ${t.home}`} className="flex flex-col items-center justify-center group py-0.5 select-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt={t.logoAlt} className="h-7 sm:h-8 w-auto max-w-[90px] object-contain dark:invert transition-transform duration-200 group-hover:scale-105" />
              <span className="text-[9px] font-bold text-ratq-700 dark:text-ratq-300 bg-ratq-50 dark:bg-ratq-950/80 border border-ratq-200 dark:border-ratq-800/80 px-1.5 py-0.5 rounded leading-none tracking-tight mt-0.5 whitespace-nowrap">
                {t.beta}
              </span>
            </Link>
            <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className={"px-3 py-1.5 rounded-md transition-colors " + (active(n.href) ? "text-ratq-700 bg-ratq-50 dark:bg-ratq-950/60 dark:text-ratq-300 font-bold" : "text-fg-muted hover:text-fg hover:bg-subtle")}
                >
                  {t[n.key]}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <button
              aria-label={t.searchAria}
              onClick={() => setPalette(true)}
              className="flex items-center gap-2 text-xs text-fg-subtle bg-subtle border border-border px-3 py-1.5 rounded-md hover:border-border-strong transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.search}</span>
              <kbd className="hidden sm:inline text-[10px] font-mono bg-muted text-fg-subtle px-1.5 py-0.5 rounded border border-border">⌘K</kbd>
            </button>
            <button aria-label={t.themeAria} onClick={() => set("theme", prefs.theme === "dark" ? "light" : "dark")} className="p-2 text-fg-muted hover:text-fg hover:bg-subtle rounded-md transition-colors">
              {prefs.theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button aria-label={t.langAria} onClick={() => set("locale", ar ? "en" : "ar")} className="p-2 text-fg-muted hover:text-fg hover:bg-subtle rounded-md transition-colors flex items-center gap-1 text-xs font-semibold">
              <Globe className="w-4 h-4" />
              <span>{t.langBtn}</span>
            </button>
            {role === "guest" ? (
              <div className="flex items-center gap-2">
                <button onClick={() => router.push("/auth/sign-in")} className={BTN + " border border-border text-fg hover:bg-subtle hover:border-border-strong active:bg-muted"}>{ar ? "تسجيل الدخول" : "Sign In"}</button>
                <button onClick={() => router.push("/auth/sign-up")} className={BTN + " bg-ratq-700 text-white hover:bg-ratq-800 shadow-sm active:bg-ratq-900"}>{ar ? "إنشاء حساب" : "Sign Up"}</button>
              </div>
            ) : (
              <div className="relative" ref={avatar}>
                <button onClick={() => setMenu((o) => !o)} className="flex items-center gap-2 p-1 rounded-full border border-border hover:border-border-strong transition-colors cursor-pointer">
                  <div className="w-7 h-7 rounded-full bg-ratq-100 dark:bg-ratq-900 text-ratq-700 dark:text-ratq-300 flex items-center justify-center font-bold text-xs">{"letter" in persona ? persona.letter : ""}</div>
                </button>
                {menu && "name" in persona && (
                  <div className="absolute end-0 mt-2 w-60 rounded-xl border border-border bg-canvas p-2 shadow-lg z-50 text-start">
                    <div className="px-3 py-2 border-b border-border-subtle mb-1">
                      <p className="text-xs font-bold text-fg truncate">{persona.name}</p>
                      <p className="text-2xs text-fg-subtle truncate">{persona.handle}</p>
                    </div>
                    {MENU.map(({ href, label, Icon }, i) => (
                      <Link key={href} href={href} className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-fg hover:bg-subtle rounded-md transition-colors">
                        <Icon className={"w-4 h-4 " + MENU_ICON[i]} />
                        <span>{label}</span>
                      </Link>
                    ))}
                    <div className="border-t border-border-subtle my-1" />
                    <button onClick={() => { setRole("guest"); setMenu(false); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-md transition-colors">
                      <LogOut className="w-4 h-4" />
                      <span>{ar ? "تسجيل الخروج" : "Sign Out"}</span>
                    </button>
                  </div>
                )}
              </div>
            )}
            <button aria-label={t.menuAria} onClick={() => setMobile((o) => !o)} className="lg:hidden p-2 text-fg-muted hover:text-fg rounded-md">
              {mobile ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {mobile && (
          <div className="lg:hidden border-t border-border bg-canvas px-4 py-4 flex flex-col gap-1 max-h-[80vh] overflow-y-auto">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className={"px-3 py-2 text-sm font-medium rounded-md transition-colors " + (active(n.href) ? "text-ratq-700 bg-ratq-50 dark:bg-ratq-950/60 dark:text-ratq-300 font-bold" : "text-fg-muted")}>
                {t[n.key]}
              </Link>
            ))}
            <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
              <span className="text-fg-subtle">تبديل الدور التجريبي:</span>
              <select value={role} onChange={(e) => setRole(e.target.value as RoleId)} className="bg-subtle border border-border px-2 py-1 rounded text-xs text-fg">
                {ROLES.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
              </select>
            </div>
          </div>
        )}
      </header>
      <CommandPalette open={palette} onClose={() => setPalette(false)} />
    </>
  );
}
