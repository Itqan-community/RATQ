import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/useAuthStore';
import { isLive } from '@/lib/payloadAuth';
import { useThemeStore } from '@/store/useThemeStore';
import { Button } from '@/components/ui/Button';
import { DemoBadge } from '@/components/ui/DemoBadge';
import { UserRole } from '@/types';
import {
  Search,
  Moon,
  Sun,
  Globe,
  Menu,
  X,
  User,
  Shield,
  Layers,
  CheckCircle,
  Settings,
  LogOut,
} from 'lucide-react';

interface SiteHeaderProps {
  onOpenCommandPalette?: () => void;
}

export const SiteHeader: React.FC<SiteHeaderProps> = ({ onOpenCommandPalette }) => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, currentRole, profile, switchRole, signOut, signOutLive } = useAuthStore();
  const { theme, toggleTheme, locale, setLocale } = useThemeStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isAr = locale === 'ar';

  useEffect(() => {
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isResourcesActive =
    location.pathname === '/resources' ||
    location.pathname.startsWith('/resources/preview-') ||
    (location.pathname.startsWith('/resources/') &&
      !location.pathname.startsWith('/resources/stacks') &&
      !location.pathname.startsWith('/resources/roadmap') &&
      !location.pathname.startsWith('/resources/wizard'));

  const isRoadmapActive =
    location.pathname.startsWith('/resources/roadmap') ||
    location.pathname.startsWith('/roadmap');

  const isStacksActive =
    location.pathname.startsWith('/resources/stacks') ||
    location.pathname.startsWith('/stacks');

  const roleOptions: { role: UserRole; label: string }[] = [
    { role: 'developer', label: 'مطور (Developer)' },
    { role: 'publisher_owner', label: 'ناشر (Publisher)' },
    { role: 'reviewer', label: 'مراجع إتقان (Reviewer)' },
    { role: 'moderator', label: 'مشرف (Moderator)' },
    { role: 'admin', label: 'مسؤول المنصة (Admin)' },
    { role: 'guest', label: 'زائر (Guest)' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-canvas/90 backdrop-blur-md transition-colors">
      <div className="max-w-container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="flex flex-col items-center justify-center group py-0.5 select-none"
            title="رَتْق — الرئيسية"
          >
            <img
              src="/logo.png"
              alt="شعار رَتْق"
              className="h-7 sm:h-8 w-auto max-w-[90px] object-contain dark:invert transition-transform duration-200 group-hover:scale-105"
            />
            <span className="text-[9px] font-bold text-ratq-700 dark:text-ratq-300 bg-ratq-50 dark:bg-ratq-950/80 border border-ratq-200 dark:border-ratq-800/80 px-1.5 py-0.5 rounded leading-none tracking-tight mt-0.5 whitespace-nowrap">
              {isAr ? 'نسخة تجريبية' : 'Beta Prototype'}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-md transition-colors ${
                location.pathname === '/'
                  ? 'text-ratq-700 bg-ratq-50 dark:bg-ratq-950/60 dark:text-ratq-300 font-bold'
                  : 'text-fg-muted hover:text-fg hover:bg-subtle'
              }`}
            >
              {isAr ? 'الرئيسية' : 'Home'}
            </Link>

            {/* Resources Nav Item */}
            <Link
              to="/resources"
              className={`px-3 py-1.5 rounded-md transition-colors ${
                isResourcesActive
                  ? 'text-ratq-700 bg-ratq-50 dark:bg-ratq-950/60 dark:text-ratq-300 font-bold'
                  : 'text-fg-muted hover:text-fg hover:bg-subtle'
              }`}
            >
              {isAr ? 'مكتبة الموارد' : 'Resources Library'}
            </Link>

            {/* Dev Roadmap Nav Item */}
            <Link
              to="/resources/roadmap"
              className={`px-3 py-1.5 rounded-md transition-colors ${
                isRoadmapActive
                  ? 'text-ratq-700 bg-ratq-50 dark:bg-ratq-950/60 dark:text-ratq-300 font-bold'
                  : 'text-fg-muted hover:text-fg hover:bg-subtle'
              }`}
            >
              {isAr ? 'مسار المطور' : 'Dev Roadmap'}
              <DemoBadge to="/resources/roadmap" isAr={isAr} />
            </Link>

            {/* App Stacks Nav Item */}
            <Link
              to="/resources/stacks"
              className={`px-3 py-1.5 rounded-md transition-colors ${
                isStacksActive
                  ? 'text-ratq-700 bg-ratq-50 dark:bg-ratq-950/60 dark:text-ratq-300 font-bold'
                  : 'text-fg-muted hover:text-fg hover:bg-subtle'
              }`}
            >
              {isAr ? 'حزم التطبيقات' : 'App Stacks'}
              <DemoBadge to="/resources/stacks" isAr={isAr} />
            </Link>

            <Link
              to="/categories"
              className={`px-3 py-1.5 rounded-md transition-colors ${
                location.pathname.startsWith('/categories')
                  ? 'text-ratq-700 bg-ratq-50 dark:bg-ratq-950/60 dark:text-ratq-300 font-bold'
                  : 'text-fg-muted hover:text-fg hover:bg-subtle'
              }`}
            >
              {isAr ? 'التصنيفات' : 'Categories'}
              <DemoBadge to="/categories" isAr={isAr} />
            </Link>

            <Link
              to="/standards"
              className={`px-3 py-1.5 rounded-md transition-colors ${
                location.pathname.startsWith('/standards')
                  ? 'text-ratq-700 bg-ratq-50 dark:bg-ratq-950/60 dark:text-ratq-300 font-bold'
                  : 'text-fg-muted hover:text-fg hover:bg-subtle'
              }`}
            >
              {isAr ? 'معيار إتقان' : 'Itqan Standard'}
            </Link>
          </nav>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Search Button (⌘K) */}
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-2 text-xs text-fg-subtle bg-subtle border border-border px-3 py-1.5 rounded-md hover:border-border-strong transition-colors cursor-pointer"
            aria-label="البحث السريع"
          >
            <Search className="w-3.5 h-3.5 text-fg-muted" />
            <span className="hidden sm:inline">ابحث في الموارد...</span>
            <kbd className="hidden sm:inline text-[10px] font-mono bg-muted text-fg-subtle px-1.5 py-0.5 rounded border border-border">
              ⌘K
            </kbd>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-fg-muted hover:text-fg hover:bg-subtle rounded-md transition-colors"
            aria-label="تبديل المظهر"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')}
            className="p-2 text-fg-muted hover:text-fg hover:bg-subtle rounded-md transition-colors flex items-center gap-1 text-xs font-semibold"
            aria-label="تبديل اللغة"
          >
            <Globe className="w-4 h-4" />
            <span>{locale === 'ar' ? 'EN' : 'عربي'}</span>
          </button>

          {/* Auth State Button / User Menu */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-full border border-border hover:border-border-strong transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-ratq-100 dark:bg-ratq-900 text-ratq-700 dark:text-ratq-300 flex items-center justify-center font-bold text-xs">
                  {profile.display_name.charAt(0)}
                </div>
              </button>

              {userMenuOpen && (
                <div
                  className="absolute end-0 mt-2 w-60 rounded-xl border border-border bg-canvas p-2 shadow-lg z-50 text-start"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-border-subtle mb-1">
                    <p className="text-xs font-bold text-fg truncate">{profile.display_name}</p>
                    <p className="text-2xs text-fg-subtle truncate">@{profile.handle}</p>
                  </div>

                  <Link
                    to="/app"
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-fg hover:bg-subtle rounded-md transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-ratq-600" />
                    <span>لوحة المطور</span>
                  </Link>
                  <Link
                    to="/publisher"
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-fg hover:bg-subtle rounded-md transition-colors"
                  >
                    <Layers className="w-3.5 h-3.5 text-blue-600" />
                    <span>بوابة الناشر</span>
                  </Link>
                  <Link
                    to="/review"
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-fg hover:bg-subtle rounded-md transition-colors"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-cyan-600" />
                    <span>لوحة المراجع</span>
                  </Link>
                  <Link
                    to="/moderation"
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-fg hover:bg-subtle rounded-md transition-colors"
                  >
                    <Shield className="w-3.5 h-3.5 text-amber-600" />
                    <span>لوحة الإشراف</span>
                  </Link>
                  <Link
                    to="/admin"
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-fg hover:bg-subtle rounded-md transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5 text-purple-600" />
                    <span>لوحة الإدارة</span>
                  </Link>

                  <div className="border-t border-border-subtle my-1" />

                  <button
                    onClick={() => {
                      if (isLive()) void signOutLive();
                      else signOut();
                      navigate('/');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-md transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t('actions.sign_out')}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate('/auth/sign-in')}>
                {t('actions.sign_in')}
              </Button>
              <Button variant="primary" size="sm" onClick={() => navigate('/auth/sign-up')}>
                {t('actions.sign_up')}
              </Button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-fg-muted hover:text-fg rounded-md"
            aria-label="القائمة"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-canvas px-4 py-4 flex flex-col gap-1 max-h-[80vh] overflow-y-auto">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              location.pathname === '/' ? 'text-ratq-700 bg-ratq-50 dark:bg-ratq-950/60 font-bold' : 'text-fg-muted'
            }`}
          >
            {isAr ? 'الرئيسية' : 'Home'}
          </Link>

          {/* Mobile Resources Nav Item */}
          <Link
            to="/resources"
            onClick={() => setMobileMenuOpen(false)}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              isResourcesActive ? 'text-ratq-700 bg-ratq-50 dark:bg-ratq-950/60 font-bold' : 'text-fg-muted'
            }`}
          >
            {isAr ? 'مكتبة الموارد' : 'Resources Library'}
          </Link>

          {/* Mobile Roadmap Item */}
          <Link
            to="/resources/roadmap"
            onClick={() => setMobileMenuOpen(false)}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              isRoadmapActive ? 'text-ratq-700 bg-ratq-50 dark:bg-ratq-950/60 font-bold' : 'text-fg-muted'
            }`}
          >
            {isAr ? 'مسار المطور' : 'Dev Roadmap'}
          </Link>

          {/* Mobile Stacks Item */}
          <Link
            to="/resources/stacks"
            onClick={() => setMobileMenuOpen(false)}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              isStacksActive ? 'text-ratq-700 bg-ratq-50 dark:bg-ratq-950/60 font-bold' : 'text-fg-muted'
            }`}
          >
            {isAr ? 'حزم التطبيقات' : 'App Stacks'}
          </Link>

          <Link
            to="/categories"
            onClick={() => setMobileMenuOpen(false)}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              location.pathname.startsWith('/categories') ? 'text-ratq-700 bg-ratq-50 dark:bg-ratq-950/60 font-bold' : 'text-fg-muted'
            }`}
          >
            {isAr ? 'التصنيفات' : 'Categories'}
          </Link>

          <Link
            to="/standards"
            onClick={() => setMobileMenuOpen(false)}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              location.pathname.startsWith('/standards') ? 'text-ratq-700 bg-ratq-50 dark:bg-ratq-950/60 font-bold' : 'text-fg-muted'
            }`}
          >
            {isAr ? 'معيار إتقان' : 'Itqan Standard'}
          </Link>
          <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
            <span className="text-fg-subtle">تبديل الدور التجريبي:</span>
            <select
              value={currentRole}
              onChange={(e) => switchRole(e.target.value as UserRole)}
              className="bg-subtle border border-border px-2 py-1 rounded text-xs text-fg"
            >
              {roleOptions.map((opt) => (
                <option key={opt.role} value={opt.role}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </header>
  );
};
