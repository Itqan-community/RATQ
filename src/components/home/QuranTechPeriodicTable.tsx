// src/components/home/QuranTechPeriodicTable.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Atom,
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
  // Sacred Text & Quranic Sciences
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

// Color styling per periodic family
const FAMILY_STYLES: Record<
  PeriodicElement['family'],
  {
    iconColor: string;
    iconBg: string;
    iconBorder: string;
    borderHover: string;
    badgeBg: string;
    badgeText: string;
    sideGradient: string;
    glowBg: string;
  }
> = {
  text: {
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/70',
    iconBorder: 'border-emerald-200/70 dark:border-emerald-800/60',
    borderHover: 'hover:border-emerald-400 dark:hover:border-emerald-500',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    sideGradient: 'from-emerald-500/6 via-emerald-500/2 to-transparent dark:from-emerald-400/8 dark:via-emerald-400/2',
    glowBg: 'bg-emerald-500',
  },
  audio: {
    iconColor: 'text-amber-600 dark:text-amber-400',
    iconBg: 'bg-amber-50 dark:bg-amber-950/70',
    iconBorder: 'border-amber-200/70 dark:border-amber-800/60',
    borderHover: 'hover:border-amber-400 dark:hover:border-amber-500',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/60',
    badgeText: 'text-amber-700 dark:text-amber-300',
    sideGradient: 'from-amber-500/6 via-amber-500/2 to-transparent dark:from-amber-400/8 dark:via-amber-400/2',
    glowBg: 'bg-amber-500',
  },
  fonts: {
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    iconBg: 'bg-cyan-50 dark:bg-cyan-950/70',
    iconBorder: 'border-cyan-200/70 dark:border-cyan-800/60',
    borderHover: 'hover:border-cyan-400 dark:hover:border-cyan-500',
    badgeBg: 'bg-cyan-50 dark:bg-cyan-950/60',
    badgeText: 'text-cyan-700 dark:text-cyan-300',
    sideGradient: 'from-cyan-500/6 via-cyan-500/2 to-transparent dark:from-cyan-400/8 dark:via-cyan-400/2',
    glowBg: 'bg-cyan-500',
  },
  code: {
    iconColor: 'text-ratq-600 dark:text-ratq-400',
    iconBg: 'bg-ratq-50 dark:bg-ratq-950/70',
    iconBorder: 'border-ratq-200/70 dark:border-ratq-800/60',
    borderHover: 'hover:border-ratq-400 dark:hover:border-ratq-500',
    badgeBg: 'bg-ratq-50 dark:bg-ratq-950/60',
    badgeText: 'text-ratq-700 dark:text-ratq-300',
    sideGradient: 'from-ratq-500/6 via-ratq-500/2 to-transparent dark:from-ratq-400/8 dark:via-ratq-400/2',
    glowBg: 'bg-ratq-500',
  },
  data: {
    iconColor: 'text-purple-600 dark:text-purple-400',
    iconBg: 'bg-purple-50 dark:bg-purple-950/70',
    iconBorder: 'border-purple-200/70 dark:border-purple-800/60',
    borderHover: 'hover:border-purple-400 dark:hover:border-purple-500',
    badgeBg: 'bg-purple-50 dark:bg-purple-950/60',
    badgeText: 'text-purple-700 dark:text-purple-300',
    sideGradient: 'from-purple-500/6 via-purple-500/2 to-transparent dark:from-purple-400/8 dark:via-purple-400/2',
    glowBg: 'bg-purple-500',
  },
};

export const QuranTechPeriodicTable: React.FC = () => {
  const [selectedFamily, setSelectedFamily] = useState<string>('all');
  const resources = mockRepo.getResources();

  const filteredElements =
    selectedFamily === 'all'
      ? PERIODIC_ELEMENTS
      : PERIODIC_ELEMENTS.filter((e) => e.family === selectedFamily);

  return (
    <section className="py-16 lg:py-20 border-b border-border bg-canvas text-start">
      <div className="max-w-container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ratq-50 dark:bg-ratq-950 text-ratq-700 dark:text-ratq-300 text-[11px] font-semibold mb-3 border border-ratq-200 dark:border-ratq-800">
              <Atom className="w-3.5 h-3.5 text-ratq-600 dark:text-ratq-400" />
              <span>الجدول الدوري للأصول التقنية القرآنية</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-fg tracking-tight">
              فهرس الأصول والموارد المعياري
            </h2>
            <p className="text-xs sm:text-sm text-fg-muted mt-1.5 leading-relaxed">
              توزيع هندسي منظّم للأصول القرآنية الـ 11 بحسب طبيعتها البرمجية وحجم مواردها المتاحة.
            </p>
          </div>

          {/* Simple Clean Family Filter Pills (Zero cognitive clutter) */}
          <div className="flex flex-wrap items-center gap-1.5 bg-subtle/50 p-1 rounded-xl border border-border text-xs self-start sm:self-auto">
            <button
              onClick={() => setSelectedFamily('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer text-xs ${
                selectedFamily === 'all'
                  ? 'bg-canvas text-fg font-bold shadow-xs border border-border'
                  : 'text-fg-muted hover:text-fg'
              }`}
            >
              الكل (11)
            </button>
            <button
              onClick={() => setSelectedFamily('text')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer text-xs ${
                selectedFamily === 'text'
                  ? 'bg-canvas text-emerald-600 dark:text-emerald-400 font-bold shadow-xs border border-border'
                  : 'text-fg-muted hover:text-fg'
              }`}
            >
              النصوص والعلوم
            </button>
            <button
              onClick={() => setSelectedFamily('code')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer text-xs ${
                selectedFamily === 'code'
                  ? 'bg-canvas text-ratq-600 dark:text-ratq-400 font-bold shadow-xs border border-border'
                  : 'text-fg-muted hover:text-fg'
              }`}
            >
              البرمجيات والـ APIs
            </button>
            <button
              onClick={() => setSelectedFamily('data')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer text-xs ${
                selectedFamily === 'data'
                  ? 'bg-canvas text-purple-600 dark:text-purple-400 font-bold shadow-xs border border-border'
                  : 'text-fg-muted hover:text-fg'
              }`}
            >
              البيانات
            </button>
            <button
              onClick={() => setSelectedFamily('audio')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer text-xs ${
                selectedFamily === 'audio'
                  ? 'bg-canvas text-amber-600 dark:text-amber-400 font-bold shadow-xs border border-border'
                  : 'text-fg-muted hover:text-fg'
              }`}
            >
              الصوتيات
            </button>
          </div>
        </div>

        {/* The Periodic Table Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredElements.map((el) => {
            const count = resources.filter((r) => r.resource_type === el.code).length;
            const style = FAMILY_STYLES[el.family];
            const Icon = ELEMENT_ICONS[el.code] || BookOpen;

            return (
              <Link
                key={el.code}
                to={`/resources?type=${el.code}`}
                className={`p-4 sm:p-5 rounded-xl border border-border bg-canvas hover:bg-subtle/20 ${style.borderHover} hover:shadow-xs transition-all duration-200 group flex flex-col justify-between relative overflow-hidden`}
              >
                {/* Subtle side gradient & corner glow on the icon side */}
                <div
                  aria-hidden="true"
                  className={`absolute inset-y-0 start-0 w-28 pointer-events-none transition-opacity duration-300 opacity-40 group-hover:opacity-70 rtl:bg-gradient-to-l ltr:bg-gradient-to-r ${style.sideGradient}`}
                />
                <div
                  aria-hidden="true"
                  className={`absolute -top-10 -start-10 w-24 h-24 rounded-full pointer-events-none blur-2xl opacity-15 dark:opacity-10 transition-opacity duration-300 group-hover:opacity-30 ${style.glowBg}`}
                />

                {/* Card Top: Icon & Title right at the top */}
                <div className="relative z-10">
                  {/* Element Icon & Title */}
                  <div className="flex items-center gap-3 mb-2.5">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${style.iconBg} ${style.iconBorder} ${style.iconColor} transition-transform duration-200 group-hover:scale-105 shadow-2xs`}
                    >
                      <Icon className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-fg group-hover:text-ratq-700 dark:group-hover:text-ratq-300 transition-colors leading-snug">
                      {el.name_ar}
                    </h3>
                  </div>

                  {/* 1-Line Clean Short Description */}
                  <p className="text-xs text-fg-muted leading-relaxed mt-2 line-clamp-2">
                    {el.short_desc}
                  </p>
                </div>

                {/* Card Bottom: Family Tag & Resource Count (replaces old "استعراض" button) */}
                <div className="pt-3 mt-3 border-t border-border/50 flex items-center justify-between text-[11px] relative z-10">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${style.badgeBg} ${style.badgeText}`}>
                    {el.family_ar}
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-subtle text-fg-muted font-medium border border-border/60">
                    {count} مورد
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
