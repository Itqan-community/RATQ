// src/components/resources/FilterHelpTooltip.tsx
import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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

// Copy lives in the site namespace (filter_help.<topic>) so it follows the language toggle.
export type FilterHelpTopic = 'badge' | 'access' | 'type' | 'license' | 'tech' | 'commercial';

interface FilterHelpTooltipProps {
  topic: FilterHelpTopic;
}

export const FilterHelpTooltip: React.FC<FilterHelpTooltipProps> = ({ topic }) => {
  const { t } = useTranslation('site');
  const data = t(`filter_help.${topic}`, { returnObjects: true }) as FilterHelpData;
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
        aria-label={t('filter_help.aria', { title: data.title })}
        aria-expanded={isOpen}
        className="p-1 -m-1 rounded-full text-fg-subtle hover:text-qtd-700 dark:hover:text-qtd-400 hover:bg-subtle/80 transition-colors focus:outline-none focus:ring-1 focus:ring-qtd-500 cursor-help"
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
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-qtd-50 dark:bg-qtd-950/60 text-qtd-700 dark:text-qtd-300 border border-qtd-200 dark:border-qtd-800 shrink-0 font-medium">
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
            <div className="pt-2 border-t border-gray-100 dark:border-neutral-800 text-[10.5px] text-qtd-800 dark:text-qtd-300 bg-qtd-50/60 dark:bg-qtd-950/40 p-2 rounded-lg border border-qtd-100 dark:border-qtd-900/60 leading-relaxed">
              {data.tip}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
