// src/components/ui/Tooltip.tsx
import React, { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: 'top' | 'top-right' | 'top-left' | 'top-start' | 'top-end' | 'bottom' | 'start' | 'end';
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  className,
}) => {
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    'top-right': 'bottom-full end-0 mb-2',
    'top-left': 'bottom-full start-0 mb-2',
    'top-start': 'bottom-full start-0 mb-2',
    'top-end': 'bottom-full end-0 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    start: 'top-1/2 end-full -translate-y-1/2 me-2',
    end: 'top-1/2 start-full -translate-y-1/2 ms-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-deep-900 dark:border-t-deep-800 border-x-transparent border-b-transparent',
    'top-right': 'top-full end-3.5 border-t-deep-900 dark:border-t-deep-800 border-x-transparent border-b-transparent',
    'top-left': 'top-full start-3.5 border-t-deep-900 dark:border-t-deep-800 border-x-transparent border-b-transparent',
    'top-start': 'top-full start-3.5 border-t-deep-900 dark:border-t-deep-800 border-x-transparent border-b-transparent',
    'top-end': 'top-full end-3.5 border-t-deep-900 dark:border-t-deep-800 border-x-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-deep-900 dark:border-b-deep-800 border-x-transparent border-t-transparent',
    start: 'start-full top-1/2 -translate-y-1/2 border-s-deep-900 dark:border-s-deep-800 border-y-transparent border-e-transparent',
    end: 'end-full top-1/2 -translate-y-1/2 border-e-deep-900 dark:border-e-deep-800 border-y-transparent border-s-transparent',
  };

  return (
    <div className={twMerge('relative group inline-flex items-center justify-center', className)}>
      {children}
      <div
        role="tooltip"
        className={twMerge(
          'absolute z-50 pointer-events-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-none',
          'px-2.5 py-1 text-[11px] font-medium text-white bg-deep-900 dark:bg-deep-800 dark:text-fg rounded shadow-md whitespace-nowrap',
          positionClasses[position]
        )}
      >
        {content}
        <div className={twMerge('absolute border-4 w-0 h-0', arrowClasses[position])} />
      </div>
    </div>
  );
};

export default Tooltip;
