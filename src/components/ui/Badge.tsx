// src/components/ui/Badge.tsx
import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'gold' | 'danger' | 'warning' | 'info' | 'success' | 'outline';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}) => {
  const variants = {
    default: 'bg-muted text-fg border-border',
    primary: 'bg-ratq-50 text-ratq-800 border-ratq-200 dark:bg-ratq-950 dark:text-ratq-300 dark:border-ratq-800',
    secondary: 'bg-deep-50 text-deep-800 border-deep-200 dark:bg-deep-900 dark:text-deep-300',
    gold: 'bg-gold-50 text-gold-800 border-gold-200 dark:bg-gold-900 dark:text-gold-300',
    danger: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300',
    warning: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300',
    info: 'bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950 dark:text-sky-300',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
    outline: 'bg-transparent text-fg-muted border-border',
  };

  const sizes = {
    sm: 'text-[11px] px-1.5 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-0.5 gap-1.5',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center font-medium rounded-full border select-none',
          variants[variant],
          sizes[size],
          className
        )
      )}
      {...props}
    >
      {children}
    </span>
  );
};
