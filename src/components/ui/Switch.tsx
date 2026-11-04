// src/components/ui/Switch.tsx
import React, { forwardRef, useId } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  labelClassName?: string;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, description, id, checked, labelClassName, ...props }, ref) => {
    const generatedId = useId();
    const switchId = id || generatedId;

    return (
      <label htmlFor={switchId} className="flex items-center justify-between gap-3 cursor-pointer select-none">
        {(label || description) && (
          <div className="flex flex-col text-start">
            {label && (
              <span className={twMerge('text-xs font-semibold text-fg', labelClassName)}>
                {label}
              </span>
            )}
            {description && <span className="text-xs text-fg-subtle">{description}</span>}
          </div>
        )}
        <div className="relative inline-flex items-center shrink-0">
          <input
            ref={ref}
            type="checkbox"
            id={switchId}
            checked={checked}
            className="peer sr-only"
            {...props}
          />
          <div
            className={twMerge(
              clsx(
                'w-9 h-5 bg-border rounded-full peer peer-checked:bg-ratq-700 transition-colors',
                'peer-focus-visible:ring-2 peer-focus-visible:ring-ratq-500',
                'peer-disabled:opacity-50 peer-disabled:cursor-not-allowed',
                className
              )
            )}
          />
          <div
            className={clsx(
              'absolute w-3.5 h-3.5 bg-white rounded-full transition-transform start-0.5',
              'peer-checked:translate-x-4 rtl:peer-checked:-translate-x-4'
            )}
          />
        </div>
      </label>
    );
  }
);

Switch.displayName = 'Switch';
