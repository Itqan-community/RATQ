// src/components/ui/Select.tsx
import React, { forwardRef, useId } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, hint, options, id, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id || generatedId;

    return (
      <div className="w-full flex flex-col gap-1.5 text-start">
        {label && (
          <label htmlFor={selectId} className="text-xs font-semibold text-fg">
            {label}
            {props.required && <span className="text-red-500 ms-1">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            className={twMerge(
              clsx(
                'w-full appearance-none rounded-md border border-border bg-canvas px-3 py-2 pe-8 text-sm text-fg transition-colors cursor-pointer',
                'focus:outline-none focus:ring-2 focus:ring-ratq-500 focus:border-ratq-500',
                'disabled:cursor-not-allowed disabled:opacity-50',
                error && 'border-red-500 focus:ring-red-500',
                className
              )
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 end-0 pe-2.5 flex items-center pointer-events-none text-fg-subtle">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
        {!error && hint && <p className="text-xs text-fg-subtle">{hint}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
