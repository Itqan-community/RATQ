// src/components/resources/CatalogWizardHelper.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { mockRepo } from '@/lib/supabase';
import { Wand2, ArrowLeft, X } from 'lucide-react';

interface CatalogWizardHelperProps {
  className?: string;
}

export const CatalogWizardHelper: React.FC<CatalogWizardHelperProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      className={`p-4 sm:p-5 rounded-2xl border border-border bg-gradient-to-r from-ratq-900 via-ratq-950 to-ratq-900 text-white relative overflow-hidden shadow-md text-start animate-in fade-in duration-200 ${
        className || 'mb-6'
      }`}
    >
      {/* Decorative ambient badge */}
      <div className="absolute top-0 end-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-ratq-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
        <div className="flex items-start gap-3.5 max-w-2xl">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 border border-white/10 text-ratq-300 flex items-center justify-center shrink-0 shadow-xs mt-0.5">
            <Wand2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xs sm:text-sm font-bold text-white">
                محتار بين {mockRepo.getResources().length} مورداً ومكتبة قرآنية؟
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-ratq-800/80 text-ratq-200 text-[10px] font-semibold border border-ratq-700/60">
                توجيه ذكي
              </span>
            </div>
            <p className="text-2xs sm:text-xs text-gray-300 leading-relaxed">
              لا تدع كثرة الخيارات تشتتك؛ دع المُوجِّه التفاعلي يغربل قاعدة البيانات ويستخرج لك المزيج الأنسب لبيئة عملك ومنصتك المستهدفة في 4 خطوات بسيطة.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/resources/wizard')}
            className="gap-2 font-bold text-xs bg-white text-ratq-950 hover:bg-gray-100 shadow-md px-4 py-2 cursor-pointer w-full sm:w-auto"
          >
            <Wand2 className="w-3.5 h-3.5 text-ratq-700" />
            <span>المُوجِّه التفاعلي Wizard</span>
            <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0 rotate-180" />
          </Button>

          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="إخفاء التلميح"
            title="إخفاء التلميح"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
