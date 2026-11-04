// src/pages/Catalog.tsx
// Canonical Resource Library - Categorized Sections with Sticky Scroll-Spy
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { mockRepo } from '@/lib/supabase';
import { DEMO_CATEGORIES } from '@/lib/mockData';
import { Resource } from '@/types';
import { ResourceCard } from '@/components/resources/ResourceCard';
import { ResourceFilters } from '@/components/resources/ResourceFilters';
import { CatalogWizardHelper } from '@/components/resources/CatalogWizardHelper';
import { useCatalogStore } from '@/store/useCatalogStore';
import {
  Layers,
  Search,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Library,
  Code2,
  PenTool,
  Database,
  Mic,
  Languages,
  ArrowUp,
  SlidersHorizontal,
  X,
  Bookmark,
  RotateCcw,
  ShieldCheck,
  Shield,
  Award,
  Crown,
  Unlock,
  Lock,
  Building2,
  Check,
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  cat_quran_sources: BookOpen,
  cat_tafsir: Library,
  cat_dev: Code2,
  cat_fonts: PenTool,
  cat_datasets: Database,
  cat_translations: Languages,
  cat_recitations: Mic,
};

const BADGE_FILTER_OPTIONS = [
  { id: 'gold', label: 'إتقان ذهبي', icon: Crown, color: 'text-amber-500' },
  { id: 'certified', label: 'معتمد', icon: Award, color: 'text-cyan-600 dark:text-cyan-400' },
  { id: 'verified', label: 'موثّق تقنياً', icon: ShieldCheck, color: 'text-ratq-600 dark:text-ratq-400' },
  { id: 'basic', label: 'إتقان أساسي', icon: Shield, color: 'text-fg-subtle' },
];

const ACCESS_FILTER_OPTIONS = [
  { id: 'open', label: 'مفتوح ومباشر', icon: Unlock, desc: 'تنزيل فوري بدون قيود' },
  { id: 'request', label: 'بالطلب', icon: Lock, desc: 'يتطلب مفتاح API أو تسجيل' },
  { id: 'institutional', label: 'مؤسسي فقط', icon: Building2, desc: 'مخصص للجهات والمعاهد' },
];

export interface CategoryTheme {
  topGradient: string;
  topBorder: string;
  glowBg: string;
  iconBg: string;
  iconBorder: string;
  iconColor: string;
  badgeBg: string;
  cardBorderHover: string;
}

const CATEGORY_THEMES: Record<string, CategoryTheme> = {
  cat_quran_sources: {
    topGradient: 'from-emerald-500/10 via-emerald-500/2 to-transparent dark:from-emerald-400/12 dark:via-emerald-400/2 to-transparent',
    topBorder: 'via-emerald-500/40 dark:via-emerald-400/40',
    glowBg: 'bg-emerald-500',
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/70',
    iconBorder: 'border-emerald-200/80 dark:border-emerald-800/70',
    iconColor: 'text-emerald-700 dark:text-emerald-300',
    badgeBg: 'bg-emerald-50/80 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    cardBorderHover: 'hover:border-emerald-300/80 dark:hover:border-emerald-800',
  },
  cat_tafsir: {
    topGradient: 'from-amber-500/10 via-amber-500/2 to-transparent dark:from-amber-400/12 dark:via-amber-400/2 to-transparent',
    topBorder: 'via-amber-500/40 dark:via-amber-400/40',
    glowBg: 'bg-amber-500',
    iconBg: 'bg-amber-50 dark:bg-amber-950/70',
    iconBorder: 'border-amber-200/80 dark:border-amber-800/70',
    iconColor: 'text-amber-700 dark:text-amber-300',
    badgeBg: 'bg-amber-50/80 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    cardBorderHover: 'hover:border-amber-300/80 dark:hover:border-amber-800',
  },
  cat_dev: {
    topGradient: 'from-ratq-500/10 via-ratq-500/2 to-transparent dark:from-ratq-400/12 dark:via-ratq-400/2 to-transparent',
    topBorder: 'via-ratq-500/40 dark:via-ratq-400/40',
    glowBg: 'bg-ratq-500',
    iconBg: 'bg-ratq-50 dark:bg-ratq-950/70',
    iconBorder: 'border-ratq-200/80 dark:border-ratq-800/70',
    iconColor: 'text-ratq-700 dark:text-ratq-300',
    badgeBg: 'bg-ratq-50/80 dark:bg-ratq-950/60 text-ratq-800 dark:text-ratq-300 border-ratq-200 dark:border-ratq-800',
    cardBorderHover: 'hover:border-ratq-300/80 dark:hover:border-ratq-800',
  },
  cat_fonts: {
    topGradient: 'from-purple-500/10 via-purple-500/2 to-transparent dark:from-purple-400/12 dark:via-purple-400/2 to-transparent',
    topBorder: 'via-purple-500/40 dark:via-purple-400/40',
    glowBg: 'bg-purple-500',
    iconBg: 'bg-purple-50 dark:bg-purple-950/70',
    iconBorder: 'border-purple-200/80 dark:border-purple-800/70',
    iconColor: 'text-purple-700 dark:text-purple-300',
    badgeBg: 'bg-purple-50/80 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    cardBorderHover: 'hover:border-purple-300/80 dark:hover:border-purple-800',
  },
  cat_datasets: {
    topGradient: 'from-cyan-500/10 via-cyan-500/2 to-transparent dark:from-cyan-400/12 dark:via-cyan-400/2 to-transparent',
    topBorder: 'via-cyan-500/40 dark:via-cyan-400/40',
    glowBg: 'bg-cyan-500',
    iconBg: 'bg-cyan-50 dark:bg-cyan-950/70',
    iconBorder: 'border-cyan-200/80 dark:border-cyan-800/70',
    iconColor: 'text-cyan-700 dark:text-cyan-300',
    badgeBg: 'bg-cyan-50/80 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
    cardBorderHover: 'hover:border-cyan-300/80 dark:hover:border-cyan-800',
  },
  cat_translations: {
    topGradient: 'from-blue-500/10 via-blue-500/2 to-transparent dark:from-blue-400/10 dark:via-blue-400/2 to-transparent',
    topBorder: 'via-blue-500/40 dark:via-blue-400/40',
    glowBg: 'bg-blue-500',
    iconBg: 'bg-blue-50 dark:bg-blue-950/70',
    iconBorder: 'border-blue-200/80 dark:border-blue-800/70',
    iconColor: 'text-blue-700 dark:text-blue-300',
    badgeBg: 'bg-blue-50/80 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    cardBorderHover: 'hover:border-blue-300/80 dark:hover:border-blue-800',
  },
  cat_recitations: {
    topGradient: 'from-green-500/10 via-green-500/2 to-transparent dark:from-green-400/12 dark:via-green-400/2 to-transparent',
    topBorder: 'via-green-500/40 dark:via-green-400/40',
    glowBg: 'bg-green-500',
    iconBg: 'bg-green-50 dark:bg-green-950/70',
    iconBorder: 'border-green-200/80 dark:border-green-800/70',
    iconColor: 'text-green-700 dark:text-green-300',
    badgeBg: 'bg-green-50/80 dark:bg-green-950/60 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800',
    cardBorderHover: 'hover:border-green-400/80 dark:hover:border-green-800',
  },
};

const DEFAULT_CATEGORY_THEME: CategoryTheme = {
  topGradient: 'from-ratq-500/10 via-ratq-500/2 to-transparent dark:from-ratq-400/12 dark:via-ratq-400/2 to-transparent',
  topBorder: 'via-ratq-500/40 dark:via-ratq-400/40',
  glowBg: 'bg-ratq-500',
  iconBg: 'bg-ratq-50 dark:bg-ratq-950/70',
  iconBorder: 'border-ratq-200/80 dark:border-ratq-800/70',
  iconColor: 'text-ratq-700 dark:text-ratq-300',
  badgeBg: 'bg-ratq-50/80 dark:bg-ratq-950/60 text-ratq-800 dark:text-ratq-300 border-ratq-200 dark:border-ratq-800',
  cardBorderHover: 'hover:border-ratq-300/80 dark:hover:border-ratq-800',
};

export const Catalog: React.FC = () => {
  const [searchParams] = useSearchParams();
  const allResources = useMemo(() => mockRepo.getResources(), []);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('cat_quran_sources');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);

  // Dropdown states for toolbar filters
  const [isBadgeDropdownOpen, setIsBadgeDropdownOpen] = useState(false);
  const [isAccessDropdownOpen, setIsAccessDropdownOpen] = useState(false);
  const badgeDropdownRef = useRef<HTMLDivElement>(null);
  const accessDropdownRef = useRef<HTMLDivElement>(null);

  // Sync URL search query if provided (e.g., from Home search bar)
  useEffect(() => {
    const qParam = searchParams.get('q');
    if (qParam) {
      setSearchQuery(qParam);
    }
  }, [searchParams]);

  // Connect to catalog store for advanced filters
  const {
    selectedTypes,
    selectedLicenses,
    selectedAccess,
    toggleAccess,
    selectedBadges,
    toggleBadge,
    selectedTech,
    commercialOnly,
    resetFilters,
    isCompact,
  } = useCatalogStore();

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        badgeDropdownRef.current &&
        !badgeDropdownRef.current.contains(event.target as Node)
      ) {
        setIsBadgeDropdownOpen(false);
      }
      if (
        accessDropdownRef.current &&
        !accessDropdownRef.current.contains(event.target as Node)
      ) {
        setIsAccessDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Drawer-specific filters count (Types, Licenses, Tech, Commercial)
  const drawerFiltersCount = useMemo(() => {
    return (
      selectedTypes.length +
      selectedLicenses.length +
      selectedTech.length +
      (commercialOnly ? 1 : 0)
    );
  }, [selectedTypes, selectedLicenses, selectedTech, commercialOnly]);

  // Total active filters count (including toolbar dropdowns + drawer)
  const activeFiltersCount = useMemo(() => {
    return (
      selectedTypes.length +
      selectedLicenses.length +
      selectedAccess.length +
      selectedBadges.length +
      selectedTech.length +
      (commercialOnly ? 1 : 0)
    );
  }, [
    selectedTypes,
    selectedLicenses,
    selectedAccess,
    selectedBadges,
    selectedTech,
    commercialOnly,
  ]);

  // Comprehensive filter matching
  const filteredResources = useMemo(() => {
    return allResources.filter((r) => {
      // 1. Text Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          r.title_ar.toLowerCase().includes(q) ||
          (r.title_en && r.title_en.toLowerCase().includes(q)) ||
          r.summary_ar.toLowerCase().includes(q) ||
          r.tags.some((tag) => tag.toLowerCase().includes(q));
        if (!matchesQuery) return false;
      }

      // 2. Resource Type Filter
      if (selectedTypes.length > 0 && !selectedTypes.includes(r.resource_type)) {
        return false;
      }

      // 3. License Filter
      if (selectedLicenses.length > 0 && !selectedLicenses.includes(r.license_id)) {
        return false;
      }

      // 4. Access Level Filter
      if (selectedAccess.length > 0 && !selectedAccess.includes(r.access_level)) {
        return false;
      }

      // 5. Itqan Badges Filter
      if (selectedBadges.length > 0 && !selectedBadges.includes(r.itqan_level)) {
        return false;
      }

      // 6. Tech Stack Filter
      if (
        selectedTech.length > 0 &&
        !selectedTech.some((tech) => r.tech_stack?.includes(tech))
      ) {
        return false;
      }

      // 7. Commercial Only
      if (commercialOnly && r.license_id !== 'lic_mit' && r.license_id !== 'lic_apache2') {
        return false;
      }

      return true;
    });
  }, [
    allResources,
    searchQuery,
    selectedTypes,
    selectedLicenses,
    selectedAccess,
    selectedBadges,
    selectedTech,
    commercialOnly,
  ]);

  // Group resources by categories
  const categorizedData = useMemo(() => {
    return DEMO_CATEGORIES.map((cat) => {
      const items = filteredResources.filter((r) => r.categories.includes(cat.id));
      return {
        category: cat,
        items,
        count: items.length,
      };
    }).filter((group) => group.count > 0);
  }, [filteredResources]);

  // Scroll-Spy with IntersectionObserver
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined' || categorizedData.length === 0) return;

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id.replace('section-', '');
          setActiveCategory(id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: '-140px 0px -50% 0px',
      threshold: 0,
    });

    categorizedData.forEach((group) => {
      const el = document.getElementById(`section-${group.category.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [categorizedData]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isFilterDrawerOpen || isMobileTocOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFilterDrawerOpen, isMobileTocOpen]);

  const toggleCategoryExpand = (catId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const scrollToSection = (id: string) => {
    setActiveCategory(id);
    setIsMobileTocOpen(false);
    const element = document.getElementById(`section-${id}`);
    if (element) {
      const offset = 148;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-container mx-auto px-4 sm:px-6 py-6 w-full text-start">
      {/* Breadcrumb & Page Header */}
      <div className="mb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs text-fg-subtle mb-3">
          <Link to="/" className="hover:text-ratq-700 transition-colors">
            الرئيسية
          </Link>
          <span>/</span>
          <span className="text-ratq-700 font-bold">مكتبة الموارد</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-fg">
          مكتبة الموارد القرآنية الموثقة
        </h1>
        <p className="text-xs sm:text-sm text-fg-subtle mt-1">
          استكشف مكتبات البرمجة، مجموعات البيانات، واجهات API، وخطوط المصحف الخاضعة لمعايير إتقان.
        </p>

        {/* Smart Wizard Helper Banner */}
        <div className="pt-2">
          <CatalogWizardHelper className="mb-0" />
        </div>
      </div>

      {/* Sticky Toolbar: Search & Advanced Filters & Dropdowns */}
      <div className="sticky top-16 z-30 mb-8 p-3 rounded-2xl border border-border bg-canvas/95 backdrop-blur-md shadow-xs transition-colors flex flex-wrap items-center justify-between gap-3">
        {/* Quick Search Input */}
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="w-4 h-4 text-fg-subtle absolute start-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="تصفية الموارد داخل الأقسام بالاسم أو الكلمات المفتاحية..."
            className="w-full ps-9 pe-3 py-2 rounded-xl border border-border bg-subtle/50 text-xs sm:text-sm placeholder:text-fg-subtle focus:outline-none focus:border-ratq-500 focus:bg-canvas transition-all"
          />
        </div>

        {/* Filter Trigger Buttons & Results Counter (All on the same line) */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {/* Active Filter Indicator Tag (Reset All) */}
          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-ratq-50 dark:bg-ratq-950/80 border border-ratq-200 dark:border-ratq-800 text-ratq-700 dark:text-ratq-300 text-xs font-semibold hover:bg-ratq-100 transition-colors cursor-pointer"
              title="إلغاء تفعيل كافة الفلاتر"
            >
              <RotateCcw className="w-3 h-3" />
              <span>إعادة ضبط ({activeFiltersCount})</span>
            </button>
          )}

          {/* Advanced Filter Button */}
          <button
            type="button"
            onClick={() => setIsFilterDrawerOpen(true)}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              drawerFiltersCount > 0
                ? 'border-ratq-500 bg-ratq-600 text-white shadow-xs hover:bg-ratq-700'
                : 'border-border bg-canvas hover:bg-subtle text-fg hover:border-ratq-300'
            }`}
            title="فتح نافذة الفلاتر المتقدمة للمكتبة"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>الفلاتر المتقدمة</span>
            {drawerFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-white text-ratq-700 text-[10px] font-mono flex items-center justify-center font-bold">
                {drawerFiltersCount}
              </span>
            )}
          </button>

          {/* 1. قائمة منسدلة: شارة إتقان */}
          <div className="relative" ref={badgeDropdownRef}>
            <button
              type="button"
              onClick={() => {
                setIsBadgeDropdownOpen((prev) => !prev);
                setIsAccessDropdownOpen(false);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                selectedBadges.length > 0
                  ? 'border-ratq-500 bg-ratq-50 dark:bg-ratq-950/70 text-ratq-800 dark:text-ratq-200 font-bold shadow-2xs'
                  : 'border-border bg-canvas hover:bg-subtle text-fg hover:border-ratq-300'
              }`}
              title="تصفية الموارد حسب شارة إتقان"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-ratq-600" />
              <span>شارة إتقان</span>
              {selectedBadges.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-ratq-700 text-white text-[10px] font-mono flex items-center justify-center font-bold">
                  {selectedBadges.length}
                </span>
              )}
              <ChevronDown
                className={`w-3.5 h-3.5 text-fg-subtle transition-transform duration-200 ${
                  isBadgeDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Badge Dropdown Popover */}
            {isBadgeDropdownOpen && (
              <div className="absolute start-0 top-full mt-2 w-56 z-50 rounded-2xl border border-border bg-canvas shadow-xl p-2.5 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 mb-1.5 border-b border-border-subtle px-1">
                  <span className="text-[11px] font-bold text-fg-subtle">تصفية بشارة إتقان</span>
                  {selectedBadges.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        selectedBadges.forEach((b) => toggleBadge(b));
                      }}
                      className="text-[10px] text-ratq-700 dark:text-ratq-300 hover:underline cursor-pointer font-medium"
                    >
                      مسح التحديد
                    </button>
                  )}
                </div>

                <div className="space-y-1">
                  {BADGE_FILTER_OPTIONS.map((opt) => {
                    const isChecked = selectedBadges.includes(opt.id);
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => toggleBadge(opt.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-colors cursor-pointer text-start ${
                          isChecked
                            ? 'bg-ratq-50 dark:bg-ratq-950/60 text-ratq-800 dark:text-ratq-200 font-semibold'
                            : 'hover:bg-subtle text-fg'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className={`w-3.5 h-3.5 ${opt.color}`} />
                          <span>{opt.label}</span>
                        </div>
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                            isChecked
                              ? 'bg-ratq-600 border-ratq-600 text-white'
                              : 'border-border bg-canvas'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 2. قائمة منسدلة: مستوى الوصول */}
          <div className="relative" ref={accessDropdownRef}>
            <button
              type="button"
              onClick={() => {
                setIsAccessDropdownOpen((prev) => !prev);
                setIsBadgeDropdownOpen(false);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                selectedAccess.length > 0
                  ? 'border-ratq-500 bg-ratq-50 dark:bg-ratq-950/70 text-ratq-800 dark:text-ratq-200 font-bold shadow-2xs'
                  : 'border-border bg-canvas hover:bg-subtle text-fg hover:border-ratq-300'
              }`}
              title="تصفية الموارد حسب مستوى الوصول"
            >
              <Unlock className="w-3.5 h-3.5 text-ratq-600" />
              <span>مستوى الوصول</span>
              {selectedAccess.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-ratq-700 text-white text-[10px] font-mono flex items-center justify-center font-bold">
                  {selectedAccess.length}
                </span>
              )}
              <ChevronDown
                className={`w-3.5 h-3.5 text-fg-subtle transition-transform duration-200 ${
                  isAccessDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Access Dropdown Popover */}
            {isAccessDropdownOpen && (
              <div className="absolute start-0 top-full mt-2 w-64 z-50 rounded-2xl border border-border bg-canvas shadow-xl p-2.5 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 mb-1.5 border-b border-border-subtle px-1">
                  <span className="text-[11px] font-bold text-fg-subtle">تصفية بمستوى الوصول</span>
                  {selectedAccess.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        selectedAccess.forEach((a) => toggleAccess(a));
                      }}
                      className="text-[10px] text-ratq-700 dark:text-ratq-300 hover:underline cursor-pointer font-medium"
                    >
                      مسح التحديد
                    </button>
                  )}
                </div>

                <div className="space-y-1">
                  {ACCESS_FILTER_OPTIONS.map((opt) => {
                    const isChecked = selectedAccess.includes(opt.id);
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => toggleAccess(opt.id)}
                        className={`w-full flex items-start justify-between p-2 rounded-xl text-xs transition-colors cursor-pointer text-start ${
                          isChecked
                            ? 'bg-ratq-50 dark:bg-ratq-950/60 text-ratq-800 dark:text-ratq-200 font-semibold'
                            : 'hover:bg-subtle text-fg'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <Icon className="w-3.5 h-3.5 text-ratq-600 mt-0.5 shrink-0" />
                          <div>
                            <div className="font-semibold text-fg">{opt.label}</div>
                            <div className="text-[10px] text-fg-subtle">{opt.desc}</div>
                          </div>
                        </div>
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            isChecked
                              ? 'bg-ratq-600 border-ratq-600 text-white'
                              : 'border-border bg-canvas'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Quick Mobile Sections Menu Trigger */}
          <button
            type="button"
            onClick={() => setIsMobileTocOpen(true)}
            className="lg:hidden inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-canvas text-xs font-semibold hover:bg-subtle text-fg cursor-pointer"
          >
            <Bookmark className="w-3.5 h-3.5 text-ratq-600" />
            <span>الفهرس</span>
          </button>

          {/* Results Count Tag */}
          <span className="text-xs font-mono text-fg-subtle bg-subtle px-2.5 py-1.5 rounded-xl border border-border-subtle whitespace-nowrap">
            {filteredResources.length} مورد معتمد
          </span>
        </div>
      </div>

      {/* Main Grid: Floating Sticky TOC (Right) + Categorized Sections (Left) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
        {/* Right Column: Floating Sticky TOC Index (3 Cols on Desktop) */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-36 z-20 space-y-4">
          <div className="rounded-2xl border border-border bg-canvas/90 backdrop-blur-md p-3.5 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-border-subtle">
              <span className="text-xs font-bold text-fg flex items-center gap-2">
                <Bookmark className="w-3.5 h-3.5 text-ratq-600" />
                <span>فهرس الأقسام</span>
              </span>
              <span className="text-[10px] font-mono text-fg-subtle">
                {categorizedData.length} أقسام
              </span>
            </div>

            <nav className="space-y-1">
              {categorizedData.map((group) => {
                const Icon = CATEGORY_ICONS[group.category.id] || Layers;
                const theme = CATEGORY_THEMES[group.category.id] || DEFAULT_CATEGORY_THEME;
                const isActive = activeCategory === group.category.id;

                return (
                  <button
                    key={group.category.id}
                    type="button"
                    onClick={() => scrollToSection(group.category.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all text-start cursor-pointer group ${
                      isActive
                        ? 'bg-ratq-700 text-white font-bold shadow-xs'
                        : 'text-fg-muted hover:text-fg hover:bg-subtle'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Icon
                        className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                          isActive ? 'text-white' : theme.iconColor
                        }`}
                      />
                      <span className="truncate">{group.category.name_ar}</span>
                    </div>

                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full shrink-0 transition-colors ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-subtle text-fg-subtle group-hover:bg-muted'
                      }`}
                    >
                      {group.count}
                    </span>
                  </button>
                );
              })}
            </nav>

            <div className="mt-4 pt-3 border-t border-border-subtle">
              <button
                type="button"
                onClick={scrollToTop}
                className="w-full py-1.5 text-center text-[11px] font-semibold text-fg-subtle hover:text-ratq-700 transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <ArrowUp className="w-3 h-3" />
                <span>العودة لأعلى الصفحة</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Left Column: Categorized Sections with Rich Hero Styling (9 Cols on Desktop) */}
        <div className="lg:col-span-9 space-y-10 min-w-0">
          {categorizedData.length === 0 ? (
            <div className="text-center py-20 bg-canvas rounded-3xl border border-dashed border-border p-8 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-subtle flex items-center justify-center mx-auto text-fg-subtle">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-fg">لا توجد موارد مطابقة لمعايير البحث الحالية</h3>
              <p className="text-xs text-fg-muted max-w-md mx-auto leading-relaxed">
                حاول تعديل شروط البحث أو الفلاتر المحددة، أو قم بإعادة ضبط كافة المرشحات لعرض جميع الأقسام.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-ratq-700 text-white text-xs font-bold hover:bg-ratq-800 transition-colors cursor-pointer mt-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إعادة ضبط كافة الفلاتر</span>
              </button>
            </div>
          ) : (
            categorizedData.map((group) => {
              const Icon = CATEGORY_ICONS[group.category.id] || Layers;
              const theme = CATEGORY_THEMES[group.category.id] || DEFAULT_CATEGORY_THEME;
              const isCollapsed = expandedCategories[group.category.id] === true;

              return (
                <section
                  key={group.category.id}
                  id={`section-${group.category.id}`}
                  className="rounded-3xl border border-border bg-canvas shadow-xs overflow-hidden transition-all duration-200 hover:shadow-sm"
                >
                  {/* Category Header Hero Banner with Dynamic Gradient and Glow */}
                  <div
                    className={`relative p-5 sm:p-6 border-b border-border/80 bg-gradient-to-b ${theme.topGradient} transition-colors`}
                  >
                    {/* Glowing highlight indicator */}
                    <div
                      className={`absolute top-0 start-0 end-0 h-[2px] bg-gradient-to-r from-transparent ${theme.topBorder} to-transparent`}
                    />

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Left: Icon, Category Name, Tagline & Description */}
                      <div className="flex items-start gap-3.5 min-w-0">
                        <div
                          className={`w-11 h-11 rounded-2xl border ${theme.iconBorder} ${theme.iconBg} flex items-center justify-center shrink-0 shadow-2xs mt-0.5`}
                        >
                          <Icon className={`w-5 h-5 ${theme.iconColor}`} />
                        </div>

                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <h2 className="text-base sm:text-lg font-extrabold text-fg tracking-tight">
                              {group.category.name_ar}
                            </h2>
                            <span className="text-xs font-mono text-fg-subtle">
                              ({group.category.name_en})
                            </span>
                            <span
                              className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${theme.badgeBg}`}
                            >
                              {group.count} مورد
                            </span>
                          </div>

                          <p className="text-xs text-fg-muted leading-relaxed line-clamp-2">
                            {group.category.description_ar}
                          </p>
                        </div>
                      </div>

                      {/* Right: Toggle Collapse Button */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => toggleCategoryExpand(group.category.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/80 bg-canvas/80 hover:bg-subtle text-xs font-semibold text-fg transition-colors cursor-pointer shadow-2xs"
                          title={isCollapsed ? 'توسيع القسم وعرض الموارد' : 'طي القسم مؤقتاً'}
                        >
                          <span>{isCollapsed ? 'عرض الموارد' : 'طي القسم'}</span>
                          {isCollapsed ? (
                            <ChevronDown className="w-3.5 h-3.5 text-fg-subtle" />
                          ) : (
                            <ChevronUp className="w-3.5 h-3.5 text-fg-subtle" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Category Resources Grid (Collapsible) */}
                  {!isCollapsed && (
                    <div className="p-5 sm:p-6 bg-canvas">
                      <div
                        className={`grid gap-4 sm:gap-5 ${
                          isCompact
                            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                            : 'grid-cols-1 md:grid-cols-2'
                        }`}
                      >
                        {group.items.map((resource: Resource) => (
                          <div key={resource.id} className="transition-all duration-200">
                            <ResourceCard
                              key={resource.id}
                              resource={resource}
                              viewMode="grid"
                              isCompact={isCompact}
                              showAppUsages={true}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              );
            })
          )}
        </div>
      </div>

      {/* Advanced Filters Drawer (Slide-Over Panel) */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setIsFilterDrawerOpen(false)}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-md bg-canvas border-s border-border shadow-2xl h-full flex flex-col z-10 animate-in slide-in-from-right duration-200 text-start">
            <div className="p-5 border-b border-border flex items-center justify-between bg-subtle/30">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-ratq-600" />
                <h3 className="text-sm font-bold text-fg">الفلاتر المتقدمة للمكتبة</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFilterDrawerOpen(false)}
                className="p-1 rounded-lg text-fg-subtle hover:text-fg hover:bg-subtle cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1">
              <ResourceFilters />
            </div>

            <div className="p-4 border-t border-border bg-subtle/30 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={resetFilters}
                className="px-4 py-2 text-xs font-semibold text-fg-subtle hover:text-fg hover:underline cursor-pointer"
              >
                إعادة ضبط
              </button>

              <button
                type="button"
                onClick={() => setIsFilterDrawerOpen(false)}
                className="px-5 py-2 rounded-xl bg-ratq-700 hover:bg-ratq-800 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                تطبيق الفلاتر ({filteredResources.length} مورد)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Floating TOC Bottom Sheet */}
      {isMobileTocOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs animate-fade-in"
            onClick={() => setIsMobileTocOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-x-0 bottom-0 bg-canvas rounded-t-3xl border-t border-border p-5 max-h-[75vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-ratq-600" />
                <h3 className="text-sm font-bold text-fg">فهرس الانتقال السريع للأقسام</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileTocOpen(false)}
                className="p-1 rounded-lg text-fg-subtle hover:text-fg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-3 space-y-1 overflow-y-auto flex-1">
              {categorizedData.map((group) => {
                const Icon = CATEGORY_ICONS[group.category.id] || Layers;
                const theme = CATEGORY_THEMES[group.category.id] || DEFAULT_CATEGORY_THEME;
                const isActive = activeCategory === group.category.id;

                return (
                  <button
                    key={group.category.id}
                    type="button"
                    onClick={() => scrollToSection(group.category.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-medium cursor-pointer ${
                      isActive
                        ? 'bg-ratq-700 text-white font-bold'
                        : 'bg-subtle/50 text-fg hover:bg-subtle'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : theme.iconColor}`} />
                      <span>{group.category.name_ar}</span>
                    </div>
                    <span className={`text-2xs font-mono px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-muted text-fg-subtle'}`}>
                      {group.count} مورد
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Catalog;
