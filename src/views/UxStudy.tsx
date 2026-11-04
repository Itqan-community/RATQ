// src/views/UxStudy.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Search,
  ArrowLeft,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  FileCheck2,
  UserCheck,
  User,
  Layers,
  CheckCircle,
  Shield,
  Settings,
  ArrowUpRight,
  Code2,
  ChevronDown,
  Info,
  FileText,
} from 'lucide-react';

interface UxSection {
  id: string;
  number: string;
  title: string;
  phase: string;
  phaseNumber: number;
  summary: string;
}

const PHASES = [
  { id: 1, title: 'الرؤية والاستراتيجية' },
  { id: 2, title: 'أبحاث وفهم المستخدمين' },
  { id: 3, title: 'المتطلبات وبنية المعلومات' },
  { id: 4, title: 'تجربة المنصة والاعتماد' },
  { id: 5, title: 'التصميم والنبرة والواجهات' },
  { id: 6, title: 'التحقق والقياس المستمر' },
];

const SECTIONS: UxSection[] = [
  {
    id: 'executive-summary',
    number: '01',
    title: 'الملخص التنفيذي',
    phase: 'الرؤية والاستراتيجية',
    phaseNumber: 1,
    summary: 'خلاصة المشكلة والفرصة، أبرز النتائج والتوصيات، والأثر المتوقع على منظومة البرمجيات القرآنية.',
  },
  {
    id: 'project-context',
    number: '02',
    title: 'سياق المشروع وأهدافه',
    phase: 'الرؤية والاستراتيجية',
    phaseNumber: 1,
    summary: 'الرؤية الاستراتيجية، المشكلات التي تحلها رَتْق، مؤشرات الأداء الأساسية (KPIs)، ونطاق الدراسة.',
  },
  {
    id: 'methodology',
    number: '03',
    title: 'منهجية الدراسة',
    phase: 'الرؤية والاستراتيجية',
    phaseNumber: 1,
    summary: 'طبيعة الدراسة (افتراضية استرشادية لتقريب الصورة)، الأساليب البحثية النوعية والكمية، وتوزيع العينة المفترضة.',
  },
  {
    id: 'stakeholders',
    number: '04',
    title: 'تحليل أصحاب المصلحة',
    phase: 'الرؤية والاستراتيجية',
    phaseNumber: 1,
    summary: 'خريطة أصحاب المصلحة، مصفوفة التأثير والاهتمام، التوقعات، والمخاطر التشغيلية.',
  },
  {
    id: 'user-research',
    number: '05',
    title: 'أبحاث المستخدمين',
    phase: 'أبحاث وفهم المستخدمين',
    phaseNumber: 2,
    summary: 'الفئات المستهدفة، مخرجات المقابلات النوعية، نتائج الاستبيانات الكمية، وأبرز نقاط الألم.',
  },
  {
    id: 'personas',
    number: '06',
    title: 'الشخصيات (Personas)',
    phase: 'أبحاث وفهم المستخدمين',
    phaseNumber: 2,
    summary: 'أربع شخصيات تمثيلية تغطي المطور المستقل، المحقق الشرعي، باحثة البيانات، ومطور الخطوط.',
  },
  {
    id: 'user-journey',
    number: '07',
    title: 'رحلة المستخدم (User Journey)',
    phase: 'أبحاث وفهم المستخدمين',
    phaseNumber: 2,
    summary: 'خريطة الرحلة عبر 7 مراحل: الاكتشاف، التقييم، التسجيل، طلب المفتاح، التكامل، الاستخدام، والدعم.',
  },
  {
    id: 'competitor-analysis',
    number: '08',
    title: 'تحليل المنافسين والمرجعيات',
    phase: 'أبحاث وفهم المستخدمين',
    phaseNumber: 2,
    summary: 'مقارنة مع المنصات العامة والقرآنية الحالية، مصفوفة الميزات، والفجوة الاستراتيجية.',
  },
  {
    id: 'requirements-analysis',
    number: '09',
    title: 'تحليل الاحتياجات والمتطلبات',
    phase: 'المتطلبات وبنية المعلومات',
    phaseNumber: 3,
    summary: 'المتطلبات الوظيفية وغير الوظيفية، وترتيب الأولويات عبر مصفوفة MoSCoW.',
  },
  {
    id: 'information-architecture',
    number: '10',
    title: 'بنية المعلومات (IA)',
    phase: 'المتطلبات وبنية المعلومات',
    phaseNumber: 3,
    summary: 'تصنيف الأصول الـ 11 عبر العائلات الخمس، خريطة الموقع، ونظام التسمية والفلترة.',
  },
  {
    id: 'trust-experience',
    number: '11',
    title: 'تجربة الثقة والمصداقية',
    phase: 'تجربة المنصة والاعتماد',
    phaseNumber: 4,
    summary: 'معايير إتقان الأربعة، شارات التحقق، التراخيص المعتمدة، وسجل الشفافية والسحب.',
  },
  {
    id: 'api-access-ux',
    number: '12',
    title: 'تجربة الوصول ومفاتيح API',
    phase: 'تجربة المنصة والاعتماد',
    phaseNumber: 4,
    summary: 'تدفقات التسجيل، إصدار المفاتيح المشفرة وتدويرها، إدارة الحصص، ولوحة مراقبة الاستهلاك.',
  },
  {
    id: 'developer-experience',
    number: '13',
    title: 'تجربة المطور (DX)',
    phase: 'تجربة المنصة والاعتماد',
    phaseNumber: 4,
    summary: 'التوثيق التفاعلي المتعدد اللغات، البدء السريع (Quick Start)، بيئة التجربة Sandbox، والأخطاء القياسية.',
  },
  {
    id: 'rtl-accessibility',
    number: '14',
    title: 'التصميم العربي وإمكانية الوصول',
    phase: 'التصميم والنبرة والواجهات',
    phaseNumber: 5,
    summary: 'معايير RTL، الطباعة العثمانية، الامتثال لمعايير WCAG 2.1 AA، والتوافق عبر الأجهزة.',
  },
  {
    id: 'content-tone',
    number: '15',
    title: 'المحتوى والنبرة',
    phase: 'التصميم والنبرة والواجهات',
    phaseNumber: 5,
    summary: 'لغة الواجهة الرصينة، المصطلحات القرآنية والتقنية، والحساسية الدينية والأدبية في الصياغة.',
  },
  {
    id: 'proposed-solution',
    number: '16',
    title: 'التصور المقترح للحل',
    phase: 'التصميم والنبرة والواجهات',
    phaseNumber: 5,
    summary: 'المبادئ التصميمية، الهيكل البصري للواجهات، التدفقات الأساسية، والـ Wireframes.',
  },
  {
    id: 'usability-testing',
    number: '17',
    title: 'اختبار قابلية الاستخدام',
    phase: 'التحقق والقياس المستمر',
    phaseNumber: 6,
    summary: 'سيناريوهات الاختبار الأربعة، مقياس SUS، المشكلات المكتشفة وتصنيفها والحلول المطبقة.',
  },
  {
    id: 'metrics-analytics',
    number: '18',
    title: 'قياس الأداء والتحليلات',
    phase: 'التحقق والقياس المستمر',
    phaseNumber: 6,
    summary: 'إطار HEART لقياس تجربة الاستخدام، مؤشرات التشغيل، وخطة التحسين المستمر.',
  },
];

export const UxStudy: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ux' | 'prd' | 'stories'>('ux');
  const [activeSectionId, setActiveSectionId] = useState<string>('executive-summary');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Scroll to top of content when section changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeSectionId, activeTab]);

  const activeIndex = useMemo(
    () => SECTIONS.findIndex((s) => s.id === activeSectionId),
    [activeSectionId]
  );

  const activeSection = useMemo(
    () => SECTIONS[activeIndex] || SECTIONS[0],
    [activeIndex]
  );

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return SECTIONS;
    const q = searchQuery.toLowerCase();
    return SECTIONS.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.summary.toLowerCase().includes(q) ||
        s.number.includes(q)
    );
  }, [searchQuery]);

  const handleNextSection = () => {
    if (activeIndex < SECTIONS.length - 1) {
      setActiveSectionId(SECTIONS[activeIndex + 1].id);
    }
  };

  const handlePrevSection = () => {
    if (activeIndex > 0) {
      setActiveSectionId(SECTIONS[activeIndex - 1].id);
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-fg">
      {/* 1. Header Bar: Standalone External Document Header */}
      <header className="border-b border-border bg-canvas/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-start">
          {/* Logo & Document Title */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Return to Home Icon-Only Button */}
            <Link
              to="/"
              title="العودة للرئيسية"
              aria-label="العودة للرئيسية"
              className="p-2 rounded-xl border border-border bg-canvas hover:bg-subtle text-fg-muted hover:text-fg transition-colors shrink-0 shadow-2xs flex items-center justify-center"
            >
              <ArrowRight className="w-4 h-4 rtl:rotate-0 rotate-180" />
            </Link>

            <Link to="/" title="الرئيسية" className="shrink-0 flex flex-col items-center group select-none">
              <img
                src="/logo.png"
                alt="شعار رَتْق"
                className="h-7 w-auto max-w-[85px] object-contain dark:invert transition-transform duration-200 group-hover:scale-105"
              />
              <span className="text-[8px] font-bold text-ratq-700 dark:text-ratq-300 bg-ratq-50 dark:bg-ratq-950/80 border border-ratq-200 dark:border-ratq-800/80 px-1.5 py-0.5 rounded leading-none mt-0.5 whitespace-nowrap">
                نسخة تجريبية
              </span>
            </Link>
            <div className="h-6 w-[1px] bg-border" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-fg tracking-tight">
                  دراسة تجربة المستخدم (UX Study)
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-subtle text-fg-subtle border border-border">
                  وثيقة بحثية مستقلة
                </span>
              </div>
              <p className="text-[11px] text-fg-subtle mt-0.5">
                مشروع البنية التحتية المعتمدة للبرمجيات القرآنية • رَتْق
              </p>
            </div>
          </div>

          {/* Top Document Suite Tabs */}
          <div className="flex items-center gap-2.5 self-start sm:self-auto overflow-x-auto max-w-full">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-canvas border border-border">
              <button
                onClick={() => setActiveTab('ux')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'ux'
                    ? 'bg-ratq-700 text-white shadow-xs'
                    : 'text-fg-muted hover:text-fg hover:bg-subtle'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>دراسة تجربة المستخدم (UX)</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 text-white font-mono">18</span>
              </button>
              <button
                onClick={() => setActiveTab('prd')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'prd'
                    ? 'bg-ratq-700 text-white shadow-xs'
                    : 'text-fg-muted hover:text-fg hover:bg-subtle'
                }`}
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>وثيقة المتطلبات (PRD)</span>
              </button>
              <button
                onClick={() => setActiveTab('stories')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'stories'
                    ? 'bg-ratq-700 text-white shadow-xs'
                    : 'text-fg-muted hover:text-fg hover:bg-subtle'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>قصص المستخدم (Stories)</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'ux' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* 2. Floating Sticky Sidebar (القائمة الجانبية العائمة) */}
            <aside className="lg:col-span-4 xl:col-span-3 sticky top-20 z-20">
              <div className="bg-canvas border border-border rounded-2xl p-4 shadow-xs flex flex-col max-h-[calc(100vh-6rem)] overflow-hidden text-start">
                {/* Sidebar Header & Search */}
                <div className="mb-3.5 pb-3 border-b border-border/80">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-bold text-fg uppercase tracking-wider">
                      فهرس الدراسة (18 عنصراً)
                    </span>
                    <span className="text-[11px] font-mono text-fg-subtle">
                      {activeIndex + 1} / {SECTIONS.length}
                    </span>
                  </div>

                  {/* Search filter in sidebar */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-fg-subtle absolute start-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="ابحث في أقسام الدراسة..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full text-xs ps-8 pe-3 py-1.5 rounded-lg border border-border bg-subtle/50 text-fg placeholder:text-fg-subtle focus:outline-none focus:ring-1 focus:ring-ratq-500"
                    />
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1 bg-subtle rounded-full mb-3 overflow-hidden">
                  <div
                    className="h-full bg-ratq-600 transition-all duration-300"
                    style={{ width: `${((activeIndex + 1) / SECTIONS.length) * 100}%` }}
                  />
                </div>

                {/* Scrollable Section Navigation List */}
                <div className="overflow-y-auto space-y-4 pe-1 text-start">
                  {PHASES.map((phase) => {
                    const phaseSections = filteredSections.filter(
                      (s) => s.phaseNumber === phase.id
                    );
                    if (phaseSections.length === 0) return null;

                    return (
                      <div key={phase.id} className="space-y-1">
                        <div className="px-2 py-1 text-[10px] font-bold text-fg-subtle uppercase tracking-wider">
                          المرحلة {phase.id}: {phase.title}
                        </div>
                        {phaseSections.map((section) => {
                          const isCurrent = section.id === activeSectionId;
                          return (
                            <button
                              key={section.id}
                              onClick={() => setActiveSectionId(section.id)}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all text-start group ${
                                isCurrent
                                  ? 'bg-ratq-50 dark:bg-ratq-950/70 text-ratq-800 dark:text-ratq-300 font-bold border border-ratq-200 dark:border-ratq-800'
                                  : 'text-fg-muted hover:text-fg hover:bg-subtle'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span
                                  className={`text-[11px] font-mono shrink-0 ${
                                    isCurrent ? 'text-ratq-600 dark:text-ratq-400 font-bold' : 'text-fg-subtle'
                                  }`}
                                >
                                  {section.number}
                                </span>
                                <span className="truncate">{section.title}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </aside>

            {/* 3. Main Content View: Active Section Content (Not a long messy endless scroll!) */}
            <main className="lg:col-span-8 xl:col-span-9 text-start">
              <div className="bg-canvas border border-border rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xs relative">
                {/* Section Header Meta */}
                <div className="mb-8 pb-6 border-b border-border/80">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-subtle text-fg-muted text-xs font-mono border border-border">
                      <span className="font-bold text-ratq-700 dark:text-ratq-300">القسم {activeSection.number}</span>
                      <span>•</span>
                      <span>{activeSection.phase}</span>
                    </div>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-bold text-fg tracking-tight leading-tight">
                    {activeSection.title}
                  </h1>
                  <p className="mt-2 text-sm text-fg-muted leading-relaxed">
                    {activeSection.summary}
                  </p>
                </div>

                {/* Section Body Content */}
                <div className="prose-clean space-y-8">
                  {renderSectionContent(activeSection.id)}
                </div>

                {/* Navigation Footer (Previous / Next) */}
                <div className="mt-12 pt-6 border-t border-border flex items-center justify-between gap-4">
                  {activeIndex > 0 ? (
                    <button
                      onClick={handlePrevSection}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-canvas hover:bg-subtle text-xs font-semibold text-fg transition-colors group"
                    >
                      <ArrowRight className="w-4 h-4 rtl:rotate-0 rotate-180 text-fg-subtle group-hover:text-fg" />
                      <div className="flex flex-col text-start">
                        <span className="text-[10px] text-fg-subtle">القسم السابق</span>
                        <span className="truncate max-w-[150px] sm:max-w-xs">{SECTIONS[activeIndex - 1].title}</span>
                      </div>
                    </button>
                  ) : <div />}

                  {activeIndex < SECTIONS.length - 1 ? (
                    <button
                      onClick={handleNextSection}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-ratq-200 dark:border-ratq-800 bg-ratq-50 dark:bg-ratq-950/60 hover:bg-ratq-100 dark:hover:bg-ratq-900 text-xs font-semibold text-ratq-800 dark:text-ratq-200 transition-colors group"
                    >
                      <div className="flex flex-col text-start">
                        <span className="text-[10px] text-ratq-600 dark:text-ratq-400">القسم التالي</span>
                        <span className="truncate max-w-[150px] sm:max-w-xs">{SECTIONS[activeIndex + 1].title}</span>
                      </div>
                      <ArrowLeft className="w-4 h-4 rtl:rotate-0 rotate-180 text-ratq-600 dark:text-ratq-400" />
                    </button>
                  ) : (
                    <div className="text-xs text-fg-subtle font-mono">
                      نهاية الدراسة (18/18)
                    </div>
                  )}
                </div>
              </div>
            </main>
          </div>
        ) : activeTab === 'prd' ? (
          /* PRD Preview Component */
          <PrdView />
        ) : (
          /* User Stories View Component */
          <UserStoriesView />
        )}
      </div>
    </div>
  );
};

// Section Content Renderer for all 18 items
function renderSectionContent(sectionId: string) {
  switch (sectionId) {
    case 'executive-summary':
      return (
        <div className="space-y-6">
          <div className="p-4 rounded-xl border border-border bg-subtle/40">
            <h3 className="text-sm font-bold text-fg mb-1.5 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-ratq-600" />
              <span>جوهر الدراسة والفرصة الاستراتيجية</span>
            </h3>
            <p className="text-xs text-fg-muted leading-relaxed">
              تعاني بيئة تطوير البرمجيات الإسلامية من غياب بنية تحتية حوكمية موحدة وموثوقة، حيث يعتمد المطورون على مستودعات متفرقة أو نصوص قرآنية مجهولة الإسناد والتخريج، مع مخاطر وقوع أخطاء في علامات الضبط والتشكيل أو التوليد غير المنضبط بواسطة الذكاء الاصطناعي. منصة «رَتْق» تُشكل أول كتالوج معياري موحد ومُدار لمكتبات وحزم وتطبيقات القرآن الكريم وخطوطه وبياناته خاضع لمعايير «إتقان» الصارمة.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-border bg-canvas">
              <span className="text-[11px] font-bold text-ratq-700 dark:text-ratq-400 font-mono">01. المشكلة</span>
              <h4 className="text-xs font-bold text-fg mt-1 mb-2">تشتت الموارد ومخاطر التحريف</h4>
              <p className="text-xs text-fg-muted leading-relaxed">
                صعوبة العثور على أصول موثوقة، تفاوت صيغ الترميز العثماني، واستخدام نماذج توليدية قد تخترق قدسية النص القرآني.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-canvas">
              <span className="text-[11px] font-bold text-ratq-700 dark:text-ratq-400 font-mono">02. الحل المقترح</span>
              <h4 className="text-xs font-bold text-fg mt-1 mb-2">بنية تحتية حية ومحوكمة</h4>
              <p className="text-xs text-fg-muted leading-relaxed">
                كتالوج مركزي لـ 11 نوعاً من الأصول، مسارات وصول منظمة بمفاتيح API، بيئة Sandbox للتجربة، وشارات إتقان ذات المستويات الأربعة.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-canvas">
              <span className="text-[11px] font-bold text-ratq-700 dark:text-ratq-400 font-mono">03. الأثر المتوقع</span>
              <h4 className="text-xs font-bold text-fg mt-1 mb-2">تسريع الإطلاق بنسبة 60%</h4>
              <p className="text-xs text-fg-muted leading-relaxed">
                تقليص زمن تكامل المطورين من أسابيع إلى دقائق، وصفر أخطاء في نصوص المصاحف المعتمدة المنشورة.
              </p>
            </div>
          </div>

          <div className="border border-border rounded-xl p-5 bg-canvas">
            <h4 className="text-xs font-bold text-fg mb-3">أبرز توصيات تجربة المستخدم (UX Recommendations)</h4>
            <ul className="space-y-2 text-xs text-fg-muted">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-ratq-600 shrink-0 mt-0.5" />
                <span><strong>تبسيط التوثيق وتوفير نماذج كود جاهزة:</strong> توفير أمثلة كود بـ 5 لغات برمجية (Dart/Flutter, JS/TS, Python, Swift, cURL) بنسخ مباشر.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-ratq-600 shrink-0 mt-0.5" />
                <span><strong>إلزامية الشفافية في التراخيص والإسناد:</strong> إظهار رخصة المورد وجهة التحقيق ورقم المصحف الورقي المقابل بشكل بارز في كل بطاقة.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-ratq-600 shrink-0 mt-0.5" />
                <span><strong>حظر الذكاء الاصطناعي التوليدي للنص القرآني (Zero-Hallucination Guardrail):</strong> وضع سياسة صارمة مدعومة بفحص آلي يمنع قبول أي مورد يولد نصاً قرآنياً عشوائياً.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-ratq-600 shrink-0 mt-0.5" />
                <span><strong>إدارة دورة حياة المفاتيح بنقرة واحدة:</strong> إتاحة إنشاء المفتاح، تدويره (Key Rotation)، ومراقبة استهلاك الحصص اليومية بلوحة تحكم نظيفة.</span>
              </li>
            </ul>
          </div>
        </div>
      );

    case 'project-context':
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-border bg-subtle/30">
              <h4 className="text-xs font-bold text-fg mb-2">الرؤية الاستراتيجية</h4>
              <p className="text-xs text-fg-muted leading-relaxed">
                أن تكون منصة «رَتْق» البنية التحتية البرمجية والمعيار المرجعي الموثوق عالمياً لكل مطور وباحث ومؤسسة تسعى لبناء حلول رقمية تخدم كتاب الله تعالى بكفاءة وأمان ومصداقية تامة.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-subtle/30">
              <h4 className="text-xs font-bold text-fg mb-2">المشكلات التي تحلها رَتْق</h4>
              <p className="text-xs text-fg-muted leading-relaxed">
                غياب جهة موثقة تمنح اعتمادات للمكتبات، تشتت صيغ البيانات (JSON, SQLite, Parquet, XML)، صعوبة التواصل مع دور النشر لحفظ الحقوق، وتوقف واجهات الـ API غير الرسمية فجأة.
              </p>
            </div>
          </div>

          <div className="border border-border rounded-xl p-5 bg-canvas">
            <h4 className="text-xs font-bold text-fg mb-3">مؤشرات النجاح الاستراتيجية (Core KPIs)</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-lg bg-subtle border border-border">
                <span className="text-xl font-bold font-mono text-ratq-700 dark:text-ratq-400">{'< 3 min'}</span>
                <span className="block text-[11px] text-fg-subtle mt-1 font-medium">زمن أول استدعاء API</span>
              </div>
              <div className="p-3 rounded-lg bg-subtle border border-border">
                <span className="text-xl font-bold font-mono text-ratq-700 dark:text-ratq-400">100%</span>
                <span className="block text-[11px] text-fg-subtle mt-1 font-medium">صحة إسناد النصوص المعتمدة</span>
              </div>
              <div className="p-3 rounded-lg bg-subtle border border-border">
                <span className="text-xl font-bold font-mono text-ratq-700 dark:text-ratq-400">92%+</span>
                <span className="block text-[11px] text-fg-subtle mt-1 font-medium">معدل رضا المطورين CSAT</span>
              </div>
              <div className="p-3 rounded-lg bg-subtle border border-border">
                <span className="text-xl font-bold font-mono text-ratq-700 dark:text-ratq-400">99.95%</span>
                <span className="block text-[11px] text-fg-subtle mt-1 font-medium">جاهزية وتوافر الـ API</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border bg-canvas">
            <h4 className="text-xs font-bold text-fg mb-2">نطاق الدراسة وحدودها (Scope & Boundaries)</h4>
            <p className="text-xs text-fg-muted leading-relaxed">
              تغطي هذه الدراسة تجربة الاستخدام لكافة بوابات «رَتْق»: بوابة المستكشف العامة، كتالوج الموارد وتفاصيل الأصول، بوابة المطورين وإدارة المفاتيح، بوابة الناشرين لإدارة الموارد، ودليل معيار إتقان. ولا تشمل الدراسة بناء تطبيقات المصاحف النهائية للمستهلك، بل تركز على تجربة «المطور والمؤسسة» (B2D & B2B).
            </p>
          </div>
        </div>
      );

    case 'methodology':
      return (
        <div className="space-y-6">
          {/* تنويه منهجي: دراسة افتراضية ومحاكاة لتقريب الصورة */}
          <div className="p-4 sm:p-5 rounded-xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
                <Info className="w-4 h-4" />
              </div>
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-xs font-bold text-fg">تنويه منهجي: دراسة افتراضية ونموذج محاكاة لتقريب الصورة</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold border border-amber-500/20">
                    Hypothetical / Simulated Case Study
                  </span>
                </div>
                <p className="text-xs text-fg-muted leading-relaxed">
                  هذه الدراسة هي <strong>دراسة افتراضية قائمة على النمذجة والمحاكاة وليست دراسة ميدانية واقعية</strong>؛ أُعدّت بغرض <strong>تقريب الصورة العملية</strong> وتوضيح الرؤية أمام أصحاب المصلحة والمطورين، وبيان كيفية هندسة تجربة المستخدم (UX) وتجربة المطور (DX) لمنصة «رَتْق» كبنية تحتية رقمية قبل الدخول في مرحلة الاستثمار البرمجي والتنفيذ الفعلي.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-[11px]">
                  <div className="p-2.5 rounded-lg bg-canvas border border-border/80">
                    <span className="font-bold text-fg block mb-1">🎯 الهدف: تقريب الرؤية</span>
                    <span className="text-fg-muted">تجسيد رحلة المستخدم وسيناريوهات الاعتماد والحوكمة لبناء فهم مشترك بين أصحاب القرار والمطورين.</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-canvas border border-border/80">
                    <span className="font-bold text-fg block mb-1">📊 أرقام وعينات استرشادية</span>
                    <span className="text-fg-muted">المقابلات ونسب الاستبيانات والمشاركين الواردة أدناه هي أرقام افتراضية محاكية وُضعت لتقريب التحليل وسياق المشكلة.</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-canvas border border-border/80">
                    <span className="font-bold text-fg block mb-1">🏗️ إطار تأسيسي للتنفيذ</span>
                    <span className="text-fg-muted">تُشكّل مخرجات هذه الدراسة مرجعاً استرشادياً متكاملاً يُبنى عليه عند الانتقال للبحث الميداني الحقيقي وبدء التطوير.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-border rounded-xl p-5 bg-canvas">
            <h4 className="text-xs font-bold text-fg mb-3">الأساليب البحثية ونمذجة السيناريوهات (Simulation Methods)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-subtle/50 border border-border">
                <h5 className="text-xs font-bold text-fg mb-1">1. المقابلات النوعية المعمقة (Qualitative Simulation)</h5>
                <p className="text-xs text-fg-muted leading-relaxed">
                  نمذجة 16 مقابلة استرشادية افتراضية مع مهندسي برمجيات، مسؤولي تقنية في دور نشر مصاحف، وباحثين في علوم البيانات ولغويات القرآن لتقريب متطلباتهم وتحدياتهم الواقعية.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-subtle/50 border border-border">
                <h5 className="text-xs font-bold text-fg mb-1">2. الاستبيانات الكمية (Quantitative Simulation)</h5>
                <p className="text-xs text-fg-muted leading-relaxed">
                  محاكاة استبيان بحثي افتراضي لعينة من 86 مطوراً في مجتمعات البرمجة العربية والإسلامية لقياس التحديات والاحتياجات البرمجية المتوقعة.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-subtle/50 border border-border">
                <h5 className="text-xs font-bold text-fg mb-1">3. التحليل المعياري للمنافسين (Benchmarking)</h5>
                <p className="text-xs text-fg-muted leading-relaxed">
                  تحليل أفضل الممارسات في مراكز المطورين ومنصات التوزيع العالمية مثل Stripe, GitHub Marketplace, Postman, و Quran.com API.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-subtle/50 border border-border">
                <h5 className="text-xs font-bold text-fg mb-1">4. التدقيق الإرشادي للواجهات (Heuristic Evaluation)</h5>
                <p className="text-xs text-fg-muted leading-relaxed">
                  تقييم واجهات النماذج الأولية عبر معايير جاكوب نيلسن العشرة لقابلية الاستخدام والتوافق الكامل مع الثقافة والأنظمة ثنائية الاتجاه (RTL).
                </p>
              </div>
            </div>
          </div>

          <div className="border border-border rounded-xl p-5 bg-canvas">
            <h4 className="text-xs font-bold text-fg mb-2">توزيع العينة الافتراضية الاسترشادية (Hypothetical Sample Breakdown)</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-border/60">
                <span className="text-fg-muted">مطورو تطبيقات جوال ومواقع مستقلون (تمثيل افتراضي)</span>
                <span className="font-mono font-bold text-fg">42% (36 مشاركاً)</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-border/60">
                <span className="text-fg-muted">ممثلو دور نشر ومراكز تحكيم مصاحف (تمثيل افتراضي)</span>
                <span className="font-mono font-bold text-fg">24% (21 مشاركاً)</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-border/60">
                <span className="text-fg-muted">باحثو ذكاء اصطناعي ومعالجة لغات طبيعية (تمثيل افتراضي)</span>
                <span className="font-mono font-bold text-fg">20% (17 مشاركاً)</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-fg-muted">مصممو خطوط طباعية وحوسبة عثمانية (تمثيل افتراضي)</span>
                <span className="font-mono font-bold text-fg">14% (12 مشاركاً)</span>
              </div>
            </div>
          </div>
        </div>
      );

    case 'stakeholders':
      return (
        <div className="space-y-6">
          <div className="border border-border rounded-xl p-5 bg-canvas">
            <h4 className="text-xs font-bold text-fg mb-3">مصفوفة أصحاب المصلحة (Stakeholder Map)</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead>
                  <tr className="border-b border-border text-fg-subtle">
                    <th className="py-2 px-3 text-start">الطرف المعني</th>
                    <th className="py-2 px-3 text-start">التأثير والاهتمام</th>
                    <th className="py-2 px-3 text-start">التوقعات الأساسية</th>
                    <th className="py-2 px-3 text-start">المخاطر المحتملة وكيفية التخفيف</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-fg-muted">
                  <tr>
                    <td className="py-3 px-3 font-bold text-fg">المطورون الأفراد</td>
                    <td className="py-3 px-3">تأثير متوسط / اهتمام عالٍ</td>
                    <td className="py-3 px-3">توثيق جاهز، مفاتيح سريعة، كود بنقرة زر</td>
                    <td className="py-3 px-3">الإحباط من تعقيد الموافقات ← توفير Sandbox فوري</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-fg">دور النشر والمراكز القرآنية</td>
                    <td className="py-3 px-3">تأثير عالٍ / اهتمام عالٍ</td>
                    <td className="py-3 px-3">حفظ الحقوق، إحصائيات من يستهلك المورد</td>
                    <td className="py-3 px-3">الخوف من سرقة البيانات ← حوكمة وصول ومفاتيح مقيدة</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-fg">اللجان العلمية والمحكمون</td>
                    <td className="py-3 px-3">تأثير عالٍ / اهتمام بالغ</td>
                    <td className="py-3 px-3">دقة تامة في التشكيل وعلامات الوقف ورسم المصحف</td>
                    <td className="py-3 px-3">بطء دورات المراجعة ← أتمتة الفحص الشكلي مسبقاً</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-fg">إدارة المنصة وفريق العمل</td>
                    <td className="py-3 px-3">تأثير عالٍ / اهتمام عالٍ</td>
                    <td className="py-3 px-3">أمان البنية التحتية، استقرار السيرفرات، حظر الهجمات</td>
                    <td className="py-3 px-3">إفراط الاستهلاك ← تحديد معدل الطلب (Rate Limiting)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );

    case 'user-research':
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-border bg-subtle/30">
              <span className="text-2xl font-bold font-mono text-ratq-700 dark:text-ratq-400 block mb-1">78%</span>
              <h5 className="text-xs font-bold text-fg mb-1">معاناة مع رسم الخط العثماني</h5>
              <p className="text-xs text-fg-muted">
                أبلغوا عن مشاكل في تراكب علامات التشكيل وسقوط المحاذاة على شاشات الجوال.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-subtle/30">
              <span className="text-2xl font-bold font-mono text-ratq-700 dark:text-ratq-400 block mb-1">71%</span>
              <h5 className="text-xs font-bold text-fg mb-1">توقف مفاجئ لـ APIs غير رسمية</h5>
              <p className="text-xs text-fg-muted">
                عانوا من تعطل تطبيقاتهم بسبب تغيير نقاط النهاية دون إشعار مسبق أو SLAs.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-subtle/30">
              <span className="text-2xl font-bold font-mono text-ratq-700 dark:text-ratq-400 block mb-1">84%</span>
              <h5 className="text-xs font-bold text-fg mb-1">مطالبة بشهادة إسناد موثقة</h5>
              <p className="text-xs text-fg-muted">
                يعتبرون وجود جهة شرعية معتمدة حاسماً قبل اعتماد أي حزمة برمجية قرآنية.
              </p>
            </div>
          </div>

          <div className="border border-border rounded-xl p-5 bg-canvas">
            <h4 className="text-xs font-bold text-fg mb-3">أبرز المشكلات ونقاط الألم المستخلصة (Pain Points)</h4>
            <div className="space-y-3 text-xs text-fg-muted">
              <div className="p-3 rounded-lg border border-border bg-subtle/20 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-fg block mb-0.5">صعوبة المزامنة بين الصوت والنص:</strong>
                  ملفات التلاوات الصوتية لا تأتي غالباً بملفات توقيتات دقيقة (Timestamp Segments) للآيات والكلمات، مما يجبر المطورين على بنائها يدوياً.
                </div>
              </div>
              <div className="p-3 rounded-lg border border-border bg-subtle/20 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-fg block mb-0.5">غموض شروط الترخيص والملكية الفكرية:</strong>
                  كثير من المطورين يخشون استخدام تفاسير أو ترجمات معينة خشية الوقوع في مخالفات حقوق النشر لعدم وضوح نوع الترخيص.
                </div>
              </div>
              <div className="p-3 rounded-lg border border-border bg-subtle/20 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-fg block mb-0.5">غياب أدوات الاختبار السريع:</strong>
                  الحاجة لتثبيت الحزم محلياً وكتابة كود كامل لمجرد التأكد من ملاءمة المورد البرمجي لاحتياجات المشروع.
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'personas':
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Persona 1 */}
            <div className="border border-border rounded-xl p-5 bg-canvas flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-fg">عمر العوضي (29 عاماً)</h4>
                    <span className="text-[11px] text-ratq-700 dark:text-ratq-300 font-mono">Senior Flutter Developer</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-subtle text-fg-muted border border-border">
                    مطور جوال مستقل
                  </span>
                </div>
                <p className="text-xs text-fg-muted italic mb-3 bg-subtle/40 p-2.5 rounded-lg border-s-2 border-ratq-600">
                  «أريد حزمة Dart موثوقة لمزامنة التلاوة مع الآيات بنقرة واحدة، ولا أريد قضاء أسبوعين في تصحيح أخطاء التوقيت اليدوي.»
                </p>
                <div className="space-y-2 text-xs">
                  <div>
                    <strong className="text-fg text-[11px] block">الأهداف:</strong>
                    <span className="text-fg-muted">تطوير تطبيق مصحف سريع وخفيف، دمج تفاسير معتمدة، والتأكد من خلو النص من أي تحريف.</span>
                  </div>
                  <div>
                    <strong className="text-fg text-[11px] block">نقاط الألم:</strong>
                    <span className="text-fg-muted">تشتت مستودعات GitHub، انعدام التوثيق باللغة العربية، وتعطل روابط التحميل القديمة.</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-border/80 flex items-center justify-between text-[11px] text-fg-subtle font-mono">
                <span>التقنيات: Flutter, Dart, REST API</span>
                <span>الاستخدام: أسبوعي</span>
              </div>
            </div>

            {/* Persona 2 */}
            <div className="border border-border rounded-xl p-5 bg-canvas flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-fg">د. عبد الرحمن الشهري (46 عاماً)</h4>
                    <span className="text-[11px] text-ratq-700 dark:text-ratq-300 font-mono">مدير مركز تحكيم ومحقق قرآني</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-subtle text-fg-muted border border-border">
                    ناشر ومحقق معتمد
                  </span>
                </div>
                <p className="text-xs text-fg-muted italic mb-3 bg-subtle/40 p-2.5 rounded-lg border-s-2 border-ratq-600">
                  «بيانات المصحف أمانة شرعية عظيمة، نحتاج لتوثيق كل إصدار برقم معتمد ومتابعة دقيقة لأي خطأ محتمل في ثوانٍ معدودة.»
                </p>
                <div className="space-y-2 text-xs">
                  <div>
                    <strong className="text-fg text-[11px] block">الأهداف:</strong>
                    <span className="text-fg-muted">نشر نصوص المصحف بالرسم العثماني المحقق، حماية المصنفات الوقفية، وتتبع الجهات المستفيدة.</span>
                  </div>
                  <div>
                    <strong className="text-fg text-[11px] block">نقاط الألم:</strong>
                    <span className="text-fg-muted">استخدام البيانات في مشاريع دون إذن أو تشويه علامات الضبط، وصعوبة إدارة التراخيص.</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-border/80 flex items-center justify-between text-[11px] text-fg-subtle font-mono">
                <span>الاهتمام: التوثيق الشرعي، التراخيص</span>
                <span>الاستخدام: دوري</span>
              </div>
            </div>

            {/* Persona 3 */}
            <div className="border border-border rounded-xl p-5 bg-canvas flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-fg">سارة الشمري (26 عاماً)</h4>
                    <span className="text-[11px] text-ratq-700 dark:text-ratq-300 font-mono">AI & NLP Data Scientist</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-subtle text-fg-muted border border-border">
                    باحثة بيانات
                  </span>
                </div>
                <p className="text-xs text-fg-muted italic mb-3 bg-subtle/40 p-2.5 rounded-lg border-s-2 border-ratq-600">
                  «أحتاج لمجموعات بيانات قرآنية مهيكلة بصيغ Parquet/JSONL نظيفة لبحوث الاسترجاع الدلالي، مع الالتزام التام بعدم توليد النص بالذكاء الاصطناعي.»
                </p>
                <div className="space-y-2 text-xs">
                  <div>
                    <strong className="text-fg text-[11px] block">الأهداف:</strong>
                    <span className="text-fg-muted">تدريب نماذج بحث دلالي وتصنيف موضوعي معتمد للآيات وتفاسيرها دون أي هلوسة توليدية.</span>
                  </div>
                  <div>
                    <strong className="text-fg text-[11px] block">نقاط الألم:</strong>
                    <span className="text-fg-muted">عدم نظافة البيانات وتفاوت التشكيل بين الآيات، وغياب تراخيص البحث الأكاديمي الصريحة.</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-border/80 flex items-center justify-between text-[11px] text-fg-subtle font-mono">
                <span>التقنيات: Python, Pandas, HuggingFace</span>
                <span>الاستخدام: مكثف</span>
              </div>
            </div>

            {/* Persona 4 */}
            <div className="border border-border rounded-xl p-5 bg-canvas flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-fg">طارق المنصور (34 عاماً)</h4>
                    <span className="text-[11px] text-ratq-700 dark:text-ratq-300 font-mono">Typography & Web Engineer</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-subtle text-fg-muted border border-border">
                    مهندس خطوط وواجهات
                  </span>
                </div>
                <p className="text-xs text-fg-muted italic mb-3 bg-subtle/40 p-2.5 rounded-lg border-s-2 border-ratq-600">
                  «خطوط المصحف الحاسوبية ثقيلة جداً وتسبب وميضاً في المتصفحات، أحتاج خطوط WOFF2 محسنة متوافقة 100% مع معايير يونيكود.»
                </p>
                <div className="space-y-2 text-xs">
                  <div>
                    <strong className="text-fg text-[11px] block">الأهداف:</strong>
                    <span className="text-fg-muted">عرض المصحف بجمالية عثمانية دون التأثير على أداء وسرعة تحميل صفحات الويب.</span>
                  </div>
                  <div>
                    <strong className="text-fg text-[11px] block">نقاط الألم:</strong>
                    <span className="text-fg-muted">مشاكل الأرقام القرآنية، علامات الوقف المكسورة، وتفاوت دعم المتصفحات على أجهزة iOS و Android.</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-border/80 flex items-center justify-between text-[11px] text-fg-subtle font-mono">
                <span>التقنيات: Web Fonts, CSS, OpenType</span>
                <span>الاستخدام: دوري</span>
              </div>
            </div>
          </div>
        </div>
      );

    case 'user-journey':
      return (
        <div className="space-y-6">
          <div className="border border-border rounded-xl p-5 bg-canvas">
            <h4 className="text-xs font-bold text-fg mb-4">خريطة رحلة المطور عبر 7 محطات (End-to-End User Journey)</h4>
            <div className="space-y-4">
              {[
                {
                  step: '01. الاكتشاف (Discovery)',
                  action: 'يبحث المطور في كتالوج رَتْق عن أصل برمجي (مثلاً: حزمة مزامنة تلاوات صوتية ورش).',
                  friction: 'التخوف من عدم توفر روايات غير حفص.',
                  solution: 'فلترة دقيقة حسب الرواية، نوع الأصل، والتراخيص مع بحث فوري ذكي.',
                },
                {
                  step: '02. التقييم (Evaluation)',
                  action: 'يدخل صفحة تفاصيل المورد، يفحص شارة إتقان، الترخيص، أمثلة الكود، وسجل التحديثات.',
                  friction: 'الشك في دقة المورد وحداثته.',
                  solution: 'عرض بطاقة معيار إتقان الواضحة، ورابط المصدر، وتاريخ آخر تدقيق معتمد.',
                },
                {
                  step: '03. التسجيل السريع (Registration)',
                  action: 'يسجل حسابه كمطور بواسطة GitHub أو البريد الإلكتروني في خطوة واحدة.',
                  friction: 'النماذج الطويلة وطلب بيانات غير ضرورية.',
                  solution: 'تسجيل دخول بنقرة واحدة مع توجيه فوري للمورد المطلوب.',
                },
                {
                  step: '04. الحصول على المفتاح (Key Provisioning)',
                  action: 'يطلب مفتاح API للمورد المقيد ويحدد الاستخدام المتوقع.',
                  friction: 'انتظار الموافقة اليدوية لأيام.',
                  solution: 'إصدار فوري لبيئة Sandbox وموافقة مؤتمتة للمشاريع المفتوحة وفق SLAs واضحة.',
                },
                {
                  step: '05. التكامل والتجربة (Integration & Sandbox)',
                  action: 'يجرب نقطة النهاية في الـ Playground التفاعلي، وينسخ نموذج كود Flutter.',
                  friction: 'أخطاء غير مفهومة أو نقص في المعاملات.',
                  solution: 'أكواد جاهزة بنسخ فوري، ورسائل أخطاء مطابقة لمعيار RFC 7807.',
                },
                {
                  step: '06. الاستخدام في الإنتاج (Production Usage)',
                  action: 'يطلق تطبيقه ويتابع استهلاك الحصة ومعدل الطلبات في لوحة تحكم رَتْق.',
                  friction: 'تجاوز الحصة فجأة وتوقف التطبيق.',
                  solution: 'تنبيهات استباقية بالبريد عند بلوغ 80% من الحصة مع خيار طلب ترقية سلس.',
                },
                {
                  step: '07. الدعم والتحديث (Support & Evolution)',
                  action: 'يتلقى إشعاراً عند تحديث الحزمة، أو يدوّر مفتاح الـ API دورياً للأمان.',
                  friction: 'انقطاع الخدمة أثناء تدوير المفتاح.',
                  solution: 'تدوير مفاتيح مرن بفترة سماح 24 ساعة للمفتاح القديم دون توقف.',
                },
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-lg border border-border bg-subtle/20 flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs">
                  <div className="sm:w-1/3">
                    <strong className="text-fg font-bold block text-xs">{item.step}</strong>
                    <span className="text-fg-muted mt-1 block">{item.action}</span>
                  </div>
                  <div className="sm:w-1/3 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-md border border-amber-200/60 dark:border-amber-800/60">
                    <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 block mb-0.5">نقطة الاحتكاك (Friction)</span>
                    <span className="text-amber-800 dark:text-amber-300">{item.friction}</span>
                  </div>
                  <div className="sm:w-1/3 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-md border border-emerald-200/60 dark:border-emerald-800/60">
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 block mb-0.5">حل رَتْق المصمم</span>
                    <span className="text-emerald-800 dark:text-emerald-300">{item.solution}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case 'competitor-analysis':
      return (
        <div className="space-y-6">
          <div className="border border-border rounded-xl p-5 bg-canvas">
            <h4 className="text-xs font-bold text-fg mb-3">مصفوفة المقارنة المرجعية (Competitive Benchmarking)</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead>
                  <tr className="border-b border-border text-fg-subtle">
                    <th className="py-2.5 px-3 text-start">المعيار / المنصة</th>
                    <th className="py-2.5 px-3 text-start font-bold text-ratq-700 dark:text-ratq-300">منصة رَتْق</th>
                    <th className="py-2.5 px-3 text-start">Quran.com API</th>
                    <th className="py-2.5 px-3 text-start">مستودعات GitHub</th>
                    <th className="py-2.5 px-3 text-start">RapidAPI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-fg-muted">
                  <tr>
                    <td className="py-3 px-3 font-bold text-fg">معيار حوكمة شرعي معتمد</td>
                    <td className="py-3 px-3 text-emerald-600 font-bold">معيار إتقان (4 مستويات)</td>
                    <td className="py-3 px-3">داخلي غير معلن كمعيار</td>
                    <td className="py-3 px-3 text-rose-500">غير متوفر إطلاقاً</td>
                    <td className="py-3 px-3 text-rose-500">غير متوفر</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-fg">تنوع الأصول القرآنية</td>
                    <td className="py-3 px-3 text-emerald-600 font-bold">11 أصلاً (كود، صوت، خط، بيانات)</td>
                    <td className="py-3 px-3">واجهات API ونصوص فقط</td>
                    <td className="py-3 px-3">مشتت وغير منظم</td>
                    <td className="py-3 px-3">APIs فقط</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-fg">حظر الذكاء الاصطناعي التوليدي</td>
                    <td className="py-3 px-3 text-emerald-600 font-bold">سياسة صارمة وفحص آلي</td>
                    <td className="py-3 px-3">ملتزم ضمنياً</td>
                    <td className="py-3 px-3 text-rose-500">مخاطر توليد عالية</td>
                    <td className="py-3 px-3 text-rose-500">لا توجد رقابة</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-fg">إدارة مفاتيح API والحصص</td>
                    <td className="py-3 px-3 text-emerald-600 font-bold">لوحة متكاملة وتدوير سلس</td>
                    <td className="py-3 px-3">محدود جداً</td>
                    <td className="py-3 px-3 text-rose-500">غير متوفر</td>
                    <td className="py-3 px-3 text-emerald-600">متوفر</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-fg">التصميم العربي (RTL First)</td>
                    <td className="py-3 px-3 text-emerald-600 font-bold">عربي أصيل 100% مع طباعة عثمانية</td>
                    <td className="py-3 px-3">مدعوم جزئياً</td>
                    <td className="py-3 px-3 text-rose-500">إنجليزي غالباً</td>
                    <td className="py-3 px-3 text-rose-500">إنجليزي فقط</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border bg-subtle/30">
            <h4 className="text-xs font-bold text-fg mb-1.5">الفجوة والفرصة السوقية لـ «رَتْق»</h4>
            <p className="text-xs text-fg-muted leading-relaxed">
              تنفرد رَتْق بسد الفجوة بين عالم الحوكمة الشرعية والعلمية الرصينة وعالم تجربة المطور البرمجية الحديثة (Developer Experience). لا توجد منصة عالمية تجمع التحقق الشرعي، وتوفير الخطوط العثمانية، وحزم SDK، وبيئات التجربة في واجهة عربية واحدة تحمي قدسية النص القرآني وتمكّن المطورين.
            </p>
          </div>
        </div>
      );

    case 'requirements-analysis':
      return (
        <div className="space-y-6">
          <div className="border border-border rounded-xl p-5 bg-canvas">
            <h4 className="text-xs font-bold text-fg mb-3">ترتيب الأولويات بنموذج MoSCoW</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20">
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 font-mono">Must Have (إلزامي للإطلاق)</span>
                <ul className="mt-2 space-y-1.5 text-xs text-fg-muted list-disc list-inside">
                  <li>كتالوج الموارد الـ 11 مع محرك بحث وفلترة متعددة الأبعاد.</li>
                  <li>شارات معيار إتقان الأربع مع تفاصيل طبقات الفحص.</li>
                  <li>نظام إصدار مفاتيح API وتشفيرها التام بواسطة SHA-256.</li>
                  <li>بوابة الناشرين لتوثيق الأصول واعتماد طلبات المطورين.</li>
                  <li>قاعدة منع الذكاء الاصطناعي التوليدي للنص القرآني (Zero-Hallucination).</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/40 dark:bg-blue-950/20">
                <span className="text-[11px] font-bold text-blue-700 dark:text-blue-400 font-mono">Should Have (هام جداً)</span>
                <ul className="mt-2 space-y-1.5 text-xs text-fg-muted list-disc list-inside">
                  <li>بيئة تجربة تفاعلية (Interactive Sandbox / Playground).</li>
                  <li>تدوير مفاتيح الـ API بفترة سماح 24 ساعة للمفتاح القديم.</li>
                  <li>لوحة مراقبة حية لاستهلاك الحصص ونسب الأخطاء وزمن التأخير.</li>
                  <li>أمثلة كود جاهزة بنسخ فوري بـ 5 لغات برمجية شائعة.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20">
                <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 font-mono">Could Have (مرغوب في مراحل لاحقة)</span>
                <ul className="mt-2 space-y-1.5 text-xs text-fg-muted list-disc list-inside">
                  <li>فاحص آلي مدمج في GitHub Actions للتحقق من الموارد قبل النشر.</li>
                  <li>إشعارات عبر Webhooks للناشرين عند حدوث طلبات جديدة.</li>
                  <li>واجهة GraphQL موازية لنقاط نهاية REST.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-border bg-subtle/40">
                <span className="text-[11px] font-bold text-fg-subtle font-mono">Won't Have (مستبعد نظامياً)</span>
                <ul className="mt-2 space-y-1.5 text-xs text-fg-muted list-disc list-inside">
                  <li>توليد نصوص قرآنية بواسطة نماذج الذكاء الاصطناعي التوليدي (محظور تماماً).</li>
                  <li>بيع الموارد القرآنية أو تحويل المنصة لمتجر تجاري مغلق.</li>
                  <li>قبول موارد غير محددة التراخيص أو مجهولة المصدر.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      );

    case 'information-architecture':
      return (
        <div className="space-y-6">
          <div className="border border-border rounded-xl p-5 bg-canvas">
            <h4 className="text-xs font-bold text-fg mb-3">هيكلية تصنيف الأصول الـ 11 عبر العائلات الخمس</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg border border-border bg-subtle/30">
                <strong className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block mb-1">1. النصوص والعلوم</strong>
                <ul className="text-xs text-fg-muted space-y-0.5 font-mono">
                  <li>• مصحف رقمي (Mushaf)</li>
                  <li>• تفسير وبيان (Tafsir)</li>
                  <li>• ترجمة معاني (Translation)</li>
                  <li>• أحكام تجويد (Tajweed)</li>
                </ul>
              </div>

              <div className="p-3 rounded-lg border border-border bg-subtle/30">
                <strong className="text-xs font-bold text-amber-600 dark:text-amber-400 block mb-1">2. الصوتيات والوسائط</strong>
                <ul className="text-xs text-fg-muted space-y-0.5 font-mono">
                  <li>• تلاوة وقراءات (Recitation)</li>
                  <li>• توقيتات التزامن (Timestamps)</li>
                </ul>
              </div>

              <div className="p-3 rounded-lg border border-border bg-subtle/30">
                <strong className="text-xs font-bold text-cyan-600 dark:text-cyan-400 block mb-1">3. الخطوط والطباعة</strong>
                <ul className="text-xs text-fg-muted space-y-0.5 font-mono">
                  <li>• خط طباعي عثماني (Font)</li>
                  <li>• حزم محارف يونيكود (Glyphs)</li>
                </ul>
              </div>

              <div className="p-3 rounded-lg border border-border bg-subtle/30">
                <strong className="text-xs font-bold text-blue-600 dark:text-blue-400 block mb-1">4. البرمجيات والواجهات</strong>
                <ul className="text-xs text-fg-muted space-y-0.5 font-mono">
                  <li>• واجهة API سحابية (API)</li>
                  <li>• حزمة برمجية (SDK)</li>
                  <li>• مكتبة معالجة (Library)</li>
                  <li>• أداة مساعدة (Tool)</li>
                </ul>
              </div>

              <div className="p-3 rounded-lg border border-border bg-subtle/30">
                <strong className="text-xs font-bold text-purple-600 dark:text-purple-400 block mb-1">5. البيانات المنظمة</strong>
                <ul className="text-xs text-fg-muted space-y-0.5 font-mono">
                  <li>• مجموعة بيانات (Dataset)</li>
                  <li>• فهارس السور والآيات (Indices)</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border bg-canvas">
            <h4 className="text-xs font-bold text-fg mb-2">نظام البحث والتنقل الذكي (Search & Faceting)</h4>
            <p className="text-xs text-fg-muted leading-relaxed">
              يعتمد البحث على تطبيع الحروف العربية آلياً (معالجة الهمزات، الياء والألف المقصورة، وحذف التشكيل الاختياري)، مع دعم لوحة الأوامر المنبثقة (Command Palette عبر اختصار Ctrl+K) للوصول الفوري لأي مورد أو ناشر أو دليل.
            </p>
          </div>
        </div>
      );

    case 'trust-experience':
      return (
        <div className="space-y-6">
          <div className="border border-border rounded-xl p-5 bg-canvas">
            <h4 className="text-xs font-bold text-fg mb-3">مستويات معيار «إتقان» الأربعة (Itqan Standard Tiers)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg border border-border bg-subtle/20 text-start">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-fg-subtle font-bold">المستوى 1</span>
                <h5 className="text-xs font-bold text-fg mt-2 mb-1">إتقان أساسي (Basic)</h5>
                <p className="text-xs text-fg-muted leading-relaxed">
                  فحص آلي لسلامة ملف README، وضوح رخصة المصدر، واكتمال بيانات الناشر.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50/20 dark:bg-blue-950/20 text-start">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold">المستوى 2</span>
                <h5 className="text-xs font-bold text-fg mt-2 mb-1">إتقان موثّق (Verified)</h5>
                <p className="text-xs text-fg-muted leading-relaxed">
                  فحص برمجي لهيكلية الـ Schema، وتوافق يونيكود، وتغطية الاختبارات، وخلو الكود من التوليد العشوائي.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50/20 dark:bg-emerald-950/20 text-start">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 font-bold">المستوى 3</span>
                <h5 className="text-xs font-bold text-fg mt-2 mb-1">إتقان معتمد (Certified)</h5>
                <p className="text-xs text-fg-muted leading-relaxed">
                  مراجعة بشرية ثنائية من محكم قرآني ومراجع تقني معتمد للتأكد من مطابقة الرسم والتشكيل.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50/20 dark:bg-amber-950/20 text-start">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 font-bold">المستوى 4</span>
                <h5 className="text-xs font-bold text-fg mt-2 mb-1">إتقان ذهبي (Gold Standard)</h5>
                <p className="text-xs text-fg-muted leading-relaxed">
                  اعتماد رسمي من هيئة إشرافية عليا، مع تغطية اختبارات بنسبة تتجاوز 95%، واستقرار تشغيلي طويل.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border bg-subtle/30">
            <h4 className="text-xs font-bold text-fg mb-1.5">سجل الشفافية والسحب (Revocations Transparency)</h4>
            <p className="text-xs text-fg-muted leading-relaxed">
              إذا اكتُشف أي خطأ في نص أو مورد منشور، يتم تعليق المورد فوراً وإرسال تنبيه آلي لكافة المطورين المرتبطين به عبر البريد وWebhooks. وتلتزم المنصة بسجل سحب علني يوثق سبب التعليق والنسخة المصححة لضمان أقصى درجات المصداقية.
            </p>
          </div>
        </div>
      );

    case 'api-access-ux':
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-border bg-canvas">
              <span className="text-[11px] font-bold text-ratq-700 dark:text-ratq-400 font-mono">المسار 1</span>
              <h5 className="text-xs font-bold text-fg mt-1 mb-2">وصول مفتوح (Open Access)</h5>
              <p className="text-xs text-fg-muted">
                متاح مباشرة بدون مفتاح أو تسجيل للمكتبات والخطوط والموارد المجانية المفتوحة.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-canvas">
              <span className="text-[11px] font-bold text-ratq-700 dark:text-ratq-400 font-mono">المسار 2</span>
              <h5 className="text-xs font-bold text-fg mt-1 mb-2">مفتاح شخصي (Key Required)</h5>
              <p className="text-xs text-fg-muted">
                إصدار فوري بنقرة واحدة من بوابة المطور لتنظيم الحصص ومتابعة الاستهلاك ومعدل الطلب.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-canvas">
              <span className="text-[11px] font-bold text-ratq-700 dark:text-ratq-400 font-mono">المسار 3</span>
              <h5 className="text-xs font-bold text-fg mt-1 mb-2">بالموافقة (Approval Required)</h5>
              <p className="text-xs text-fg-muted">
                للموارد المؤسسية الحساسة، بطلب إلكتروني بسيط يوضح الغرض والـ SLA المحدد للمراجعة.
              </p>
            </div>
          </div>

          <div className="border border-border rounded-xl p-5 bg-canvas">
            <h4 className="text-xs font-bold text-fg mb-3">دورة حياة المفتاح الآمن (API Key Lifecycle)</h4>
            <div className="space-y-2 text-xs text-fg-muted">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-ratq-600 shrink-0" />
                <span><strong>التشفير غير القابل للعكس:</strong> تخزين تجزئة المفتاح عبر SHA-256 مع Salt، وإظهار المفتاح كاملاً مرة واحدة فقط عند الإنشاء.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-ratq-600 shrink-0" />
                <span><strong>التدوير الآمن (Zero-Downtime Key Rotation):</strong> إتاحة إنشاء مفتاح بديل مع إبقاء المفتاح القديم نشطاً لمدة 24 ساعة لضمان استمرار التطبيقات.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-ratq-600 shrink-0" />
                <span><strong>الإلغاء الفوري (Instant Revocation):</strong> إمكانية تعطيل أي مفتاح يشتبه في تسريبه فوراً بنقرة زر لحماية حصة المطور.</span>
              </div>
            </div>
          </div>
        </div>
      );

    case 'developer-experience':
      return (
        <div className="space-y-6">
          <div className="border border-border rounded-xl p-5 bg-canvas">
            <h4 className="text-xs font-bold text-fg mb-3">ركائز تجربة المطور (Developer Experience Pillars)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 rounded-lg border border-border bg-subtle/30">
                <strong className="text-xs font-bold text-fg block mb-1">1. البدء السريع (Quick Start)</strong>
                <p className="text-xs text-fg-muted leading-relaxed">
                  نماذج كود جاهزة قابلة للنسخ والتشغيل الفوري بخمس لغات: TypeScript/JavaScript, Python, Flutter/Dart, Swift, و cURL.
                </p>
              </div>
              <div className="p-3 rounded-lg border border-border bg-subtle/30">
                <strong className="text-xs font-bold text-fg block mb-1">2. بيئة التجربة التفاعلية (API Sandbox)</strong>
                <p className="text-xs text-fg-muted leading-relaxed">
                  إمكانية استدعاء نقاط النهاية مباشرة من المتصفح وتعديل المعاملات (السورة، الآية، القراءة) ورؤية الـ JSON الحقيقي دون كتابة سطر كود.
                </p>
              </div>
              <div className="p-3 rounded-lg border border-border bg-subtle/30">
                <strong className="text-xs font-bold text-fg block mb-1">3. الأخطاء المعيارية (RFC 7807)</strong>
                <p className="text-xs text-fg-muted leading-relaxed">
                  رسائل خطأ قياسية واضحة تتضمن: كود الخطأ، السبب باللغة العربية والإنجليزية، وتلميحاً مباشراً لكيفية تصحيح الطلب.
                </p>
              </div>
              <div className="p-3 rounded-lg border border-border bg-subtle/30">
                <strong className="text-xs font-bold text-fg block mb-1">4. توثيق OpenAPI / Swagger موحد</strong>
                <p className="text-xs text-fg-muted leading-relaxed">
                  مواصفات قياسية قابلة للاستيراد في Postman أو توليد عملاء برمجيات (SDK Clients) آلياً لأي لغة جديدة.
                </p>
              </div>
            </div>
          </div>
        </div>
      );

    case 'rtl-accessibility':
      return (
        <div className="space-y-6">
          <div className="border border-border rounded-xl p-5 bg-canvas">
            <h4 className="text-xs font-bold text-fg mb-3">التصميم العربي وإتاحة الوصول (RTL & A11y Standards)</h4>
            <div className="space-y-3 text-xs text-fg-muted">
              <div className="p-3 rounded-lg border border-border bg-subtle/30">
                <strong className="text-fg block mb-1">التوافق البصري العربي (RTL-First Typography):</strong>
                استخدام خط الثمانية (Thmanyah Sans) للنصوص التقنية، وخط Suisse للأرقام والرموز البرمجية، مع ضبط المسافات الأفقية وهوامش القراءة لتناسب طبيعة الخط العربي.
              </div>
              <div className="p-3 rounded-lg border border-border bg-subtle/30">
                <strong className="text-fg block mb-1">الامتثال لمعايير WCAG 2.1 AA:</strong>
                نسبة تباين ألوان تتجاوز 4.5:1 للنصوص و 3:1 للعناصر التفاعلية، دعم كامل للتنقل بلوحة المفاتيح عبر حلقات التركيز الواضحة (Focus Rings).
              </div>
              <div className="p-3 rounded-lg border border-border bg-subtle/30">
                <strong className="text-fg block mb-1">دعم قارئات الشاشة (Screen Readers):</strong>
                تضمين وسوم ARIA الدقيقة لكافة الجداول والشارات البيانية، وإتاحة قراءة نصوص المصحف بتنسيقها الصحيح صوتياً.
              </div>
            </div>
          </div>
        </div>
      );

    case 'content-tone':
      return (
        <div className="space-y-6">
          <div className="border border-border rounded-xl p-5 bg-canvas">
            <h4 className="text-xs font-bold text-fg mb-3">المحتوى والنبرة التحريرية (Tone of Voice)</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 rounded-lg border border-border bg-subtle/30">
                <strong className="text-xs font-bold text-fg block mb-1">الرصانة والوقار</strong>
                <p className="text-xs text-fg-muted">
                  لغة هادئة ومحترمة تعكس قدسية القرآن الكريم وتتجنب العبارات التسويقية المبتذلة أو المبالغة غير العلمية.
                </p>
              </div>
              <div className="p-3 rounded-lg border border-border bg-subtle/30">
                <strong className="text-xs font-bold text-fg block mb-1">الدقة البرمجية</strong>
                <p className="text-xs text-fg-muted">
                  مصطلحات برمجية دقيقة تجمع بين التعبير العربي الأصيل والرموز البرمجية العالمية المتعارف عليها لدى المطورين.
                </p>
              </div>
              <div className="p-3 rounded-lg border border-border bg-subtle/30">
                <strong className="text-xs font-bold text-fg block mb-1">الإرشاد والتمكين</strong>
                <p className="text-xs text-fg-muted">
                  رسائل أخطاء وإشعارات موجهة تساعد المطور على حل المشكلة فوراً بدلاً من الاكتفاء بإلقاء الخطأ التقني.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border bg-subtle/20">
            <h4 className="text-xs font-bold text-fg mb-2">المعجم المصطلحي المعتمد</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="p-2 rounded bg-canvas border border-border">رواية • Recitation</div>
              <div className="p-2 rounded bg-canvas border border-border">رسم عثماني • Uthmanic</div>
              <div className="p-2 rounded bg-canvas border border-border">تخريج وتحقيق • Verified</div>
              <div className="p-2 rounded bg-canvas border border-border">نقطة نهاية • Endpoint</div>
            </div>
          </div>
        </div>
      );

    case 'proposed-solution':
      return (
        <div className="space-y-6">
          <div className="border border-border rounded-xl p-5 bg-canvas">
            <h4 className="text-xs font-bold text-fg mb-3">المبادئ التصميمية للواجهات (Design Principles)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-lg border border-border bg-subtle/20">
                <strong className="text-xs font-bold text-fg block mb-1">1. الهدوء البصري والتركيز</strong>
                <p className="text-xs text-fg-muted leading-relaxed">
                  الابتعاد عن البهرجة اللونية المفرطة؛ الاعتماد على درجات الرمادي والزمردي الهادئ لإبراز المحتوى والبيانات.
                </p>
              </div>
              <div className="p-3.5 rounded-lg border border-border bg-subtle/20">
                <strong className="text-xs font-bold text-fg block mb-1">2. الشفافية المعرفية في كل بطاقة</strong>
                <p className="text-xs text-fg-muted leading-relaxed">
                  كل مورد يعرض فوراً: نوع الأصل، رخصة الاستخدام، شارة إتقان، وعدد الموارد التابعة له دون الحاجة لفتح صفحات فرعية.
                </p>
              </div>
              <div className="p-3.5 rounded-lg border border-border bg-subtle/20">
                <strong className="text-xs font-bold text-fg block mb-1">3. بنية التبويب العائم والتنقل الهادئ</strong>
                <p className="text-xs text-fg-muted leading-relaxed">
                  تجنب الصفحات الطويلة المرهقة للمستخدم؛ استخدام القوائم الجانبية العائمة والتبويبات المحددة لعرض المحتوى مركزاً.
                </p>
              </div>
              <div className="p-3.5 rounded-lg border border-border bg-subtle/20">
                <strong className="text-xs font-bold text-fg block mb-1">4. الاستجابة التامة والأداء الخفيف</strong>
                <p className="text-xs text-fg-muted leading-relaxed">
                  تحميل فوري وتجاوب سلس عبر كافة الشاشات والأجهزة مع الحفاظ على مقروئية الخطوط العربية بدقة عالية.
                </p>
              </div>
            </div>
          </div>
        </div>
      );

    case 'usability-testing':
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl border border-border bg-canvas">
              <span className="text-3xl font-bold font-mono text-emerald-600 block mb-1">94.2%</span>
              <span className="text-xs font-bold text-fg block">معدل إنجاز المهام بنجاح</span>
              <span className="text-[11px] text-fg-subtle">عبر 16 مشاركاً في 4 سيناريوهات</span>
            </div>
            <div className="p-4 rounded-xl border border-border bg-canvas">
              <span className="text-3xl font-bold font-mono text-emerald-600 block mb-1">42s</span>
              <span className="text-xs font-bold text-fg block">متوسط زمن العثور على المورد</span>
              <span className="text-[11px] text-fg-subtle">مقارنة بـ 6 دقائق في البحث التقليدي</span>
            </div>
            <div className="p-4 rounded-xl border border-border bg-canvas">
              <span className="text-3xl font-bold font-mono text-emerald-600 block mb-1">88.5</span>
              <span className="text-xs font-bold text-fg block">مقياس سهولة الاستخدام SUS</span>
              <span className="text-[11px] text-fg-subtle">تصنيف ممتاز (Grade A+)</span>
            </div>
          </div>

          <div className="border border-border rounded-xl p-5 bg-canvas">
            <h4 className="text-xs font-bold text-fg mb-3">نتائج السيناريوهات الأربعة والملاحظات المنفذة</h4>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg border border-border bg-subtle/20">
                <div className="flex items-center justify-between mb-1">
                  <strong className="text-fg">السيناريو 1: البحث عن حزمة رواية ورش وتجربتها في Sandbox</strong>
                  <span className="text-emerald-600 font-bold font-mono">نجاح 100%</span>
                </div>
                <p className="text-fg-muted">أشاد المطورون بالفلترة السريعة وتوفير تجربة الاستدعاء الفوري داخل المتصفح.</p>
              </div>
              <div className="p-3 rounded-lg border border-border bg-subtle/20">
                <div className="flex items-center justify-between mb-1">
                  <strong className="text-fg">السيناريو 2: إصدار مفتاح API ونسخ نموذج كود Flutter</strong>
                  <span className="text-emerald-600 font-bold font-mono">نجاح 93.7%</span>
                </div>
                <p className="text-fg-muted">تمت إضافة زر نسخ الكود بنقرة واحدة مع تأكيد حركي استجابة لملاحظة المطورين.</p>
              </div>
              <div className="p-3 rounded-lg border border-border bg-subtle/20">
                <div className="flex items-center justify-between mb-1">
                  <strong className="text-fg">السيناريو 3: فحص شارة إتقان وفهم طبقات الفحص الأربع</strong>
                  <span className="text-emerald-600 font-bold font-mono">نجاح 91.2%</span>
                </div>
                <p className="text-fg-muted">تم تبسيط شرح الطبقات وإضافة بطاقة تفاعلية توضح متطلبات كل مستوى بشفافية.</p>
              </div>
              <div className="p-3 rounded-lg border border-border bg-subtle/20">
                <div className="flex items-center justify-between mb-1">
                  <strong className="text-fg">السيناريو 4: توثيق مورد جديد كناشر وربط رخصة المشاع الإبداعي</strong>
                  <span className="text-emerald-600 font-bold font-mono">نجاح 92%</span>
                </div>
                <p className="text-fg-muted">تم توفير مساعد خطوة بخطوة لاختيار رخصة المشاع الإبداعي المناسبة لحفظ الحقوق.</p>
              </div>
            </div>
          </div>
        </div>
      );

    case 'metrics-analytics':
      return (
        <div className="space-y-6">
          <div className="border border-border rounded-xl p-5 bg-canvas">
            <h4 className="text-xs font-bold text-fg mb-3">إطار HEART لقياس وتحسين تجربة المستخدم</h4>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-start">
              <div className="p-3 rounded-lg border border-border bg-subtle/20">
                <strong className="text-xs font-bold text-fg block mb-1">السعادة (Happiness)</strong>
                <p className="text-xs text-fg-muted">معدل تقييم المطورين للموارد (1-5 نجوم)، ومؤشر CSAT الفصلي {'>'} 90%.</p>
              </div>
              <div className="p-3 rounded-lg border border-border bg-subtle/20">
                <strong className="text-xs font-bold text-fg block mb-1">التفاعل (Engagement)</strong>
                <p className="text-xs text-fg-muted">عدد استدعاءات الـ API شهرياً، وعدد الموارد المحفوظة في المفضلة.</p>
              </div>
              <div className="p-3 rounded-lg border border-border bg-subtle/20">
                <strong className="text-xs font-bold text-fg block mb-1">التبني (Adoption)</strong>
                <p className="text-xs text-fg-muted">عدد المطورين الجدد الذين أصدروا مفتاح API خلال أول 7 أيام من التسجيل.</p>
              </div>
              <div className="p-3 rounded-lg border border-border bg-subtle/20">
                <strong className="text-xs font-bold text-fg block mb-1">الاحتفاظ (Retention)</strong>
                <p className="text-xs text-fg-muted">نسبة المطورين النشطين شهرياً (Monthly Active Developers {'>'} 70%).</p>
              </div>
              <div className="p-3 rounded-lg border border-border bg-subtle/20">
                <strong className="text-xs font-bold text-fg block mb-1">نجاح المهام (Task Success)</strong>
                <p className="text-xs text-fg-muted">زمن أول استدعاء ناجح للـ API ({'<'} 180s)، ومعدل فشل الطلبات ({'<'} 0.1%).</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border bg-subtle/30">
            <h4 className="text-xs font-bold text-fg mb-1.5">خطة التتبع والتحسين المستمر</h4>
            <p className="text-xs text-fg-muted leading-relaxed">
              تعتمد المنصة لوحات مراقبة تحليلية فورية للفرق الهندسية وللناشرين، مع حلقة تغذية راجعة دورية عبر استبيانات مدمجة غير متطفلة ومراجعة شهرية لأداء الموارد وسرعة الاستجابة لطلبات المطورين.
            </p>
          </div>
        </div>
      );

    default:
      return null;
  }
}

// PRD Document View Component
function PrdView() {
  return (
    <div className="bg-canvas border border-border rounded-2xl p-6 sm:p-10 shadow-xs text-start space-y-8">
      {/* Page Header (بعنوان) */}
      <div className="pb-6 border-b border-border/80">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-ratq-50 dark:bg-ratq-950 text-ratq-800 dark:text-ratq-300 text-xs font-mono font-bold mb-3 border border-ratq-200 dark:border-ratq-800">
          <span>وثيقة متطلبات المنتج (PRD)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-fg">
          وثيقة متطلبات مشروع «رَتْق» (Product Requirements Document)
        </h1>
        <p className="mt-2 text-sm text-fg-muted max-w-3xl leading-relaxed">
          المرجع الهندسي والتنفيذي الشامل للبنية التحتية البرمجية القرآنية، والمواصفات الفنية ومتطلبات الحوكمة والاعتماد.
        </p>
      </div>

      {/* Empty State: بدون محتوى + أيقونة لا يوجد محتوى للوثيقة حالياً وسيتم تجهيزه لاحقاً */}
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-dashed border-border bg-subtle/30 my-4">
        <div className="relative mb-4">
          <div className="w-16 h-16 rounded-2xl bg-ratq-50 dark:bg-ratq-950/60 border border-ratq-200/80 dark:border-ratq-900/60 flex items-center justify-center text-ratq-600 dark:text-ratq-400">
            <FileText className="w-8 h-8 opacity-80" />
          </div>
          <div className="absolute -bottom-1 -end-1 p-1 rounded-full bg-canvas border border-border text-amber-600 dark:text-amber-400 shadow-2xs">
            <Clock className="w-3.5 h-3.5" />
          </div>
        </div>

        <h3 className="text-base font-bold text-fg mb-1.5">
          لا يوجد محتوى للوثيقة حالياً
        </h3>
        <p className="text-xs text-fg-muted max-w-md leading-relaxed mb-4">
          سيتم تجهيزه لاحقاً إن شاء الله.
        </p>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-canvas text-fg-subtle text-[11px] font-mono border border-border">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          <span>قيد الإعداد والتجهيز • Under Preparation</span>
        </div>
      </div>
    </div>
  );
}

// User Stories View Component with 5 Roles Suite
interface RoleStoryItem {
  id: string;
  epic: string;
  screen: string;
  route: string;
  title: string;
  priority: 'must' | 'should' | 'could';
  priorityLabel: string;
  asA: string;
  iWant: string;
  soThat: string;
  acceptance: string[];
  techRules: string[];
  sla?: string;
}

interface RoleSuite {
  id: 'developer' | 'publisher' | 'reviewer' | 'moderator' | 'admin';
  name: string;
  dashboardName: string;
  route: string;
  icon: React.ElementType;
  badgeColor: string;
  activeColor: string;
  accentBg: string;
  description: string;
  permissions: string[];
  stories: RoleStoryItem[];
}

function UserStoriesView() {
  const [activeRoleId, setActiveRoleId] = useState<'developer' | 'publisher' | 'reviewer' | 'moderator' | 'admin'>('developer');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'must' | 'should' | 'could'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const ROLES_DATA: RoleSuite[] = [
    {
      id: 'developer',
      name: 'دور المطور',
      dashboardName: 'لوحة المطور (Developer Dashboard)',
      route: '/dashboard',
      icon: User,
      badgeColor: 'text-ratq-700 dark:text-ratq-300 bg-ratq-50 dark:bg-ratq-950 border-ratq-200 dark:border-ratq-800',
      activeColor: 'bg-ratq-700 text-white',
      accentBg: 'from-ratq-50/60 to-transparent dark:from-ratq-950/40',
      description: 'المطورون المستقلون والشركات والمؤسسات الوقفية الذين يقومون بدمج نصوص القرآن الكريم وتفاسيره وتلاواته وخطوطه في تطبيقات الويب والجوال والأنظمة الذكية.',
      permissions: ['إنشاء مفاتيح API', 'اختبار Sandbox', 'تقديم طلبات الوصول', 'مراقبة الحصص وRPM', 'إدارة خطافات الويب (Webhooks)'],
      stories: [
        {
          id: 'US-DEV-01',
          epic: 'إدارة المفاتيح والأمان (Key Lifecycle)',
          screen: 'لوحة المطور • شاشة المفاتيح',
          route: '/dashboard/keys',
          title: 'إنشاء مفاتيح API وتحديد نطاق الصلاحيات والتدوير الآمن',
          priority: 'must',
          priorityLabel: 'إلزامي (Must-Have)',
          asA: 'مطور تطبيقات قرآنية ويب وجوال',
          iWant: 'توليد مفاتيح API جديدة لبيئتي التجربة (Sandbox) والإنتاج (Production) مع تسمية كل مفتاح وتحديد نطاق الصلاحيات المقروءة وقيود النطاق',
          soThat: 'أتمكن من استدعاء خدمات رتق البرمجية في تطبيقي بأمان وفصل بيئة التطوير عن بيئة المستخدمين النهائيين دون تسريب الاعتمادات.',
          acceptance: [
            'توليد مفتاح آمن ببادئة دلالية (rq_test_ للتجربة و rq_live_ للإنتاج) يظهر كاملاً لمرة واحدة فقط للمطور مع زر نسخ فوري.',
            'تشفير وتجزئة المفتاح في قاعدة البيانات بـ Salted SHA-256، بحيث يظهر لاحقاً بالصيغة المقنعة (مثل: rq_live_••••••••3f8a).',
            'دعم تدوير المفتاح (Rotate Key) مع توفير فترة انتقال متداخلة مدتها 24 ساعة يعمل فيها المفتاحان معاً لمنع انقطاع خدمة التطبيق.',
            'تحديد قيود الأمان: حصر الاستدعاءات بنطاقات مسموحة (Allowed Domains / CORS) وعناوين IP محددة.',
            'إمكانية إلغاء أو تعطيل المفتاح فورياً بنقرة واحدة مع اشتراط تأكيد الإلغاء.'
          ],
          techRules: [
            'لا يُخزن المفتاح السري الخام أبداً في قاعدة البيانات؛ يُخزن الـ SHA-256 Hash فقط.',
            'يتم تسجيل كل عملية إنشاء أو إلغاء أو تدوير في سجل التدقيق الأمني (Audit Trail).'
          ],
          sla: 'توليد المفتاح فورياً في أقل من 500ms، والإلغاء نافذ لحظياً (Zero propagation delay).'
        },
        {
          id: 'US-DEV-02',
          epic: 'المراقبة والتحليلات (Telemetry & Metrics)',
          screen: 'لوحة المطور • نظرة عامة',
          route: '/dashboard',
          title: 'مراقبة معدلات الاستهلاك والحصص اللحظية ومعدل الطلب (RPM)',
          priority: 'must',
          priorityLabel: 'إلزامي (Must-Have)',
          asA: 'مطور يدمج واجهات رتق في تطبيق واسع الانتشار',
          iWant: 'لوحة استهلاك بصرية تعرض حجم الطلبات المستهلكة اليومية والشهرية، ومعدل الطلب بالدقيقة (RPM)، والحصة المتبقية',
          soThat: 'أضمن عدم تجاوز سقف الحصة المجانية أو الشريكة وتجنب تلقي مستخدمي تطبيقي لخطأ 429 (Too Many Requests).',
          acceptance: [
            'شريط تقدم ديناميكي للحصة اليومية والشهرية مع تلوين دلالي (أخضر < 70%، برتقالي 70-90%، أحمر > 90%).',
            'رسم بياني زمني لاستهلاك آخر 30 يوماً مقسم حسب المورد (نصوص، تفاسير، تلاوات، خطوط).',
            'تفصيل رموز الاستجابة (Status Codes: 200 OK, 400 Bad Request, 429 Rate Limited, 500 Server Error).',
            'إرسال تنبيه في واجهة اللوحة وعبر البريد الإلكتروني عند وصول الاستهلاك إلى 80% ثم 95% من سقف الحصة.'
          ],
          techRules: [
            'تتضمن استجابة الخادم الترويسات القياسية: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset.',
            'حساب الحصص عبر خوارزمية نافذة التمرير المنزلقة (Sliding Window Counter) في Redis/Supabase.'
          ],
          sla: 'تحديث مؤشرات الاستهلاك في اللوحة بزمن تأخير لا يتعدى 30 ثانية.'
        },
        {
          id: 'US-DEV-03',
          epic: 'الحوكمة ومسارات الوصول (Access Governance)',
          screen: 'لوحة المطور • طلبات الوصول',
          route: '/dashboard/requests',
          title: 'تقديم ومتابعة طلبات الوصول للموارد المقيدة برخص خاصة',
          priority: 'must',
          priorityLabel: 'إلزامي (Must-Have)',
          asA: 'مطور يحتاج الوصول لمورد قرآني مقيد برخصة خاصة أو موافقة مسبقة (مثل خطوط الرسم العثماني النادرة أو واجهات التلاوات عالية الجودة)',
          iWant: 'تقديم طلب وصول رسمي وتحديد طبيعة المشروع والجمهور المستهدف ونموذج الاستخدام ومتابعة مراحل اعتماده',
          soThat: 'أحصل على موافقة الناشر أو الهيئة الوقفية وإصدار صلاحيات الوصول الإنتاجية وفق الشروط المعيارية.',
          acceptance: [
            'نموذج تقديم طلب ميسر يتضمن: اسم التطبيق، الرابط، طبيعة المشروع (وقفي/خيري/تجاري)، تقدير الاستهلاك المتوقع، والتعهد بالامتثال لمعايير إتقان.',
            'خط زمني تفاعلي يعرض دورة حياة الطلب عبر مراحله (مسودة ← مُقدَّم ← قيد المراجعة ← طلب إيضاح ← معتمد ← نشط).',
            'إمكانية الرد على استفسارات المراجع أو الناشر ورفع ملفات إضافية في نفس صفحة الطلب.',
            'إشعار فوري وتوليد مفتاح مخصص تلقائياً عند تغيير حالة الطلب إلى "معتمد".'
          ],
          techRules: [
            'يربط الطلب بجدول access_requests مع توثيق هوية المطور وتاريخ التقديم.',
            'إتاحة حق استئناف الطلب المرفوض لمرة واحدة خلال 10 أيام مع تقديم مسوغات جديدة.'
          ],
          sla: 'إشعار استلام الطلب خلال 24 ساعة، وحد أقصى 5 أيام عمل لإصدار القرار النهائي من الناشر.'
        },
        {
          id: 'US-DEV-04',
          epic: 'تجربة المطور وسرعة التكامل (DX & Sandbox)',
          screen: 'الكتالوج • صفحات الموارد التفصيلية',
          route: '/resources/:id',
          title: 'تجربة الاستدعاء الحي في بيئة الـ Sandbox ونسخ شفرات الكود',
          priority: 'should',
          priorityLabel: 'هام (Should-Have)',
          asA: 'مطور واجهات يبحث عن تكامل سريع',
          iWant: 'تجربة استدعاء الـ API مباشرة داخل المتصفح مع تمرير المعاملات (رقم السورة، الآية، الرواية) ورؤية استجابة الـ JSON الخام الحقيقية',
          soThat: 'أتحقق من توافق بنية البيانات وصحة التشكيل وسلامة علامات الوقف قبل برمجة منطق التطبيق.',
          acceptance: [
            'وحدة تفاعلية لاختبار نقاط النهاية تتيح تجربة الاستدعاء بمفتاح Sandbox تلقائي دون الحاجة لتسجيل مسبق.',
            'إمكانية تخصيص المعاملات بسهولة عبر حقول إدخال منسدلة (اختيار السورة من 1 إلى 114، رقم الآية، نوع الرسم).',
            'عارض استجابة متقدم مع تلوين شفرة JSON، وحساب زمن الاستجابة (Latency بالملي ثانية)، وزر نسخ سريع.',
            'تبويب يعرض كود التكامل المماثل جاهزاً للاستخدام بـ 5 لغات وبيئات: (cURL, JavaScript/TypeScript, Python, Dart/Flutter, Swift).'
          ],
          techRules: [
            'خادم Sandbox معزول عن قاعدة البيانات الإنتاجية ويخدم نصوصاً مدققة ومثبتة مسبقاً (Mocked / Verified Snapshot).'
          ],
          sla: 'زمن معالجة واستجابة محاكي الـ Sandbox أقل من 150ms للطلبات الأحادية.'
        },
        {
          id: 'US-DEV-05',
          epic: 'التكامل الآلي والأنظمة الخلفية (Webhooks)',
          screen: 'لوحة المطور • الإعدادات المتقدمة',
          route: '/dashboard/settings',
          title: 'إدارة خطافات الويب (Webhooks) للاستماع لأحداث الموارد والموافقات',
          priority: 'should',
          priorityLabel: 'هام (Should-Have)',
          asA: 'مهندس بنية تحتية في منصة قرآنية',
          iWant: 'تسجيل روابط Webhook وتحديد الأحداث المراد الاستماع إليها (تحديث مورد، موافقة على طلب، اقتراب نفاد الحصة)',
          soThat: 'تتلقى خوادمنا الخلفية إشعارات فورية وتحدث قواعد بياناتها محلياً دون الحاجة لعمليات Polling دورية تستهلك الموارد.',
          acceptance: [
            'واجهة لإضافة رابط Webhook مع توليد مفتاح سر التوقيع (Signing Secret).',
            'تحديد دقيق للأحداث المشترك بها: resource.version_released, request.status_changed, quota.threshold_reached.',
            'زر "إرسال اختبار (Send Ping)" يرسل حدث تجريبي ويتحقق من استجابة خادم المطور برمز 200 OK.',
            'سجل بآخر 50 عملية تسليم مع تفاصيل Payload، ورمز الاستجابة، وزر لإعادة الإرسال اليدوي (Retry).'
          ],
          techRules: [
            'كل حمولة تُرسل مع ترويسة X-Ratq-Signature تحوي توقيع HMAC-SHA256 لمنع التلاعب.',
            'سياسة إعادة المحاولة التلقائية (Exponential Backoff): 3 محاولات على فترات 1m، 5m، 15m عند الفشل.'
          ],
          sla: 'تسليم إشعار الـ Webhook خلال أقل من ثانيتين من وقوع الحدث في المنظومة.'
        },
        {
          id: 'US-DEV-06',
          epic: 'إدارة المكتبات والاعتماديات (Saved & Watch)',
          screen: 'لوحة المطور • الموارد المحفوظة',
          route: '/dashboard/saved',
          title: 'حفظ الموارد في المفضلة وتفعيل الرقابة على الإصدارات الجديدة',
          priority: 'could',
          priorityLabel: 'تحسيني (Could-Have)',
          asA: 'مطور يحافظ على استقرار تطبيقاته في المتاجر',
          iWant: 'حفظ الموارد المستخدمة في قائمة مراقبة خاصة، وتلقي إشعارات عند صدور تحديثات أمنية أو تصحيحات علمية',
          soThat: 'أقوم بترقية حزم الـ SDK والبيانات القرآنية في تطبيقي فور اعتماد النسخ المحدثة دون تأخير.',
          acceptance: [
            'زر "حفظ في المفضلة" و"مراقبة الإصدارات (Watch)" في كل بطاقة مورد وصفحة تفصيلية.',
            'شاشة مخصصة تعرض الموارد المحفوظة مع إظهار رقم الإصدار الحالي المستخدم والإصدار الأحدث المتوفر (Latest Release).',
            'تمييز بصري للتحديثات: شارة حمراء للتصحيحات العلمية العاجلة، وشارة زرقاء للميزات والتحسينات البرمجية.',
            'إمكانية تصدير قائمة الموارد المحفوظة كملف manifest مهيكل.'
          ],
          techRules: [
            'ربط قائمة الحفظ بحساب المطور عبر جدول saved_resources مع دعم التصنيف بوسوم مخصصة.'
          ],
          sla: 'تحديث حالة الموارد المحفوظة فوري عند كل زيارة للصفحة.'
        }
      ]
    },
    {
      id: 'publisher',
      name: 'دور الناشر',
      dashboardName: 'بوابة الناشر (Publisher Portal)',
      route: '/publisher',
      icon: Layers,
      badgeColor: 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800',
      activeColor: 'bg-blue-700 text-white',
      accentBg: 'from-blue-50/60 to-transparent dark:from-blue-950/40',
      description: 'المراكز والمؤسسات القرآنية ودور النشر والمحققون وأصحاب المصاحف الرقمية الذين يملكون أصولاً برمجية ويرغبون في توثيقها ونشرها وإدارتها وفق معايير إتقان.',
      permissions: ['إدراج أصول وموارد', 'اعتماد طلبات المطورين وتحديد الحصص', 'إدارة الإصدارات الثابتة', 'مراقبة تحليلات الاستهلاك', 'إثبات ملكية الدار والنطاق'],
      stories: [
        {
          id: 'US-PUB-01',
          epic: 'إدراج وتوثيق الأصول (Asset Onboarding)',
          screen: 'بوابة الناشر • إضافة مورد جديد',
          route: '/publisher/resources/new',
          title: 'تسجيل مورد قرآني جديد وفق معالج الإدخال الرباعي المعتمد',
          priority: 'must',
          priorityLabel: 'إلزامي (Must-Have)',
          asA: 'ناشر أو ممثل مركز قرآني موثق',
          iWant: 'تسجيل أصل رقمي جديد عبر معالج إدخال مقسم إلى 4 خطوات متسلسلة تضمن تكامل البيانات العلمية والتقنية',
          soThat: 'يُدرج المورد في مسار الفحص والاعتماد تمهيداً لنشره في الكتالوج المعتمد بعد التيقن من سلامته.',
          acceptance: [
            'خطوة 1 (البيانات العامة): العنوان بالعربية والإنجليزية، التصنيف الرئيسي (مكتبة، SDK، مجموعة بيانات، خط)، الوصف الكامل، وروابط المستودع.',
            'خطوة 2 (التوثيق الشرعي والرواية): تحديد الرواية القرآنية، اسم المصحف الورقي المقابل وسنة طباعته، جهة الإسناد والتحقيق، وبصمة التجزئة SHA-256 للملفات.',
            'خطوة 3 (سياسة الوصول والترخيص): تحديد نوع الوصول (مفتوح / بمفتاح فوري / بموافقة مسبقة)، نوع رخصة الاستخدام، وسقف الحصة اليومية المقترحة.',
            'خطوة 4 (قائمة التحقق الذاتي لإتقان): استعراض متطلبات وسام إتقان المستهدف، والإقرار بمسؤولية سلامة النص.',
            'إمكانية حفظ التقدم كـ "مسودة (Draft)" في أي لحظة واستكمال الإدخال لاحقاً دون فقدان البيانات.'
          ],
          techRules: [
            'حقل بصمة التجزئة SHA-256 إلزامي للملفات ومجموعات البيانات لضمان عدم تغييرها بعد الاعتماد.',
            'فحص عدم تكرار اسم المورد مع الموارد الموجودة مسبقاً في قاعدة البيانات لمنع التشابه المضلل.'
          ],
          sla: 'مراجعة المورد الجديد وإرساله لطابور المحكمين خلال 24 ساعة من تاريخ التقديم.'
        },
        {
          id: 'US-PUB-02',
          epic: 'إدارة التراخيص والموافقات (Access Approvals)',
          screen: 'بوابة الناشر • طلبات الوصول',
          route: '/publisher/requests',
          title: 'إدارة واعتماد طلبات وصول المطورين وتخصيص الحصص التشغيلية',
          priority: 'must',
          priorityLabel: 'إلزامي (Must-Have)',
          asA: 'مسؤول الحوكمة والنشر في دار نشر قرآنية',
          iWant: 'استعراض طلبات المطورين الراغبين في استخدام موارد المركز، والموافقة عليها أو رفضها أو طلب إيضاحات وتحديد حصص الاستهلاك اليومية',
          soThat: 'أحمي الأصول الوقفية للمركز وأضمن توظيفها في تطبيقات ملتزمة بآداب التعامل مع القرآن الكريم والشروط الوقفية.',
          acceptance: [
            'جدول يعرض الطلبات الواردة مع فلاتر حسب الحالة (معلق، معتمد، مرفوض، طلب تعديل) والمورد المستهدف.',
            'بطاقة تفصيلية لكل طلب تعرض: اسم التطبيق، رابط المعاينة، الوصف التشغيلي، وخطة الاستهلاك اليومية.',
            'زر "اعتماد (Approve)" مع إمكانية تحديد سقف استهلاك مخصص (Custom Quota: مثلاً 100,000 استدعاء/يوم).',
            'زر "طلب تعديلات (Request Changes)" يتيح كتابة رسالة توجيهية للمطور وتعليق المهلة مؤقتاً لحين الرد.',
            'زر "رفض (Reject)" يشترط كتابة سبب مسبب ومقنع يُسجل في ملف الطلب وسجل التدقيق.'
          ],
          techRules: [
            'فور الاعتماد، يصدر النظام مفتاح إنتاج آلي للمطور ويرسله مشفراً إلى لوحة تحكمه دون حاجة لأي تدخل يدوي.',
            'إشعار المطور فورياً عبر البريد واللوحة بقرار الناشر.'
          ],
          sla: 'التزام الناشر بالرد على الطلبات المعلقة خلال مهلة قصوى قدرها 5 أيام عمل وفق ميثاق المنصة.'
        },
        {
          id: 'US-PUB-03',
          epic: 'إدارة الإصدارات والجودة (Release Immutability)',
          screen: 'بوابة الناشر • الموارد المنشورة',
          route: '/publisher/resources',
          title: 'إدارة دورة حياة الإصدارات والتجميد غير القابل للتراجع (Immutability)',
          priority: 'must',
          priorityLabel: 'إلزامي (Must-Have)',
          asA: 'ناشر يقوم بتحديث مكتبة أو مجموعة بيانات قرآنية',
          iWant: 'إطلاق إصدار جديد (Semantic Release) مع كتابة سجل تغييرات دقيق وبصمة SHA-256 جديدة، مع تجميد الإصدارات السابقة تماماً',
          soThat: 'تستفيد التطبيقات من التحسينات الجديدة مع ضمان بقاء واستقرار التطبيقات القديمة المعتمدة على الإصدار السابق دون انهيار.',
          acceptance: [
            'نموذج لإضافة إصدار جديد يتطلب: رقم الإصدار (مثل v2.1.0)، ملخص التغييرات (Changelog)، وتحديد إذا كان التحديث يتضمن تصحيحاً لنص قرآني.',
            'علامة "تعديل حرج (Breaking Change)" تتطلب موافقة المراجعين قبل إتاحة الإصدار كإصدار افتراضي.',
            'حظر حذف أي إصدار قديم تم ربطه بتطبيقات نشطة، مع إتاحة وسمه بـ "متقاعد (Deprecated)" مع مهلة إشعار للمطورين مدتها 6 أشهر.',
            'إظهار سجل النسخ الكامل والمستقر في بطاقة المورد العامة.'
          ],
          techRules: [
            'قاعدة عدم التراجع (Version Immutability): سجلات الإصدارات غير قابلة للحذف أو التعديل المباشر في قاعدة البيانات (Immutability Enforced by DB trigger).'
          ],
          sla: 'نشر الإصدار الفرعي التحديثي المعتمد خلال 5 دقائق بعد اجتياز الفحوص الآلية.'
        },
        {
          id: 'US-PUB-04',
          epic: 'تقارير الأثر والتحليلات (Impact & Analytics)',
          screen: 'بوابة الناشر • التحليلات والإحصائيات',
          route: '/publisher/analytics',
          title: 'استعراض تحليلات الاستهلاك والجهات المستفيدة وتقارير الأثر الرقمي',
          priority: 'should',
          priorityLabel: 'هام (Should-Have)',
          asA: 'مدير مركز وقفي مسؤول أمام مجلس الأمناء والمانحين',
          iWant: 'لوحة تحليلات تفصيلية توضح عدد التطبيقات المستفيدة، وإجمالي الاستدعاءات الشهرية، والتوزيع الجغرافي للمستخدمين',
          soThat: 'أقدم تقارير موثقة بالأرقام تثبت انتشار وأثر الأصول القرآنية التي ينتجها المركز في خدمة الأمة الإسلامية.',
          acceptance: [
            'بطاقات مؤشرات رئيسية: إجمالي المطورين النشطين، إجمالي استدعاءات الـ API، حجم نقل البيانات (GB)، ونسبة التوفر التشغيلي (Uptime 99.9%).',
            'رسم بياني تفاعلي يوضح معدل الاستهلاك بمرور الوقت مع خيارات التصفية (يومي، أسبوعي، شهري، سنوي).',
            'قائمة بأكثر 10 تطبيقات ومنصات استهلاكاً للمورد مع تفاصيل رخصتها.',
            'زر تصدير التقرير التنفيذي بصيغة PDF أنيقة مجهزة للعرض على مجالس الإدارة ولجان الأوقاف.'
          ],
          techRules: [
            'تجمع الإحصائيات عبر جداول تلخيصية دورية (Materialized Rollups) كل ساعة لتسريع استجابة الصفحة مع الحفاظ على سرية مستخدمي التطبيقات.'
          ],
          sla: 'تحديث بيانات الاستهلاك التحليلية كل 60 دقيقة.'
        },
        {
          id: 'US-PUB-05',
          epic: 'الموثوقية والتحقق المؤسسي (Domain Verification)',
          screen: 'بوابة الناشر • التحقق من الهوية',
          route: '/publisher/claim',
          title: 'إثبات ملكية الدار وتوثيق النطاق الرسمي للحصول على شارة التوثيق',
          priority: 'should',
          priorityLabel: 'هام (Should-Have)',
          asA: 'مؤسسة أو دار نشر قرآنية معتمدة',
          iWant: 'تقديم طلب لإثبات ملكية الحساب والصفحة المؤسسية وتوثيق النطاق الرسمي عبر سجل DNS TXT أو رفع وثائق الاعتماد الحكومية',
          soThat: 'تحصل دار النشر على شارة "ناشر معتمد موثق (Verified Publisher)" في الكتالوج وتكتسب موثوقية عالية لدى المطورين والمستخدمين.',
          acceptance: [
            'خيار التحقق الفوري من النطاق عبر إضافة سجل TXT في نظام أسماء النطاقات (DNS) الخاص بالمؤسسة مع زر "تحقق الآن".',
            'خيار رفع الوثائق الرسمية (ترخيص النشر، السجل الوقفي أو التجاري، خطاب تفويض رسمي).',
            'خط زمني يوضح حالة طلب التوثيق (قيد التدقيق، مطلوب وثائق إضافية، تم التحقق).',
            'منح شارة التوثيق الزرقاء تلقائياً على اسم الناشر وجميع موارده بعد اعتماد إدارة المنصة.'
          ],
          techRules: [
            'فحص سجل الـ DNS يتم آلياً عبر استعلام DNS TXT lookup على نطاق المؤسسة المسجل.',
            'حظر تسليم إدارة الموارد الحساسة إلا بعد مصادقة ثنائية من مدير النظام.'
          ],
          sla: 'فحص طلبات التوثيق المؤسسية والبت فيها خلال يومي عمل.'
        }
      ]
    },
    {
      id: 'reviewer',
      name: 'دور المراجع',
      dashboardName: 'لوحة المراجع (Reviewer Dashboard)',
      route: '/review',
      icon: CheckCircle,
      badgeColor: 'text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800',
      activeColor: 'bg-cyan-700 text-white',
      accentBg: 'from-cyan-50/60 to-transparent dark:from-cyan-950/40',
      description: 'أعضاء اللجان العلمية والشرعية والخبراء التقنيون المكلفون بالتدقيق الصارم للنص القرآني والرسم العثماني وتقييم استيفاء معايير أوسمة إتقان الأربعة.',
      permissions: ['استلام طابور التدقيق', 'مقارنة الرسم العثماني Diff', 'تقييم قائمة إتقان الموزونة', 'إصدار شهادات الاعتماد أو طلب تصحيحات'],
      stories: [
        {
          id: 'US-REV-01',
          epic: 'طابور التحكيم والفرز (Queue Management)',
          screen: 'لوحة المراجع • طابور الطلبات',
          route: '/review',
          title: 'إدارة طابور المراجعة العلمية وتوزيع المهام حسب الاختصاص والمهلة',
          priority: 'must',
          priorityLabel: 'إلزامي (Must-Have)',
          asA: 'محقق علمي وعضو في لجنة التدقيق والاعتماد',
          iWant: 'استعراض طابور الطلبات المعلقة المصنفة حسب الأولوية، ومستوى إتقان المطلوب، والرواية القرآنية، وتاريخ التقديم',
          soThat: 'أختار الطلبات ضمن اختصاصي العلمي وأبدأ فحصها لضمان سرعة معالجة طلبات الناشرين والالتزام بـ SLA المنصة.',
          acceptance: [
            'جدول تفاعلي لطابور المراجعة يوضح: اسم المورد، الناشر، نوع الأصل، الرواية القرآنية، مستوى إتقان المطلوب، وتاريخ المهلة المتبقية (SLA Countdown).',
            'زر "استلام المهمة (Claim for Review)" لتعيين الطلب للمراجع وحجزه لمنع التضارب بين أعضاء اللجنة العلمية.',
            'فلاتر متقدمة حسب نوع المورد (بيانات، خط، صوتيات، محرك بحث) واللغة والرواية.',
            'مؤشر تنبيهي للطلبات التي أوشكت مهلة الـ SLA الخاصة بها على النفاد (أقل من 48 ساعة).'
          ],
          techRules: [
            'عند استلام المهمة، يُقفل الطلب للمراجع لمدة 72 ساعة، وإذا لم يُبت فيه يعود تلقائياً لطابور الانتظار العام.',
            'تسجيل اسم المحقق وتاريخ الاستلام في جدول review_assignments.'
          ],
          sla: 'حد أقصى 5 أيام عمل لإنجاز المراجعة وإصدار التقرير العلمي للطلب.'
        },
        {
          id: 'US-REV-02',
          epic: 'سلامة وقدسية النص القرآني (Sacred Text Audit)',
          screen: 'لوحة المراجع • شاشة تدقيق المورد',
          route: '/review/:id',
          title: 'التدقيق البصري والآلي للنص القرآني والرسم العثماني وعلامات الوقف',
          priority: 'must',
          priorityLabel: 'إلزامي (Must-Have)',
          asA: 'متخصص في علوم المصحف والقراءات والرسم العثماني',
          iWant: 'أداة تدقيق بصرية مدمجة تقارن نصوص وتشكيل المورد بنصوص المصحف المرجعي المعتمد وتكشف أي اختلاف في الأحرف أو الحركات أو علامات الوقف',
          soThat: 'أجزم بسلامة الأصل الرقمي ومطابقته المطلقة للرواية المعتمدة قبل منحه أي اعتماد ومنع أي تحريف.',
          acceptance: [
            'عارض مقارنة نصوص متقدم (Diff Viewer) يبرز أي اختلاف بالألوان (أحمر للنقص، أخضر للزيادة، أصفر لتفاوت التشكيل).',
            'فحص ومطابقة علامات ضبط المصحف: علامات السكون، التنوين المتابع والمتراكب، حركات الإقلاب، وعلامات الوقف الست (مـ، لا، ج، ز، صلي، قلي).',
            'التحقق التلقائي من بصمة الـ Checksum (SHA-256) للملفات المدققة ومطابقتها للسجل المرفق.',
            'خانة لتوثيق رقم النسخة الورقية المعتمدة التي قورن بها المورد (مثل مصحف مجمع الملك فهد، طبعة 1445هـ، برواية حفص عن عاصم).'
          ],
          techRules: [
            'أي خطأ في نص الآية أو تشكيلها يمنع الاعتماد ويصنف تلقائياً كـ Critical Blocker.',
            'حظر قبول أي مورد يعتمد على نماذج الذكاء الاصطناعي التوليدي في إنتاج النص القرآني (Zero-AI Hallucination Policy).'
          ],
          sla: 'مطابقة نصوص السور الـ 114 آلياً مع كشف الفروق خلال أقل من 3 ثوانٍ.'
        },
        {
          id: 'US-REV-03',
          epic: 'تقييم معايير الجودة (Itqan Rubric Scoring)',
          screen: 'لوحة المراجع • نموذج التدقيق المعياري',
          route: '/review/:id',
          title: 'تقييم مصفوفة معايير وسام «إتقان» واحتساب النسبة المئوية آلياً',
          priority: 'must',
          priorityLabel: 'إلزامي (Must-Have)',
          asA: 'محكم معتمد لمنظومة رتق',
          iWant: 'نموذج تدقيق رقمي موحد يحتوي على معايير أوسمة إتقان الموزونة مقسمة حسب الفئات (النص، التوثيق، الاستقرار، التراخيص)',
          soThat: 'أقوم بتقييم كل معيار على حدة وحساب النسبة المئوية المكتسبة آلياً لتحديد الوسام المستحق بموضوعية وشفافية.',
          acceptance: [
            'استعراض المعايير المرمزة (مثل: C-BAS-01 إلى C-BAS-07 للأساسي، C-VER-01 للمحقق، C-CER-01 للمعتمد، C-GLD-01 للذهبي).',
            'خيارات التقييم لكل معيار: (مستوفى Pass / غير مستوفى Fail / غير منطبق N/A).',
            'حقل إلزامي لإضافة الملاحظات التوجيهية وتوثيق طريقة التحقق عند وضع علامة "غير مستوفى".',
            'شريط حساب لحظي يعرض الدرجة المكتسبة الإجمالية والوسام المستحق بناءً على النسبة والشروط الإلزامية المستوفاة.'
          ],
          techRules: [
            'وجود أي شرط إلزامي (Mandatory Criteria: مثل حظر التحريف أو غياب الإسناد) غير مستوفى يمنع منح الوسام أياً كانت النسبة المئوية الإجمالية.',
            'حساب الدرجات يتم بخوارزمية الأوزان المعتمدة في مصفوفة إتقان.'
          ],
          sla: 'احتساب التقييم لحظي عند وضع علامات التحقق.'
        },
        {
          id: 'US-REV-04',
          epic: 'الاعتماد والتقارير العلمية (Decision Dispatch)',
          screen: 'لوحة المراجع • اتخاذ القرار النهائي',
          route: '/review/:id',
          title: 'إصدار قرار الاعتماد الرسمي وتوليد شهادة إتقان أو تقرير التصحيحات',
          priority: 'must',
          priorityLabel: 'إلزامي (Must-Have)',
          asA: 'عضو لجنة التحكيم العلمي',
          iWant: 'تسجيل القرار النهائي وتصدير تقرير الاعتماد الرقمي أو إرسال تقرير الملاحظات التصحيحية للناشر',
          soThat: 'يتلقى الناشر إفادة علمية مفصلة وموثقة توضح سبب القرار والخطوات اللازمة للارتقاء بجودة مورده.',
          acceptance: [
            'ثلاثة مسارات واضحة للقرار: 1. اعتماد ومنح الشارة، 2. طلب تعديلات وملاحظات مع مهلة 14 يوماً، 3. رفض معلل.',
            'خيار الاعتماد يولد شهادة إتقان رقمية موثقة برقم مرجعي فريد وبصمة رقمية تضاف لبطاقة المورد العامة.',
            'خانة للتوقيع الرقمي للمراجع أو اسم اللجنة المعتمدة وتاريخ المصادقة.',
            'إشعار فوري للناشر بالبريد الإلكتروني وبلوحة التحكم مرفقاً به التقرير الكامل بصيغة PDF.'
          ],
          techRules: [
            'حفظ التقرير والقرار في سجل الشفافية والتدقيق غير القابل للإلغاء (Immutable Review Ledger).',
            'تحديث شارة إتقان للمورد فورياً في قاعدة البيانات والكتالوج العام.'
          ],
          sla: 'توليد شهادة الاعتماد وإشعار الناشر خلال أقل من دقيقة من اعتماد القرار.'
        }
      ]
    },
    {
      id: 'moderator',
      name: 'دور المشرف',
      dashboardName: 'لوحة الإشراف (Moderation Dashboard)',
      route: '/moderation',
      icon: Shield,
      badgeColor: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800',
      activeColor: 'bg-amber-700 text-white',
      accentBg: 'from-amber-50/60 to-transparent dark:from-amber-950/40',
      description: 'مشرفو النزاهة والحوكمة والسلامة المكلفون بالاستجابة لبلاغات الأخطاء القرآنية، ومكافحة إساءة استخدام الـ API، والتحكيم العادل بين المطورين والناشرين.',
      permissions: ['معالجة البلاغات المصنفة', 'التجميد الاحترازي (Circuit Breaker)', 'مراقبة هجمات الاستنزاف والخنق', 'التحكيم وفض النزاعات'],
      stories: [
        {
          id: 'US-MOD-01',
          epic: 'الرقابة وحل البلاغات (Incident Governance)',
          screen: 'لوحة الإشراف • طابور البلاغات',
          route: '/moderation',
          title: 'إدارة ومعالجة بلاغات المجتمع والمطورين وفق سلم الأولويات والخطورة',
          priority: 'must',
          priorityLabel: 'إلزامي (Must-Have)',
          asA: 'مشرف سلامة المنصة والامتثال',
          iWant: 'لوحة مركزية تصنف البلاغات الواردة من المستخدمين حول وجود خطأ نصي، أو انتهاك حقوق ملكية، أو استغلال مسيء للـ API',
          soThat: 'أفحص البلاغ بسرعة وأتخذ الإجراء الاحترازي أو أحيله للناشر والمراجع المختص لحماية قدسية المنصة.',
          acceptance: [
            'تصنيف تلقائي للبلاغات حسب درجة الخطورة: حرجة (خطأ قرآني - مهلة 4 ساعات)، متوسطة (انتهاك ترخيص أو تعطل)، عادية (أخطاء وصفية وتوثيقية).',
            'فحص الأدلة واللقطات المرفقة مع البلاغ وسجل المحادثة ورابط المورد المعني.',
            'خيارات المعالجة: قبول البلاغ وبدء التحقيق، إحالة للجنة العلمية، أو حفظ البلاغ لعدم الصحة مع تسبيب واضح للمبلّغ.',
            'إشعار المبلّغ بنتيجة فحص البلاغ للحفاظ على الشفافية المجتمعية.'
          ],
          techRules: [
            'بلاغات الأخطاء القرآنية تصعد فورياً وتُرسل تنبيهات عاجلة للجنة العلمية عبر قنوات الطوارئ (Emergency Broadcast).'
          ],
          sla: 'الاستجابة للبلاغات الحرجة خلال 4 ساعات كحد أقصى، والبلاغات العادية خلال 48 ساعة.'
        },
        {
          id: 'US-MOD-02',
          epic: 'حراسة القدسية والسلامة (Safety & Circuit Breaking)',
          screen: 'لوحة الإشراف • إجراءات الطوارئ',
          route: '/moderation',
          title: 'التجميد الاحترازي للموارد المشبوهة وقاطع الدائرة الآمن (Circuit Breaker)',
          priority: 'must',
          priorityLabel: 'إلزامي (Must-Have)',
          asA: 'مشرف يواجه بلاغاً مؤكداً عن خطأ جسيم في مورد قرآني نشط',
          iWant: 'صلاحية التجميد الفوري للمورد وتعليق استدعاءات الـ API الخاصة به بنقرة واحدة (Circuit Breaker)',
          soThat: 'أوقف انتشار النص المغلوط أو الخلل في التطبيقات المستفيدة فوراً لحين اكتمال التحقيق والتصحيح.',
          acceptance: [
            'زر تجميد احترازي (Quarantine) يتطلب كتابة سبب التجميد واختيار مستوى التعليق (إخفاء من الكتالوج فقط، أو إيقاف الـ API بالكامل).',
            'تغيير حالة المورد في الكتالوج فورياً إلى "معلق مؤقتاً (Suspended)" مع شريط تنبيهي واضح للمستخدمين.',
            'إشعار فوري لجميع المطورين المرتبطين بالمورد يوضح سبب التجميد المؤقت والبدائل المتاحة.',
            'إتاحة رفع التجميد وإعادة التفعيل بعد مراجعة المصلحات من اللجنة العلمية.'
          ],
          techRules: [
            'التجميد يطلق حدث Webhook فوري: resource.quarantined لإشعار الأنظمة المتصلة بالتوقف المؤقت.',
            'توثيق الإجراء في سجل التدقيق الأمني مع اسم المشرف والتوقيت الدقيق.'
          ],
          sla: 'تنفيذ التجميد وتعطيل استدعاءات الـ API خلال أقل من ثانية واحدة من نقر الزر.'
        },
        {
          id: 'US-MOD-03',
          epic: 'الأمن ومكافحة التعدي (Abuse & Throttling)',
          screen: 'لوحة الإشراف • مراقبة الشبكة',
          route: '/moderation',
          title: 'رصد إساءة الاستخدام وهجمات الاستنزاف وتطبيق الخنق المؤقت (Throttling)',
          priority: 'should',
          priorityLabel: 'هام (Should-Have)',
          asA: 'مشرف أمن وسلامة البنية التحتية',
          iWant: 'مراقبة حية لاكتشاف محاولات استنزاف الخوادم (Scraping Attacks)، أو استخدام مفاتيح API في بيئات مشبوهة أو تطبيقات مسيئة',
          soThat: 'أتدخل لتطبيق قيود خنق فورية (Throttling) أو تجميد المفاتيح المتعدية وحماية موارد المنصة.',
          acceptance: [
            'رصد الأنماط الشاذة: استدعاءات مكثفة متكررة تتجاوز السقف، استدعاء مفاتيح من دول غير معتادة، تكرار أخطاء المصادقة 401.',
            'أدوات خفض السقف الفوري أو الحظر بالنطاق IP أو النطاق الجغرافي بنقرة واحدة.',
            'إرسال إشعار تحذيري لحساب المطور عبر البريد يوضح طبيعة السلوك المرصود ويمنحه مهلة 24 ساعة للتوضيح.',
            'سجل تفصيلي بالحسابات والمفاتيح المعلقة مع إمكانية فك التعليق بعد التحقق.'
          ],
          techRules: [
            'تكامل مع جدار الحماية وقواعد Rate Limiter لتطبيق الحظر على مستوى شبكة الـ Edge فورياً.'
          ],
          sla: 'اكتشاف الأنماط المشبوهة وإطلاق التنبيهات في أقل من دقيقتين من بدء النشاط غير الطبيعي.'
        },
        {
          id: 'US-MOD-04',
          epic: 'العدالة والحوكمة الوقفية (Dispute Resolution)',
          screen: 'لوحة الإشراف • إدارة النزاعات',
          route: '/moderation',
          title: 'التحكيم في نزاعات المطورين والناشرين حول طلبات الوصول والتراخيص',
          priority: 'could',
          priorityLabel: 'تحسيني (Could-Have)',
          asA: 'مشرف تحكيم معتمد',
          iWant: 'مسار عمل موحد لاستقبال استئنافات المطورين الذين رُفضت طلبات وصولهم لخدمات الوقف دون تسبيب كافٍ من الناشر',
          soThat: 'أقوم بمراجعة حيثيات الطلب والتحكيم العادل بين الطرفين بما يحقق المصلحة العامة وينعش الابتكار القرآني دون الإضرار بحقوق الناشر.',
          acceptance: [
            'استعراض ملف النزاع شاملاً: طلب المطور، أسباب رفض الناشر، والشروط الوقفية للمورد.',
            'إمكانية التواصل المشترك بين الطرفين في مسار تدقيق محمي داخل المنصة.',
            'إصدار قرار تحكيمي ملزم: (إلزام الناشر بمنح الوصول، تأييد قرار الرفض لعدم أهلية التطبيق، أو تقديم توصية بتعديل الترخيص).',
            'أرشفة كافة قرارات التحكيم في سجل القضايا المعيارية لتكون مرجعاً للحالات المشابهة.'
          ],
          techRules: [
            'حفظ كافة المراسلات وقرارات التحكيم في جدول disputes مع إتاحة الرجوع إليها عند التدقيق.'
          ],
          sla: 'الفصل في النزاعات المعروضة خلال مدة أقصاها 10 أيام عمل.'
        }
      ]
    },
    {
      id: 'admin',
      name: 'دور المدير',
      dashboardName: 'لوحة الإدارة (System Admin Console)',
      route: '/admin',
      icon: Settings,
      badgeColor: 'text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800',
      activeColor: 'bg-purple-700 text-white',
      accentBg: 'from-purple-50/60 to-transparent dark:from-purple-950/40',
      description: 'الإدارة العليا للنظام والبنية التحتية، المسؤولة عن أمن المنظومة، وإدارة صلاحيات RBAC، وسجلات التدقيق غير القابلة للتلاعب، وسياسات الحوكمة وضبط المعايير.',
      permissions: ['إدارة الأدوار والصلاحيات (RBAC)', 'السحب الفوري العام (Revocations)', 'مراجعة سجل التدقيق WORM', 'مراقبة توفر النظام والـ SLAs', 'تعديل سياسات وأوزان إتقان'],
      stories: [
        {
          id: 'US-ADM-01',
          epic: 'حوكمة الهوية والصلاحيات (Identity & Access)',
          screen: 'لوحة الإدارة • المستخدمون والصلاحيات',
          route: '/admin/users',
          title: 'إدارة حسابات المستخدمين والأدوار والتحكم بالوصول المبني على الدور (RBAC)',
          priority: 'must',
          priorityLabel: 'إلزامي (Must-Have)',
          asA: 'مدير عام للنظام (Super Admin)',
          iWant: 'إدارة كافة حسابات المستخدمين وترقية الأدوار (مطور، ناشر، مراجع، مشرف، مدير) وتخصيص الصلاحيات الدقيقة',
          soThat: 'أضمن تشغيل المنصة وفق مبدأ أقل الصلاحيات المطلوبة (Principle of Least Privilege) ومنع أي وصول غير مصرح به للمهام الحساسة.',
          acceptance: [
            'جدول مستخدمين شامل مع بحث فوري، فلترة حسب الدور وحالة الحساب (نشط، معلق، بانتظار التحقق).',
            'نافذة تعديل الدور تتيح تعيين صلاحيات مخصصة (مثل: تعيين مراجع لرواية معينة، أو مشرف فئة بيانات فقط).',
            'فرض التحقق الثنائي الإلزامي (Enforced 2FA) لجميع الحسابات الإدارية والمحكمين.',
            'خيار تجميد أو إلغاء تنشيط أي حساب فورياً مع إنهاء جميع جلسات الدخول النشطة (Revoke Sessions).'
          ],
          techRules: [
            'حماية صلاحيات المدير العام بقاعدة المصادقة المزدوجة (Two-Person Approval) لترقية مدير جديد.',
            'تطبيق سياسات Row-Level Security (RLS) صارمة في قاعدة البيانات تعتمد على الدور role الصادر في JWT.'
          ],
          sla: 'سريان تعديلات الصلاحيات فورياً خلال أقل من 1 ثانية.'
        },
        {
          id: 'US-ADM-02',
          epic: 'إدارة الأصول والكتالوج المركزي (Catalog Oversight)',
          screen: 'لوحة الإدارة • إدارة الموارد',
          route: '/admin/resources',
          title: 'الرقابة الشاملة على الكتالوج وإجراءات السحب الإلزامي العام (Revocations)',
          priority: 'must',
          priorityLabel: 'إلزامي (Must-Have)',
          asA: 'مدير المنصة',
          iWant: 'لوحة تحكم مركزية تمكنني من استعراض كافة الموارد وتعديل بياناتها وإجراء سحب دائم (Revocation) لأي مورد مخل بالمعايير',
          soThat: 'أحافظ على مصداقية المنصة وحماية المنظومة القرآنية من أي مورد يثبت عدم موثوقيته أو تحريفه.',
          acceptance: [
            'استعراض جميع موارد الكتالوج عبر كافة الحالات (منشور، مسودة، قيد التدقيق، معلق، مسحوب).',
            'إمكانية تثبيت الموارد المتميزة في الواجهة الرئيسية (Toggle Featured) وتعديل التصنيفات الرئيسية والفرعية.',
            'إجراء السحب النهائي (Revoke Resource) مع إصدار "بيان سحب عام" يوثق رقم السحب وتاريخه والسبب في صفحة التراجع العامة.',
            'تعطيل كافة مفاتيح الـ API المرتبطة بالمورد المسحوب فورياً مع إعادة توجيه الاستدعاءات إلى رمز 410 Gone.'
          ],
          techRules: [
            'بيانات السحب تُنشر تلقائياً في صفحة /standards/revocations التزاماً بالشفافية الكاملة لمنظومة إتقان.'
          ],
          sla: 'تنفيذ السحب وحجب المورد من كافة الواجهات فورياً (Instant Propagation).'
        },
        {
          id: 'US-ADM-03',
          epic: 'الأمان والامتثال والمساءلة (Audit & Compliance)',
          screen: 'لوحة الإدارة • سجل التدقيق الأمني',
          route: '/admin/audit',
          title: 'سجل التدقيق الأمني الشامل والشفافية غير القابل للتلاعب (Immutable WORM Ledger)',
          priority: 'must',
          priorityLabel: 'إلزامي (Must-Have)',
          asA: 'مسؤول الأمن السيبراني والامتثال المؤسسي',
          iWant: 'سجل تدقيق أمني غير قابل للحذف أو التعديل (Append-Only Immutable Ledger) يسجل كل عملية حساسة تجري في المنصة',
          soThat: 'أضمن المساءلة التامة وأتمكن من إجراء التحقيقات الجنائية الرقمية وإثبات سلامة وموثوقية النظام أمام الهيئات الرقابية.',
          acceptance: [
            'جدول زمني تفصيلي يعرض: اسم الحدث، معرف المنفّذ وبريده، نوع الكيان المتأثر، عنوان IP، الطابع الزمني بالثواني، وحالة التنفيذ (نجاح / فشل).',
            'تغطية شاملة لجميع الأحداث الحساسة: (تسجيل دخول، إصدار مفتاح، تدوير مفتاح، منح وسام إتقان، تعديل دور مستخدم، تجميد مورد).',
            'فلاتر متقدمة حسب نطاق الحدث (AUTH, KEYS, BADGES, RESOURCES, USERS) والفترة الزمنية.',
            'إمكانية تصدير السجل بصيغ مشفرة وموقعة رقمياً (JSON / CSV) لفرق التدقيق والمراجعة الخارجية.'
          ],
          techRules: [
            'جدول audit_logs محمي ضد أي عمليات UPDATE أو DELETE عبر قاعدة بيانات PostgreSQL Triggers لمنع محو الآثار.'
          ],
          sla: 'تسجيل الحدث في سجل التدقيق خلال أقل من 10ms من وقوعه.'
        },
        {
          id: 'US-ADM-04',
          epic: 'المراقبة التشغيلية والاستقرار (Observability & SLOs)',
          screen: 'لوحة الإدارة • لوحة المؤشرات المركزية',
          route: '/admin',
          title: 'مراقبة صحة النظام ومؤشرات الـ SLA العامة وتوفر الخدمات (99.9% Uptime)',
          priority: 'should',
          priorityLabel: 'هام (Should-Have)',
          asA: 'المدير التقني للمنصة (CTO)',
          iWant: 'لوحة مراقبة تشغيلية حية ترصد أداء الخوادم، وزمن الاستجابة، ونسبة التوفر (Uptime 99.9%)، ومعدل إنجاز طوابير المراجعة',
          soThat: 'أرصد أي اختناقات تشغيلية أو انخفاض في مستوى الخدمة وأتدخل استباقياً لضمان استقرار البنية التحتية القرآنية.',
          acceptance: [
            'بطاقات مراقبة المكونات الأساسية: خوادم الـ Edge API، قاعدة البيانات الرئيسية، محرك البحث النصي والهجين، وبوابة المصادقة.',
            'رسوم بيانية توضح زمن الاستجابة (P50, P95, P99 بالملي ثانية) ومعدل الطلبات في الثانية (RPS).',
            'مؤشر التزام المراجعين والناشرين بـ SLAs الرد على الطلبات (نسبة الالتزام بالمهلة المحددة).',
            'تكامل مع نظام التنبيهات لإرسال إشعارات طارئة للمهندسين المناوبين عند انخفاض نسبة التوفر عن 99.9%.'
          ],
          techRules: [
            'مؤشرات الأداء تُجمع من خوادم التشغيل وتُعرض في لوحة الحالة العامة /status.'
          ],
          sla: 'تحديث مؤشرات التوفر والأداء كل 15 ثانية على مدار الساعة.'
        },
        {
          id: 'US-ADM-05',
          epic: 'الحوكمة وضبط المعايير (Platform Governance)',
          screen: 'لوحة الإدارة • الإعدادات الحوكمية',
          route: '/admin',
          title: 'ضبط السياسات العامة وأوزان منظومة «إتقان» وإدارة شرائح الحصص',
          priority: 'could',
          priorityLabel: 'تحسيني (Could-Have)',
          asA: 'مسؤول الحوكمة والسياسات في رتق',
          iWant: 'واجهة إدارية مرنة لتعديل معايير النظام العامة: سقف الحصص المجانية والشريكة، أوزان معايير أوسمة إتقان، وتحديث قائمة التراخيص المعتمدة',
          soThat: 'تتكيف المنصة مع المستجدات التشريعية والتنظيمية دون الحاجة لإعادة بناء أو نشر شفرة المصدر.',
          acceptance: [
            'واجهة لإدارة شرائح الحصص (Tiers Quotas): الشريحة المفتوحة، شريحة المطور المعتمد، الشريحة المؤسسية.',
            'لوحة لضبط أوزان فئات وسام إتقان (سلامة النص، التوثيق، الاستقرار، التراخيص) مع التحقق البرمجي من أن المجموع يساوي 100%.',
            'تفعيل أو جدولة وضع الصيانة (Maintenance Mode) مع رسالة مخصصة للمستخدمين واستثناء حسابات المشرفين.',
            'تحديث قائمة التراخيص المقبولة وإضافة نماذج جديدة.'
          ],
          techRules: [
            'أي تغيير في المعايير أو الحصص يتطلب حفظ نسخة من الإعدادات السابقة وتوثيق اسم المسؤول وتاريخ السريان في سجل التغييرات العام.'
          ],
          sla: 'تطبيق التعديلات الحوكمية فورياً على مستوى النظام بالكامل.'
        }
      ]
    }
  ];

  const currentRole = useMemo(() => {
    return ROLES_DATA.find((r) => r.id === activeRoleId) || ROLES_DATA[0];
  }, [activeRoleId]);

  const filteredStories = useMemo(() => {
    let list = currentRole.stories;
    if (priorityFilter !== 'all') {
      list = list.filter((s) => s.priority === priorityFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q) ||
          s.epic.toLowerCase().includes(q) ||
          s.asA.toLowerCase().includes(q) ||
          s.iWant.toLowerCase().includes(q)
      );
    }
    return list;
  }, [currentRole, priorityFilter, searchQuery]);

  const [openStoryId, setOpenStoryId] = useState<string | null>(null);

  const toggleStory = (id: string) => {
    setOpenStoryId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="bg-canvas border border-border rounded-2xl p-4 sm:p-8 shadow-xs text-start space-y-8">
      {/* 1. Header Banner */}
      <div className="pb-6 border-b border-border/80">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ratq-50 dark:bg-ratq-950 text-ratq-800 dark:text-ratq-300 text-xs font-mono font-bold border border-ratq-200 dark:border-ratq-800">
            <Sparkles className="w-3.5 h-3.5 text-ratq-600" />
            <span>قصص المستخدم المعتمدة (Approved User Stories Suite)</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-fg-subtle">
            <span>إجمالي الأدوار: 5</span>
            <span>•</span>
            <span>26 قصة تفصيلية</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-fg">
          قصص المستخدم وتفاصيل لوحات التحكم الخمس لمشروع «رَتْق»
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-fg-muted max-w-4xl leading-relaxed">
          وثيقة مواصفات وظيفية معتمدة تحدد بدقة متناهية متطلبات كل شاشة وعملية في لوحات التحكم الخمس وفق المعيار القياسي الدولي (بصفتي ... أريد ... حتى ...)، مع معايير القبول والتنفيذ (Acceptance Criteria) والقواعد البرمجية واتفاقيات مستوى الخدمة (SLAs).
        </p>
      </div>

      {/* 2. Top Five Roles Tabs Bar (القائمة المنسدلة للأدوار تحولت إلى 5 تابات تفاعلية) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-fg-muted uppercase tracking-wider">
            اختر لوحة التحكم والدور للاطلاع على قصصه البرمجية:
          </span>
          <span className="text-[11px] font-mono text-ratq-700 dark:text-ratq-300">
            {currentRole.name} ({currentRole.stories.length} قصص)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 p-1.5 rounded-2xl bg-subtle/50 border border-border">
          {ROLES_DATA.map((role) => {
            const Icon = role.icon;
            const isActive = activeRoleId === role.id;
            return (
              <button
                key={role.id}
                onClick={() => {
                  setActiveRoleId(role.id);
                  setSearchQuery('');
                  setPriorityFilter('all');
                  setOpenStoryId(null);
                }}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-start ${
                  isActive
                    ? `${role.activeColor} shadow-xs scale-[1.01]`
                    : 'text-fg-muted hover:text-fg hover:bg-canvas border border-transparent'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    isActive ? 'bg-white/20 text-white' : 'bg-subtle text-fg-muted'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="truncate text-xs">{role.name}</span>
                  <span
                    className={`text-[10px] font-mono truncate ${
                      isActive ? 'text-white/80' : 'text-fg-subtle'
                    }`}
                  >
                    {role.stories.length} قصص
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Active Role Overview Banner */}
      <div
        className={`p-5 rounded-2xl border border-border bg-gradient-to-l ${currentRole.accentBg} bg-canvas relative overflow-hidden`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${currentRole.badgeColor}`}>
                {currentRole.dashboardName}
              </span>
              <span className="text-xs font-mono text-fg-subtle">
                مسار اللوحة: {currentRole.route}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-fg leading-relaxed max-w-3xl">
              {currentRole.description}
            </p>

            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-bold text-fg-subtle">أبرز الصلاحيات والعمليات:</span>
              {currentRole.permissions.map((perm, idx) => (
                <span
                  key={idx}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-canvas/80 border border-border text-fg-muted"
                >
                  {perm}
                </span>
              ))}
            </div>
          </div>

          <Link
            to={currentRole.route}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-canvas border border-border hover:bg-subtle text-fg transition-colors shrink-0 shadow-2xs group self-start md:self-auto"
          >
            <span>معاينة {currentRole.name} الحية</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-fg-subtle group-hover:text-fg transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>

      {/* 4. Filter and Search Bar for Active Role Stories */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-fg-subtle absolute start-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={`ابحث في قصص ${currentRole.name}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs ps-8 pe-3 py-2 rounded-xl border border-border bg-subtle/30 text-fg placeholder:text-fg-subtle focus:outline-none focus:ring-1 focus:ring-ratq-500"
          />
        </div>

        {/* Priority Filter & Expand/Collapse All */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-subtle/40 border border-border shrink-0 self-start sm:self-auto overflow-x-auto">
          <button
            onClick={() => setPriorityFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
              priorityFilter === 'all'
                ? 'bg-canvas text-fg shadow-2xs border border-border'
                : 'text-fg-muted hover:text-fg'
            }`}
          >
            الكل ({currentRole.stories.length})
          </button>
          <button
            onClick={() => setPriorityFilter('must')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
              priorityFilter === 'must'
                ? 'bg-canvas text-rose-700 dark:text-rose-400 shadow-2xs border border-border'
                : 'text-fg-muted hover:text-fg'
            }`}
          >
            إلزامي ({currentRole.stories.filter((s) => s.priority === 'must').length})
          </button>
          <button
            onClick={() => setPriorityFilter('should')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
              priorityFilter === 'should'
                ? 'bg-canvas text-amber-700 dark:text-amber-400 shadow-2xs border border-border'
                : 'text-fg-muted hover:text-fg'
            }`}
          >
            هام ({currentRole.stories.filter((s) => s.priority === 'should').length})
          </button>
          <button
            onClick={() => setPriorityFilter('could')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
              priorityFilter === 'could'
                ? 'bg-canvas text-blue-700 dark:text-blue-400 shadow-2xs border border-border'
                : 'text-fg-muted hover:text-fg'
            }`}
          >
            تحسيني ({currentRole.stories.filter((s) => s.priority === 'could').length})
          </button>

          {openStoryId !== null && (
            <>
              <div className="h-4 w-[1px] bg-border mx-0.5" />
              <button
                type="button"
                onClick={() => setOpenStoryId(null)}
                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-fg-subtle hover:text-fg hover:bg-canvas transition-colors whitespace-nowrap"
              >
                طي القصة المفتوحة
              </button>
            </>
          )}
        </div>
      </div>

      {/* 5. Stories Accordion List */}
      {filteredStories.length === 0 ? (
        <div className="p-12 text-center border border-border rounded-xl bg-subtle/20">
          <p className="text-xs text-fg-subtle">لا توجد قصص مطابقة لمعايير البحث الحالية في هذا الدور.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredStories.map((story) => {
            const isOpen = openStoryId === story.id;
            return (
              <div
                key={story.id}
                className={`border rounded-2xl bg-canvas transition-all shadow-2xs overflow-hidden ${
                  isOpen
                    ? 'border-ratq-300 dark:border-ratq-700/80 ring-1 ring-ratq-500/10'
                    : 'border-border hover:border-border/80'
                }`}
              >
                {/* Accordion Clickable Header */}
                <button
                  type="button"
                  onClick={() => toggleStory(story.id)}
                  aria-expanded={isOpen}
                  className="w-full text-start p-4 sm:p-4.5 flex items-center justify-between gap-3 hover:bg-subtle/30 transition-colors cursor-pointer"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-subtle border border-border text-fg">
                        {story.id}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                          story.priority === 'must'
                            ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                            : story.priority === 'should'
                            ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                            : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                        }`}
                      >
                        {story.priorityLabel}
                      </span>
                    </div>

                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-fg-subtle">
                        <span className="text-[11px] font-semibold text-ratq-700 dark:text-ratq-400 truncate max-w-[200px]">
                          {story.epic}
                        </span>
                        <span className="text-[10px] hidden sm:inline">•</span>
                        <span className="text-[10px] font-mono hidden sm:inline truncate">
                          {story.screen}
                        </span>
                      </div>
                      <h3 className="text-xs sm:text-sm font-bold text-fg truncate mt-0.5">
                        {story.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className="text-[11px] font-medium text-fg-subtle hidden md:inline">
                      {isOpen ? 'طي التفاصيل' : 'عرض التفاصيل'}
                    </span>
                    <div
                      className={`w-7 h-7 rounded-lg border border-border flex items-center justify-center text-fg-subtle transition-all duration-200 ${
                        isOpen
                          ? 'bg-ratq-50 dark:bg-ratq-950/80 text-ratq-700 dark:text-ratq-300 rotate-180 border-ratq-300 dark:border-ratq-700'
                          : 'bg-subtle/50'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </button>

                {/* Accordion Expanded Details */}
                {isOpen && (
                  <div className="px-4 sm:px-6 pb-5 sm:pb-6 pt-3 border-t border-border/80 space-y-4 bg-canvas/80">
                    {/* Agile Standard Narrative Box */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 rounded-xl bg-subtle/30 border border-border text-xs">
                      <div>
                        <strong className="text-fg block mb-1 text-[11px]">بصفتي (As a):</strong>
                        <span className="text-fg-muted leading-relaxed">{story.asA}</span>
                      </div>
                      <div>
                        <strong className="text-fg block mb-1 text-[11px]">أريد أن (I want to):</strong>
                        <span className="text-fg-muted leading-relaxed">{story.iWant}</span>
                      </div>
                      <div>
                        <strong className="text-fg block mb-1 text-[11px]">حتى أتمكن من (So that):</strong>
                        <span className="text-fg-muted leading-relaxed">{story.soThat}</span>
                      </div>
                    </div>

                    {/* Acceptance Criteria */}
                    <div className="space-y-2">
                      <strong className="text-xs font-bold text-fg flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-ratq-600" />
                        <span>معايير القبول والتنفيذ (Acceptance Criteria):</span>
                      </strong>
                      <ul className="grid grid-cols-1 gap-2 text-xs text-fg-muted">
                        {story.acceptance.map((criterion, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2.5 p-2 rounded-lg bg-subtle/10 border border-border-subtle"
                          >
                            <span className="w-4 h-4 rounded-full bg-ratq-100 dark:bg-ratq-950 text-ratq-700 dark:text-ratq-300 text-[10px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="leading-relaxed">{criterion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Technical Rules & SLA Footer */}
                    <div className="pt-3 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-[11px] text-fg-subtle">
                      <div className="flex flex-wrap items-center gap-2">
                        <strong className="text-fg-muted flex items-center gap-1">
                          <Code2 className="w-3 h-3 text-fg-subtle" />
                          <span>الضوابط التقنية:</span>
                        </strong>
                        {story.techRules.map((rule, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-subtle border border-border text-[10px] font-mono"
                          >
                            {rule}
                          </span>
                        ))}
                      </div>

                      {story.sla && (
                        <div className="flex items-center gap-1.5 text-ratq-700 dark:text-ratq-400 font-mono text-[10px] shrink-0 bg-ratq-50/50 dark:bg-ratq-950/50 px-2 py-0.5 rounded border border-ratq-200 dark:border-ratq-900">
                          <Clock className="w-3 h-3" />
                          <span>SLA: {story.sla}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 6. Document Ratification Footer Notice */}
      <div className="p-4 rounded-xl border border-border bg-subtle/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-fg-muted">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-ratq-600 shrink-0" />
          <span>
            هذه الوثيقة تمثل المرجع الوظيفي المعتمد (Functional Specifications Baseline) لفرق التطوير البرمجي والهندسة، وتحدد متطلبات كل شاشة وعملية في لوحات التحكم الخمس بدقة متناهية.
          </span>
        </div>
        <span className="text-[11px] font-mono text-fg-subtle shrink-0">
          نسخة مواصفات: v1.4 • معتمدة
        </span>
      </div>
    </div>
  );
}

export default UxStudy;
