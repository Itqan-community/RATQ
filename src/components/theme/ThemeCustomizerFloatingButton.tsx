import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Palette } from 'lucide-react';
import { ThemeCustomizerModal } from './ThemeCustomizerModal';

export const FIRST_VISIT_KEY = 'ratq_theme_customizer_first_visit_v1';

export interface ThemeCustomizerFloatingButtonProps {
  initialOpen?: boolean;
  disableAutoOpen?: boolean;
}

export const ThemeCustomizerFloatingButton: React.FC<ThemeCustomizerFloatingButtonProps> = ({
  initialOpen,
  disableAutoOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(initialOpen ?? false);
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  useEffect(() => {
    if (initialOpen !== undefined || disableAutoOpen) return;
    if (typeof window === 'undefined') return;

    try {
      const hasSeen =
        localStorage.getItem(FIRST_VISIT_KEY) ||
        sessionStorage.getItem(FIRST_VISIT_KEY);

      if (!hasSeen) {
        setIsOpen(true);
        localStorage.setItem(FIRST_VISIT_KEY, 'true');
        sessionStorage.setItem(FIRST_VISIT_KEY, 'true');
      }
    } catch {
      // Ignore storage errors in private/sandboxed windows
    }
  }, [initialOpen, disableAutoOpen]);

  return (
    <>
      <aside
        aria-label={isAr ? 'زر تخصيص الثيم والمظهر' : 'Theme and appearance button'}
        className="fixed bottom-4 sm:bottom-6 left-3 sm:left-4 z-40 flex items-center gap-2.5 print:hidden group"
        dir="ltr"
      >
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white dark:bg-slate-50 text-slate-800 hover:bg-slate-100 dark:hover:bg-white shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95 border border-slate-200 dark:border-slate-300 focus:outline-hidden focus:ring-4 focus:ring-ratq-500/30 cursor-pointer"
          title={isAr ? 'تخصيص الثيم والخط' : 'Customize theme and font'}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
        >
          <Palette className="w-5 h-5 text-ratq-600 dark:text-ratq-700 group-hover:rotate-12 transition-transform duration-300" />
          <span className="sr-only">
            {isAr ? 'تخصيص الثيم والمظهر' : 'Customize Theme & Appearance'}
          </span>
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-ratq-500 rounded-full border-2 border-white animate-pulse" />
        </button>

        {/* Floating tooltip label shown to the RIGHT of the button */}
        <div
          dir={isAr ? 'rtl' : 'ltr'}
          className="opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none bg-white dark:bg-slate-50 text-slate-800 text-xs font-semibold py-1.5 px-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-300 whitespace-nowrap transform -translate-x-1 group-hover:translate-x-0"
        >
          {isAr ? 'تخصيص المظهر والخط' : 'Theme & Font Customizer'}
        </div>
      </aside>

      <ThemeCustomizerModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

export default ThemeCustomizerFloatingButton;
