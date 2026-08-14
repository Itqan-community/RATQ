"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/shared/ui/i18n";

function SaudiFlag() {
  return (
    <img
      src="/flags/sa.svg?v=2"
      alt=""
      className="h-5 w-[30px] rounded-[3px] object-cover shadow-sm ring-1 ring-black/10"
      aria-hidden="true"
    />
  );
}

function BritishFlag() {
  return (
    <img
      src="/flags/gb.svg?v=2"
      alt=""
      className="h-5 w-[30px] rounded-[3px] object-cover shadow-sm ring-1 ring-black/10"
      aria-hidden="true"
    />
  );
}
export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, logout } = useAuth();
  const { locale, direction, setLocale, t } = useLanguage();

  // eslint-disable-next-line react-hooks/set-state-in-effect -- Avoid auth-dependent hydration mismatch after localStorage is read on the client.
  useEffect(() => setMounted(true), []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);
  const navLinkClass = (href: string) =>
    `py-2 transition ${isActive(href) ? "font-black text-black" : "font-medium text-[#59636d] hover:text-black"}`;
  const mobileNavLinkClass = (href: string) =>
    `py-1 transition ${isActive(href) ? "font-black text-black" : "font-medium text-[#59636d]"}`;

  const languageSwitcher = (
    <div
      className="inline-flex w-fit shrink-0 items-center rounded-full border border-[#e8e2d6] bg-[#f9f4ea] p-1"
      dir="ltr"
      role="group"
      aria-label={locale === "ar" ? "اختيار اللغة" : "Choose language"}
    >
      <button
        type="button"
        onClick={() => setLocale("ar")}
        aria-pressed={locale === "ar"}
        aria-label="العربية"
        title="العربية"
        className={`flex h-9 items-center gap-1.5 rounded-full px-2 text-xs font-black transition sm:px-3 ${
          locale === "ar"
            ? "bg-[#171717] text-white shadow-sm"
            : "text-[#4a4a4a] hover:bg-white"
        }`}
      >
        <SaudiFlag />
        <span className="hidden sm:inline">AR</span>
      </button>
      <button
        type="button"
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
        aria-label="English"
        title="English"
        className={`flex h-9 items-center gap-1.5 rounded-full px-2 text-xs font-black transition sm:px-3 ${
          locale === "en"
            ? "bg-[#171717] text-white shadow-sm"
            : "text-[#4a4a4a] hover:bg-white"
        }`}
      >
        <BritishFlag />
        <span className="hidden sm:inline">EN</span>
      </button>
    </div>
  );

  return (
    <header
      className="sticky top-0 z-50 h-0 overflow-visible bg-transparent px-3 sm:px-8"
      dir={direction}
    >
      <div className="mx-auto mt-8 max-w-[1410px]">
        <nav
          className={`${menuOpen ? "rounded-[28px]" : "rounded-full"} bg-white px-3 shadow-[0_10px_40px_rgba(15,23,42,0.06)] sm:px-5 md:rounded-full`}
          dir={direction}
        >
          <div className="flex h-20 items-center justify-between gap-4">
            <div className="order-3 flex items-center justify-start gap-2" dir={direction}>
              <div className="hidden md:block">
                {languageSwitcher}
              </div>
              {mounted && user ? (
                <button
                  onClick={handleLogout}
                  className="hidden rounded-full bg-black px-6 py-3 text-sm font-black text-white transition hover:bg-[#171717] lg:inline-flex"
                >
                  {t.header.auth.logout}
                </button>
              ) : (
                <Link
                  href="/login"
                  className="hidden rounded-full bg-black px-6 py-3 text-sm font-black text-white transition hover:bg-[#171717] lg:inline-flex"
                >
                  {t.header.auth.login}
                </Link>
              )}
            </div>

            <div
              className="order-2 hidden items-center gap-9 text-base md:flex"
              dir={direction}
            >
              <Link href="/" className={navLinkClass("/")} aria-current={isActive("/") ? "page" : undefined}>
                {t.header.nav.home}
              </Link>
              <Link href="/resources" className={navLinkClass("/resources")} aria-current={isActive("/resources") ? "page" : undefined}>
                {t.header.nav.resources}
              </Link>
              <Link href="/about" className={navLinkClass("/about")} aria-current={isActive("/about") ? "page" : undefined}>
                {t.header.nav.about}
              </Link>
              <Link href="/contributors" className={navLinkClass("/contributors")} aria-current={isActive("/contributors") ? "page" : undefined}>
                {t.header.nav.contributors}
              </Link>
              <Link href="/dashboard" className={navLinkClass("/dashboard")} aria-current={isActive("/dashboard") ? "page" : undefined}>
                {t.header.nav.dashboard}
              </Link>
            </div>

            <div className="order-1 flex items-center gap-2">
              <Link
                href="/"
                className="text-4xl font-black tracking-normal text-black"
                aria-label="RATQ"
              >
                <img
                  src="/images/logo.png"
                  alt="RATQ"
                  className="h-8 w-auto object-contain"
                />
              </Link>
              <span className="rounded-full bg-black px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-white">
                Beta
              </span>
            </div>

            <button
              className="order-4 rounded-full p-3 text-black md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={t.header.mobileMenu}
              aria-expanded={menuOpen}
            >
              <svg
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18 18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {menuOpen && (
            <div
              className="border-t border-[#eeeeee] px-2 pb-5 pt-4 text-start md:hidden"
              dir={direction}
            >
              <div className="grid gap-4 text-base text-black">
                <Link href="/" className={mobileNavLinkClass("/")} aria-current={isActive("/") ? "page" : undefined} onClick={() => setMenuOpen(false)}>
                  {t.header.nav.home}
                </Link>
                <Link href="/resources" className={mobileNavLinkClass("/resources")} aria-current={isActive("/resources") ? "page" : undefined} onClick={() => setMenuOpen(false)}>
                  {t.header.nav.resources}
                </Link>
                <Link href="/about" className={mobileNavLinkClass("/about")} aria-current={isActive("/about") ? "page" : undefined} onClick={() => setMenuOpen(false)}>
                  {t.header.nav.about}
                </Link>
                <Link href="/contributors" className={mobileNavLinkClass("/contributors")} aria-current={isActive("/contributors") ? "page" : undefined} onClick={() => setMenuOpen(false)}>
                  {t.header.nav.contributors}
                </Link>
                <Link href="/dashboard" className={mobileNavLinkClass("/dashboard")} aria-current={isActive("/dashboard") ? "page" : undefined} onClick={() => setMenuOpen(false)}>
                  {t.header.nav.dashboard}
                </Link>
                <div className="border-t border-[#eeeeee] pt-4">
                  <p className="mb-3 text-sm font-bold text-[#59636d]">
                    {locale === "ar" ? "اللغة" : "Language"}
                  </p>
                  <div className="[&_span]:!inline">
                    {languageSwitcher}
                  </div>
                </div>
                {mounted && user ? (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                    className="text-start"
                  >
                    {t.header.auth.logout}
                  </button>
                ) : (
                  <Link href="/login" onClick={() => setMenuOpen(false)}>
                    {t.header.auth.login}
                  </Link>
                )}
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
