// src/views/Home.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ResourceCard } from '@/components/resources/ResourceCard';
import { ItqanBadge } from '@/components/ui/ItqanBadge';
import { mockRepo } from '@/lib/supabase';
import { HeroRings } from '@/components/home/HeroRings';
import { QuranTechPeriodicTable } from '@/components/home/QuranTechPeriodicTable';
// import { QuranTechPeriodicCarousel } from '@/components/home/QuranTechPeriodicCarousel';
import { HeroDepthCarousel } from '@/components/home/HeroDepthCarousel';
import { DotField } from '@/components/ui/DotField/DotField';
import { CatalogWizardHelper } from '@/components/resources/CatalogWizardHelper';
import {
  Search,
  ArrowLeft,
  Sparkles,
  ChevronDown,
  ShieldCheck,
  Database,
  KeyRound,
  CheckCircle2,
  Building2,
} from 'lucide-react';
import { useThemeStore } from '@/store/useThemeStore';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const heroLayout = useThemeStore((s) => s.heroLayout);
  const palette = useThemeStore((s) => s.palette);
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const dotColors = {
    gold: {
      from: 'rgba(190, 165, 110, 0.45)',
      to: 'rgba(148, 110, 55, 0.22)',
    },
    default: {
      from: 'rgba(52, 211, 153, 0.40)',
      to: 'rgba(5, 150, 105, 0.20)',
    },
    olive: {
      from: 'rgba(168, 184, 104, 0.42)',
      to: 'rgba(107, 124, 51, 0.22)',
    },
    navy: {
      from: 'rgba(84, 137, 191, 0.45)',
      to: 'rgba(29, 79, 133, 0.22)',
    },
  }[palette] || {
    from: 'rgba(190, 165, 110, 0.45)',
    to: 'rgba(148, 110, 55, 0.22)',
  };

  const resources = mockRepo.getResources();
  const publishers = mockRepo.getPublishers();
  const keys = mockRepo.getKeys();

  const featuredResources = resources.filter((r) => r.is_featured).slice(0, 6);

  // Live trust metrics from store/DB
  const trustMetrics = [
    { label: 'مورد برمجي منشور', value: resources.length },
    { label: 'ناشر ومؤسسة موثقة', value: publishers.length },
    { label: 'شارة إتقان ممنوحة', value: resources.filter((r) => r.itqan_level !== 'none').length },
    { label: 'مفتاح API نشط', value: keys.length },
  ];

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/resources?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/resources');
    }
  };

  const faqs = [
    {
      q: 'ما هو معيار إتقان وما الذي يميزه؟',
      a: 'معيار إتقان هو إطار حوكمة جودة متعدد المستويات يفحص الموارد البرمجية القرآنية عبر 4 طبقات: التقنية، الأمان، التراخيص، والتحقيق العلمي الشرعي الإلزامي المعتمد.',
    },
    {
      q: 'كيف يمكنني الحصول على مفتاح API للموارد المقيّدة؟',
      a: 'من خلال تقديم طلب وصول إلكتروني بنقرة واحدة وتوضيح الغرض من المشروع، ويقوم الناشر بمراجعته والبت فيه وفق الـ SLA المحدد لتوليد مفتاحك الآمن.',
    },
    {
      q: 'هل يمكن لناشري المصاحف ودور النشر إدارة أصولهم مباشرة؟',
      a: 'نعم، توفر المنصة بوابة ناشرين متكاملة للمطالبة بملكية الموارد، إصدار النسخ، متابعة طلبات المطورين، والحصول على تحليلات دقيقة.',
    },
    {
      q: 'هل تضم المنصة نصوصاً قرآنية مولدة بالذكاء الاصطناعي؟',
      a: 'كلا تماماً، تفرض المنصة حواجز صارمة وقواعد تمنع توليد أو تخمين نص القرآن الكريم بالذكاء الاصطناعي، وجميع الموارد مسندة لجهات معتمدة ومحققة.',
    },
    {
      q: 'هل استخدام المنصة مجاني للمطورين؟',
      a: 'نعم، المنصة مجانية لمجتمع المطورين والباحثين، وتدعم المشاريع المفتوحة المصدر والتطوعية لخدمة كتاب الله.',
    },
  ];

  return (
    <div className="flex flex-col w-full text-center">
      {/* 1. Hero Section */}
      <section className="relative pt-14 pb-16 sm:pt-16 sm:pb-20 px-4 sm:px-6 overflow-hidden border-b border-border hero-gradient-bg transition-colors">
        {heroLayout === 'split' ? (
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center animate-in fade-in duration-300">
            {/* Right Column in RTL: Content, Search Bar, CTAs */}
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-start">
              {/* Badge pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-ratq-200 bg-ratq-50 dark:border-ratq-800 dark:bg-ratq-950 text-ratq-800 dark:text-ratq-300 text-xs font-semibold mb-6">
                <Sparkles className="w-3.5 h-3.5 text-ratq-600" />
                <span>البنية التحتية المعتمدة للبرمجيات القرآنية</span>
              </div>

              <h1 className="hero-title-typography text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-bold text-fg tracking-normal leading-[1.1] sm:leading-[1.15] lg:leading-[1.2] flex flex-col items-center lg:items-start gap-2 sm:gap-3.5">
                <span className="block">مرجعك الموثوق لتطوير</span>
                <span className="text-ratq-700 dark:text-ratq-400 block pb-1">البرمجيات القرآنية</span>
              </h1>

              <p className="mt-5 text-sm sm:text-base text-fg-muted max-w-xl leading-relaxed">
                كتالوج شامل للمكتبات، حزم التطوير، مجموعات البيانات، والخطوط — خاضعة لمعايير إتقان الصارمة مع مسارات وصول منظّمة ومفاتيح API مُدارة.
              </p>

              {/* Large Hero Search Bar */}
              <form onSubmit={handleHeroSearch} className="w-full max-w-xl mt-8">
                <div className="relative flex items-center shadow-lg rounded-xl border border-slate-200/80 dark:border-border bg-white dark:bg-slate-900 overflow-hidden focus-within:ring-2 focus-within:ring-ratq-500 focus-within:border-ratq-500 transition-all">
                  <Search className="w-5 h-5 text-fg-subtle ms-4 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث عن مكتبة، حزمة SDK، مجموعة بيانات، أو خط..."
                    className="w-full py-4 px-3 text-sm text-fg placeholder:text-fg-subtle bg-transparent focus:outline-none"
                  />
                  <Button type="submit" variant="primary" size="md" className="me-2 shrink-0">
                    بحث فوري
                  </Button>
                </div>
              </form>

              {/* Hero CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mt-6">
                <Button variant="primary" size="lg" onClick={() => navigate('/resources')} className="shadow-sm">
                  استكشف الموارد
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate('/publisher')} className="bg-canvas/80 backdrop-blur-xs shadow-xs">
                  وثّق موردك كناشر
                </Button>
              </div>
            </div>

            {/* Left Column in RTL: 3D Quran Illustration with Concentric Animated Rings & Floating Cards */}
            <div className="lg:col-span-5 flex items-center justify-center relative pt-12 pb-20 sm:pb-24 lg:py-14 px-2 sm:px-4">
              {/* Concentric Animated Circles with Orbit Dots & Gradient Opacity */}
              <HeroRings />

              {/* Main Illustration Container with Floating Cards Formatted Completely Outside */}
              <div className="relative w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[450px] flex items-center justify-center z-10">
                {/* 2 Floating Cards on Top (Completely Outside the Image) */}
                {/* Card 1: Top Right */}
                <div className="absolute -top-2 sm:-top-11 start-[-20px] sm:start-[-50px] lg:start-[-40px] z-20">
                  <div className="animate-float-1 inline-flex items-center gap-2 px-3 py-1.5 sm:px-3 sm:py-2 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 shadow-lg backdrop-blur-xs select-none transition-all duration-300 hover:scale-105 whitespace-nowrap">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 bg-ratq-50 dark:bg-ratq-950/60 text-ratq-600 dark:text-ratq-400">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col text-start">
                      <span className="text-[11px] sm:text-xs font-bold text-fg leading-tight">معيار إتقان — 4 مستويات</span>
                      <span className="text-[9px] sm:text-[10px] text-fg-subtle leading-tight mt-0.5">فحص علمي وأمني معتمد</span>
                    </div>
                  </div>
                </div>

                {/* Card 2: Top Left */}
                <div className="absolute -top-20 sm:-top-4 end-[-5px] sm:end-[-20px] lg:end-[-48px] z-20">
                  <div className="animate-float-2 inline-flex items-center gap-2 px-3 py-1.5 sm:px-3 sm:py-2 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 shadow-lg backdrop-blur-xs select-none transition-all duration-300 hover:scale-105 whitespace-nowrap">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 bg-ratq-50 dark:bg-ratq-950/60 text-ratq-600 dark:text-ratq-400">
                      <Database className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col text-start">
                      <span className="text-[11px] sm:text-xs font-bold text-fg leading-tight">+128 مورد موثّق</span>
                      <span className="text-[9px] sm:text-[10px] text-fg-subtle leading-tight mt-0.5">مكتبات وحزم وبيانات قرآنية</span>
                    </div>
                  </div>
                </div>

                {/* Central 3D Quran Illustration (Fully Clear and Unobstructed) */}
                <img
                  src="/hero-quran.png"
                  alt="البرمجيات القرآنية — رَتْق"
                  className="relative w-full max-w-[270px] sm:max-w-[340px] lg:max-w-[380px] object-contain drop-shadow-2xl transition-transform duration-700 hover:scale-105 select-none pointer-events-none"
                />

                {/* 3 Floating Cards Around and Below (Completely Outside the Image) */}
                {/* Card 3: Outside Right */}
                <div className="absolute bottom-30 sm:bottom-30 start-[-40px] sm:start-[-20px] lg:start-[-90px] z-20">
                  <div className="animate-float-3 inline-flex items-center gap-2 px-3 py-1.5 sm:px-3 sm:py-2 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 shadow-lg backdrop-blur-xs select-none transition-all duration-300 hover:scale-105 whitespace-nowrap">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col text-start">
                      <span className="text-[11px] sm:text-xs font-bold text-fg leading-tight">مفاتيح API مشفّرة</span>
                      <span className="text-[9px] sm:text-[10px] text-fg-subtle leading-tight mt-0.5">وصول محكوم وحوكمة أمنية</span>
                    </div>
                  </div>
                </div>

                {/* Card 4: Outside Bottom Center */}
                <div className="absolute -bottom-14 sm:-bottom-16 lg:-bottom-20 left-1/2 -translate-x-1/2 z-30">
                  <div className="animate-float-4 inline-flex items-center gap-2.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 shadow-xl backdrop-blur-xs select-none transition-all duration-300 hover:scale-105 whitespace-nowrap">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col text-start">
                      <span className="text-[11px] sm:text-xs font-bold text-fg leading-tight">تدقيق ومراجعة بشرية 100%</span>
                      <span className="text-[9px] sm:text-[10px] text-fg-subtle leading-tight mt-0.5">تحت إشراف مختصين لحماية النص القرآني</span>
                    </div>
                  </div>
                </div>

                {/* Card 5: Outside Left */}
                <div className="absolute bottom-3 sm:bottom-4 end-[-10px] sm:end-[-20px] lg:end-[-90px] z-20">
                  <div className="animate-float-5 inline-flex items-center gap-2 px-3 py-1.5 sm:px-3 sm:py-2 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 shadow-lg backdrop-blur-xs select-none transition-all duration-300 hover:scale-105 whitespace-nowrap">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col text-start">
                      <span className="text-[11px] sm:text-xs font-bold text-fg leading-tight">+34 ناشر ومؤسسة</span>
                      <span className="text-[9px] sm:text-[10px] text-fg-subtle leading-tight mt-0.5">جهات رسمية ودور نشر موثوقة</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : heroLayout === 'third' ? (
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center animate-in fade-in duration-300">
            {/* Right Column in RTL: Content, Search Bar, CTAs */}
            <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-start">
              {/* Badge pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-ratq-200 bg-ratq-50 dark:border-ratq-800 dark:bg-ratq-950 text-ratq-800 dark:text-ratq-300 text-xs font-semibold mb-6 animate-in fade-in slide-in-from-top-3">
                <Sparkles className="w-3.5 h-3.5 text-ratq-600" />
                <span>البنية التحتية المعتمدة للبرمجيات القرآنية</span>
              </div>

              <h1 className="hero-title-typography text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-bold text-fg tracking-normal leading-[1.1] sm:leading-[1.15] lg:leading-[1.2] flex flex-col items-center lg:items-start gap-2 sm:gap-3.5">
                <span className="block">مرجعك الموثوق لتطوير</span>
                <span className="text-ratq-700 dark:text-ratq-400 block pb-1">البرمجيات القرآنية</span>
              </h1>

              <p className="mt-5 text-sm sm:text-base text-fg-muted max-w-xl leading-relaxed">
                كتالوج شامل للمكتبات، حزم التطوير، مجموعات البيانات، والخطوط — خاضعة لمعايير إتقان الصارمة مع مسارات وصول منظّمة ومفاتيح API مُدارة.
              </p>

              {/* Large Hero Search Bar */}
              <form onSubmit={handleHeroSearch} className="w-full max-w-xl mt-8">
                <div className="relative flex items-center shadow-lg rounded-xl border border-slate-200/80 dark:border-border bg-white dark:bg-slate-900 overflow-hidden focus-within:ring-2 focus-within:ring-ratq-500 focus-within:border-ratq-500 transition-all">
                  <Search className="w-5 h-5 text-fg-subtle ms-4 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث عن مكتبة، حزمة SDK، مجموعة بيانات، أو خط..."
                    className="w-full py-4 px-3 text-sm text-fg placeholder:text-fg-subtle bg-transparent focus:outline-none"
                  />
                  <Button type="submit" variant="primary" size="md" className="me-2 shrink-0">
                    بحث فوري
                  </Button>
                </div>
              </form>

              {/* Hero CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mt-6">
                <Button variant="primary" size="lg" onClick={() => navigate('/resources')} className="shadow-sm">
                  استكشف الموارد
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate('/publisher')} className="bg-canvas/80 backdrop-blur-xs shadow-xs">
                  وثّق موردك كناشر
                </Button>
              </div>
            </div>

            {/* Left Column in RTL: Depth Carousel replaces Image & Floating Cards */}
            <div className="lg:col-span-6 flex items-center justify-center relative w-full h-[460px] sm:h-[520px]">
              <HeroDepthCarousel />
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto flex flex-col items-center animate-in fade-in duration-300">
            {/* Badge pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-ratq-200 bg-ratq-50 dark:border-ratq-800 dark:bg-ratq-950 text-ratq-800 dark:text-ratq-300 text-xs font-semibold mb-6 animate-in fade-in slide-in-from-top-3">
              <Sparkles className="w-3.5 h-3.5 text-ratq-600" />
              <span>البنية التحتية المعتمدة للبرمجيات القرآنية</span>
            </div>

            <h1 className="hero-title-typography text-3xl sm:text-5xl lg:text-6xl font-bold text-fg tracking-normal leading-[1.1] sm:leading-[1.15] lg:leading-[1.2] flex flex-col items-center gap-2.5 sm:gap-4">
              <span className="block">مرجعك الموثوق لتطوير</span>
              <span className="text-ratq-700 dark:text-ratq-400 block pb-1">البرمجيات القرآنية</span>
            </h1>

            <p className="mt-5 text-sm sm:text-base text-fg-muted max-w-2xl leading-relaxed">
              كتالوج شامل للمكتبات، حزم التطوير، مجموعات البيانات، والخطوط — خاضعة لمعايير إتقان الصارمة مع مسارات وصول منظّمة ومفاتيح API مُدارة.
            </p>

            {/* Large Hero Search Bar */}
            <form onSubmit={handleHeroSearch} className="w-full max-w-2xl mt-8">
              <div className="relative flex items-center shadow-lg rounded-xl border border-slate-200/80 dark:border-border bg-white dark:bg-slate-900 overflow-hidden focus-within:ring-2 focus-within:ring-ratq-500 focus-within:border-ratq-500 transition-all">
                <Search className="w-5 h-5 text-fg-subtle ms-4 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن مكتبة، حزمة SDK، مجموعة بيانات، أو خط..."
                  className="w-full py-4 px-3 text-sm text-fg placeholder:text-fg-subtle bg-transparent focus:outline-none"
                />
                <Button type="submit" variant="primary" size="md" className="me-2 shrink-0">
                  بحث فوري
                </Button>
              </div>
            </form>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <Button variant="primary" size="lg" onClick={() => navigate('/resources')} className="shadow-sm">
                استكشف الموارد
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/publisher')} className="bg-canvas/80 backdrop-blur-xs shadow-xs">
                وثّق موردك كناشر
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* 2. Live Trust Metrics */}
      <section className="py-10 border-b border-border bg-subtle/40">
        <div className="max-w-container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {trustMetrics.map((metric, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-2xl sm:text-4xl font-bold font-mono text-ratq-700 dark:text-ratq-400">
                  {metric.value.toLocaleString()}
                </span>
                <span className="text-xs text-fg-subtle mt-1 font-medium">{metric.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Quran Tech Periodic Table (الجدول الدوري للأصول التقنية القرآنية) */}
      <QuranTechPeriodicTable />

      {/* 3c. Quran Tech Periodic Carousel (مخفي مؤقتاً ويمكن إظهاره لاحقاً) */}
      {/* <QuranTechPeriodicCarousel /> */}

      {/* 4. Featured Resources */}
      <section className="py-16 border-b border-border bg-subtle/20">
        <div className="max-w-container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8 text-start">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-fg">الموارد المختارة والمتميزة</h2>
              <p className="text-xs text-fg-subtle mt-1">حزم ومكتبات حائزة على أعلى تقييمات إتقان واعتماد المجتمع</p>
            </div>
            <Link
              to="/resources"
              className="text-xs font-bold text-ratq-700 hover:underline flex items-center gap-1"
            >
              <span>عرض الكتالوج كاملاً</span>
              <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0 rotate-180" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredResources.map((res) => (
              <ResourceCard
                key={res.id}
                resource={res}
                showEnglishTitle={false}
                showAppUsages={true}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. How It Works */}
      <section className="py-16 border-b border-border relative overflow-hidden bg-white dark:bg-[#080c14]">
        {/* Background ambient gradient circles: Right (emerald/teal) and Left (cyan/sky) with clean white space in center */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Right side large soft gradient circles (emerald / teal) */}
          <div
            className="absolute -top-32 -right-32 sm:-top-40 sm:-right-40 w-[550px] h-[550px] sm:w-[750px] sm:h-[750px] rounded-full blur-[100px] sm:blur-[140px] opacity-70 dark:opacity-25"
            style={{
              background:
                'radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, rgba(52, 211, 153, 0.12) 40%, rgba(209, 250, 229, 0.05) 70%, transparent 85%)',
            }}
          />
          <div
            className="absolute -bottom-28 -right-20 sm:-bottom-36 sm:-right-24 w-[450px] h-[450px] sm:w-[600px] sm:h-[600px] rounded-full blur-[110px] sm:blur-[140px] opacity-55 dark:opacity-20"
            style={{
              background:
                'radial-gradient(circle, rgba(5, 150, 105, 0.18) 0%, rgba(110, 231, 183, 0.09) 50%, transparent 80%)',
            }}
          />

          {/* Left side large soft gradient circles (cyan / sky blue) */}
          <div
            className="absolute -top-28 -left-32 sm:-top-36 sm:-left-40 w-[550px] h-[550px] sm:w-[750px] sm:h-[750px] rounded-full blur-[100px] sm:blur-[140px] opacity-65 dark:opacity-25"
            style={{
              background:
                'radial-gradient(circle, rgba(6, 182, 212, 0.20) 0%, rgba(56, 189, 248, 0.11) 45%, rgba(224, 242, 254, 0.05) 70%, transparent 85%)',
            }}
          />
          <div
            className="absolute -bottom-32 -left-20 sm:-bottom-40 sm:-left-24 w-[450px] h-[450px] sm:w-[600px] sm:h-[600px] rounded-full blur-[110px] sm:blur-[140px] opacity-55 dark:opacity-20"
            style={{
              background:
                'radial-gradient(circle, rgba(14, 165, 233, 0.16) 0%, rgba(99, 102, 241, 0.08) 50%, transparent 80%)',
            }}
          />

          {/* Center: Clean pristine white wash in the middle */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] sm:w-[850px] lg:w-[1050px] h-[450px] sm:h-[600px] bg-white/90 dark:bg-[#080c14]/90 rounded-full blur-[70px] sm:blur-[90px]"
          />
        </div>

        <div className="max-w-container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-fg">كيف تعمل منصة RATQ؟</h2>
            <p className="text-xs text-fg-subtle mt-1">رحلة مبسطة من الاكتشاف إلى أول طلب تكامل ناجح</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-start">
            <div className="p-6 rounded-xl border border-border bg-canvas/85 backdrop-blur-sm relative shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-ratq-50 text-ratq-700 flex items-center justify-center font-bold text-sm mb-4">
                ١
              </div>
              <h3 className="text-sm font-bold text-fg mb-1">اكتشف بثقة</h3>
              <p className="text-xs text-fg-muted leading-relaxed">
                ابحث في الكتالوج الشامل، واستخدم الفلاتر المتطورة للعثور على المكتبات والرخص والتقنيات المناسبة لمشروعك.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border bg-canvas/85 backdrop-blur-sm relative shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold text-sm mb-4">
                ٢
              </div>
              <h3 className="text-sm font-bold text-fg mb-1">تحقّق من الجودة</h3>
              <p className="text-xs text-fg-muted leading-relaxed">
                تحقق من شارة إتقان الممنوحة للمورد، راجع بصمات SHA-256 للملفات وتأكد من مطابقتها للمعايير العلمية والتقنية.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border bg-canvas/85 backdrop-blur-sm relative shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-gold-50 text-gold-700 flex items-center justify-center font-bold text-sm mb-4">
                ٣
              </div>
              <h3 className="text-sm font-bold text-fg mb-1">ابنِ وتكامل بأمان</h3>
              <p className="text-xs text-fg-muted leading-relaxed">
                احصل على مفاتيح API مدارة بنقرة واحدة، انسخ كود التثبيت المباشر، وتابع تحديثات الإصدارات تلقائياً.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Itqan Standard Highlight */}
      <section className="py-16 border-b border-border bg-ratq-950 text-white text-start relative overflow-hidden">
        {/* Interactive DotField Background from React Bits */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <DotField
            dotRadius={1.5}
            dotSpacing={14}
            bulgeStrength={67}
            glowRadius={0}
            sparkle={false}
            waveAmplitude={0}
            gradientFrom={dotColors.from}
            gradientTo={dotColors.to}
            glowColor="transparent"
          />
        </div>

        <div className="max-w-container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-xs font-semibold text-ratq-400 uppercase tracking-wider block mb-2">
                معيار الجودة والموثوقية
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold leading-snug mb-4">
                معيار إتقان: حوكمة رقمية وعلمية لحماية البرمجيات القرآنية
              </h2>
              <p className="text-xs text-gray-300 leading-relaxed mb-6">
                لا نكتفي بكون المورد مفتوح المصدر أو متاحاً؛ بل نخضعه لتقييم موزون من أربعة مستويات يضمن سلامة الرسم العثماني ودقة التفاسير واستقرار الأكواد والامتثال التام للحقوق الفكرية.
              </p>

              <div className="flex flex-wrap gap-3">
                <Button variant="primary" size="md" onClick={() => navigate('/standards')}>
                  استكشف معايير إتقان
                </Button>
                <Button variant="outline" size="md" onClick={() => navigate('/standards/checklist')} className="border-ratq-700 text-white hover:bg-ratq-900">
                  قائمة التحقق التفصيلية
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-ratq-900 border border-ratq-800 hover:border-ratq-700 transition-colors shadow-xs">
                <ItqanBadge level="basic" size="sm" />
                <p className="text-2xs text-gray-300 mt-2">بيانات مكتملة ومصرّح بها ذاتياً</p>
              </div>
              <div className="p-4 rounded-xl bg-ratq-900 border border-ratq-800 hover:border-ratq-700 transition-colors shadow-xs">
                <ItqanBadge level="verified" size="sm" />
                <p className="text-2xs text-gray-300 mt-2">تدقيق تقني لسلامة الروابط والملفات</p>
              </div>
              <div className="p-4 rounded-xl bg-ratq-900 border border-ratq-800 hover:border-ratq-700 transition-colors shadow-xs">
                <ItqanBadge level="certified" size="sm" />
                <p className="text-2xs text-gray-300 mt-2">مراجعة بشرية وعلمية معتمدة</p>
              </div>
              <div className="p-4 rounded-xl bg-ratq-900 border border-ratq-800 hover:border-ratq-700 transition-colors shadow-xs">
                <ItqanBadge level="gold" size="sm" />
                <p className="text-2xs text-gray-300 mt-2">النخبة في فئتها واستقرار استثنائي</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ Preview */}
      <section className="py-16 border-b border-border text-start">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-fg">الأسئلة الشائعة</h2>
            <p className="text-xs text-fg-subtle mt-1">إجابات موجزة لأبرز تساؤلات المطورين والناشرين</p>
          </div>

          <div className="flex flex-col gap-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-xl border border-border bg-canvas overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-4 flex items-center justify-between text-xs font-bold text-fg hover:bg-subtle transition-colors cursor-pointer text-start"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-fg-subtle transition-transform ${openFaq === index ? 'rotate-180' : ''
                      }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-4 pb-4 pt-1 text-xs text-fg-muted leading-relaxed border-t border-border-subtle bg-subtle/30">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Final CTA */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-t from-ratq-50/50 to-canvas dark:from-ratq-950/20 relative overflow-hidden">
        {/* Repeating small squares grid background pattern */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-[0.10] dark:opacity-[0.08]">
          <svg
            className="w-full h-full text-ratq-600 dark:text-ratq-400"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="cta-grid-pattern"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 20 0 L 0 0 0 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cta-grid-pattern)" />
          </svg>
        </div>

        <div className="max-w-2xl mx-auto text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-fg mb-3">جاهز للبناء والتطوير؟</h2>
          <p className="text-xs sm:text-sm text-fg-muted mb-6 leading-relaxed">
            انضم إلى مئات المطورين والباحثين القرآنيين، وابدأ دمج أحدث المجموعات البرمجية الموثقة في مشروعك اليوم.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button variant="primary" size="lg" onClick={() => navigate('/resources')}>
              تصفح الكتالوج الآن
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/auth/sign-up')}>
              إنشاء حساب مطور
            </Button>
          </div>
        </div>
      </section>

      {/* 9. Smart Wizard Teaser Bar (محتار بين 124 مورداً ومكتبة قرآنية؟) */}
      <section className="pb-16 pt-2 px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto w-full">
          <CatalogWizardHelper className="mb-0" />
        </div>
      </section>
    </div>
  );
};
