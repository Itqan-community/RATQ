// src/views/Standards.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ItqanBadge } from '@/components/ui/ItqanBadge';
import {
  FileText,
  AlertTriangle,
  ArrowLeft,
  X,
  Printer,
  CheckCircle2,
  Code2,
  BookOpen,
  Scale,
  ShieldCheck,
  Info
} from 'lucide-react';

export const Standards: React.FC = () => {
  const [isChecklistDrawerOpen, setIsChecklistDrawerOpen] = useState(false);

  // Close drawer on Escape key and prevent body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsChecklistDrawerOpen(false);
    };
    if (isChecklistDrawerOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isChecklistDrawerOpen]);

  return (
    <div className="max-w-container mx-auto px-4 sm:px-6 py-10 w-full text-start">
      {/* Header */}
      <div className="mb-12 pb-6 border-b border-border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-ratq-700 uppercase tracking-wider block mb-1">
              معيار إتقان — الإصدار 1.0
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-fg leading-tight">
              معيار الجودة والموثوقية لتطوير البرمجيات القرآنية
            </h1>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsChecklistDrawerOpen(true)}
              startIcon={<FileText className="w-4 h-4" />}
            >
              استعراض قائمة التحقق الموزونة
            </Button>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-fg-muted mt-4 leading-relaxed max-w-3xl">
          إطار حوكمة تقني وعلمي موحد يضمن دقة النصوص القرآنية، استقرار الأكواد البرمجية، وضوح التراخيص، ونزاهة التوزيع الرقمي لكتاب الله.
        </p>
      </div>

      {/* The 4 Levels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {/* Basic */}
        <div className="p-6 rounded-2xl border border-border bg-canvas flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <ItqanBadge level="basic" size="md" />
              <span className="text-2xs font-bold text-fg-subtle">آلي بالكامل</span>
            </div>
            <h3 className="text-base font-bold text-fg mb-2">إتقان أساسي (Basic)</h3>
            <p className="text-xs text-fg-muted leading-relaxed mb-4">
              بيانات مكتملة وذاتية التصريح من الناشر تستوفي الحد الأدنى من اسم المورد، الوصف، الترخيص المرفق، والناشر المرتبط.
            </p>
          </div>
          <div className="pt-4 border-t border-border-subtle text-2xs text-fg-subtle">
            تجديد سنوي تلقائي • لا يتطلب مراجعة بشرية
          </div>
        </div>

        {/* Verified */}
        <div className="p-6 rounded-2xl border border-ratq-200 bg-ratq-50/30 dark:bg-ratq-950/20 dark:border-ratq-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <ItqanBadge level="verified" size="md" />
              <span className="text-2xs font-bold text-ratq-700 dark:text-ratq-400">تحقق تقني آلي</span>
            </div>
            <h3 className="text-base font-bold text-fg mb-2">موثّق تقنياً (Verified)</h3>
            <p className="text-xs text-fg-muted leading-relaxed mb-4">
              فحص دوري أسبوعي لسلامة الروابط، توافر الملفات ومطابقة بصمات SHA-256، وخلو المورد من الأخطاء والبرمجيات الضارة.
            </p>
          </div>
          <div className="pt-4 border-t border-border-subtle text-2xs text-fg-subtle">
            إعادة فحص أسبوعية للروابط والملفات
          </div>
        </div>

        {/* Certified */}
        <div className="p-6 rounded-2xl border border-cyan-200 bg-cyan-50/30 dark:bg-cyan-950/20 dark:border-cyan-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <ItqanBadge level="certified" size="md" />
              <span className="text-2xs font-bold text-cyan-700 dark:text-cyan-400">مراجعة بشرية إلزامية</span>
            </div>
            <h3 className="text-base font-bold text-fg mb-2">معتمد علمياً وتقنياً (Certified)</h3>
            <p className="text-xs text-fg-muted leading-relaxed mb-4">
              مراجعة علمية متخصصة من محكمين معتمدين تؤكد صحة الإسناد لمصادر النصوص والتفاسير، وتجربة تركيب وتشغيل برمجية كاملة.
            </p>
          </div>
          <div className="pt-4 border-t border-border-subtle text-2xs text-fg-subtle">
            تحكيم بشري متخصص • إعادة اعتماد سنوية
          </div>
        </div>

        {/* Gold */}
        <div className="p-6 rounded-2xl border border-gold-200 bg-gold-50/30 dark:bg-gold-950/20 dark:border-gold-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <ItqanBadge level="gold" size="md" />
              <span className="text-2xs font-bold text-gold-700 dark:text-gold-400">نخبة المنظومة</span>
            </div>
            <h3 className="text-base font-bold text-fg mb-2">إتقان ذهبي (Gold Standard)</h3>
            <p className="text-xs text-fg-muted leading-relaxed mb-4">
              أعلى درجات الاعتماد: للمشاريع التي أثبتت استقراراً استثنائياً، صيانة منتظمة، تقييمات مجتمعية رفيعة (≥ 4.5)، وتوثيقاً متكاملاً.
            </p>
          </div>
          <div className="pt-4 border-t border-border-subtle text-2xs text-fg-subtle">
            ترشيح مزدوج من مجلس المعايير • فحص نصف سنوي
          </div>
        </div>
      </div>

      {/* Revocation Protocol Summary */}
      <div className="p-8 rounded-2xl border border-border bg-subtle/50 text-start">
        <h2 className="text-lg font-bold text-fg mb-3 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <span>بروتوكول سحب الشارات والشفافية العامة</span>
        </h2>
        <p className="text-xs text-fg-muted leading-relaxed max-w-3xl mb-4">
          للحفاظ على نزاهة المعيار، تخضع الشارات لإعادة تحقق دورية وسحب فوري عند حدوث أعطال مستمرة أو أخطاء علمية أو مخالفات لحقوق الملكية. وتعلن كافة حالات السحب بشفافية كاملة في السجل العام مع منح الناشر حق الاستئناف خلال 10 أيام عمل.
        </p>
        <Link
          to="/standards/revocations"
          className="text-xs font-bold text-ratq-700 hover:underline inline-flex items-center gap-1"
        >
          <span>استعراض السجل العام للشفافية والسحب</span>
          <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0 rotate-180" />
        </Link>
      </div>

      {/* Modal / Slide-over Drawer from the Right - Weighted Checklist */}
      {isChecklistDrawerOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="قائمة التحقق الموزونة لمعيار إتقان"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-modal-fade-in"
            onClick={() => setIsChecklistDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel Sliding in from the Right */}
          <div className="relative z-10 w-full max-w-xl md:max-w-2xl h-full bg-canvas border-l border-border shadow-2xl flex flex-col animate-slide-in-right overflow-hidden text-start">
            {/* Drawer Header */}
            <div className="p-5 sm:p-6 border-b border-border flex items-center justify-between gap-4 bg-canvas/95 backdrop-blur-xs sticky top-0 z-20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-ratq-50 dark:bg-ratq-950 text-ratq-700 dark:text-ratq-300 flex items-center justify-center shrink-0 border border-ratq-200 dark:border-ratq-800 shadow-2xs">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-2xs font-bold text-ratq-700 dark:text-ratq-400 uppercase tracking-wider block font-mono">
                    وثيقة المعايير الفنية v1.0
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-fg leading-tight">
                    قائمة التحقق الموزونة لمعيار إتقان
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.print()}
                  startIcon={<Printer className="w-4 h-4" />}
                  className="hidden sm:inline-flex"
                >
                  طباعة
                </Button>
                <button
                  type="button"
                  onClick={() => setIsChecklistDrawerOpen(false)}
                  className="p-2 rounded-lg text-fg-subtle hover:text-fg hover:bg-subtle transition-colors cursor-pointer"
                  aria-label="إغلاق النافذة"
                  title="إغلاق"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Drawer Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              {/* Weight Distribution Breakdown */}
              <div className="p-4 rounded-xl bg-subtle/70 border border-border">
                <div className="flex items-center justify-between text-xs font-bold text-fg mb-2.5">
                  <span>توزيع أوزان التقييم المعتمدة</span>
                  <span className="text-ratq-700 dark:text-ratq-400 font-mono">المجموع: 100%</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-canvas border border-ratq-200 dark:border-ratq-900">
                    <span className="text-2xs text-fg-subtle block">تقنية وأمنية</span>
                    <span className="font-bold text-ratq-700 dark:text-ratq-400 font-mono">35%</span>
                  </div>
                  <div className="p-2 rounded-lg bg-canvas border border-cyan-200 dark:border-cyan-900">
                    <span className="text-2xs text-fg-subtle block">معرفية وتوثيق</span>
                    <span className="font-bold text-cyan-700 dark:text-cyan-400 font-mono">25%</span>
                  </div>
                  <div className="p-2 rounded-lg bg-canvas border border-amber-200 dark:border-amber-900">
                    <span className="text-2xs text-fg-subtle block">علمية وشرعية</span>
                    <span className="font-bold text-amber-700 dark:text-amber-400 font-mono">30%</span>
                  </div>
                  <div className="p-2 rounded-lg bg-canvas border border-purple-200 dark:border-purple-900">
                    <span className="text-2xs text-fg-subtle block">قانونية وتراخيص</span>
                    <span className="font-bold text-purple-700 dark:text-purple-400 font-mono">10%</span>
                  </div>
                </div>
              </div>

              {/* Section 1 */}
              <div className="p-5 rounded-xl border border-border bg-canvas shadow-2xs">
                <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-border-subtle">
                  <Code2 className="w-4 h-4 text-ratq-600 dark:text-ratq-400" />
                  <h3 className="text-sm font-bold text-fg">1. المتطلبات التقنية والأمنية</h3>
                  <span className="ms-auto text-xs font-bold font-mono px-2 py-0.5 rounded bg-ratq-100/70 text-ratq-800 dark:bg-ratq-950 dark:text-ratq-300">
                    35%
                  </span>
                </div>
                <ul className="space-y-3 text-xs leading-relaxed text-fg-muted">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-ratq-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-fg font-semibold">سلامة الروابط:</strong> كافة روابط المستودع والتوثيق والملفات تعمل وتستجيب برمز HTTP 200 دون تحويلات مكسورة.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-ratq-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-fg font-semibold">سلامة الملفات والبصمات:</strong> كل إصدار يحتوي على بصمة SHA-256 دقيقة مطابقة للملف المرفوع لمنع التلاعب.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-ratq-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-fg font-semibold">خلو البرمجيات من المخاطر:</strong> لا تحتوي الحزمة على برمجيات ضارة، تتبع غير مصرح، أو مكتبات مهجورة بها ثغرات أمنية حرجة.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-ratq-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-fg font-semibold">اتساق الترقيم الدلالي:</strong> الالتزام بنظام الترقيم الدلالي SemVer (Major.Minor.Patch) مع توثيق كسر التوافق في سجل التغييرات.
                    </div>
                  </li>
                </ul>
              </div>

              {/* Section 2 */}
              <div className="p-5 rounded-xl border border-border bg-canvas shadow-2xs">
                <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-border-subtle">
                  <BookOpen className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <h3 className="text-sm font-bold text-fg">2. المتطلبات المعرفية وتوثيق البيانات</h3>
                  <span className="ms-auto text-xs font-bold font-mono px-2 py-0.5 rounded bg-cyan-100/70 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300">
                    25%
                  </span>
                </div>
                <ul className="space-y-3 text-xs leading-relaxed text-fg-muted">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-fg font-semibold">اكتمال الوصف الفني:</strong> ملخص عربي دقيق لا يقل عن 20 حرفاً مع شرح تفصيلي لطبيعة البيانات وحالات الاستخدام المستهدفة.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-fg font-semibold">تعليمات التثبيت:</strong> وجود أوامر تثبيت واستدعاء واضحة ومختبرة للمنصات المدعومة (npm, pip, flutter, REST...).
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-fg font-semibold">تحديد الحدود والنواقص:</strong> بيان صريح لأي قيود فنية، لغوية، حدود للاستهلاك، أو اعتمادات خارجية تتطلب إذناً.
                    </div>
                  </li>
                </ul>
              </div>

              {/* Section 3 */}
              <div className="p-5 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/20 dark:bg-amber-950/20 shadow-2xs">
                <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-amber-200 dark:border-amber-900">
                  <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-fg">3. المتطلبات العلمية والشرعية</h3>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 dark:text-amber-200 dark:bg-amber-900/60 px-2 py-0.5 rounded">
                      إلزامي • لا تجاوز إطلاقاً
                    </span>
                  </div>
                  <span className="ms-auto text-xs font-bold font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    30%
                  </span>
                </div>
                <ul className="space-y-3 text-xs leading-relaxed text-fg-muted">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-fg font-semibold">مطابقة المصدر المعتمد:</strong> إسناد النص القرآني أو التفسير لجهة موثقة معلنة (مجمع الملك فهد لطباعة المصحف، تنزيل، وغيرها).
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-fg font-semibold">سلامة الرسم والضبط:</strong> خلو النص تماماً من أي تحريف أو سقوط حركات أو خلط بين روايات المصحف الشريف.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-fg font-semibold">صحة العزو والتأليف:</strong> توثيق أسماء المفسرين والمترجمين والجهات المحققة بدقة متناهية دون أدنى غموض.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-fg font-semibold">حظر التوليد التخميني:</strong> حظر مطلق ونهائي لتوليد الآيات أو التفاسير بنماذج الذكاء الاصطناعي التوليدي من الذاكرة دون تحقق مباشر من نصوص موثقة.
                    </div>
                  </li>
                </ul>
              </div>

              {/* Section 4 */}
              <div className="p-5 rounded-xl border border-border bg-canvas shadow-2xs">
                <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-border-subtle">
                  <Scale className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-sm font-bold text-fg">4. المتطلبات القانونية والتراخيص</h3>
                  <span className="ms-auto text-xs font-bold font-mono px-2 py-0.5 rounded bg-purple-100/70 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                    10%
                  </span>
                </div>
                <ul className="space-y-3 text-xs leading-relaxed text-fg-muted">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-fg font-semibold">وضوح الترخيص:</strong> تحديد رخصة مفتوحة أو مخصصة صريحة تحدد حقوق الاستخدام التجاري والتعديل وإعادة التوزيع.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-fg font-semibold">إثبات الملكية:</strong> التحقق من انتماء المورد للناشر عبر النطاق المؤسسي أو البريد الرسمي أو مستودع GitHub الموثق.
                    </div>
                  </li>
                </ul>
              </div>

              {/* Standards Levels Correlation Note */}
              <div className="p-4 rounded-xl bg-ratq-50/50 dark:bg-ratq-950/30 border border-ratq-200 dark:border-ratq-900 flex items-start gap-3">
                <Info className="w-4 h-4 text-ratq-600 dark:text-ratq-400 shrink-0 mt-0.5" />
                <p className="text-2xs sm:text-xs text-fg-muted leading-relaxed">
                  تُمنح شارات المعيار استناداً إلى مجموع النقاط المحققة مع اشتراط استيفاء المتطلبات العلمية والشرعية بنسبة 100% دون أي استثناء.
                </p>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 sm:p-5 border-t border-border bg-canvas flex items-center justify-between gap-3 sticky bottom-0 z-20">
              <Button
                variant="outline"
                size="md"
                onClick={() => setIsChecklistDrawerOpen(false)}
              >
                إغلاق النافذة
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => window.print()}
                startIcon={<Printer className="w-4 h-4" />}
              >
                طباعة القائمة
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
