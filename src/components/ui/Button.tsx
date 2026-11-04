// src/components/ui/Button.tsx
import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loading?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      loading = false,
      startIcon,
      endIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isSpinning = isLoading || loading;
    const baseStyles =
      'inline-flex flex-row flex-nowrap items-center justify-center whitespace-nowrap font-medium rounded-md transition-all duration-150 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ratq-500 disabled:opacity-50 disabled:pointer-events-none select-none shrink-0 [&>svg]:shrink-0';

    const variants = {
      primary: 'bg-ratq-700 text-white hover:bg-ratq-800 shadow-sm active:bg-ratq-900',
      secondary: 'bg-subtle text-fg border border-border hover:bg-muted active:bg-border-subtle',
      outline: 'border border-border text-fg hover:bg-subtle hover:border-border-strong active:bg-muted',
      ghost: 'text-fg-muted hover:text-fg hover:bg-subtle',
      danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm active:bg-red-800',
      gold: 'bg-gold-500 text-white hover:bg-gold-600 shadow-sm active:bg-gold-700',
    };

    const sizes = {
      sm: 'text-xs px-2.5 py-1.5 gap-1.5',
      md: 'text-sm px-4 py-2 gap-2',
      lg: 'text-base px-5 py-2.5 gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isSpinning}
        className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
        {...props}
      >
        {isSpinning && <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" />}
        {!isSpinning && startIcon && <span className="shrink-0 inline-flex items-center">{startIcon}</span>}
        {children}
        {!isSpinning && endIcon && <span className="shrink-0 inline-flex items-center">{endIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
