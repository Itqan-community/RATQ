// src/components/ui/Checkbox.tsx
import React, { forwardRef, useId } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  onChange?: (checked: any) => void;
  labelClassName?: string;
  containerClassName?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      label,
      description,
      children,
      id,
      checked,
      onChange,
      labelClassName,
      containerClassName,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const checkboxId = id || generatedId;
    const content = label || children;

    return (
      <label
        htmlFor={checkboxId}
        className={twMerge(
          'inline-flex items-center gap-2 cursor-pointer select-none text-start group w-fit max-w-full',
          description ? 'items-start' : 'items-center',
          containerClassName
        )}
      >
        <div className="relative flex items-center justify-center shrink-0">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            checked={checked}
            className="peer sr-only"
            onChange={(e) => {
              if (onChange) {
                const checkedVal = e.target.checked;
                const hybridEvent: any = Object.assign(Boolean(checkedVal), {
                  target: { checked: checkedVal },
                  currentTarget: { checked: checkedVal },
                  checked: checkedVal,
                  nativeEvent: e.nativeEvent,
                });
                onChange(hybridEvent);
              }
            }}
            {...props}
          />
          <div
            className={twMerge(
              clsx(
                'w-4 h-4 rounded border transition-colors flex items-center justify-center shrink-0',
                checked
                  ? 'bg-ratq-700 border-ratq-700 text-white'
                  : 'border-border bg-canvas hover:border-ratq-500',
                className
              )
            )}
          >
            {checked && <Check className="w-3 h-3 stroke-[3]" />}
          </div>
        </div>

        {content && (
          <div className="flex flex-col min-w-0">
            <span className={twMerge('text-xs font-semibold text-fg leading-snug', labelClassName)}>
              {content}
            </span>
            {description && <span className="text-2xs text-fg-subtle mt-0.5">{description}</span>}
          </div>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
