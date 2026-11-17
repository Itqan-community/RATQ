// src/components/ui/Input.tsx
import React, { forwardRef, useId } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, startIcon, endIcon, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    return (
      <div className="w-full flex flex-col gap-1.5 text-start">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-fg">
            {label}
            {props.required && <span className="text-red-500 ms-1">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {startIcon && (
            <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none text-fg-subtle">
              {startIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : hint ? hintId : undefined}
            className={twMerge(
              clsx(
                'w-full rounded-md border border-border bg-canvas px-3 py-2 text-sm text-fg placeholder:text-fg-subtle transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-ratq-500 focus:border-ratq-500',
                'disabled:cursor-not-allowed disabled:opacity-50',
                startIcon && 'ps-9',
                endIcon && 'pe-9',
                error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
                className
              )
            )}
            {...props}
          />
          {endIcon && (
            <div className="absolute inset-y-0 end-0 pe-3 flex items-center pointer-events-none text-fg-subtle">
              {endIcon}
            </div>
          )}
        </div>
        {error && (
          <p id={errorId} className="text-xs text-red-500 font-medium">
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={hintId} className="text-xs text-fg-subtle">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
