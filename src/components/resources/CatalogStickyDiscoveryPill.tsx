// src/components/resources/CatalogStickyDiscoveryPill.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wand2, ExternalLink, X } from 'lucide-react';

export const CatalogStickyDiscoveryPill: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (dismissed) return;
      if (window.scrollY > 380) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dismissed]);

  if (dismissed || !isVisible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-[92vw] sm:max-w-max animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-center gap-2.5 sm:gap-3.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-canvas/95 dark:bg-[#0c1017]/95 border border-ratq-500/50 dark:border-ratq-400/40 shadow-2xl backdrop-blur-md text-xs">
        {/* Glowing Wand Icon */}
        <div className="w-6 h-6 rounded-full bg-ratq-100 dark:bg-ratq-900/80 text-ratq-700 dark:text-ratq-300 flex items-center justify-center shrink-0">
          <Wand2 className="w-3.5 h-3.5 animate-pulse" />
        </div>

        {/* Text prompt */}
        <span className="text-fg font-medium hidden sm:inline whitespace-nowrap">
          تبحث عن توليفة معتمدة لمشروعك؟
        </span>

        {/* CTA Button */}
        <button
          type="button"
          onClick={() => navigate('/resources/wizard')}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-ratq-600 hover:bg-ratq-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
        >
          <span>المُوجِّه التفاعلي Wizard</span>
          <ExternalLink className="w-3 h-3 rtl:rotate-0" />
        </button>

        {/* Dismiss Button */}
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="p-1 rounded-full text-fg-subtle hover:text-fg hover:bg-subtle transition-colors cursor-pointer"
          aria-label="إغلاق التلميح العائم"
          title="إغلاق"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
