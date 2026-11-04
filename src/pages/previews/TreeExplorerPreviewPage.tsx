// src/pages/previews/TreeExplorerPreviewPage.tsx
// النموذج 4: مستكشف المجلدات الهرمي القابل للطي (Collapsible Directory Tree / VS Code Style)
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockRepo } from '@/lib/supabase';
import { Resource } from '@/types';
import { ItqanBadge } from '@/components/ui/ItqanBadge';
import { LicenseBadge } from '@/components/ui/LicenseBadge';
import { AccessBadge } from '@/components/ui/AccessBadge';
import { getAppsUsingResource } from '@/lib/appEcosystem';
import { ResourceAppBadges } from '@/components/resources/ResourceAppBadges';
import { BranchedMenu, BranchedMenuItem } from '@/components/ui/BranchedMenu';
import { useCatalogStore } from '@/store/useCatalogStore';
import { ResourceFilters } from '@/components/resources/ResourceFilters';
import {
  FolderTree,
  FileCode,
  Search,
  ExternalLink,
  BookOpen,
  FileText,
  Code2,
  Terminal,
  Smartphone,
  Headphones,
  Clock,
  Type,
  Database,
  BookMarked,
  SlidersHorizontal,
  ShieldCheck,
  Unlock,
  ChevronDown,
  Check,
  X,
  Shield,
  Crown,
  Award,
  Lock,
  Building2,
} from 'lucide-react';

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

interface TreeNode {
  id: string;
  labelAr: string;
  icon?: React.ElementType;
  children?: TreeNode[];
  resourceFilter?: (r: Resource) => boolean;
}

const TREE_DATA: TreeNode[] = [
  {
    id: 'root_text',
    labelAr: '01. نصوص ومصاحف محققة',
    children: [
      {
        id: 'text_uthmani',
        labelAr: 'الرسم العثماني وعلامات الضبط',
        icon: BookOpen,
        resourceFilter: (r) =>
          r.categories.includes('cat_quran_sources') || r.tags.includes('رسم-عثماني'),
      },
      {
        id: 'text_manuscripts',
        labelAr: 'فهارس ومخطوطات مصحفية',
        icon: FileText,
        resourceFilter: (r) => r.categories.includes('cat_quran_sources'),
      },
    ],
  },
  {
    id: 'root_dev',
    labelAr: '02. حزم ومكتبات البرمجة',
    children: [
      {
        id: 'dev_js',
        labelAr: 'JavaScript و TypeScript',
        icon: Code2,
        resourceFilter: (r) =>
          r.tech_stack.includes('TypeScript') || r.tech_stack.includes('JavaScript'),
      },
      {
        id: 'dev_python',
        labelAr: 'Python والذكاء الاصطناعي',
        icon: Terminal,
        resourceFilter: (r) => r.tech_stack.includes('Python'),
      },
      {
        id: 'dev_mobile',
        labelAr: 'تطبيقات الجوال (Flutter & Swift)',
        icon: Smartphone,
        resourceFilter: (r) =>
          r.tech_stack.includes('Flutter') ||
          r.tech_stack.includes('Swift') ||
          r.tech_stack.includes('Kotlin'),
      },
    ],
  },
  {
    id: 'root_audio',
    labelAr: '03. تلاوات وقراءات صوتية',
    children: [
      {
        id: 'audio_murattal',
        labelAr: 'المصاحف المرتلة المعتمدة',
        icon: Headphones,
        resourceFilter: (r) => r.categories.includes('cat_recitations'),
      },
      {
        id: 'audio_timing',
        labelAr: 'ملفات التوقيت والتزامن',
        icon: Clock,
        resourceFilter: (r) => r.tags.some((t) => t.includes('توقيت') || t.includes('audio')),
      },
    ],
  },
  {
    id: 'root_fonts',
    labelAr: '04. خطوط وتيبوغرافيا',
    children: [
      {
        id: 'fonts_mushaf',
        labelAr: 'خطوط المصحف الشريف',
        icon: Type,
        resourceFilter: (r) => r.resource_type === 'font' || r.categories.includes('cat_fonts'),
      },
    ],
  },
  {
    id: 'root_datasets',
    labelAr: '05. بيانات وذكاء اصطناعي',
    children: [
      {
        id: 'data_corpora',
        labelAr: 'مدونات لغوية ومجموعات بيانات',
        icon: Database,
        resourceFilter: (r) =>
          r.resource_type === 'dataset' || r.categories.includes('cat_datasets'),
      },
    ],
  },
  {
    id: 'root_tafsir',
    labelAr: '06. تفاسير وعلوم القرآن',
    children: [
      {
        id: 'tafsir_books',
        labelAr: 'كتب التفسير المحققة',
        icon: BookMarked,
        resourceFilter: (r) => r.categories.includes('cat_tafsir'),
      },
    ],
  },
];

export const TreeExplorerPreviewPage: React.FC = () => {
  const allResources = useMemo(() => mockRepo.getResources(), []);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('text_uthmani');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Dropdown states for toolbar filters & slide-over drawer
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isBadgeDropdownOpen, setIsBadgeDropdownOpen] = useState(false);
  const [isAccessDropdownOpen, setIsAccessDropdownOpen] = useState(false);
  const badgeDropdownRef = useRef<HTMLDivElement>(null);
  const accessDropdownRef = useRef<HTMLDivElement>(null);

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

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isFilterDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFilterDrawerOpen]);

  // Drawer-specific filters count (Types, Licenses, Tech, Commercial)
  const drawerFiltersCount = useMemo(() => {
    return (
      selectedTypes.length +
      selectedLicenses.length +
      selectedTech.length +
      (commercialOnly ? 1 : 0)
    );
  }, [selectedTypes, selectedLicenses, selectedTech, commercialOnly]);

  // Ecosystem apps using the selected resource
  const selectedResourceApps = useMemo(() => {
    if (!selectedResource) return [];
    return getAppsUsingResource(selectedResource.slug);
  }, [selectedResource]);

  // Convert TREE_DATA into BranchedMenuItem format, filtered by searchQuery if present
  const branchedMenuItems: BranchedMenuItem[] = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return TREE_DATA.map((root) => {
      const filteredKids = (root.children || []).filter((child) => {
        if (!q) return true;
        return (
          child.labelAr.toLowerCase().includes(q) ||
          root.labelAr.toLowerCase().includes(q)
        );
      });

      const kids = filteredKids.map((child) => {
        const count = child.resourceFilter
          ? allResources.filter(child.resourceFilter).length
          : 0;
        return {
          value: child.id,
          label: child.labelAr,
          icon: child.icon || FileCode,
          badge: count,
        };
      });

      return {
        value: root.id,
        label: root.labelAr,
        children: kids,
      };
    }).filter((root) => {
      if (!q) return true;
      return (
        root.label.toLowerCase().includes(q) ||
        (root.children && root.children.length > 0)
      );
    });
  }, [allResources, searchQuery]);

  // Find selected node
  const activeNode = useMemo(() => {
    for (const root of TREE_DATA) {
      if (root.id === selectedNodeId) return root;
      if (root.children) {
        for (const child of root.children) {
          if (child.id === selectedNodeId) return child;
        }
      }
    }
    return TREE_DATA[0].children?.[0] || TREE_DATA[0];
  }, [selectedNodeId]);

  // Filter resources for current node & active filters
  const nodeResources = useMemo(() => {
    let list: Resource[] = [];
    if (activeNode.resourceFilter) {
      list = allResources.filter(activeNode.resourceFilter);
    } else if (activeNode.children) {
      // Gather all children filters
      list = allResources.filter((r) =>
        activeNode.children!.some((c) => c.resourceFilter && c.resourceFilter(r))
      );
    }

    if (list.length === 0) {
      list = allResources.slice(0, 8); // Fallback
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.title_ar.toLowerCase().includes(q) ||
          (r.title_en && r.title_en.toLowerCase().includes(q)) ||
          r.summary_ar.toLowerCase().includes(q) ||
          r.slug.toLowerCase().includes(q) ||
          r.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    // Resource Type Filter (Drawer)
    if (selectedTypes.length > 0) {
      list = list.filter((r) => selectedTypes.includes(r.resource_type));
    }

    // License Filter (Drawer)
    if (selectedLicenses.length > 0) {
      list = list.filter((r) => selectedLicenses.includes(r.license_id));
    }

    // Access Level Filter (Toolbar Dropdown)
    if (selectedAccess.length > 0) {
      list = list.filter((r) => selectedAccess.includes(r.access_level));
    }

    // Itqan Badges Filter (Toolbar Dropdown)
    if (selectedBadges.length > 0) {
      list = list.filter((r) => selectedBadges.includes(r.itqan_level));
    }

    // Tech Stack Filter (Drawer)
    if (selectedTech.length > 0) {
      list = list.filter((r) =>
        selectedTech.some((tech: string) => r.tech_stack?.includes(tech))
      );
    }

    // Commercial Only (Drawer)
    if (commercialOnly) {
      list = list.filter((r) => r.license_id === 'lic_mit' || r.license_id === 'lic_apache2');
    }

    return list;
  }, [
    activeNode,
    allResources,
    searchQuery,
    selectedTypes,
    selectedLicenses,
    selectedAccess,
    selectedBadges,
    selectedTech,
    commercialOnly,
  ]);

  // Set default selected resource when node or filters change
  useEffect(() => {
    if (nodeResources.length > 0) {
      setSelectedResource((prev) => {
        if (prev && nodeResources.some((r) => r.id === prev.id)) {
          return prev;
        }
        return nodeResources[0];
      });
    } else {
      setSelectedResource(null);
    }
  }, [selectedNodeId, nodeResources]);

  return (
    <div className="max-w-container mx-auto px-4 sm:px-6 py-6 w-full text-start">
      {/* Page Header (Matching Catalog.tsx clean style) */}
      <div className="mb-6 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ratq-100 dark:bg-ratq-900/60 text-ratq-800 dark:text-ratq-200 text-xs font-semibold">
          <FolderTree className="w-3.5 h-3.5" />
          <span>مستكشف المجلدات الهرمي (VS Code Collapsible Directory Tree)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-fg">
          مكتبة الموارد القرآنية الموثقة
        </h1>
        <p className="text-xs sm:text-sm text-fg-subtle mt-1">
          استكشف مكتبات البرمجة، مجموعات البيانات، واجهات API، وخطوط المصحف الخاضعة لمعايير إتقان.
        </p>
      </div>

      {/* Tree Explorer Split View Container */}
      <div className="rounded-3xl border border-border bg-canvas shadow-md overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[650px]">
        {/* Left Panel: Directory Tree (Compact width lg:col-span-3) */}
        <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-e border-border bg-subtle/30 flex flex-col">
          {/* Tree Header & Search */}
          <div className="p-3.5 border-b border-border/80 bg-canvas space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-fg-subtle">
              <span className="flex items-center gap-1.5 font-semibold text-fg">
                <FolderTree className="w-4 h-4 text-ratq-600" />
                <span>مستكشف المجلدات</span>
              </span>
              <span className="text-[10px] bg-subtle px-2 py-0.5 rounded text-fg-subtle">
                {allResources.length} مورد
              </span>
            </div>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="تصفية المجلدات..."
                className="w-full pl-3 pr-8 py-1.5 rounded-lg border border-border bg-canvas text-xs placeholder:text-fg-subtle focus:outline-none focus:border-ratq-500"
              />
              <Search className="w-3.5 h-3.5 text-fg-subtle absolute right-2.5 top-2.5" />
            </div>
          </div>

          {/* Tree Nodes List (Using BranchedMenu with Curved Branch Lines) */}
          <div className="p-3 overflow-y-auto flex-1 text-xs">
            {branchedMenuItems.length === 0 ? (
              <div className="text-center py-8 text-fg-muted text-xs">
                لا توجد مجلدات مطابقة للبحث
              </div>
            ) : (
              <BranchedMenu
                items={branchedMenuItems}
                active={selectedNodeId}
                defaultOpen={0}
                onSelect={(value) => {
                  setSelectedNodeId(value);
                }}
                rowHeight={34}
                indent={36}
                trunk={14}
                radius={10}
                lineWidth={1.5}
                fontSize={12}
                drawDuration={350}
                foldDuration={250}
                isRtl={true}
              />
            )}
          </div>
        </div>

        {/* Right Panel: Content & Resource Inspector (lg:col-span-9) */}
        <div className="lg:col-span-9 flex flex-col bg-canvas">
          {/* Breadcrumbs Bar & Toolbar Filters */}
          <div className="p-3.5 border-b border-border bg-subtle/40 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-fg-subtle truncate min-w-0">
              <span className="text-fg-subtle font-medium">الكتالوج</span>
              <span>/</span>
              <span className="text-fg font-bold truncate">{activeNode.labelAr}</span>
              <span>/</span>
              <span className="text-ratq-600 font-semibold shrink-0">({nodeResources.length} مورد متوافق)</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* الفلاتر المتقدمة */}
              <button
                type="button"
                onClick={() => setIsFilterDrawerOpen(true)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
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

              {/* شارة إتقان */}
              <div className="relative" ref={badgeDropdownRef}>
                <button
                  type="button"
                  onClick={() => {
                    setIsBadgeDropdownOpen((prev) => !prev);
                    setIsAccessDropdownOpen(false);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
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
                            selectedBadges.forEach((b: string) => toggleBadge(b));
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
                              <div
                                className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                                  isChecked
                                    ? 'bg-ratq-700 border-ratq-700 text-white'
                                    : 'border-border bg-canvas'
                                }`}
                              >
                                {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <Icon className={`w-3.5 h-3.5 ${opt.color}`} />
                              <span>{opt.label}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* مستوى الوصول */}
              <div className="relative" ref={accessDropdownRef}>
                <button
                  type="button"
                  onClick={() => {
                    setIsAccessDropdownOpen((prev) => !prev);
                    setIsBadgeDropdownOpen(false);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
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
                  <div className="absolute end-0 top-full mt-2 w-60 z-50 rounded-2xl border border-border bg-canvas shadow-xl p-2.5 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between pb-2 mb-1.5 border-b border-border-subtle px-1">
                      <span className="text-[11px] font-bold text-fg-subtle">مستوى الوصول</span>
                      {selectedAccess.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            selectedAccess.forEach((a: string) => toggleAccess(a));
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
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-colors cursor-pointer text-start ${
                              isChecked
                                ? 'bg-ratq-50 dark:bg-ratq-950/60 text-ratq-800 dark:text-ratq-200 font-semibold'
                                : 'hover:bg-subtle text-fg'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                                  isChecked
                                    ? 'bg-ratq-700 border-ratq-700 text-white'
                                    : 'border-border bg-canvas'
                                }`}
                              >
                                {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <Icon className="w-3.5 h-3.5 text-ratq-600 shrink-0" />
                              <div className="flex flex-col min-w-0">
                                <span className="font-medium">{opt.label}</span>
                                <span className="text-[10px] text-fg-subtle font-normal truncate">{opt.desc}</span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-5 flex-1 grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Resources In Selected Folder (Clean Cards without Tags) */}
            <div className="md:col-span-5 space-y-2 max-h-[520px] overflow-y-auto pe-1">
              <span className="text-[11px] font-bold text-fg-subtle block mb-1">
                الموارد داخل هذا المسار:
              </span>

              {nodeResources.map((res) => {
                const isCurrent = selectedResource?.id === res.id;
                return (
                  <button
                    key={res.id}
                    type="button"
                    onClick={() => setSelectedResource(res)}
                    className={`w-full p-3.5 rounded-2xl border text-start transition-all cursor-pointer block ${
                      isCurrent
                        ? 'border-ratq-500 bg-ratq-50/70 dark:bg-ratq-950/70 shadow-2xs'
                        : 'border-border bg-canvas hover:bg-subtle'
                    }`}
                  >
                    <div className="mb-1.5">
                      <h4 className="text-xs font-bold text-fg truncate">{res.title_ar}</h4>
                      {res.title_en && (
                        <p className="text-[10px] text-fg-subtle truncate mt-0.5">{res.title_en}</p>
                      )}
                    </div>
                    <p className="text-[11px] text-fg-muted line-clamp-2 leading-relaxed">{res.summary_ar}</p>
                  </button>
                );
              })}
            </div>

            {/* Inspector Details View of Selected Resource */}
            <div className="md:col-span-7 rounded-2xl border border-border bg-subtle/20 p-5 flex flex-col justify-between max-h-[560px] overflow-y-auto pe-1">
              {selectedResource ? (
                <div className="space-y-4">
                  {/* Resource Header */}
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <ItqanBadge level={selectedResource.itqan_level} size="sm" />
                      <AccessBadge level={selectedResource.access_level} />
                      <LicenseBadge
                        licenseId={selectedResource.license_id}
                        spdx={selectedResource.license_spdx}
                      />
                    </div>
                    <h3 className="text-lg font-bold text-fg">{selectedResource.title_ar}</h3>
                    {selectedResource.title_en && (
                      <p className="text-xs font-mono text-fg-subtle">{selectedResource.title_en}</p>
                    )}
                  </div>

                  {/* Summary */}
                  <p className="text-xs text-fg-muted leading-relaxed">
                    {selectedResource.summary_ar}
                  </p>

                  {/* Tech Specs */}
                  <div className="p-3.5 rounded-xl bg-canvas border border-border space-y-2 text-xs">
                    <span className="font-bold text-fg block text-[11px]">المواصفات التقنية:</span>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-fg-subtle block">الناشر:</span>
                        <span className="font-semibold text-fg">
                          {selectedResource.publisher?.name_ar || 'مؤسسة معتمدة'}
                        </span>
                      </div>
                      <div>
                        <span className="text-fg-subtle block">النوع:</span>
                        <span className="font-mono text-fg">{selectedResource.resource_type}</span>
                      </div>
                      <div>
                        <span className="text-fg-subtle block">عدد التنزيلات:</span>
                        <span className="font-mono text-fg">
                          {selectedResource.downloads_count.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-fg-subtle block">التقييم:</span>
                        <span className="font-mono text-fg">
                          ★ {selectedResource.rating_avg.toFixed(1)} / 5.0
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Ecosystem Apps Widget */}
                  {selectedResourceApps.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-canvas border border-border space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-fg block text-[11px]">
                          تطبيقات تعتمد على المورد:
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-ratq-50 dark:bg-ratq-950 text-ratq-700 dark:text-ratq-300 border border-ratq-200 dark:border-ratq-800">
                          {selectedResourceApps.length}
                        </span>
                      </div>
                      <p className="text-[11px] text-fg-muted leading-relaxed">
                        مُعتمد ومُدمج في معمارية المنظومات والتطبيقات القرآنية التالية:
                      </p>
                      <div className="pt-0.5 pb-0.5">
                        <ResourceAppBadges
                          apps={selectedResourceApps}
                          showLabel={false}
                          maxDisplay={6}
                          size="sm"
                          linkToTechStack
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-16 text-fg-muted text-xs">
                  اختر مورداً من القائمة لاستعراض تفاصيله
                </div>
              )}

              {selectedResource && (
                <div className="pt-4 border-t border-border mt-4 flex items-center justify-between">
                  <span className="text-[11px] text-fg-subtle">
                    معرف المورد: <code className="font-mono">{selectedResource.slug}</code>
                  </span>
                  <Link
                    to={`/resources/${selectedResource.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-ratq-700 hover:bg-ratq-800 text-white text-xs font-bold transition-all shadow-2xs"
                  >
                    <span>فتح صفحة التوثيق</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Slide-Over Drawer for Advanced Filters */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity cursor-pointer"
            onClick={() => setIsFilterDrawerOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 end-0 max-w-full flex">
            <div className="w-screen max-w-md bg-canvas border-s border-border shadow-2xl flex flex-col p-6 overflow-y-auto animate-in slide-in-from-right duration-200 text-start">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-ratq-100 dark:bg-ratq-900/60 text-ratq-700 dark:text-ratq-300 flex items-center justify-center">
                    <SlidersHorizontal className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-fg">الفلاتر المتقدمة للمكتبة</h3>
                    <p className="text-2xs text-fg-subtle">مطابقة لفلاتر المكتبة الافتراضية الأصلية</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-fg-subtle hover:text-fg hover:bg-subtle transition-colors cursor-pointer"
                  title="إغلاق نافذة الفلاتر"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* ResourceFilters Content from Default Catalog */}
              <div className="py-4 flex-1 overflow-y-auto [&>aside]:w-full [&>aside]:border-0 [&>aside]:shadow-none [&>aside]:p-0">
                <ResourceFilters hideBadges hideAccess />
              </div>

              {/* Drawer Footer Actions */}
              <div className="pt-4 border-t border-border flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-4 py-2.5 rounded-xl border border-border text-xs font-semibold text-fg-subtle hover:text-fg hover:bg-subtle transition-colors cursor-pointer"
                >
                  إعادة ضبط الكل
                </button>
                <button
                  type="button"
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-ratq-700 hover:bg-ratq-800 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs text-center"
                >
                  تطبيق وعرض ({nodeResources.length} مورد)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TreeExplorerPreviewPage;
