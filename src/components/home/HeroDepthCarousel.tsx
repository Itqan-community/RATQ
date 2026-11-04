// src/components/home/HeroDepthCarousel.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';
import { DepthCarousel } from '@/components/ui/DepthCarousel/DepthCarousel';
import { useThemeStore } from '@/store/useThemeStore';

export type WizardJourneyFamily =
  | 'step1'
  | 'step2'
  | 'step3'
  | 'step4'
  | 'step5'
  | 'step6'
  | 'success';

export interface WizardJourneyCard {
  number: string;
  stepLabel: string;
  title_ar: string;
  title_en: string;
  desc: string;
  family: WizardJourneyFamily;
  family_ar: string;
}

export const WIZARD_JOURNEY_CARDS: WizardJourneyCard[] = [
  // 1. Decision 1 - Platform
  {
    number: '01',
    stepLabel: 'القرار ١ • نوع المنصة',
    title_ar: 'ما هي منصة مشروعك؟',
    title_en: 'Target Platform',
    desc: 'حدد وجهتك: تطبيق هاتف ذكي، موقع ويب تفاعلي، واجهة سحابية API، أو منصة بحثية.',
    family: 'step1',
    family_ar: 'تحديد المنصة',
  },
  // 2. Decision 2 - Tech Stack
  {
    number: '02',
    stepLabel: 'القرار ٢ • التقنية واللغة',
    title_ar: 'بأي لغة ومحرك تبني؟',
    title_en: 'Language & Framework',
    desc: 'اختر المكدس التقني المفضل: Flutter أو React/Next.js أو Python أو Swift للبدء السريع.',
    family: 'step2',
    family_ar: 'بيئة التطوير',
  },
  // 3. Decision 3 - Quranic Text & Script
  {
    number: '03',
    stepLabel: 'القرار ٣ • النص والرسم',
    title_ar: 'ما نوع النص القرآني؟',
    title_en: 'Uthmanic Script & Text',
    desc: 'اختر الرواية المعتمدة (حفص، ورش) ومستوى الرسم: مصحف المدينة، خط حاسوبي، أو نصوص مجردة.',
    family: 'step3',
    family_ar: 'المتن المصحفي',
  },
  // 4. Decision 4 - Audio Recitations
  {
    number: '04',
    stepLabel: 'القرار ٤ • الصوتيات والتلاوات',
    title_ar: 'هل يحتاج مشروعك تلاوات؟',
    title_en: 'Audio & Synchronized Ayahs',
    desc: 'اربط تسجيلات كبار القراء بروايات متواترة مع ملفات مزامنة الآيات والكلمات بالمللي ثانية.',
    family: 'step4',
    family_ar: 'المكتبة الصوتية',
  },
  // 5. Decision 5 - Tafsir & Translation
  {
    number: '05',
    stepLabel: 'القرار ٥ • العلوم والتفاسير',
    title_ar: 'هل تود إضافة تفاسير وترجمات؟',
    title_en: 'Tafsir & Translations',
    desc: 'أمهات كتب التفسير المحققة، أسباب النزول، وترجمات معتمدة بأكثر من 40 لغة عالمية.',
    family: 'step5',
    family_ar: 'العلوم والمعارف',
  },
  // 6. Decision 6 - License & Compliance
  {
    number: '06',
    stepLabel: 'القرار ٦ • الترخيص والاعتماد',
    title_ar: 'ما هي رخصة استخدامك؟',
    title_en: 'License & Itqan Standard',
    desc: 'فلترة الموارد المتوافقة مع أهدافك: رخصة حرة بالكامل، تجاري متاح، أو استخدام وقفي.',
    family: 'step6',
    family_ar: 'الأمان والترخيص',
  },
  // 7. Result - Vetted Stack Ready
  {
    number: '07',
    stepLabel: 'النتيجة • اكتمال الوصفة',
    title_ar: 'تم توليد وصفتك المعمارية!',
    title_en: 'Vetted Recipe Ready',
    desc: 'حزمة موثقة بالكامل تجمع الخطوط والأكواد والتلاوات مع أمر تثبيت فوري.',
    family: 'success',
    family_ar: 'اكتمال الوصفة',
  },
];

export const WIZARD_JOURNEY_COLORS: Record<
  WizardJourneyFamily,
  {
    stepTagBg: string;
    stepTagText: string;
    stepTagBorder: string;
    border: string;
    badgeBg: string;
    badgeText: string;
    glow: string;
    numberColor: string;
  }
> = {
  step1: {
    stepTagBg: 'bg-sky-50 dark:bg-sky-950/80',
    stepTagText: 'text-sky-700 dark:text-sky-300',
    stepTagBorder: 'border-sky-300/80 dark:border-sky-800',
    border: 'border-sky-500/30 dark:border-sky-500/20',
    badgeBg: 'bg-sky-100 dark:bg-sky-900/60',
    badgeText: 'text-sky-800 dark:text-sky-200',
    glow: 'rgba(14, 165, 233, 0.18)',
    numberColor: 'text-sky-600 dark:text-sky-400',
  },
  step2: {
    stepTagBg: 'bg-indigo-50 dark:bg-indigo-950/80',
    stepTagText: 'text-indigo-700 dark:text-indigo-300',
    stepTagBorder: 'border-indigo-300/80 dark:border-indigo-800',
    border: 'border-indigo-500/30 dark:border-indigo-500/20',
    badgeBg: 'bg-indigo-100 dark:bg-indigo-900/60',
    badgeText: 'text-indigo-800 dark:text-indigo-200',
    glow: 'rgba(99, 102, 241, 0.18)',
    numberColor: 'text-indigo-600 dark:text-indigo-400',
  },
  step3: {
    stepTagBg: 'bg-amber-50 dark:bg-amber-950/80',
    stepTagText: 'text-amber-800 dark:text-amber-300',
    stepTagBorder: 'border-amber-300/80 dark:border-amber-800',
    border: 'border-amber-500/30 dark:border-amber-500/20',
    badgeBg: 'bg-amber-100 dark:bg-amber-900/60',
    badgeText: 'text-amber-800 dark:text-amber-200',
    glow: 'rgba(245, 158, 11, 0.18)',
    numberColor: 'text-amber-600 dark:text-amber-400',
  },
  step4: {
    stepTagBg: 'bg-teal-50 dark:bg-teal-950/80',
    stepTagText: 'text-teal-700 dark:text-teal-300',
    stepTagBorder: 'border-teal-300/80 dark:border-teal-800',
    border: 'border-teal-500/30 dark:border-teal-500/20',
    badgeBg: 'bg-teal-100 dark:bg-teal-900/60',
    badgeText: 'text-teal-800 dark:text-teal-200',
    glow: 'rgba(20, 184, 166, 0.18)',
    numberColor: 'text-teal-600 dark:text-teal-400',
  },
  step5: {
    stepTagBg: 'bg-purple-50 dark:bg-purple-950/80',
    stepTagText: 'text-purple-700 dark:text-purple-300',
    stepTagBorder: 'border-purple-300/80 dark:border-purple-800',
    border: 'border-purple-500/30 dark:border-purple-500/20',
    badgeBg: 'bg-purple-100 dark:bg-purple-900/60',
    badgeText: 'text-purple-800 dark:text-purple-200',
    glow: 'rgba(168, 85, 247, 0.18)',
    numberColor: 'text-purple-600 dark:text-purple-400',
  },
  step6: {
    stepTagBg: 'bg-rose-50 dark:bg-rose-950/80',
    stepTagText: 'text-rose-700 dark:text-rose-300',
    stepTagBorder: 'border-rose-300/80 dark:border-rose-800',
    border: 'border-rose-500/30 dark:border-rose-500/20',
    badgeBg: 'bg-rose-100 dark:bg-rose-900/60',
    badgeText: 'text-rose-800 dark:text-rose-200',
    glow: 'rgba(244, 63, 94, 0.18)',
    numberColor: 'text-rose-600 dark:text-rose-400',
  },
  success: {
    stepTagBg: 'bg-emerald-50 dark:bg-emerald-950/80',
    stepTagText: 'text-emerald-800 dark:text-emerald-200',
    stepTagBorder: 'border-emerald-300/80 dark:border-emerald-800',
    border: 'border-emerald-500/50 dark:border-emerald-500/40',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-900/60',
    badgeText: 'text-emerald-900 dark:text-emerald-200',
    glow: 'rgba(16, 185, 129, 0.45)',
    numberColor: 'text-emerald-600 dark:text-emerald-400',
  },
};

export const HeroDepthCarousel: React.FC = () => {
  const direction = useThemeStore((s) => s.direction);

  return (
    <div className="w-full h-full relative flex items-center justify-center select-none">
      {/* Ambient background glow behind the carousel */}
      <div
        className="absolute w-[360px] sm:w-[460px] h-[360px] sm:h-[460px] rounded-full blur-[90px] opacity-40 dark:opacity-20 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(6, 182, 212, 0.15) 50%, transparent 75%)',
        }}
      />

      <DepthCarousel
        items={WIZARD_JOURNEY_CARDS}
        cardWidth={265}
        cardHeight={320}
        radius={20}
        tint="#070a11"
        depth={180}
        spread={70}
        tilt={16}
        tiltDirection={direction === 'rtl' ? 'left' : 'right'}
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
        renderItem={(item: WizardJourneyCard, _, isActive) => {
          const isSuccess = item.family === 'success';

          // Final card: Distinctive green background with animated success badge & icon
          if (isSuccess) {
            return (
              <div
                className="w-full h-full p-5 sm:p-6 flex flex-col justify-between text-start select-none transition-all duration-300 relative rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-900 dark:from-emerald-950 dark:via-[#053322] dark:to-[#021f15] text-white border-2 border-emerald-300/70 dark:border-emerald-400/60 shadow-xl"
                style={{
                  boxShadow: isActive
                    ? '0 20px 45px -10px rgba(16, 185, 129, 0.5), 0 0 25px rgba(52, 211, 153, 0.25)'
                    : '0 10px 25px -10px rgba(16, 185, 129, 0.2)',
                }}
              >
                {/* Decorative glow circles */}
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-emerald-400/25 blur-2xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-teal-300/20 blur-2xl pointer-events-none" />

                {/* Top: Step Sequence Number & Pill */}
                <div className="flex items-center justify-between relative z-10">
                  <span className="font-mono text-xs font-extrabold text-emerald-200">
                    #{item.number}
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 dark:bg-emerald-500/25 text-white dark:text-emerald-100 border border-white/30 dark:border-emerald-400/40 backdrop-blur-xs shadow-xs">
                    {item.stepLabel}
                  </span>
                </div>

                {/* Center: Success Animation & Big Distinctive Icon & Content */}
                <div className="my-auto py-1 flex flex-col items-center text-center relative z-10">
                  <div className="relative mb-2.5 flex items-center justify-center">
                    {/* Pulsing ring animation */}
                    <span className="absolute w-14 h-14 rounded-full bg-emerald-300/40 animate-ping pointer-events-none" />
                    <span className="absolute w-16 h-16 rounded-full bg-emerald-200/25 animate-pulse pointer-events-none" />
                    <div className="relative w-13 h-13 rounded-2xl bg-white dark:bg-emerald-900/90 border-2 border-emerald-200 dark:border-emerald-400/80 text-emerald-600 dark:text-emerald-300 flex items-center justify-center shadow-lg shadow-emerald-950/40">
                      <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
                      <Sparkles className="w-3.5 h-3.5 text-amber-300 absolute -top-1.5 -end-1.5 animate-bounce" />
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-extrabold text-white leading-tight drop-shadow-xs">
                    {item.title_ar}
                  </h3>
                  <span className="text-[11px] text-emerald-200 font-mono block mt-0.5">
                    {item.title_en}
                  </span>
                  <p className="text-xs text-emerald-100/90 dark:text-emerald-200/80 leading-relaxed mt-1.5 line-clamp-2">
                    {item.desc}
                  </p>
                </div>

                {/* Bottom: Journey Phase Pill & Direct Link */}
                <div className="pt-3 border-t border-white/20 dark:border-emerald-500/30 flex items-center justify-between text-xs relative z-10">
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-white/20 dark:bg-emerald-500/25 text-white border border-white/30 dark:border-emerald-400/30 backdrop-blur-xs">
                    {item.family_ar}
                  </span>

                  <Link
                    to="/resources/wizard"
                    className="text-xs font-bold text-white hover:text-emerald-200 flex items-center gap-1 group cursor-pointer transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <span>عرض الوصفة</span>
                    <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0 rotate-180 group-hover:-translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          }

          const color = WIZARD_JOURNEY_COLORS[item.family];

          return (
            <div
              className={`w-full h-full p-5 sm:p-6 flex flex-col justify-between text-start select-none transition-all duration-300 bg-canvas dark:bg-[#0c1017] border ${color.border} relative rounded-2xl overflow-hidden`}
              style={{
                boxShadow: isActive ? `0 20px 40px -15px ${color.glow}` : undefined,
              }}
            >
              {/* Subtle decorative background gradient */}
              <div
                className="absolute -top-12 -right-12 w-32 h-32 rounded-full pointer-events-none blur-2xl opacity-20"
                style={{ background: color.glow }}
              />

              {/* Top: Step Sequence Number & Distinctly Colored Step Tag */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`font-mono text-xs font-bold ${color.numberColor}`}>
                    #{item.number}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border shadow-2xs ${color.stepTagBg} ${color.stepTagText} ${color.stepTagBorder}`}
                  >
                    {item.stepLabel}
                  </span>
                </div>

                {/* Middle: Title without the 2-letter symbol */}
                <div className="mb-3.5">
                  <h3 className="text-base sm:text-lg font-bold text-fg leading-tight">
                    {item.title_ar}
                  </h3>
                  <span className="text-[11px] text-fg-subtle font-mono block mt-1">
                    {item.title_en}
                  </span>
                </div>

                {/* Short concise description (simple, clean) */}
                <p className="text-xs text-fg-muted leading-relaxed line-clamp-3">
                  {item.desc}
                </p>
              </div>

              {/* Bottom: Journey Phase Pill & Direct Link */}
              <div className="pt-3.5 border-t border-border/60 flex items-center justify-between text-xs">
                <span
                  className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${color.badgeBg} ${color.badgeText}`}
                >
                  {item.family_ar}
                </span>

                <Link
                  to="/resources/wizard"
                  className="text-xs font-semibold text-ratq-700 dark:text-ratq-400 hover:underline flex items-center gap-1 group cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <span>استكشف</span>
                  <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0 rotate-180" />
                </Link>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
};
