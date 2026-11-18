// src/components/ui/Tabs.tsx
import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ items, activeId, onChange, className }) => {
  return (
    <div className={twMerge('flex border-b border-border gap-1 overflow-x-auto no-scrollbar', className)}>
      {items.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={clsx(
              'flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 -mb-px whitespace-nowrap transition-colors cursor-pointer select-none',
              isActive
                ? 'border-qtd-700 text-qtd-700 dark:border-qtd-400 dark:text-qtd-300'
                : 'border-transparent text-fg-muted hover:text-fg hover:border-border'
            )}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={clsx(
                  'text-[10px] px-1.5 py-0.2 rounded-full font-bold',
                  isActive
                    ? 'bg-qtd-100 text-qtd-800 dark:bg-qtd-900 dark:text-qtd-200'
                    : 'bg-muted text-fg-subtle'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
