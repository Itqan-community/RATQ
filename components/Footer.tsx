import Link from "next/link";
import { Activity, ShieldCheck } from "lucide-react";

const COLS = [
  { h: "المنصة", links: [["/about", "عن رتق"], ["/resources", "الكتالوج الشامل"], ["/resources/stacks", "حزم التطبيقات"], ["/categories", "التصنيفات"], ["/publishers", "دليل الناشرين"]] },
  { h: "معيار إتقان", links: [["/standards", "دليل المعيار"], ["/standards/checklist", "قائمة التحقق"], ["/standards/revocations", "سجل السحب والشفافية"], ["/licenses", "دليل التراخيص"], ["/changelog", "سجل التغييرات"]] },
  { h: "قانوني ونظامي", links: [["/legal/terms", "شروط الخدمة"], ["/legal/privacy", "سياسة الخصوصية"], ["/legal/dmca", "حقوق النشر (DMCA)"], ["/legal/accessibility", "بيان إتاحة الوصول"]] },
];

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-subtle text-fg transition-colors mt-auto">
      <div className="max-w-container mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12 text-start">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <Link href="/" title="رَتْق — الرئيسية" className="flex flex-col items-start group select-none">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.png" alt="شعار رَتْق" className="h-8 w-auto max-w-[90px] object-contain dark:invert" />
                <span className="text-[9px] font-bold text-ratq-700 dark:text-ratq-300 bg-ratq-50 dark:bg-ratq-950/80 border border-ratq-200 dark:border-ratq-800/80 px-1.5 py-0.5 rounded leading-none mt-1">نسخة تجريبية</span>
              </Link>
            </div>
            <p className="text-xs text-fg-muted max-w-sm leading-relaxed mb-4">
              «اكتشف بثقة. ابنِ بإتقان. شارك بمسؤولية.»<br />
              المرجع الأول والبنية التحتية الحية لاكتشاف وتوزيع والتحقق من موارد تطوير البرمجيات القرآنية.
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-ratq-200 bg-ratq-50 text-ratq-800 dark:border-ratq-900 dark:bg-ratq-950 dark:text-ratq-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>مدعوم بمجتمع إتقان</span>
            </div>
          </div>
          {COLS.map((c, i) => (
            <div key={c.h}>
              <h4 className="text-xs font-bold text-fg uppercase tracking-wider mb-3">{c.h}</h4>
              <ul className="flex flex-col gap-2 text-xs text-fg-muted">
                {c.links.map(([href, label], j) => (
                  <li key={href}>
                    <Link href={href} className={"hover:text-fg transition-colors" + (i === 0 && j === 0 ? " font-semibold text-fg" : "")}>{label}</Link>
                  </li>
                ))}
                {i === 2 && (
                  <li>
                    <Link href="/status" className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
                      <Activity className="w-3.5 h-3.5" />
                      <span>حالة الخدمة: تعمل</span>
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-fg-subtle">
          <p>جميع الحقوق محفوظة لمنصة مجتمع RATQ © 2026</p>
          <div className="flex items-center gap-4">
            <Link href="/ux-study" className="hover:text-fg transition-colors font-medium text-ratq-700 dark:text-ratq-400">دراسة UX</Link>
            <span>•</span>
            <Link href="/faq" className="hover:text-fg transition-colors">الأسئلة الشائعة</Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-fg transition-colors">اتصل بنا</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
