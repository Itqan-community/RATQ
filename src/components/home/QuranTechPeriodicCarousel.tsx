// src/components/home/QuranTechPeriodicCarousel.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Layers,
  BookOpen,
  Volume2,
  Library,
  Languages,
  Sparkles,
  Type,
  Cloud,
  Package,
  Code2,
  Database,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import { mockRepo } from '@/lib/supabase';
import { DepthCarousel } from '@/components/ui/DepthCarousel/DepthCarousel';
import { Button } from '@/components/ui/Button';

const ELEMENT_ICONS: Record<string, LucideIcon> = {
  mushaf: BookOpen,
  recitation: Volume2,
  tafsir: Library,
  translation: Languages,
  tajweed: Sparkles,
  font: Type,
  api: Cloud,
  sdk: Package,
  library: Code2,
  dataset: Database,
  tool: Wrench,
};

interface PeriodicElement {
  number: string;
  symbol: string;
  code: string;
  name_ar: string;
  name_en: string;
  short_desc: string;
  family: 'text' | 'audio' | 'fonts' | 'code' | 'data';
  family_ar: string;
}

const PERIODIC_ELEMENTS: PeriodicElement[] = [
  {
    number: '01',
    symbol: 'Ms',
    code: 'mushaf',
    name_ar: 'مصحف رقمي',
    name_en: 'Mushaf',
    short_desc: 'نصوص المصحف الشريف بالرسم العثماني المعتمد وفق الروايات الموثوقة.',
    family: 'text',
    family_ar: 'النصوص والعلوم',
  },
  {
    number: '02',
    symbol: 'Rc',
    code: 'recitation',
    name_ar: 'تلاوة وقراءات',
    name_en: 'Recitation',
    short_desc: 'تسجيلات صوتية مقطعية ومصحوبة ببيانات التزامن للروايات والقراءات.',
    family: 'audio',
    family_ar: 'الصوتيات والوسائط',
  },
  {
    number: '03',
    symbol: 'Tf',
    code: 'tafsir',
    name_ar: 'تفسير وبيان',
    name_en: 'Tafsir',
    short_desc: 'أمهات كتب وبيانات التفسير المعتمدة وأسباب النزول وغريب القرآن.',
    family: 'text',
    family_ar: 'النصوص والعلوم',
  },
  {
    number: '04',
    symbol: 'Tr',
    code: 'translation',
    name_ar: 'ترجمة معاني',
    name_en: 'Translation',
    short_desc: 'ترجمات معتمدة ومحققة لمعاني القرآن الكريم بأكثر من 40 لغة عالمية.',
    family: 'text',
    family_ar: 'النصوص والعلوم',
  },
  {
    number: '05',
    symbol: 'Tj',
    code: 'tajweed',
    name_ar: 'أحكام تجويد',
    name_en: 'Tajweed',
    short_desc: 'قواعد وأحكام التجويد المرمزة وعلامات الوقف ومخارج الحروف.',
    family: 'text',
    family_ar: 'النصوص والعلوم',
  },
  {
    number: '06',
    symbol: 'Fn',
    code: 'font',
    name_ar: 'خط طباعي',
    name_en: 'Font',
    short_desc: 'خطوط حاسوبية عثمانية عالية الدقة متوافقة مع مصحف المدينة ويونيكود.',
    family: 'fonts',
    family_ar: 'الخطوط والطباعة',
  },
  {
    number: '07',
    symbol: 'Ap',
    code: 'api',
    name_ar: 'واجهة API',
    name_en: 'API',
    short_desc: 'نقاط نهاية سحابية منخفضة التأخير للاستعلام المباشر عن السور والآيات.',
    family: 'code',
    family_ar: 'البرمجيات والواجهات',
  },
  {
    number: '08',
    symbol: 'Sk',
    code: 'sdk',
    name_ar: 'حزمة SDK',
    name_en: 'SDK',
    short_desc: 'أطقم برمجية متعددة اللغات لتسريع بناء وتكامل التطبيقات القرآنية.',
    family: 'code',
    family_ar: 'البرمجيات والواجهات',
  },
  {
    number: '09',
    symbol: 'Lb',
    code: 'library',
    name_ar: 'مكتبة برمجية',
    name_en: 'Library',
    short_desc: 'حزم مفتوحة المصدر لمعالجة النصوص القرآنية وتقسيم الأحزاب والأرباع.',
    family: 'code',
    family_ar: 'البرمجيات والواجهات',
  },
  {
    number: '10',
    symbol: 'Ds',
    code: 'dataset',
    name_ar: 'مجموعة بيانات',
    name_en: 'Dataset',
    short_desc: 'بيانات منظمة بصيغ JSON و Parquet و SQL للبحوث والتدريب التقني.',
    family: 'data',
    family_ar: 'البيانات المنظمة',
  },
  {
    number: '11',
    symbol: 'Tl',
    code: 'tool',
    name_ar: 'أداة مساعدة',
    name_en: 'Tool',
    short_desc: 'أدوات وفاحصات برمجية مساندة للمطورين للتحقق والتحويل بين الصيغ.',
    family: 'code',
    family_ar: 'البرمجيات والواجهات',
  },
];

const FAMILY_COLORS: Record<
  PeriodicElement['family'],
  {
    symbol: string;
    iconColor: string;
    iconBg: string;
    iconBorder: string;
    border: string;
    badgeBg: string;
    badgeText: string;
    glow: string;
  }
> = {
  text: {
    symbol: 'text-emerald-500 dark:text-emerald-400',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/70',
    iconBorder: 'border-emerald-200/70 dark:border-emerald-800/60',
    border: 'border-emerald-500/30',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/80',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    glow: 'rgba(16, 185, 129, 0.15)',
  },
  audio: {
    symbol: 'text-amber-500 dark:text-amber-400',
    iconColor: 'text-amber-600 dark:text-amber-400',
    iconBg: 'bg-amber-50 dark:bg-amber-950/70',
    iconBorder: 'border-amber-200/70 dark:border-amber-800/60',
    border: 'border-amber-500/30',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/80',
    badgeText: 'text-amber-700 dark:text-amber-300',
    glow: 'rgba(245, 158, 11, 0.15)',
  },
  fonts: {
    symbol: 'text-cyan-500 dark:text-cyan-400',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    iconBg: 'bg-cyan-50 dark:bg-cyan-950/70',
    iconBorder: 'border-cyan-200/70 dark:border-cyan-800/60',
    border: 'border-cyan-500/30',
    badgeBg: 'bg-cyan-50 dark:bg-cyan-950/80',
    badgeText: 'text-cyan-700 dark:text-cyan-300',
    glow: 'rgba(6, 182, 212, 0.15)',
  },
  code: {
    symbol: 'text-ratq-500 dark:text-ratq-400',
    iconColor: 'text-ratq-600 dark:text-ratq-400',
    iconBg: 'bg-ratq-50 dark:bg-ratq-950/70',
    iconBorder: 'border-ratq-200/70 dark:border-ratq-800/60',
    border: 'border-ratq-500/30',
    badgeBg: 'bg-ratq-50 dark:bg-ratq-950/80',
    badgeText: 'text-ratq-700 dark:text-ratq-300',
    glow: 'rgba(59, 130, 246, 0.15)',
  },
  data: {
    symbol: 'text-purple-500 dark:text-purple-400',
    iconColor: 'text-purple-600 dark:text-purple-400',
    iconBg: 'bg-purple-50 dark:bg-purple-950/70',
    iconBorder: 'border-purple-200/70 dark:border-purple-800/60',
    border: 'border-purple-500/30',
    badgeBg: 'bg-purple-50 dark:bg-purple-950/80',
    badgeText: 'text-purple-700 dark:text-purple-300',
    glow: 'rgba(168, 85, 247, 0.15)',
  },
};

export const QuranTechPeriodicCarousel: React.FC = () => {
  const resources = mockRepo.getResources();

  return (
    <section
      className="py-8 border-b border-border bg-white dark:bg-[#080c14] text-start overflow-hidden relative"
      style={{ paddingTop: '2rem', paddingBottom: '2rem' }}
    >
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Right Column (in RTL): Title, Description, and CTA Button */}
          <div className="lg:col-span-5 text-start flex flex-col justify-center">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ratq-50 dark:bg-ratq-950 text-ratq-700 dark:text-ratq-300 text-[11px] font-semibold mb-3.5 border border-ratq-200 dark:border-ratq-800 w-fit">
              <Layers className="w-3.5 h-3.5 text-ratq-600 dark:text-ratq-400" />
              <span>عرض العمق البصري • Depth Carousel</span>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-fg tracking-tight leading-snug mb-3.5">
              فهرس الأصول والموارد المعياري
            </h2>

            <p className="text-xs sm:text-sm text-fg-muted leading-relaxed mb-6">
              تصفح كافة الأصول القرآنية الـ 11 مع تأثير العمق ثلاثي الأبعاد والتمرير السلس. يمكنك السحب
              بالفأرة أو استخدام الأسهم للتنقل.
            </p>

            <div>
              <Link to="/resources" className="inline-block">
                <Button
                  variant="primary"
                  size="md"
                  className="gap-2 shadow-sm font-semibold text-xs sm:text-sm px-5 py-2.5"
                >
                  <span>عرض جميع الأصول</span>
                  <ArrowLeft className="w-4 h-4 rtl:rotate-0 rotate-180" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Left Column (in RTL): 3D Depth Carousel Stage */}
          <div className="lg:col-span-7 h-[500px] sm:h-[540px] relative w-full flex items-center justify-center">
            <DepthCarousel
              items={PERIODIC_ELEMENTS}
              cardWidth={270}
              cardHeight={325}
              radius={20}
              tint="#070a11"
              depth={185}
              spread={72}
              tilt={16}
              tiltDirection="left"
              perspective={1400}
              visibleCards={4}
              falloff={0.16}
              blur={5}
              duration={650}
              autoplay={true}
              autoplayDelay={3500}
              loop={true}
              showControls={true}
              showIndicators={true}
              renderItem={(element: PeriodicElement, _, isActive) => {
                const count = resources.filter((r) => r.resource_type === element.code).length;
                const familyColor = FAMILY_COLORS[element.family];
                const Icon = ELEMENT_ICONS[element.code] || BookOpen;

                return (
                  <div
                    className={`w-full h-full p-5 sm:p-6 flex flex-col justify-between text-start select-none transition-all duration-300 bg-canvas dark:bg-[#0c1017] border ${familyColor.border} relative`}
                    style={{
                      boxShadow: isActive ? `0 20px 40px -15px ${familyColor.glow}` : undefined,
                    }}
                  >
                    {/* Subtle decorative background gradient */}
                    <div
                      className="absolute -top-12 -right-12 w-32 h-32 rounded-full pointer-events-none blur-2xl opacity-20"
                      style={{ background: familyColor.glow }}
                    />

                    {/* Top: Resource Count Badge */}
                    <div>
                      <div className="flex items-center justify-end mb-3.5">
                        <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-subtle text-fg-muted font-medium border border-border/80">
                          {count} مورد
                        </span>
                      </div>

                      {/* Middle: Icon & Title */}
                      <div className="flex items-center gap-3 mb-3.5">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${familyColor.iconBg} ${familyColor.iconBorder} ${familyColor.iconColor} shadow-2xs`}
                        >
                          <Icon className="w-6 h-6 stroke-[2.2]" />
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-fg leading-tight">
                          {element.name_ar}
                        </h3>
                      </div>

                      {/* Short Description */}
                      <p className="text-xs text-fg-muted leading-relaxed line-clamp-3">
                        {element.short_desc}
                      </p>
                    </div>

                    {/* Bottom: Category Family Pill & Direct Link */}
                    <div className="pt-3.5 border-t border-border/60 flex items-center justify-between text-xs">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${familyColor.badgeBg} ${familyColor.badgeText}`}
                      >
                        {element.family_ar}
                      </span>

                      <Link
                        to={`/resources?type=${element.code}`}
                        className="text-xs font-semibold text-ratq-700 dark:text-ratq-400 hover:underline flex items-center gap-1 group"
                        onClick={(e) => {
                          // Allow navigation when clicking on the active card
                          e.stopPropagation();
                        }}
                      >
                        <span>استعراض</span>
                        <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0 rotate-180" />
                      </Link>
                    </div>
                  </div>
                );
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
