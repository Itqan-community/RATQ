// src/views/About.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ShieldCheck, Compass, Layers, KeyRound, MessagesSquare, Code2 } from 'lucide-react';
import { DotField } from '@/components/ui/DotField/DotField';
import { useThemeStore } from '@/store/useThemeStore';

export const About: React.FC = () => {
  const { palette } = useThemeStore();

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

  return (
    <div className="w-full text-start">
      {/* Top Section - Contained in max-w-4xl */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 pb-12 w-full">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-ratq-700 uppercase tracking-wider block mb-2">
            عن منصة مجتمع RATQ
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-fg leading-snug">
            المرجع الأول لحوكمة وتطوير البرمجيات القرآنية
          </h1>
          <p className="text-xs sm:text-sm text-fg-muted mt-3 max-w-2xl mx-auto leading-relaxed">
            «اكتشف بثقة. ابنِ بإتقان. شارك بمسؤولية.»
          </p>
        </div>

        <div className="flex flex-col gap-10 text-xs sm:text-sm text-fg leading-relaxed">
          {/* Mission & Vision */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border border-border bg-canvas">
              <div className="w-10 h-10 rounded-xl bg-ratq-50 dark:bg-ratq-950 text-ratq-700 dark:text-ratq-300 flex items-center justify-center mb-4">
                <Compass className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-fg mb-2">رسالتنا</h2>
              <p className="text-fg-muted leading-relaxed">
                تمكين المطورين والناشرين عبر توفير سوق آمن ومنتقى وخاضع للمعايير لموارد وتطبيقات القرآن الكريم الرقمية.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-canvas">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-fg mb-2">رؤيتنا</h2>
              <p className="text-fg-muted leading-relaxed">
                أن نصبح المعيار العالمي الأول للثقة والدقة والتعاون في تطوير النظم والبرمجيات القرآنية.
              </p>
            </div>
          </div>

          {/* The 3 Core Differences */}
          <div className="p-8 rounded-2xl border border-border bg-subtle/50">
            <h2 className="text-lg font-bold text-fg mb-4">
              ما الذي يميز RATQ عن الأدلة المفتوحة الساكنة؟
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-start">
              <div>
                <h3 className="text-sm font-bold text-ratq-700 mb-1">1. التحقق العلمي والتقني</h3>
                <p className="text-xs text-fg-muted leading-relaxed">
                  لا نكتفي بوجود المورد، بل نتحقق من سلامته عبر شارات إتقان ومراجعة بشرية متخصصة ومصادقة على أمان الملفات.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-cyan-700 mb-1">2. الحوكمة الرقمية الحية</h3>
                <p className="text-xs text-fg-muted leading-relaxed">
                  مسارات قرار واضحة لطلبات الوصول، سجل تدقيق غير قابل للتعديل، ومسارات استئناف شفافة تحمي حقوق الناشر والمطور.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gold-700 mb-1">3. بوابة الناشرين الحقيقية</h3>
                <p className="text-xs text-fg-muted leading-relaxed">
                  المالك الحقيقي هو من يدير أصوله ويصدر إصداراته ويتحكم في تراخيصه ويتابع تحليلات التنزيل بدقة.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Width Dark Section: What RATQ Provides (مطابق لقسم معيار الجودة والموثوقية في الرئيسية) */}
      <section className="w-full py-16 sm:py-20 border-y border-border bg-ratq-950 text-white text-start relative overflow-hidden">
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

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="mb-10 text-start">
            <span className="text-xs font-semibold text-ratq-400 uppercase tracking-wider block mb-2">
              ما توفر رتْق
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold leading-snug mb-3 text-white">
              ماذا توفر RATQ؟
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-2xl">
              تدعم المنصة الرحلة كاملة، من اكتشاف المورد إلى نشره والمحافظة على معلوماته.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* 01 */}
            <div className="md:col-span-1 lg:col-span-2 p-6 rounded-2xl bg-ratq-900 border border-ratq-800 hover:border-ratq-700 transition-colors flex flex-col justify-between group shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-ratq-950 border border-ratq-800 text-ratq-400 flex items-center justify-center">
                    <Layers className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-2xl font-black text-ratq-400/40 group-hover:text-ratq-400 transition-colors">
                    01
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">
                  دليل منظم للموارد
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  اعثر على المكتبات ومجموعات البيانات وواجهات البرمجة وأدوات التطوير والبحث من خلال دليل موحد وقابل للبحث.
                </p>
              </div>
            </div>

            {/* 02 */}
            <div className="md:col-span-1 lg:col-span-2 p-6 rounded-2xl bg-ratq-900 border border-ratq-800 hover:border-ratq-700 transition-colors flex flex-col justify-between group shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-ratq-950 border border-ratq-800 text-cyan-400 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-2xl font-black text-cyan-400/40 group-hover:text-cyan-400 transition-colors">
                    02
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">
                  معلومات واضحة عن الجودة
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  راجع التوثيق والرخص والإصدارات والنسبة ومعلومات توثيق إتقان قبل اختيار المورد المناسب.
                </p>
              </div>
            </div>

            {/* 03 */}
            <div className="md:col-span-2 lg:col-span-2 p-6 rounded-2xl bg-ratq-900 border border-ratq-800 hover:border-ratq-700 transition-colors flex flex-col justify-between group shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-ratq-950 border border-ratq-800 text-gold-400 flex items-center justify-center">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-2xl font-black text-gold-400/40 group-hover:text-gold-400 transition-colors">
                    03
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">
                  إدارة الوصول للناشرين
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  يمكن للناشرين إدارة الموارد المقيدة ومراجعة طلبات الوصول والمحافظة على تحديث معلومات مواردهم.
                </p>
              </div>
            </div>

            {/* 04 */}
            <div className="md:col-span-1 lg:col-span-3 p-6 rounded-2xl bg-ratq-900 border border-ratq-800 hover:border-ratq-700 transition-colors flex flex-col justify-between group shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-ratq-950 border border-ratq-800 text-emerald-400 flex items-center justify-center">
                    <MessagesSquare className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-2xl font-black text-emerald-400/40 group-hover:text-emerald-400 transition-colors">
                    04
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">
                  ملاحظات المجتمع
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  تساعد التعليقات والبلاغات والمراجعات على إبراز الموارد المفيدة واكتشاف المعلومات القديمة والجوانب التي تحتاج إلى تحسين.
                </p>
              </div>
            </div>

            {/* 05 */}
            <div className="md:col-span-1 lg:col-span-3 p-6 rounded-2xl bg-ratq-900 border border-ratq-800 hover:border-ratq-700 transition-colors flex flex-col justify-between group shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-ratq-950 border border-ratq-800 text-indigo-400 flex items-center justify-center">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-2xl font-black text-indigo-400/40 group-hover:text-indigo-400 transition-colors">
                    05
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">
                  أدوات للمطورين
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  تسهل صفحات المطورين ومفاتيح API وروابط التوثيق وتفاصيل التكامل استخدام الموارد في المشاريع الحقيقية.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Section - Contained in max-w-4xl */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 pb-16 w-full text-start">
        <div className="flex flex-col gap-10 text-xs sm:text-sm text-fg leading-relaxed">
          {/* Ethical Quranic Tech Principles */}
          <div className="p-6 rounded-2xl border border-border bg-canvas">
            <h2 className="text-base font-bold text-fg mb-3">مبادئ القرار عند التعارض</h2>
            <ol className="list-decimal list-inside space-y-2 text-xs text-fg-muted">
              <li>الدقة الشرعية والعلمية تتقدم دائماً على سرعة النشر.</li>
              <li>حق الناشر في موارده يتقدم على رغبة المستخدم في الوصول المفتوح.</li>
              <li>الشفافية في الحوكمة تتقدم على سهولة الإجراء.</li>
              <li>حماية خصوصية المستخدم تتقدم على دقة وتفصيل التحليلات.</li>
            </ol>
          </div>

          <div className="text-center pt-4">
            <Link to="/resources">
              <Button variant="primary" size="lg">
                استكشف الكتالوج الشامل
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
