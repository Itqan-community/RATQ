// src/pages/StandardsChecklist.tsx
import React from 'react';
import { Button } from '@/components/ui/Button';
import { Printer } from 'lucide-react';

export const StandardsChecklist: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full text-start">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-bold text-ratq-700 uppercase tracking-wider block mb-1">
            وثيقة المعايير الفنية
          </span>
          <h1 className="text-2xl font-bold text-fg">قائمة التحقق التفصيلية لمعيار إتقان</h1>
        </div>
        <Button variant="outline" size="sm" onClick={() => window.print()} startIcon={<Printer className="w-4 h-4" />}>
          طباعة القائمة
        </Button>
      </div>

      <div className="flex flex-col gap-8 text-xs text-fg leading-relaxed">
        {/* Section 1 */}
        <div className="p-6 rounded-xl border border-border bg-canvas">
          <h2 className="text-sm font-bold text-fg mb-3 text-ratq-700">1. المتطلبات التقنية والأمنية (35%)</h2>
          <ul className="list-disc list-inside space-y-2 text-fg-muted">
            <li><strong>سلامة الروابط:</strong> كافة روابط المستودع والتوثيق والملفات تعمل وتستجيب برمز HTTP 200.</li>
            <li><strong>سلامة الملفات والبصمات:</strong> كل إصدار يحتوي على بصمة SHA-256 دقيقة مطابقة للملف المرفوع.</li>
            <li><strong>خلو البرمجيات من المخاطر:</strong> لا تحتوي الحزمة على برمجيات ضارة أو مكتبات مهجورة بها ثغرات أمنية حرجة.</li>
            <li><strong>اتساق الترقيم الدلالي:</strong> الالتزام بنظام SemVer (Major.Minor.Patch) وتوضيح كسر التوافق.</li>
          </ul>
        </div>

        {/* Section 2 */}
        <div className="p-6 rounded-xl border border-border bg-canvas">
          <h2 className="text-sm font-bold text-fg mb-3 text-cyan-700">2. المتطلبات المعرفية وتوثيق البيانات (25%)</h2>
          <ul className="list-disc list-inside space-y-2 text-fg-muted">
            <li><strong>اكتمال الوصف الفني:</strong> ملخص عربي دقيق لا يقل عن 20 حرفاً وشرح تفصيلي لحالات الاستخدام.</li>
            <li><strong>تعليمات التثبيت:</strong> وجود أوامر تثبيت واضحة ومختبرة للمنصات المدعومة (npm, pip, flutter...).</li>
            <li><strong>تحديد الحدود والنواقص:</strong> بيان أي قيود فنية أو لغوية أو حدود للاستهلاك بوضوح.</li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className="p-6 rounded-xl border border-border bg-canvas border-ratq-300 dark:border-ratq-800">
          <h2 className="text-sm font-bold text-fg mb-3 text-amber-700 flex items-center justify-between">
            <span>3. المتطلبات العلمية والشرعية (30% — إلزامي للمحتوى الديني)</span>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded">
              لا تجاوز إطلاقاً
            </span>
          </h2>
          <ul className="list-disc list-inside space-y-2 text-fg-muted">
            <li><strong>مطابقة المصدر المعتمد:</strong> إسناد النص القرآني أو التفسير لجهة موثقة معلنة (مجمع الملك فهد، تنزيل...).</li>
            <li><strong>سلامة الرسم والضبط:</strong> خلو النص من أي تحريف أو سقوط حركات أو خلط في رسم المصحف.</li>
            <li><strong>صحة العزو والتأليف:</strong> توثيق أسماء المفسرين والمترجمين والجهات المحققة دون غموض.</li>
            <li><strong>حظر التوليد التخميني:</strong> حظر مطلق لتوليد الآيات أو التفاسير بالذكاء الاصطناعي من الذاكرة.</li>
          </ul>
        </div>

        {/* Section 4 */}
        <div className="p-6 rounded-xl border border-border bg-canvas">
          <h2 className="text-sm font-bold text-fg mb-3 text-purple-700">4. المتطلبات القانونية والتراخيص (10%)</h2>
          <ul className="list-disc list-inside space-y-2 text-fg-muted">
            <li><strong>وضوح الترخيص:</strong> تحديد رخصة مفتوحة أو مخصصة صريحة تحدد حقوق الاستخدام التجاري والتعديل.</li>
            <li><strong>إثبات الملكية:</strong> التحقق من انتماء المورد للناشر عبر النطاق أو البريد المؤسسي أو مستودع GitHub.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
