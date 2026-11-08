// src/components/layout/SiteFooter.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Activity } from 'lucide-react';
import { DemoBadge } from '@/components/ui/DemoBadge';

export const SiteFooter: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <footer className="w-full border-t border-border bg-subtle text-fg transition-colors mt-auto">
      <div className="max-w-container mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12 text-start">
          {/* Brand info */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <Link to="/" className="flex flex-col items-start group select-none" title="رَتْق — الرئيسية">
                <img
                  src="/logo.png"
                  alt="شعار رَتْق"
                  className="h-8 w-auto max-w-[90px] object-contain dark:invert"
                />
                <span className="text-[9px] font-bold text-ratq-700 dark:text-ratq-300 bg-ratq-50 dark:bg-ratq-950/80 border border-ratq-200 dark:border-ratq-800/80 px-1.5 py-0.5 rounded leading-none mt-1">
                  نسخة تجريبية
                </span>
              </Link>
            </div>
            <p className="text-xs text-fg-muted max-w-sm leading-relaxed mb-4">
              «اكتشف بثقة. ابنِ بإتقان. شارك بمسؤولية.»
              <br />
              المرجع الأول والبنية التحتية الحية لاكتشاف وتوزيع والتحقق من موارد تطوير البرمجيات القرآنية.
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-ratq-200 bg-ratq-50 text-ratq-800 dark:border-ratq-900 dark:bg-ratq-950 dark:text-ratq-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t('footer.supported_by')}</span>
            </div>
          </div>

          {/* Col 1: Platform */}
          <div>
            <h4 className="text-xs font-bold text-fg uppercase tracking-wider mb-3">المنصة</h4>
            <ul className="flex flex-col gap-2 text-xs text-fg-muted">
              <li><Link to="/about" className="hover:text-fg transition-colors font-semibold text-fg">عن رتق</Link></li>
              <li><Link to="/resources" className="hover:text-fg transition-colors">الكتالوج الشامل</Link></li>
              <li><Link to="/resources/stacks" className="hover:text-fg transition-colors">حزم التطبيقات<DemoBadge to="/resources/stacks" /></Link></li>
              <li><Link to="/categories" className="hover:text-fg transition-colors">التصنيفات<DemoBadge to="/categories" /></Link></li>
              <li><Link to="/publishers" className="hover:text-fg transition-colors">دليل الناشرين<DemoBadge to="/publishers" /></Link></li>
            </ul>
          </div>

          {/* Col 2: Standards & Dev */}
          <div>
            <h4 className="text-xs font-bold text-fg uppercase tracking-wider mb-3">معيار إتقان</h4>
            <ul className="flex flex-col gap-2 text-xs text-fg-muted">
              <li><Link to="/standards" className="hover:text-fg transition-colors">دليل المعيار</Link></li>
              <li><Link to="/standards/checklist" className="hover:text-fg transition-colors">قائمة التحقق<DemoBadge to="/standards/checklist" /></Link></li>
              <li><Link to="/standards/revocations" className="hover:text-fg transition-colors">سجل السحب والشفافية<DemoBadge to="/standards/revocations" /></Link></li>
              <li><Link to="/licenses" className="hover:text-fg transition-colors">دليل التراخيص<DemoBadge to="/licenses" /></Link></li>
              <li><Link to="/changelog" className="hover:text-fg transition-colors">سجل التغييرات<DemoBadge to="/changelog" /></Link></li>
            </ul>
          </div>

          {/* Col 3: Legal & Status */}
          <div>
            <h4 className="text-xs font-bold text-fg uppercase tracking-wider mb-3">قانوني ونظامي</h4>
            <ul className="flex flex-col gap-2 text-xs text-fg-muted">
              <li><Link to="/legal/terms" className="hover:text-fg transition-colors">شروط الخدمة</Link></li>
              <li><Link to="/legal/privacy" className="hover:text-fg transition-colors">سياسة الخصوصية</Link></li>
              <li><Link to="/legal/dmca" className="hover:text-fg transition-colors">حقوق النشر (DMCA)</Link></li>
              <li><Link to="/legal/accessibility" className="hover:text-fg transition-colors">بيان إتاحة الوصول</Link></li>
              <li>
                <Link to="/status" className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
                  <Activity className="w-3.5 h-3.5" />
                  <span>حالة الخدمة: تعمل</span>
                  <DemoBadge to="/status" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-fg-subtle">
          <p>{t('footer.rights_reserved')}</p>
          <div className="flex items-center gap-4">
            <Link to="/ux-study" className="hover:text-fg transition-colors font-medium text-ratq-700 dark:text-ratq-400">دراسة UX</Link>
            <span>•</span>
            <Link to="/faq" className="hover:text-fg transition-colors">الأسئلة الشائعة</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-fg transition-colors">اتصل بنا</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
