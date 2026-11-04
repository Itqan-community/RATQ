// src/components/resources/FilterHelpTooltip.tsx
import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';

export interface FilterHelpItem {
  label: string;
  desc: string;
  tag?: string;
}

export interface FilterHelpData {
  title: string;
  badge?: string;
  description: string;
  items?: FilterHelpItem[];
  tip?: string;
}

export const FILTER_TOOLTIPS: Record<string, FilterHelpData> = {
  badge: {
    title: 'شارة إتقان لضبط الجودة',
    badge: 'معيار إتقان',
    description: 'نظام حوكمة واعتماد معياري صارم من 4 مستويات يتحقق من سلامة النص القرآني، دقة علامات الضبط والتشكيل، والتخريج العلمي، مع منع التوليد العشوائي (Zero-Hallucination).',
    items: [
      { label: 'إتقان ذهبي', desc: 'تدقيق ثلاثي مستقل وإسناد مباشر لمصحف مطبوع معتمد (مثل مصحف مجمع الملك فهد).' },
      { label: 'معتمد', desc: 'مراجعة علمية وإجازة رسمية من هيئة قرآنية أو دار نشر موثوقة.' },
      { label: 'موثّق تقنياً', desc: 'فحص آلي خوارزمي لمطابقة التشفير واليونيكود وقواعد الرسم العثماني.' },
      { label: 'إتقان أساسي', desc: 'مورد خام مؤهل برمجياً قيد التدقيق النهائي.' },
    ],
    tip: '💡 نصيحة: اختر "معتمد" أو "ذهبي" للتطبيقات الإنتاجية والمصاحف الرقمية الموجهة للجمهور.',
  },
  access: {
    title: 'مستوى الوصول وسياسات الاستخدام',
    badge: 'سياسات الوصول',
    description: 'يحدد الصلاحيات والإجراءات المطلوبة لاستخدام المورد برمجياً أو تنزيله عبر المنصة وواجهات برمجة التطبيقات (APIs).',
    items: [
      { label: 'مفتوح ومباشر', desc: 'متاح للجميع فوراً للتنزيل المباشر أو الاستهلاك دون قيود أو شروط مسبقة.' },
      { label: 'بالطلب', desc: 'يتطلب تقديم طلب مراجعة سريع وتوليد مفتاح وصول (API Key) لتتبع معدل الاستهلاك.' },
      { label: 'مؤسسي فقط', desc: 'مخصص للمراكز البحثية والجهات الرسمية ودور النشر بموجب اتفاقية ترخيص خاصة.' },
    ],
    tip: '💡 نصيحة: الموارد المفتوحة هي الأسرع لبدء النماذج الأولية والمشاريع الفردية المستقلة.',
  },
  type: {
    title: 'نوع المورد والتصنيف الفني',
    badge: '11 فئة تخصصية',
    description: 'يصنف الكتالوج الأصول البرمجية والمعرفية إلى فئات متخصصة لتسهيل الوصول للأصل المطلوب بدقة متناهية.',
    items: [
      { label: 'نصوص ومصاحف', desc: 'بيانات نصية كاملة بالرسم العثماني أو الإملائي وعلامات الوقف.' },
      { label: 'حزم ومكتبات (SDK)', desc: 'مكتبات برمجية تسهل التعامل مع الآيات والسور والتقسيمات والبحث.' },
      { label: 'خطوط رقمية', desc: 'خطوط حاسوبية عثمانية متخصصة بالمصاحف وعلامات الضبط الدقيقة.' },
      { label: 'بيانات وتفاسير', desc: 'قواعد بيانات التفاسير المعتمدة، أسباب النزول، والإعراب.' },
      { label: 'صوتيات وذكاء اصطناعي', desc: 'تلاوات مسندة، وموجّهات معالجة اللغات الطبيعية (NLP) الموثوقة.' },
    ],
    tip: '💡 نصيحة: يمكنك تفعيل أكثر من نوع في آن واحد لحصر الموارد المركبة (مثل الحزم مع التفاسير).',
  },
  license: {
    title: 'التراخيص وحقوق الملكية الفكرية',
    badge: 'Creative Commons',
    description: 'تحدد الرخص القانونية الصلاحيات والقيود المفروضة على استخدام المورد أو تعديله أو توزيعه وفق المعايير الدولية.',
    items: [
      { label: 'CC0 / الملكية العامة', desc: 'حرية استخدام وتوزيع ونشر كاملة بدون أي قيود أو شروط.' },
      { label: 'CC BY (نسب المصنف)', desc: 'يسمح بالاستخدام والتطوير مع وجوب ذكر جهة التحقيق أو الناشر.' },
      { label: 'CC BY-SA (المشاركة بالمثل)', desc: 'يلزم ترخيص الأعمال المشتقة بنفس الرخصة المفتوحة.' },
      { label: 'CC BY-NC (غير تجاري)', desc: 'يقتصر على التطبيقات الخيرية والمشاريع غير الربحية.' },
      { label: 'CC BY-ND (منع الاشتقاق)', desc: 'يمنع تعديل النصوص أو الخطوط لحماية قدسية الرسم المصحفي.' },
      { label: 'رخص البرمجيات', desc: 'رخص مفتوحة المصدر (مثل MIT و Apache) للشيفرات البرمجية.' },
    ],
    tip: '💡 نصيحة: انتبه لشرط "منع الاشتقاق ND" إذا كنت تخطط لتعديل بنية البيانات أو تصميم الخطوط.',
  },
  tech: {
    title: 'التقنية والمنصات المدعومة',
    badge: 'بيئات التطوير',
    description: 'تصفية الموارد التي توفر دعماً برمجياً مباشراً، حزم تثبيت (Packages)، أو أمثلة كود متوافقة مع لغة تطبيقك.',
    items: [
      { label: 'Flutter / Dart', desc: 'لتطبيقات الهواتف الذكية والأجهزة اللوحية متعددة المنصات (iOS & Android).' },
      { label: 'React / Next.js / Vue', desc: 'لتطبيقات الويب والمواقع القرآنية التفاعلية الحديثة.' },
      { label: 'Python', desc: 'للأبحاث القرآنية، معالجة النصوص، والتحليل الحاسوبي للبيانات.' },
      { label: 'Swift / Kotlin', desc: 'للتطوير الأصلي (Native) على أنظمة Apple و Android.' },
      { label: 'Node.js / Go / Rust', desc: 'للخدمات السحابية والأنظمة الخلفية عالية الأداء.' },
    ],
    tip: '💡 نصيحة: تحديد تقنيتك الحالية يضمن ظهور الموارد ذات التوثيق الجاهز للتكامل الفوري.',
  },
  commercial: {
    title: 'الاستخدام التجاري المسموح',
    badge: 'الاستثمار التجاري',
    description: 'فلترة فورية تستبعد الموارد المقيدة برخص غير تجارية (مثل CC BY-NC)، وتُبقي فقط الأصول المصرح باستثمارها في منتجات ربحية أو مدفوعة.',
    tip: '💡 نصيحة: فعّل هذا الخيار إذا كان تطبيقك يحتوي على اشتراكات أو خطط مدفوعة أو إعلانات.',
  },
};

interface FilterHelpTooltipProps {
  data: FilterHelpData;
}

export const FilterHelpTooltip: React.FC<FilterHelpTooltipProps> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 180);
  };

  // Close on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className="relative inline-flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
        aria-label={`توضيح ${data.title}`}
        aria-expanded={isOpen}
        className="p-1 -m-1 rounded-full text-fg-subtle hover:text-ratq-700 dark:hover:text-ratq-400 hover:bg-subtle/80 transition-colors focus:outline-none focus:ring-1 focus:ring-ratq-500 cursor-help"
      >
        <HelpCircle className="w-3.5 h-3.5 transition-transform hover:scale-110" />
      </button>

      {/* Floating Tooltip Box: White background, light gray border */}
      {isOpen && (
        <div
          role="tooltip"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="absolute z-50 top-full start-0 mt-2.5 w-72 sm:w-80 p-3.5 sm:p-4 rounded-xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 shadow-xl shadow-black/8 text-start text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed pointer-events-auto animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Subtle Pointer Arrow */}
          <div className="absolute -top-1.5 start-2.5 w-3 h-3 bg-white dark:bg-neutral-900 border-t border-s border-gray-200 dark:border-neutral-800 rotate-45 pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-gray-100 dark:border-neutral-800">
            <span className="font-bold text-fg text-xs">{data.title}</span>
            {data.badge && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-ratq-50 dark:bg-ratq-950/60 text-ratq-700 dark:text-ratq-300 border border-ratq-200 dark:border-ratq-800 shrink-0 font-medium">
                {data.badge}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-[11px] text-fg-muted mb-2.5 leading-relaxed">
            {data.description}
          </p>

          {/* Detailed Breakdown Items */}
          {data.items && data.items.length > 0 && (
            <div className="space-y-1.5 mb-2.5 pt-2 border-t border-gray-100 dark:border-neutral-800/80">
              {data.items.map((item, idx) => (
                <div key={idx} className="text-[11px] leading-snug">
                  <span className="font-bold text-fg">{item.label}: </span>
                  <span className="text-fg-muted">{item.desc}</span>
                </div>
              ))}
            </div>
          )}

          {/* Pro Tip Footer */}
          {data.tip && (
            <div className="pt-2 border-t border-gray-100 dark:border-neutral-800 text-[10.5px] text-ratq-800 dark:text-ratq-300 bg-ratq-50/60 dark:bg-ratq-950/40 p-2 rounded-lg border border-ratq-100 dark:border-ratq-900/60 leading-relaxed">
              {data.tip}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
