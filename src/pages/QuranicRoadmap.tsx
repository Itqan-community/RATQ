// src/pages/QuranicRoadmap.tsx
import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { mockRepo } from '@/lib/supabase';
import { Resource } from '@/types';
import { Button } from '@/components/ui/Button';
import { ItqanBadge } from '@/components/ui/ItqanBadge';
import { LicenseBadge } from '@/components/ui/LicenseBadge';
import { AccessBadge } from '@/components/ui/AccessBadge';
import { RatingStars } from '@/components/ui/RatingStars';
import {
  Compass,
  Search,
  ExternalLink,
  Package,
  FileText,
  Download,
  Eye,
  ShieldCheck,
  Code2,
  X,
  BookOpen,
  Type,
  Library,
  Headphones,
  Cpu,
  HelpCircle,
  Sparkles,
  Check,
  RotateCcw,
  ArrowLeft,
  Smartphone,
  Globe,
} from 'lucide-react';
export interface QuranicTrack {
  id: string;
  name_ar: string;
  name_en: string;
  tagline_ar: string;
  description_ar: string;
  icon: React.ElementType;
  stageNumbers: number[];
  targetBadge: string;
  focusKeywords: string[];
}

export const QURANIC_TRACKS: QuranicTrack[] = [
  {
    id: 'all',
    name_ar: 'المسار الشامل المتكامل',
    name_en: 'Full Quranic Ecosystem Master Track',
    tagline_ar: 'الخارطة التقنية المرجعية الشاملة لكافة مراحل بناء وتطوير المنظومات القرآنية',
    description_ar:
      'يغطي كافة المراحل الست من التأسيس وفهم الرسم العثماني وحتى التيبوغرافيا والتفاسير والصوتيات ومحركات الذكاء الاصطناعي ومعايير إتقان.',
    icon: Compass,
    stageNumbers: [1, 2, 3, 4, 5, 6],
    targetBadge: 'مهندس برمجيات قرآنية معتمد',
    focusKeywords: ['رسم عثماني', 'خطوط حاسوبية', 'تفاسير', 'مكتبات برمجية', 'صوتيات', 'ذكاء اصطناعي'],
  },
  {
    id: 'mushaf',
    name_ar: 'مسار مطور تطبيقات المصاحف والجوال',
    name_en: 'Mobile Mushaf Developer Track',
    tagline_ar: 'بناء مصحف رقمي متجهي فائق النقاء يعمل بدون إنترنت (Offline-First)',
    description_ar:
      'مخصص لمطوري تطبيقات الهواتف (Flutter, Swift, Kotlin). يركز على سلامة نصوص الرسم العثماني، خطوط OpenType، ومحركات العرض والتظليل المتزامن والتخزين المحلي.',
    icon: Smartphone,
    stageNumbers: [1, 2, 4, 5],
    targetBadge: 'مطور مصاحف رقمية معتمد',
    focusKeywords: ['متجهات SVG', 'Offline SQLite', 'خطوط OpenType', 'تظليل لحظي', 'Flutter'],
  },
  {
    id: 'ai',
    name_ar: 'مسار مهندس الذكاء الاصطناعي واللغويات',
    name_en: 'Quranic AI & NLP Engineer Track',
    tagline_ar: 'تطوير نماذج التسميع الآلي والبحث الدلالي والمعالجة الصرفية للحزم القرآنية',
    description_ar:
      'مخصص لمهندسي الذكاء الاصطناعي والبيانات (Python, PyTorch, Embeddings). يركز على مجموعات البيانات الدقيقة، تصريف الألفاظ، نماذج التعرف الصوتي والتضمين الدلالي.',
    icon: Cpu,
    stageNumbers: [1, 3, 6],
    targetBadge: 'خبير ذكاء اصطناعي قرآني',
    focusKeywords: ['Speech Recognition', 'Embeddings', 'جذور صرفية', 'Vector Database', 'Python'],
  },
  {
    id: 'audio',
    name_ar: 'مسار مهندس الصوتيات ومزامنة التلاوات',
    name_en: 'Quranic Audio & Sync Engineer Track',
    tagline_ar: 'هندسة خوادم وبث التلاوات وخرائط التوقيت الدقيقة للقراءات العشر',
    description_ar:
      'مخصص لمهندسي الصوت والوسائط المتعددة. يركز على أرشيف التلاوات، توزيع الصوت، وخرائط التزامن بالملي ثانية وضمان جودة الروايات المتواترة.',
    icon: Headphones,
    stageNumbers: [1, 4, 5],
    targetBadge: 'مهندس نظم صوتية قرآنية',
    focusKeywords: ['EveryAyah CDN', 'خرائط التوقيت', 'تزامن الآيات', 'القراءات العشر', 'AAC/Opus'],
  },
  {
    id: 'web',
    name_ar: 'مسار مطور منصات الويب والموسوعات التفسيرية',
    name_en: 'Web Platforms & Tafsir Developer Track',
    tagline_ar: 'معمارية منصات الويب السريعة ومحركات التفاسير والترجمات العالمية',
    description_ar:
      'مخصص لمطوري الويب المتكامل (Next.js, SSR, GraphQL/REST). يركز على إتاحة مصاحف الويب الفورية، ربط كتب التفسير، ومحركات البحث النصي السريع.',
    icon: Globe,
    stageNumbers: [1, 2, 3, 4],
    targetBadge: 'مطور منصات قرآنية معتمد',
    focusKeywords: ['Next.js SSR', 'APIs قرآنية', 'ترجمات معاني', 'فهارس تفاسير', 'TypeScript'],
  },
];

interface StageDefinition {
  number: number;
  title: string;
  badge: string;
  icon: React.ElementType;
  filter: (r: Resource) => boolean;
}

const ROADMAP_STAGES: StageDefinition[] = [
  {
    number: 1,
    title: 'متون ومصادر المصحف الشريف والتراخيص المعتمدة',
    badge: 'المتون والنصوص',
    icon: BookOpen,
    filter: (r) => r.categories.includes('cat_quran_sources') || r.resource_type === 'mushaf',
  },
  {
    number: 2,
    title: 'الخطوط الحاسوبية واليونيكود والتيبوغرافيا المصحفية',
    badge: 'الخطوط والضبط',
    icon: Type,
    filter: (r) => r.categories.includes('cat_fonts') || r.resource_type === 'font',
  },
  {
    number: 3,
    title: 'علوم القرآن والتفاسير المعتمدة والترجمات العالمية',
    badge: 'التفاسير والترجمات',
    icon: Library,
    filter: (r) =>
      r.categories.includes('cat_tafsir') ||
      r.resource_type === 'tafsir' ||
      r.categories.includes('cat_translations') ||
      r.resource_type === 'translation',
  },
  {
    number: 4,
    title: 'الحزم البرمجية ومحركات البحث والتطوير والتطبيع',
    badge: 'الحزم والمكتبات',
    icon: Code2,
    filter: (r) =>
      r.categories.includes('cat_dev') ||
      ['library', 'sdk', 'tool', 'api'].includes(r.resource_type),
  },
  {
    number: 5,
    title: 'التلاوات الصوتية والمصاحف المرتلة ومزامنة الآيات',
    badge: 'الصوتيات والقراءات',
    icon: Headphones,
    filter: (r) =>
      r.categories.includes('cat_recitations') ||
      ['recitation', 'audio', 'tajweed'].includes(r.resource_type),
  },
  {
    number: 6,
    title: 'مجموعات البيانات والذكاء الاصطناعي ومعايير إتقان',
    badge: 'البيانات والذكاء الاصطناعي',
    icon: Cpu,
    filter: (r) => r.categories.includes('cat_datasets') || r.resource_type === 'dataset',
  },
];

interface StageConnectorPath {
  id: string;
  d: string;
}

interface RoadmapStageProps {
  stage: StageDefinition;
  resources: Resource[];
  searchQuery: string;
  onSelectResource: (res: Resource) => void;
  hoveredCardId: string | null;
  setHoveredCardId: (id: string | null) => void;
}

const RoadmapStageSection: React.FC<RoadmapStageProps> = ({
  stage,
  resources,
  searchQuery,
  onSelectResource,
  hoveredCardId,
  setHoveredCardId,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const centerNodeRef = useRef<HTMLDivElement>(null);
  const cardElementsRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const [paths, setPaths] = useState<StageConnectorPath[]>([]);

  // Split resources into two balanced wings around the center stage node
  const { rightWingResources, leftWingResources } = useMemo(() => {
    const half = Math.ceil(resources.length / 2);
    return {
      rightWingResources: resources.slice(0, half),
      leftWingResources: resources.slice(half),
    };
  }, [resources]);

  // Recalculate curved connector lines between center node and card elements
  const updateConnectorPaths = useCallback(() => {
    if (!containerRef.current || !centerNodeRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const centerRect = centerNodeRef.current.getBoundingClientRect();

    if (containerRect.width === 0 || centerRect.width === 0) return;

    const centerNodeRightX = centerRect.right - containerRect.left;
    const centerNodeLeftX = centerRect.left - containerRect.left;
    const centerNodeY = centerRect.top + centerRect.height / 2 - containerRect.top;
    const centerNodeBottomY = centerRect.bottom - containerRect.top;
    const centerNodeCenterX = centerRect.left + centerRect.width / 2 - containerRect.left;

    const newPaths: StageConnectorPath[] = [];

    cardElementsRef.current.forEach((el, cardId) => {
      if (!el) return;
      const cardRect = el.getBoundingClientRect();

      // Check if card is on the right wing, left wing, or underneath on mobile
      const isRight = cardRect.left >= centerRect.right - 15;
      const isLeft = cardRect.right <= centerRect.left + 15;
      const isBelow = cardRect.top >= centerRect.bottom - 10;

      if (!isRight && !isLeft && isBelow) {
        // Mobile layout: curves flow from bottom of center node down into cards
        const startX = centerNodeCenterX;
        const startY = centerNodeBottomY;
        const endX = cardRect.left + cardRect.width / 2 - containerRect.left;
        const endY = cardRect.top - containerRect.top;
        const midY = (startY + endY) / 2;
        const d = `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`;
        newPaths.push({ id: cardId, d });
      } else {
        // Desktop / Tablet layout: curves flow horizontally out from center sides
        let startX = centerNodeRightX;
        let endX = cardRect.left - containerRect.left;
        const cardY = cardRect.top + cardRect.height / 2 - containerRect.top;

        if (isLeft) {
          startX = centerNodeLeftX;
          endX = cardRect.right - containerRect.left;
        }

        const midX = (startX + endX) / 2;
        const d = `M ${startX} ${centerNodeY} C ${midX} ${centerNodeY}, ${midX} ${cardY}, ${endX} ${cardY}`;
        newPaths.push({ id: cardId, d });
      }
    });

    setPaths(newPaths);
  }, []);

  useEffect(() => {
    updateConnectorPaths();
    const t1 = setTimeout(updateConnectorPaths, 60);
    const t2 = setTimeout(updateConnectorPaths, 300);

    window.addEventListener('resize', updateConnectorPaths);
    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      observer = new ResizeObserver(() => updateConnectorPaths());
      observer.observe(containerRef.current);
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('resize', updateConnectorPaths);
      if (observer) observer.disconnect();
    };
  }, [updateConnectorPaths, resources]);

  const StageIcon = stage.icon;

  const isCardMatching = (res: Resource) => {
    if (!searchQuery.trim()) return false;
    const q = searchQuery.trim().toLowerCase();
    return (
      res.title_ar.toLowerCase().includes(q) ||
      (res.title_en && res.title_en.toLowerCase().includes(q)) ||
      res.summary_ar.toLowerCase().includes(q) ||
      res.tags.some((t) => t.toLowerCase().includes(q))
    );
  };

  const hasSearch = Boolean(searchQuery.trim());

  return (
    <div
      id={`stage-${stage.number}`}
      ref={containerRef}
      className="relative w-full py-8 my-4 scroll-mt-36"
    >
      {/* SVG Connecting Curved Lines Canvas */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
        aria-hidden="true"
      >
        {paths.map((p) => {
          const isHovered = hoveredCardId === p.id;
          return (
            <path
              key={p.id}
              d={p.d}
              fill="none"
              stroke={isHovered ? 'var(--ratq-primary-600)' : 'currentColor'}
              strokeWidth={isHovered ? 2.5 : 1.5}
              className={`transition-all duration-200 ${
                isHovered
                  ? 'opacity-100'
                  : 'text-border-strong dark:text-border opacity-60'
              }`}
            />
          );
        })}
      </svg>

      {/* Main Responsive Grid Layout: Wing 1 (Right) | Center Milestone | Wing 2 (Left) */}
      <div className="relative z-10 flex flex-col md:flex-row items-center md:items-center justify-between gap-6 md:gap-4 lg:gap-8 w-full">
        {/* Right Wing Resources (Appears on the right in RTL) */}
        <div className="flex-1 w-full flex flex-col gap-2.5 items-stretch md:items-end">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-2.5 w-full">
            {rightWingResources.map((res) => {
              const matched = hasSearch && isCardMatching(res);
              const dimmed = hasSearch && !matched;
              const isHovered = hoveredCardId === res.id;
              const isCertified = res.itqan_level === 'certified' || res.itqan_level === 'verified';

              return (
                <div
                  key={res.id}
                  ref={(el) => {
                    if (el) cardElementsRef.current.set(res.id, el);
                    else cardElementsRef.current.delete(res.id);
                  }}
                  onClick={() => onSelectResource(res)}
                  onMouseEnter={() => setHoveredCardId(res.id)}
                  onMouseLeave={() => setHoveredCardId(null)}
                  className={`px-3.5 py-2.5 min-h-[46px] rounded-xl border transition-all cursor-pointer select-none text-start text-xs font-bold leading-snug flex items-center justify-between gap-2 shadow-2xs group relative ${
                    matched
                      ? 'border-ratq-600 bg-ratq-50 dark:bg-ratq-950 text-ratq-900 dark:text-ratq-100 ring-2 ring-ratq-500/40'
                      : dimmed
                      ? 'opacity-30 border-border bg-subtle/30 text-fg-subtle'
                      : isHovered
                      ? isCertified
                        ? 'border-emerald-500 bg-[#e7f7ee] dark:bg-[#122b22] text-emerald-950 dark:text-emerald-100 shadow-sm -translate-y-0.5'
                        : 'border-ratq-600 bg-canvas text-ratq-800 dark:text-ratq-200 shadow-sm -translate-y-0.5'
                      : isCertified
                      ? 'border-[#c1edd4] dark:border-[#1d4737] bg-[#f0f9f4] dark:bg-[#0c1e19] text-fg hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-xs'
                      : 'border-border bg-canvas hover:border-ratq-400 text-fg hover:shadow-xs'
                  }`}
                  title={isCertified ? undefined : res.title_ar}
                >
                  {/* Instant Tooltip on Hover with Zero Delay */}
                  {isCertified && (
                    <div
                      className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 flex flex-col items-center z-50 pointer-events-none whitespace-nowrap opacity-0 group-hover:opacity-100 transition-none"
                      role="tooltip"
                    >
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/95 dark:bg-emerald-900/95 text-white text-[11px] font-semibold shadow-md border border-emerald-700/60 backdrop-blur-xs">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>ناشر ومورد معتمد</span>
                      </div>
                      <div className="w-2 h-2 bg-emerald-950/95 dark:bg-emerald-900/95 border-r border-b border-emerald-700/60 rotate-45 -mt-1" />
                    </div>
                  )}

                  <span className="line-clamp-2 flex-1 leading-snug">{res.title_ar}</span>
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 transition-transform ${
                      isHovered
                        ? 'bg-ratq-600 scale-125'
                        : res.itqan_level === 'gold'
                        ? 'bg-amber-500'
                        : isCertified
                        ? 'bg-emerald-500 ring-2 ring-emerald-500/20'
                        : 'bg-gray-300 dark:bg-zinc-600'
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Center Milestone Node (Prominent Stage Card with NO details) */}
        <div
          ref={centerNodeRef}
          className="shrink-0 w-full md:w-64 lg:w-72 p-4 sm:p-5 rounded-2xl border-2 border-ratq-600 bg-canvas shadow-md text-center relative group overflow-hidden"
        >
          {/* Muted Micro Dot Matrix Background */}
          <div
            className="absolute inset-0 pointer-events-none select-none overflow-hidden"
            aria-hidden="true"
          >
            <div
              className="absolute inset-0 opacity-[0.18] dark:opacity-[0.25]"
              style={{
                backgroundImage: 'radial-gradient(circle, currentColor 1.2px, transparent 1.2px)',
                backgroundSize: '13px 13px',
                color: 'var(--ratq-primary-600, #059669)',
              }}
            />
            {/* Subtle soft gradient overlay to keep center content calm and focused */}
            <div
              className="absolute inset-0 bg-gradient-to-b from-canvas/30 via-transparent to-canvas/70 pointer-events-none"
            />
          </div>

          <div className="relative z-10">
            {/* Stage Number & Badge */}
            <div className="flex items-center justify-center gap-1.5 mb-2">
              <span className="w-2 h-2 rounded-full bg-ratq-600 animate-pulse" />
              <span className="text-[11px] font-bold font-mono text-ratq-700 dark:text-ratq-300 uppercase tracking-wider">
                المرحلة {stage.number}
              </span>
            </div>

            {/* Stage Icon */}
            <div className="w-10 h-10 rounded-xl bg-canvas/90 dark:bg-canvas/90 text-ratq-700 dark:text-ratq-300 mx-auto flex items-center justify-center mb-2.5 border border-ratq-200 dark:border-ratq-800 shadow-2xs backdrop-blur-xs">
              <StageIcon className="w-5 h-5 text-ratq-600" />
            </div>

            {/* Clean Stage Title (Without Long Details) */}
            <h3 className="text-sm sm:text-base font-extrabold text-fg leading-snug">
              {stage.title}
            </h3>

            {/* Count pill */}
            <div className="mt-2.5">
              <span className="inline-block text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-canvas/90 dark:bg-canvas/90 text-fg-muted border border-border-subtle shadow-2xs backdrop-blur-xs">
                {resources.length} مورد موثق
              </span>
            </div>
          </div>
        </div>

        {/* Left Wing Resources (Appears on the left in RTL) */}
        <div className="flex-1 w-full flex flex-col gap-2.5 items-stretch md:items-start">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-2.5 w-full">
            {leftWingResources.map((res) => {
              const matched = hasSearch && isCardMatching(res);
              const dimmed = hasSearch && !matched;
              const isHovered = hoveredCardId === res.id;
              const isCertified = res.itqan_level === 'certified' || res.itqan_level === 'verified';

              return (
                <div
                  key={res.id}
                  ref={(el) => {
                    if (el) cardElementsRef.current.set(res.id, el);
                    else cardElementsRef.current.delete(res.id);
                  }}
                  onClick={() => onSelectResource(res)}
                  onMouseEnter={() => setHoveredCardId(res.id)}
                  onMouseLeave={() => setHoveredCardId(null)}
                  className={`px-3.5 py-2.5 min-h-[46px] rounded-xl border transition-all cursor-pointer select-none text-start text-xs font-bold leading-snug flex items-center justify-between gap-2 shadow-2xs group relative ${
                    matched
                      ? 'border-ratq-600 bg-ratq-50 dark:bg-ratq-950 text-ratq-900 dark:text-ratq-100 ring-2 ring-ratq-500/40'
                      : dimmed
                      ? 'opacity-30 border-border bg-subtle/30 text-fg-subtle'
                      : isHovered
                      ? isCertified
                        ? 'border-emerald-500 bg-[#e7f7ee] dark:bg-[#122b22] text-emerald-950 dark:text-emerald-100 shadow-sm -translate-y-0.5'
                        : 'border-ratq-600 bg-canvas text-ratq-800 dark:text-ratq-200 shadow-sm -translate-y-0.5'
                      : isCertified
                      ? 'border-[#c1edd4] dark:border-[#1d4737] bg-[#f0f9f4] dark:bg-[#0c1e19] text-fg hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-xs'
                      : 'border-border bg-canvas hover:border-ratq-400 text-fg hover:shadow-xs'
                  }`}
                  title={isCertified ? undefined : res.title_ar}
                >
                  {/* Instant Tooltip on Hover with Zero Delay */}
                  {isCertified && (
                    <div
                      className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 flex flex-col items-center z-50 pointer-events-none whitespace-nowrap opacity-0 group-hover:opacity-100 transition-none"
                      role="tooltip"
                    >
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/95 dark:bg-emerald-900/95 text-white text-[11px] font-semibold shadow-md border border-emerald-700/60 backdrop-blur-xs">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>ناشر ومورد معتمد</span>
                      </div>
                      <div className="w-2 h-2 bg-emerald-950/95 dark:bg-emerald-900/95 border-r border-b border-emerald-700/60 rotate-45 -mt-1" />
                    </div>
                  )}

                  <span className="line-clamp-2 flex-1 leading-snug">{res.title_ar}</span>
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 transition-transform ${
                      isHovered
                        ? 'bg-ratq-600 scale-125'
                        : res.itqan_level === 'gold'
                        ? 'bg-amber-500'
                        : isCertified
                        ? 'bg-emerald-500 ring-2 ring-emerald-500/20'
                        : 'bg-gray-300 dark:bg-zinc-600'
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export const QuranicRoadmapPage: React.FC = () => {
  const allResources = useMemo(() => mockRepo.getResources(), []);
  const [drawerResource, setDrawerResource] = useState<Resource | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [activeStageNumber, setActiveStageNumber] = useState<number>(1);
  const [showMethodologyModal, setShowMethodologyModal] = useState<boolean>(false);

  // Smart Wizard State
  const [selectedTrackId, setSelectedTrackId] = useState<string>('all');
  const [showQuizModal, setShowQuizModal] = useState<boolean>(false);
  const [quizStep, setQuizStep] = useState<number>(1);
  const [quizAnswers, setQuizAnswers] = useState<{
    projectType?: string;
    techStack?: string;
    priority?: string;
  }>({});
  const [quizRecommendedTrack, setQuizRecommendedTrack] = useState<QuranicTrack | null>(null);

  // Active Track Object
  const currentTrack = useMemo(() => {
    return QURANIC_TRACKS.find((t) => t.id === selectedTrackId) || QURANIC_TRACKS[0];
  }, [selectedTrackId]);

  // Stages filtered by active track
  const activeStages = useMemo(() => {
    return ROADMAP_STAGES.filter((st) => currentTrack.stageNumbers.includes(st.number));
  }, [currentTrack]);

  // Group resources by stage
  const stageResourcesMap = useMemo(() => {
    const map = new Map<number, Resource[]>();
    activeStages.forEach((st) => {
      map.set(st.number, allResources.filter(st.filter));
    });
    return map;
  }, [activeStages, allResources]);

  // Track active stage on scroll to dynamically highlight current stage in sticky tabs
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 220;
      for (let i = activeStages.length - 1; i >= 0; i--) {
        const st = activeStages[i];
        const el = document.getElementById(`stage-${st.number}`);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (top <= scrollPos) {
            setActiveStageNumber(st.number);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeStages]);

  // Smoothly scroll to a specific stage respecting the sticky navbar and sticky tabs
  const scrollToStage = (stageNum: number) => {
    setActiveStageNumber(stageNum);
    const el = document.getElementById(`stage-${stageNum}`);
    if (el) {
      const headerOffset = 135; // 64px site header + sticky pills bar height
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  // Escape key handler & body scroll lock for modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDrawerResource(null);
        setShowMethodologyModal(false);
        setShowQuizModal(false);
      }
    };
    if (drawerResource || showMethodologyModal || showQuizModal) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [drawerResource, showMethodologyModal, showQuizModal]);

  // Quiz Recommendation Logic
  const handleCalculateRecommendation = (answers: typeof quizAnswers) => {
    const { projectType, techStack } = answers;

    let targetId = 'mushaf';
    if (projectType === 'ai' || techStack === 'python') {
      targetId = 'ai';
    } else if (projectType === 'audio') {
      targetId = 'audio';
    } else if (projectType === 'web' || techStack === 'web') {
      targetId = 'web';
    } else if (projectType === 'all') {
      targetId = 'all';
    } else {
      targetId = 'mushaf';
    }

    const matched = QURANIC_TRACKS.find((t) => t.id === targetId) || QURANIC_TRACKS[1];
    setQuizRecommendedTrack(matched);
    setQuizStep(4);
  };

  const handleApplyRecommendedTrack = () => {
    if (quizRecommendedTrack) {
      setSelectedTrackId(quizRecommendedTrack.id);
    }
    setShowQuizModal(false);
    setQuizStep(1);
  };

  const handleResetQuiz = () => {
    setQuizAnswers({});
    setQuizRecommendedTrack(null);
    setQuizStep(1);
  };

  const searchMatchingCount = useMemo(() => {
    if (!searchQuery.trim()) return 0;
    const q = searchQuery.trim().toLowerCase();
    return allResources.filter(
      (r) =>
        r.title_ar.toLowerCase().includes(q) ||
        (r.title_en && r.title_en.toLowerCase().includes(q)) ||
        r.summary_ar.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q))
    ).length;
  }, [allResources, searchQuery]);

  return (
    <div className="max-w-container mx-auto px-4 sm:px-6 py-10 w-full text-start">
      {/* Breadcrumb & Header */}
      <div className="mb-8 pb-6 border-b border-border">
        <div className="flex items-center gap-2 text-xs text-fg-subtle mb-3">
          <Link to="/" className="hover:text-ratq-700 transition-colors">
            الرئيسية
          </Link>
          <span>/</span>
          <span className="text-ratq-700 font-bold">مسار المطور</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-ratq-200 bg-ratq-50 dark:border-ratq-800 dark:bg-ratq-950 text-ratq-800 dark:text-ratq-300 text-xs font-semibold mb-3">
              <Compass className="w-3.5 h-3.5 text-ratq-600" />
              <span>خريطة طريق تفاعلية مستوحاة من roadmap.sh</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-fg tracking-tight">
              خريطة طريق المطور القرآني التفاعلية
            </h1>
            <p className="text-xs sm:text-sm text-fg-muted mt-2 max-w-3xl leading-relaxed">
              مسار معماري متكامل يربط كافة الموارد الـ {allResources.length} المعتمدة عبر 6 مراحل متدرجة. عنوان كل مرحلة يظهر في الوسط وحوله بطاقات الموارد المترابطة بخطوط منحنية. انقر على أي مورد لفتح تفاصيله الكاملة.
            </p>
          </div>

          <div className="flex flex-wrap items-stretch gap-3 shrink-0">
            <div className="px-4 py-2.5 rounded-xl border border-border bg-subtle/50 text-xs text-fg flex flex-col justify-center">
              <span className="text-fg-subtle block text-2xs leading-tight">إجمالي الموارد المشمولة:</span>
              <span className="font-bold text-sm text-ratq-700 dark:text-ratq-400 font-mono leading-snug">
                {allResources.length} مورداً موثقاً
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowQuizModal(true);
                setQuizStep(1);
              }}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-ratq-700 to-ratq-600 hover:from-ratq-800 hover:to-ratq-700 text-white shadow-xs hover:shadow-md transition-all cursor-pointer text-start border border-ratq-600/30"
            >
              <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="block text-[10.5px] sm:text-2xs text-amber-200/90 font-medium leading-tight">توجيه ذكي لمشروعك (60 ثانية):</span>
                <span className="block text-xs sm:text-[13px] font-bold text-white leading-snug">المعالج الذكي لتحديد مسارك</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Applied Track Indicator if tailored via Wizard */}
      {selectedTrackId !== 'all' && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 p-3.5 px-4 rounded-2xl border border-ratq-200 dark:border-ratq-800/60 bg-ratq-50/60 dark:bg-ratq-950/40 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-ratq-600 text-white flex items-center justify-center shrink-0">
              {React.createElement(currentTrack.icon, { className: 'w-4 h-4' })}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-fg">
                  المسار المعتمد عبر المعالج: <span className="text-ratq-700 dark:text-ratq-300 font-extrabold">{currentTrack.name_ar}</span>
                </span>
                <span className="text-2xs font-mono text-fg-subtle bg-canvas px-2 py-0.5 rounded border border-border-subtle">
                  {activeStages.length} مراحل مفلترة
                </span>
              </div>
              <p className="text-[11px] text-fg-muted mt-0.5">
                {currentTrack.tagline_ar}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                setShowQuizModal(true);
                setQuizStep(1);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-ratq-300 dark:border-ratq-800 bg-canvas hover:bg-subtle text-xs font-semibold text-ratq-700 dark:text-ratq-300 transition-colors shadow-2xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-ratq-600" />
              <span>إعادة التشخيص بالمعالج</span>
            </button>
            <span className="text-fg-subtle">•</span>
            <button
              type="button"
              onClick={() => setSelectedTrackId('all')}
              className="text-xs text-fg-subtle hover:text-fg cursor-pointer"
            >
              عرض كافة المراحل (إعادة ضبط)
            </button>
          </div>
        </div>
      )}

      {/* Roadmap Search Bar */}
      <div className="max-w-lg mx-auto mb-6">
        <div className="relative">
          <Search className="w-4 h-4 text-fg-subtle absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              selectedTrackId !== 'all'
                ? `ابحث داخل ${currentTrack.name_ar} بالاسم أو التقنية...`
                : 'ابحث عن مورد في الخريطة بالاسم أو التقنية...'
            }
            className="w-full ps-10 pe-16 py-2.5 text-xs rounded-xl border border-border bg-canvas text-fg placeholder:text-fg-subtle focus:outline-none focus:border-ratq-500 shadow-2xs"
          />
          {searchQuery && (
            <div className="absolute end-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <span className="text-2xs font-mono font-bold text-ratq-700 dark:text-ratq-400">
                {searchMatchingCount} تطابق
              </span>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-2xs text-fg-subtle hover:text-fg cursor-pointer"
              >
                مسح
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Stage Navigation Tabs Bar (Locks to top during scroll) */}
      <div className="sticky top-16 z-30 py-2.5 sm:py-3 mb-8 bg-canvas/90 backdrop-blur-md border-y border-border shadow-2xs -mx-4 px-4 sm:-mx-6 sm:px-6 transition-all">
        <div className="max-w-5xl mx-auto flex items-stretch gap-2 sm:gap-2.5">
          {/* Integrated query/info button: Placed BEFORE Stage 1 with light gray background */}
          <button
            type="button"
            onClick={() => setShowMethodologyModal(true)}
            className="flex flex-col items-center justify-center py-2 px-2.5 sm:px-3.5 rounded-xl border border-border bg-muted/70 hover:bg-muted dark:bg-muted/50 hover:border-ratq-500 hover:text-ratq-700 text-fg transition-all cursor-pointer shadow-2xs shrink-0 self-stretch group min-w-[72px] sm:min-w-[100px]"
            title="دليل منهجية وفلسفة بناء المراحل وكيف تساعدك في مشروعك"
            aria-label="دليل منهجية وفلسفة بناء المراحل"
          >
            <div className="flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-ratq-600 group-hover:scale-110 transition-transform shrink-0" />
              <span className="text-xs font-bold leading-tight whitespace-nowrap">دليل المسار</span>
            </div>
            <span className="text-[10px] mt-0.5 sm:mt-1 font-medium text-fg-subtle leading-none whitespace-nowrap">
              فلسفة البناء
            </span>
          </button>

          {/* Standing Vertical Separator Line (خط واقف خفيف) */}
          <div className="w-px bg-border shrink-0 self-stretch my-1 mx-0.5" />

          {/* Dynamic Stages Tabs */}
          <div className="flex items-stretch gap-2 flex-1 w-full overflow-x-auto pb-0.5 sm:pb-0">
            {activeStages.map((st) => {
              const isActive = activeStageNumber === st.number;
              const count = stageResourcesMap.get(st.number)?.length || 0;

              return (
                <button
                  key={st.number}
                  type="button"
                  onClick={() => scrollToStage(st.number)}
                  className={`flex-1 min-w-[85px] flex flex-col items-center justify-center py-2 px-2 rounded-xl border transition-all cursor-pointer shadow-2xs select-none text-center ${
                    isActive
                      ? 'border-ratq-600 bg-ratq-700 text-white shadow-xs ring-2 ring-ratq-600/20'
                      : 'border-border bg-canvas hover:border-ratq-500 hover:text-ratq-700 text-fg hover:bg-subtle/60'
                  }`}
                  title={`الانتقال إلى المرحلة ${st.number}: ${st.title}`}
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        isActive ? 'bg-white' : 'bg-ratq-600'
                      }`}
                    />
                    <span className="text-xs font-bold leading-tight">المرحلة {st.number}</span>
                  </div>
                  <span
                    className={`text-[10px] mt-1 font-medium transition-colors leading-none ${
                      isActive ? 'text-ratq-100' : 'text-fg-muted'
                    }`}
                  >
                    {count} مورد
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Roadmap Canvas Container */}
      <div className="relative max-w-6xl mx-auto rounded-3xl border border-border bg-canvas p-4 sm:p-8 lg:p-10 shadow-xs overflow-hidden">
        {/* Subtle Roadmap Grid/Dots Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#d1d5db_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />

        {/* Vertical Central Spine Path behind Stages */}
        <div className="relative z-10 space-y-2">
          {activeStages.map((stage, idx) => {
            const stageRes = stageResourcesMap.get(stage.number) || [];

            return (
              <React.Fragment key={stage.number}>
                {/* Stage Flow Block */}
                <RoadmapStageSection
                  stage={stage}
                  resources={stageRes}
                  searchQuery={searchQuery}
                  onSelectResource={(res) => setDrawerResource(res)}
                  hoveredCardId={hoveredCardId}
                  setHoveredCardId={setHoveredCardId}
                />

                {/* Vertical Central Spine Connector between Stages */}
                {idx < activeStages.length - 1 && (
                  <div className="flex flex-col items-center justify-center my-2 py-1 relative z-20">
                    <div className="w-0.5 h-10 bg-gradient-to-b from-ratq-600 to-ratq-500/30" />
                    <div className="w-7 h-7 rounded-full border-2 border-ratq-600 bg-canvas flex items-center justify-center text-ratq-700 dark:text-ratq-300 text-xs shadow-xs my-1 font-bold">
                      ↓
                    </div>
                    <div className="w-0.5 h-10 bg-gradient-to-b from-ratq-500/30 to-ratq-600" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Slide-over Drawer Modal from the Left for Resource Details */}
      {drawerResource && (
        <div
          className="fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="drawer-resource-title"
        >
          {/* Dimmed Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-modal-fade-in"
            onClick={() => setDrawerResource(null)}
            aria-hidden="true"
          />

          {/* Drawer Panel Sliding in from the Left */}
          <div className="fixed inset-y-0 left-0 z-10 w-full max-w-xl md:max-w-2xl h-full bg-canvas border-r border-border shadow-2xl flex flex-col animate-slide-in-left overflow-hidden text-start">
            {/* Drawer Header */}
            <div className="p-5 sm:p-6 border-b border-border flex items-center justify-between gap-4 bg-canvas/95 backdrop-blur-xs sticky top-0 z-20">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-ratq-50 dark:bg-ratq-950 text-ratq-700 dark:text-ratq-300 flex items-center justify-center shrink-0 border border-ratq-200 dark:border-ratq-800 shadow-2xs">
                  <Package className="w-5 h-5 text-ratq-600" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[10px] font-bold font-mono text-ratq-700 uppercase tracking-wider bg-ratq-50 dark:bg-ratq-950 px-2 py-0.5 rounded border border-ratq-200 dark:border-ratq-800">
                      تفاصيل المورد المعتمد
                    </span>
                    <ItqanBadge level={drawerResource.itqan_level} size="sm" />
                  </div>
                  <h3 id="drawer-resource-title" className="text-base sm:text-lg font-bold text-fg leading-tight truncate">
                    {drawerResource.title_ar}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setDrawerResource(null)}
                className="p-2 rounded-lg text-fg-subtle hover:text-fg hover:bg-subtle transition-colors cursor-pointer shrink-0"
                aria-label="إغلاق النافذة"
                title="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-start">
              {/* English Title & Metadata Badges */}
              <div className="space-y-2.5 pb-4 border-b border-border-subtle">
                {drawerResource.title_en && (
                  <p className="text-xs font-mono text-fg-subtle">
                    {drawerResource.title_en}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-2">
                  <AccessBadge level={drawerResource.access_level} />
                  <LicenseBadge licenseId={drawerResource.license_id} spdx={drawerResource.license_spdx} />
                  {drawerResource.latest_version && (
                    <span className="text-2xs font-mono text-fg-subtle bg-muted px-2 py-0.5 rounded border border-border-subtle">
                      v{drawerResource.latest_version}
                    </span>
                  )}
                </div>

                {/* Publisher Info */}
                {drawerResource.publisher && (
                  <div className="flex items-center gap-2 text-xs text-fg-muted pt-1">
                    <span className="text-fg-subtle">الناشر المعتمد:</span>
                    <span className="font-semibold text-fg">
                      {drawerResource.publisher.name_ar}
                    </span>
                    {drawerResource.publisher.verification_status === 'verified' && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                        <ShieldCheck className="w-3 h-3" />
                        <span>ناشر موثق</span>
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Summary */}
              <div>
                <h4 className="text-xs font-bold text-fg uppercase tracking-wider mb-1.5">
                  نبذة عن المورد وغرض الاستخدام:
                </h4>
                <p className="text-xs text-fg leading-relaxed">
                  {drawerResource.summary_ar}
                </p>
              </div>

              {/* Description */}
              {drawerResource.description_ar && (
                <div>
                  <h4 className="text-xs font-bold text-fg uppercase tracking-wider mb-1.5">
                    الوصف التفصيلي:
                  </h4>
                  <div className="p-3.5 rounded-xl bg-subtle/50 border border-border-subtle text-xs text-fg-muted leading-relaxed whitespace-pre-line max-h-52 overflow-y-auto font-sans">
                    {drawerResource.description_ar}
                  </div>
                </div>
              )}

              {/* Tech Stack & Stats */}
              <div className="pt-4 border-t border-border-subtle space-y-3">
                <div>
                  <span className="text-[11px] font-medium text-fg-subtle block mb-1.5">
                    التقنيات والصيغ البرمجية المدعومة:
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {drawerResource.tech_stack && drawerResource.tech_stack.length > 0 ? (
                      drawerResource.tech_stack.map((tech) => (
                        <span
                          key={tech}
                          className="text-[10px] font-mono text-fg-muted bg-subtle px-2 py-0.5 rounded border border-border-subtle"
                        >
                          {tech}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-fg-subtle">ملفات ومصادر قياسية</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-fg-subtle pt-2">
                  <div className="flex items-center gap-1.5">
                    <RatingStars rating={drawerResource.rating_avg} size={13} />
                    <span className="font-bold text-fg">
                      {drawerResource.rating_avg}
                    </span>
                    <span className="text-fg-subtle">({drawerResource.rating_count})</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Download className="w-3.5 h-3.5 text-fg-subtle" />
                    <span>{drawerResource.downloads_count.toLocaleString()} تنزيل</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-fg-subtle" />
                    <span>{drawerResource.views_count.toLocaleString()} مشاهدة</span>
                  </div>
                </div>
              </div>

              {/* Documentation & Repo Links */}
              {(drawerResource.docs_url || drawerResource.repo_url) && (
                <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-border-subtle text-xs">
                  {drawerResource.docs_url && (
                    <a
                      href={drawerResource.docs_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-ratq-700 hover:underline font-semibold"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>الوثائق والتوثيق البرمجي ↗</span>
                    </a>
                  )}
                  {drawerResource.repo_url && (
                    <a
                      href={drawerResource.repo_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-ratq-700 hover:underline font-semibold"
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      <span>المستودع المصدري ↗</span>
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 sm:p-5 border-t border-border bg-canvas/95 backdrop-blur-xs flex items-center justify-between gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDrawerResource(null)}
              >
                <span>إغلاق النافذة</span>
              </Button>

              <Link to={`/resources/${drawerResource.slug}`}>
                <Button size="sm" variant="primary">
                  <span>عرض صفحة المورد الكاملة</span>
                  <ExternalLink className="w-3.5 h-3.5 ms-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Methodology & Architecture Explanation Modal */}
      {showMethodologyModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="methodology-modal-title"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-modal-fade-in"
            onClick={() => setShowMethodologyModal(false)}
            aria-hidden="true"
          />

          {/* Modal Card */}
          <div className="relative z-10 w-full max-w-3xl max-h-[90vh] bg-canvas rounded-2xl border border-border shadow-2xl flex flex-col overflow-hidden text-start animate-scale-up">
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-border bg-canvas/95 backdrop-blur-xs flex items-center justify-between gap-4 sticky top-0 z-20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-ratq-50 dark:bg-ratq-950 text-ratq-700 dark:text-ratq-300 flex items-center justify-center shrink-0 border border-ratq-200 dark:border-ratq-800 shadow-2xs">
                  <Compass className="w-5 h-5 text-ratq-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold font-mono text-ratq-700 uppercase tracking-wider bg-ratq-50 dark:bg-ratq-950 px-2 py-0.5 rounded border border-ratq-200 dark:border-ratq-800">
                      دليل المنهجية المعمارية
                    </span>
                  </div>
                  <h2 id="methodology-modal-title" className="text-base sm:text-xl font-extrabold text-fg">
                    لماذا بُنيت خريطة طريق المطور القرآني بهذا التسلسل؟
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowMethodologyModal(false)}
                className="p-2 rounded-lg text-fg-subtle hover:text-fg hover:bg-subtle transition-colors cursor-pointer shrink-0"
                aria-label="إغلاق النافذة"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-fg leading-relaxed">
              {/* Introduction Callout */}
              <div className="p-3.5 sm:p-4 rounded-xl border border-border/70 bg-subtle/40 text-fg-muted">
                <p className="text-[11px] sm:text-xs leading-relaxed">
                  تعتمد هندسة البرمجيات القرآنية على مبدأ <span className="font-semibold text-fg">«التدرج المعماري للأولويات والاعتمادية (Architectural Dependency Hierarchy)»</span>؛ فكل طبقة برمجية تستند بالضرورة إلى سلامة واستقرار الطبقة التأسيسية التي تسبقها في المسار.
                </p>
              </div>

              {/* The 6 Stages Detailed Breakdown */}
              <div>
                <h3 className="text-xs font-bold text-fg-subtle uppercase tracking-wider mb-3">
                  سلسلة المراحل الست ومنطق البناء البرمجي:
                </h3>
                <div className="space-y-3">
                  {/* Stage 1 */}
                  <div className="p-3.5 rounded-xl border border-border bg-subtle/30 flex gap-3.5 items-start">
                    <div className="w-7 h-7 rounded-lg bg-ratq-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      1
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-fg text-xs sm:text-sm">متون ومصادر المصحف والتراخيص (قاعدة الهرم)</h4>
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-canvas text-fg-muted border border-border">حجر الأساس</span>
                      </div>
                      <p className="text-xs text-fg-muted leading-normal">
                        <strong>لماذا أولاً؟</strong> سلامة كلمة وحرف المصحف خط أحمر. البدء بالنصوص المعتمدة والخاضعة لمصادقات مجمع الملك فهد أو تنزيل يمنع أي تحريف في علامات الضبط أو سقط في النص، مع وضوح التراخيص القانونية للاستخدام.
                      </p>
                    </div>
                  </div>

                  {/* Stage 2 */}
                  <div className="p-3.5 rounded-xl border border-border bg-subtle/30 flex gap-3.5 items-start">
                    <div className="w-7 h-7 rounded-lg bg-ratq-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      2
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-fg text-xs sm:text-sm">الخطوط الحاسوبية وضبط الرسم العثماني (طبقة العرض)</h4>
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-canvas text-fg-muted border border-border">العرض البصري</span>
                      </div>
                      <p className="text-xs text-fg-muted leading-normal">
                        <strong>لماذا ثانياً؟</strong> القرآن لا يُعرض بخطوط النظام القياسية؛ فهو يتطلب خطوط OpenType مصحفية مخصصة وتقنيات تيبوغرافيا دقيقة لتموضع علامات الوقف، والسجدات، وأرقام الآيات، والرسم العثماني المعتمد.
                      </p>
                    </div>
                  </div>

                  {/* Stage 3 */}
                  <div className="p-3.5 rounded-xl border border-border bg-subtle/30 flex gap-3.5 items-start">
                    <div className="w-7 h-7 rounded-lg bg-ratq-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      3
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-fg text-xs sm:text-sm">علوم القرآن والتفاسير والترجمات (طبقة المعنى)</h4>
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-canvas text-fg-muted border border-border">السياق والدلالة</span>
                      </div>
                      <p className="text-xs text-fg-muted leading-normal">
                        <strong>لماذا ثالثاً؟</strong> بعد استقرار النص وعرضه، يحتاج التطبيق إلى ربطه بقواعد بيانات معتمدة للتفاسير (كابن كثير والسعدي) والترجمات العالمية وفق معرفات قياسية موحدة للآيات والسور.
                      </p>
                    </div>
                  </div>

                  {/* Stage 4 */}
                  <div className="p-3.5 rounded-xl border border-border bg-subtle/30 flex gap-3.5 items-start">
                    <div className="w-7 h-7 rounded-lg bg-ratq-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      4
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-fg text-xs sm:text-sm">الحزم البرمجية ومحركات البحث والتطبيع (المنطق البرمجي)</h4>
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-canvas text-fg-muted border border-border">المحرك التشغيلي</span>
                      </div>
                      <p className="text-xs text-fg-muted leading-normal">
                        <strong>لماذا رابعاً؟</strong> توفير مكتبات جاهزة لمختلف المنصات (Flutter, React, Swift, Kotlin, Python) لإجراء عمليات تطبيع النص (إزالة التشكيل، توحيد الهمزات)، والبحث السريع، والاتصال بالـ APIs.
                      </p>
                    </div>
                  </div>

                  {/* Stage 5 */}
                  <div className="p-3.5 rounded-xl border border-border bg-subtle/30 flex gap-3.5 items-start">
                    <div className="w-7 h-7 rounded-lg bg-ratq-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      5
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-fg text-xs sm:text-sm">التلاوات الصوتية والمصاحف المرتلة ومزامنة الآيات</h4>
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-canvas text-fg-muted border border-border">الطبقة السمعية</span>
                      </div>
                      <p className="text-xs text-fg-muted leading-normal">
                        <strong>لماذا خامساً؟</strong> تزويد التطبيق بملفات الصوت لمشاهير القراء والمصاحف المرتلة، وربطها بملفات التوقيت اللحظي (Timestamps) لتظليل الآيات والكلمات أثناء الاستماع.
                      </p>
                    </div>
                  </div>

                  {/* Stage 6 */}
                  <div className="p-3.5 rounded-xl border border-border bg-subtle/30 flex gap-3.5 items-start">
                    <div className="w-7 h-7 rounded-lg bg-ratq-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      6
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-fg text-xs sm:text-sm">مجموعات البيانات والذكاء الاصطناعي ومعيار إتقان</h4>
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-canvas text-fg-muted border border-border">الطبقة المتقدمة والاعتماد</span>
                      </div>
                      <p className="text-xs text-fg-muted leading-normal">
                        <strong>لماذا سادساً؟</strong> ذروة التطبيق: البحث الدلالي بالمعنى، وتطبيقات المعالجة اللغوية الطبيعية (NLP)، والتحقق الصارم عبر «معيار إتقان» لضمان خلو التطبيق من الهلوسة البرمجية أو المخالفات.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* How it helps the developer */}
              <div className="pt-2 border-t border-border">
                <h3 className="text-xs font-bold text-fg-subtle uppercase tracking-wider mb-3">
                  كيف تساعدك هذه الخريطة عملياً في إنجاز مشروعك؟
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl border border-border bg-canvas shadow-2xs">
                    <span className="text-ratq-600 font-bold block mb-1">1. منع الهدر البرمجي</span>
                    <p className="text-xs text-fg-muted">
                      بدلاً من قضاء أسابيع في تنظيف نصوص أو بناء محركات تجريد الحروف، توفر الخريطة مكتبات مجربة وموثقة جاهزة للتثبيت الفوري.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl border border-border bg-canvas shadow-2xs">
                    <span className="text-ratq-600 font-bold block mb-1">2. وضوح خطة البناء</span>
                    <p className="text-xs text-fg-muted">
                      تعطيك وفريقك تسلسلاً معمارياً دقيقاً، وتمنع البدء بطبقات متقدمة قبل استيفاء المتطلبات الأساسية للنص والخطوط.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl border border-border bg-canvas shadow-2xs">
                    <span className="text-ratq-600 font-bold block mb-1">3. مطابقة معيار إتقان</span>
                    <p className="text-xs text-fg-muted">
                      كافة الموارد المعروضة مفحوصة ومرتبطة بمستويات إتقان وتراخيص واضحة، لحماية مشروعك من المخالفات الفقهية أو القانونية.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-5 border-t border-border bg-subtle/30 flex flex-col sm:flex-row items-center justify-between gap-3">
              <Link
                to="/resources/wizard"
                onClick={() => setShowMethodologyModal(false)}
                className="text-xs font-bold text-ratq-700 hover:text-ratq-800 dark:text-ratq-400 dark:hover:text-ratq-300 transition-colors flex items-center gap-1.5"
              >
                <span>تريد تجميع حزمة تقنية جاهزة لمشروعك تلقائياً؟</span>
                <span className="underline underline-offset-4">جرب المُوجِّه التفاعلي ←</span>
              </Link>

              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowMethodologyModal(false)}
                className="w-full sm:w-auto"
              >
                فهمت المنهجية، ابدأ التصفح
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Modal for Interactive Pathway Determination */}
      {showQuizModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="quiz-modal-title"
        >
          {/* Backdrop (Closes modal on outside click) */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-modal-fade-in cursor-pointer"
            onClick={() => setShowQuizModal(false)}
            aria-hidden="true"
            data-testid="quiz-modal-backdrop"
          />

          <div className="relative z-10 w-full max-w-xl bg-canvas border border-border rounded-3xl shadow-2xl overflow-hidden animate-modal-zoom-in text-start">
            {/* Modal Header */}
            <div className="p-5 border-b border-border flex items-center justify-between gap-3 bg-subtle/30">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-ratq-600 text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <h3 id="quiz-modal-title" className="text-sm font-bold text-fg">
                    معالج توليد المسار القرآني المخصص
                  </h3>
                  <p className="text-[11px] text-fg-muted font-mono">
                    {quizStep <= 3 ? `الخطوة ${quizStep} من 3 • 60 ثانية` : 'نتيجة المسار المقترح'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowQuizModal(false)}
                className="p-1.5 rounded-lg text-fg-subtle hover:text-fg hover:bg-subtle transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quiz Content by Step */}
            <div className="p-6 space-y-4 max-h-[460px] overflow-y-auto">
              {/* Step 1: Project Type */}
              {quizStep === 1 && (
                <div className="space-y-3">
                  <h4 className="text-xs sm:text-sm font-bold text-fg leading-relaxed">
                    1. ما هو نوع المشروع القرآني الذي تسعى لبنائه وتطويره؟
                  </h4>
                  <div className="space-y-2">
                    {[
                      {
                        id: 'mushaf',
                        icon: Smartphone,
                        title: 'تطبيق مصحف رقمي وقراءة على الجوال',
                        desc: 'عرض متجهات الرسم العثماني دون إنترنت، وتظليل الآيات',
                      },
                      {
                        id: 'ai',
                        icon: Cpu,
                        title: 'نظام ذكاء اصطناعي وتسميع أو بحث دلالي',
                        desc: 'التعرف الصوتي على التلاوة، تصريف الألفاظ، وتضمين المتشابهات',
                      },
                      {
                        id: 'audio',
                        icon: Headphones,
                        title: 'منصة تلاوات صوتية وإذاعات بالروايات المتواترة',
                        desc: 'بث الصوتيات، خرائط التوقيت والتزامن اللحظي بالميلي ثانية',
                      },
                      {
                        id: 'web',
                        icon: Globe,
                        title: 'موقع ويب وموسوعة للتفاسير والترجمات',
                        desc: 'عرض سريع على المتصفح، محركات بحث نصي، وتعدد اللغات',
                      },
                      {
                        id: 'all',
                        icon: Compass,
                        title: 'مشروع شامل أو استكشاف لكافة البنى التحتية',
                        desc: 'الاطلاع على كافة الموارد والمراحل من الألف إلى الياء',
                      },
                    ].map((opt) => {
                      const Icon = opt.icon;
                      const isChosen = quizAnswers.projectType === opt.id;

                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setQuizAnswers({ ...quizAnswers, projectType: opt.id });
                            setQuizStep(2);
                          }}
                          className={`w-full p-3.5 rounded-2xl border text-start transition-all cursor-pointer flex items-center gap-3 group ${
                            isChosen
                              ? 'border-ratq-600 bg-ratq-50 dark:bg-ratq-950/70 shadow-xs ring-1 ring-ratq-600'
                              : 'border-border bg-canvas hover:border-ratq-300 hover:bg-subtle'
                          }`}
                        >
                          <div
                            className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${
                              isChosen
                                ? 'bg-ratq-600 text-white border-ratq-600'
                                : 'bg-subtle text-fg-muted border-border-subtle group-hover:text-fg'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-fg group-hover:text-ratq-700 transition-colors">
                              {opt.title}
                            </div>
                            <div className="text-[10px] text-fg-muted mt-0.5">{opt.desc}</div>
                          </div>
                          <Check
                            className={`w-4 h-4 text-ratq-600 transition-opacity ${
                              isChosen ? 'opacity-100' : 'opacity-0'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 2: Tech Stack */}
              {quizStep === 2 && (
                <div className="space-y-3">
                  <h4 className="text-xs sm:text-sm font-bold text-fg leading-relaxed">
                    2. ما هي بيئة العمل أو إطار البرمجة الأساسي المفضل لديك؟
                  </h4>
                  <div className="space-y-2">
                    {[
                      {
                        id: 'flutter',
                        title: 'Flutter / Dart',
                        desc: 'لتطوير تطبيقات هواتف تعمل بسلاسة على iOS وAndroid بنواة واحدة',
                      },
                      {
                        id: 'python',
                        title: 'Python / PyTorch / AI',
                        desc: 'لبناء نماذج التعلم العميق والذكاء الاصطناعي ومعالجة اللغات الطبيعية',
                      },
                      {
                        id: 'web',
                        title: 'React / Next.js / TypeScript',
                        desc: 'لمنصات الويب السريعة فائقة الأداء مع العرض من جانب الخادم (SSR)',
                      },
                      {
                        id: 'native',
                        title: 'Swift (iOS) / Kotlin (Android)',
                        desc: 'للتطوير الأصيل مع أعلى درجات التحكم في الذاكرة ومحركات الرسم',
                      },
                      {
                        id: 'api',
                        title: 'APIs وخرائط قواعد البيانات الجاهزة (SQLite / REST)',
                        desc: 'للتكامل المباشر بدون الاعتماد على لغة معينة',
                      },
                    ].map((opt) => {
                      const isChosen = quizAnswers.techStack === opt.id;

                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setQuizAnswers({ ...quizAnswers, techStack: opt.id });
                            setQuizStep(3);
                          }}
                          className={`w-full p-3.5 rounded-2xl border text-start transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                            isChosen
                              ? 'border-ratq-600 bg-ratq-50 dark:bg-ratq-950/70 shadow-xs ring-1 ring-ratq-600'
                              : 'border-border bg-canvas hover:border-ratq-300 hover:bg-subtle'
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-fg group-hover:text-ratq-700 transition-colors">
                              {opt.title}
                            </div>
                            <div className="text-[10px] text-fg-muted mt-0.5">{opt.desc}</div>
                          </div>
                          <Check
                            className={`w-4 h-4 text-ratq-600 shrink-0 transition-opacity ${
                              isChosen ? 'opacity-100' : 'opacity-0'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 3: Priority */}
              {quizStep === 3 && (
                <div className="space-y-3">
                  <h4 className="text-xs sm:text-sm font-bold text-fg leading-relaxed">
                    3. ما هي أولويتك ومستواك في التعامل مع التقنيات القرآنية؟
                  </h4>
                  <div className="space-y-2">
                    {[
                      {
                        id: 'beginner',
                        title: 'أول تجربة لي في التطبيقات القرآنية',
                        desc: 'أحتاج البدء من الأساسيات: فهم الرسم العثماني والضوابط الشرعية المعتمدة أولاً',
                      },
                      {
                        id: 'ready_sdk',
                        title: 'لدي مشروع قائم وأريد حزم ومكتبات إنتاجية جاهزة',
                        desc: 'أبحث عن حلول فورية ومجربة للخطوط، التزامن الصوتي، أو قواعد بيانات التفسير',
                      },
                      {
                        id: 'audit',
                        title: 'مشروع متقدم يحتاج الامتثال لمعايير إتقان الذهبية',
                        desc: 'فحص التراخيص، التدقيق العلمي، وضمان الجاهزية للعمل مع ملايين المستخدمين',
                      },
                    ].map((opt) => {
                      const isChosen = quizAnswers.priority === opt.id;

                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            const updated = { ...quizAnswers, priority: opt.id };
                            setQuizAnswers(updated);
                            handleCalculateRecommendation(updated);
                          }}
                          className={`w-full p-3.5 rounded-2xl border text-start transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                            isChosen
                              ? 'border-ratq-600 bg-ratq-50 dark:bg-ratq-950/70 shadow-xs ring-1 ring-ratq-600'
                              : 'border-border bg-canvas hover:border-ratq-300 hover:bg-subtle'
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-fg group-hover:text-ratq-700 transition-colors">
                              {opt.title}
                            </div>
                            <div className="text-[10px] text-fg-muted mt-0.5">{opt.desc}</div>
                          </div>
                          <Check
                            className={`w-4 h-4 text-ratq-600 shrink-0 transition-opacity ${
                              isChosen ? 'opacity-100' : 'opacity-0'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 4: Result Card */}
              {quizStep === 4 && quizRecommendedTrack && (
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl border-2 border-ratq-500 bg-ratq-50/70 dark:bg-ratq-950/60 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-ratq-700 dark:text-ratq-300 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-ratq-600" />
                        <span>المسار الهندسي الموصى به لمشروعك:</span>
                      </span>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-ratq-700 text-white">
                        تطابق بنسبة 98%
                      </span>
                    </div>

                    <div className="flex items-start gap-3 pt-1">
                      <div className="w-12 h-12 rounded-xl bg-ratq-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        {React.createElement(quizRecommendedTrack.icon, { className: 'w-6 h-6' })}
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-fg">
                          {quizRecommendedTrack.name_ar}
                        </h3>
                        <p className="text-xs text-ratq-700 dark:text-ratq-400 font-semibold mt-0.5">
                          {quizRecommendedTrack.tagline_ar}
                        </p>
                        <p className="text-xs text-fg-muted mt-1 leading-relaxed">
                          {quizRecommendedTrack.description_ar}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-ratq-200 dark:border-ratq-800 flex flex-wrap items-center justify-between gap-2 text-xs text-fg-subtle">
                      <span>عدد مراحل المسار: <strong className="text-fg">{quizRecommendedTrack.stageNumbers.length} مراحل</strong></span>
                      <span>الشارة: <strong className="text-emerald-600">{quizRecommendedTrack.targetBadge}</strong></span>
                    </div>
                  </div>

                  <p className="text-xs text-fg-muted leading-relaxed">
                    بالنقر على الزر أدناه، سيتم تفعيل هذا المسار مباشرة في صفحة خارطة الطريق، وترشيح المكتبات والمراحل المناسبة لتنفيذه فوراً.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 border-t border-border bg-subtle/40 flex items-center justify-between gap-2">
              {quizStep > 1 && quizStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setQuizStep(quizStep - 1)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-canvas text-xs font-semibold text-fg hover:bg-subtle transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>الخطوة السابقة</span>
                </button>
              ) : quizStep === 4 ? (
                <button
                  type="button"
                  onClick={handleResetQuiz}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-canvas text-xs font-semibold text-fg hover:bg-subtle transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-fg-subtle" />
                  <span>إعادة الإجابات</span>
                </button>
              ) : (
                <div />
              )}

              {quizStep === 4 ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleApplyRecommendedTrack}
                  className="gap-1.5 font-bold"
                >
                  <Check className="w-4 h-4" />
                  <span>اعتماد هذا المسار وتطبيقه على الخارطة الآن</span>
                </Button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowQuizModal(false)}
                  className="px-3 py-1.5 text-xs text-fg-subtle hover:text-fg cursor-pointer"
                >
                  إلغاء
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuranicRoadmapPage;
