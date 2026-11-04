// src/components/theme/ThemeCustomizerModal.tsx
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useThemeStore,
  PaletteType,
  FontType,
  RadiusType,
} from '@/store/useThemeStore';
import {
  Palette,
  X,
  Sun,
  Moon,
  Sparkles,
  Type,
  Box,
  RotateCcw,
  Check,
  CheckCircle2,
  LayoutTemplate,
} from 'lucide-react';

interface ThemeCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeCustomizerModal: React.FC<ThemeCustomizerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const {
    theme,
    setTheme,
    palette,
    setPalette,
    font,
    setFont,
    radius,
    setRadius,
    heroLayout,
    setHeroLayout,
    resetDefaults,
  } = useThemeStore();

  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const palettesList: Array<{
    id: PaletteType;
    nameAr: string;
    nameEn: string;
    colors: { primary: string; secondary: string };
  }> = [
    {
      id: 'gold',
      nameAr: isAr ? 'الثيم الذهبي (الافتراضي)' : 'Golden Amber (Default)',
      nameEn: 'Golden Amber (Default)',
      colors: { primary: '#946E37', secondary: '#BEA56E' },
    },
    {
      id: 'default',
      nameAr: isAr ? 'ثيم رتق (زمردي)' : 'Ratq (Emerald)',
      nameEn: 'Ratq (Emerald)',
      colors: { primary: '#059669', secondary: '#1F4E4E' },
    },
    {
      id: 'olive',
      nameAr: isAr ? 'ثيم أخضر زيتوني' : 'Olive Green',
      nameEn: 'Olive Green',
      colors: { primary: '#6B7C33', secondary: '#A8B868' },
    },
    {
      id: 'navy',
      nameAr: isAr ? 'الأسود الكحلي' : 'Midnight Navy',
      nameEn: 'Midnight Navy',
      colors: { primary: '#162F52', secondary: '#2968A9' },
    },
  ];

  const fontsList: Array<{
    id: FontType;
    label: string;
    sub: string;
    fontFamily: string;
  }> = [
    {
      id: 'suisse',
      label: 'SuisseIntl',
      sub: isAr ? 'سويس إنتل (الافتراضي)' : 'Suisse Intl (Default)',
      fontFamily: "'SuisseIntl', 'IBM Plex Sans Arabic', sans-serif",
    },
    {
      id: 'default',
      label: 'IBM Plex Sans',
      sub: isAr ? 'آي بي إم بلكس' : 'IBM Plex',
      fontFamily: "'IBM Plex Sans Arabic', sans-serif",
    },
    {
      id: 'thmanyah',
      label: 'خط ثمانية',
      sub: 'Thmanyah',
      fontFamily: "'Thmanyah Sans', 'IBM Plex Sans Arabic', sans-serif",
    },
  ];

  const radiusList: RadiusType[] = ['4px', '8px', '12px', '20px'];

  return (
    <>
      {/* Backdrop to catch clicks outside */}
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] transition-opacity animate-in fade-in duration-150"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Popover Window anchored cleanly at bottom-left */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="theme-customizer-title"
        className="fixed bottom-16 sm:bottom-20 left-3 sm:left-4 z-50 w-[calc(100vw-1.5rem)] sm:w-[380px] max-w-[380px] bg-canvas text-fg rounded-2xl border border-border shadow-xl overflow-hidden flex flex-col transition-all duration-200 animate-in fade-in zoom-in-95 origin-bottom-left"
      >
        {/* Header — clean and quiet */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/80 bg-subtle/40">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-ratq-600/10 dark:bg-ratq-400/10 text-ratq-700 dark:text-ratq-300 flex items-center justify-center">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h2
                id="theme-customizer-title"
                className="text-xs sm:text-sm font-bold text-fg leading-tight"
              >
                {isAr ? 'تخصيص الثيم والمظهر' : 'Appearance & Theme'}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-fg-muted hover:text-fg hover:bg-muted rounded-lg transition-colors"
            aria-label={isAr ? 'إغلاق' : 'Close'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body — calm, balanced, no overflow */}
        <div className="p-3.5 space-y-3.5 text-start">
          {/* Section 1: Mode (Segmented Pill Switch) */}
          <div>
            <div className="text-[10px] font-bold text-fg-muted uppercase tracking-wider mb-1.5">
              {isAr ? 'نمط الإضاءة' : 'Color Mode'}
            </div>
            <div className="grid grid-cols-2 p-1 rounded-xl bg-subtle border border-border/60 gap-1">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg transition-all text-xs font-medium ${
                  theme === 'light'
                    ? 'bg-canvas text-fg shadow-xs border border-border/60 font-semibold'
                    : 'text-fg-muted hover:text-fg'
                }`}
              >
                <Sun className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-amber-500' : 'text-fg-subtle'}`} />
                <span>{isAr ? 'الوضع النهاري' : 'Light'}</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg transition-all text-xs font-medium ${
                  theme === 'dark'
                    ? 'bg-canvas text-fg shadow-xs border border-border/60 font-semibold'
                    : 'text-fg-muted hover:text-fg'
                }`}
              >
                <Moon className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-indigo-400' : 'text-fg-subtle'}`} />
                <span>{isAr ? 'الوضع الليلي' : 'Dark'}</span>
              </button>
            </div>
          </div>

          {/* Section: Hero Section Layout (خيار الهيرو سكشن) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-fg-muted uppercase tracking-wider">
                <LayoutTemplate className="w-3 h-3 text-ratq-500" />
                <span>{isAr ? 'خيار الهيرو سكشن' : 'Hero Layout'}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 p-1 rounded-xl bg-subtle border border-border/60 gap-1">
              <button
                type="button"
                onClick={() => setHeroLayout('centered')}
                className={`flex items-center justify-center py-1.5 px-1.5 sm:px-2 rounded-lg transition-all text-[11px] sm:text-xs font-medium text-center ${
                  heroLayout === 'centered'
                    ? 'bg-canvas text-fg shadow-xs border border-border/60 font-semibold'
                    : 'text-fg-muted hover:text-fg'
                }`}
              >
                <span>{isAr ? 'مركزي الحالي' : 'Centered'}</span>
              </button>

              <button
                type="button"
                onClick={() => setHeroLayout('split')}
                className={`flex items-center justify-center py-1.5 px-1.5 sm:px-2 rounded-lg transition-all text-[11px] sm:text-xs font-medium text-center ${
                  heroLayout === 'split'
                    ? 'bg-canvas text-fg shadow-xs border border-border/60 font-semibold'
                    : 'text-fg-muted hover:text-fg'
                }`}
              >
                <span>{isAr ? 'جانبي مع صورة' : 'Side with Image'}</span>
              </button>

              <button
                type="button"
                onClick={() => setHeroLayout('third')}
                className={`flex items-center justify-center py-1.5 px-1.5 sm:px-2 rounded-lg transition-all text-[11px] sm:text-xs font-medium text-center ${
                  heroLayout === 'third'
                    ? 'bg-canvas text-fg shadow-xs border border-border/60 font-semibold'
                    : 'text-fg-muted hover:text-fg'
                }`}
              >
                <span>{isAr ? 'بطاقات' : 'Cards'}</span>
              </button>
            </div>
          </div>

          {/* Section 2: Theme Palette (Single row of 3 quiet cards) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-fg-muted uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-ratq-500" />
                <span>{isAr ? 'طابع الألوان' : 'Color Palette'}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {palettesList.map((p) => {
                const isSelected = palette === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPalette(p.id)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all relative cursor-pointer ${
                      isSelected
                        ? 'border-ratq-500 bg-ratq-50/50 dark:bg-ratq-950/30 ring-1 ring-ratq-500 shadow-xs'
                        : 'border-border bg-subtle/50 hover:bg-muted/70 hover:border-border-strong'
                    }`}
                  >
                    {/* Swatch dots */}
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <div
                        className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-xs"
                        style={{ backgroundColor: p.colors.primary }}
                      />
                      <div
                        className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-xs"
                        style={{ backgroundColor: p.colors.secondary }}
                      />
                    </div>

                    <span className="text-[11px] font-bold text-fg leading-tight truncate w-full">
                      {isAr ? p.nameAr : p.nameEn}
                    </span>

                    {isSelected && (
                      <div className="absolute top-1.5 end-1.5 w-3 h-3 rounded-full bg-ratq-600 text-white flex items-center justify-center">
                        <Check className="w-2 h-2 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Platform Font (Quiet 2-column segmented layout) */}
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-fg-muted uppercase tracking-wider mb-1.5">
              <Type className="w-3 h-3 text-ratq-500" />
              <span>{isAr ? 'خط المنصة' : 'Platform Font'}</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {fontsList.map((f) => {
                const isSelected = font === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFont(f.id)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all relative ${
                      isSelected
                        ? 'border-ratq-500 bg-ratq-50/50 dark:bg-ratq-950/30 ring-1 ring-ratq-500 shadow-xs'
                        : 'border-border bg-subtle/50 hover:bg-muted/70 hover:border-border-strong'
                    }`}
                  >
                    <span
                      className="font-bold text-xs text-fg leading-tight truncate w-full"
                      style={{ fontFamily: f.fontFamily }}
                    >
                      {f.label}
                    </span>
                    <span className="text-[10px] text-fg-muted leading-tight mt-0.5 truncate w-full">
                      {f.sub}
                    </span>

                    {isSelected && (
                      <div className="absolute top-1.5 end-1.5 w-3 h-3 rounded-full bg-ratq-600 text-white flex items-center justify-center">
                        <Check className="w-2 h-2 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Border Radius (Clean interactive pills) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-fg-muted uppercase tracking-wider">
                <Box className="w-3 h-3 text-ratq-500" />
                <span>{isAr ? 'استدارة الحواف' : 'Border Radius'}</span>
              </div>
              <span className="text-[10px] font-mono font-medium text-fg-muted px-1.5 py-0.2 rounded bg-subtle border border-border/60">
                {radius}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {radiusList.map((r) => {
                const isSelected = radius === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRadius(r)}
                    style={{ borderRadius: r }}
                    className={`py-1.5 px-2 text-center text-xs font-mono font-semibold border transition-all ${
                      isSelected
                        ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 border-transparent shadow-xs'
                        : 'border-border bg-subtle hover:bg-muted text-fg-muted hover:text-fg'
                    }`}
                  >
                    {r}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer — minimalist */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-border/80 bg-subtle/40">
          <button
            type="button"
            onClick={resetDefaults}
            className="flex items-center gap-1.5 text-[11px] font-medium text-fg-muted hover:text-fg transition-colors py-1 px-1.5 rounded-lg hover:bg-muted"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{isAr ? 'استعادة الافتراضي' : 'Reset Defaults'}</span>
          </button>

          <div className="flex items-center gap-1 text-[10px] text-fg-muted font-medium">
            <CheckCircle2 className="w-3 h-3 text-ratq-500" />
            <span>{isAr ? 'يحفظ تلقائياً' : 'Auto-saved'}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ThemeCustomizerModal;
