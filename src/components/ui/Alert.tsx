// src/components/ui/Alert.tsx
import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'danger' | 'error';
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  className,
}) => {
  const activeVariant = variant === 'error' ? 'danger' : variant;
  const configs = {
    info: {
      icon: Info,
      style: 'bg-sky-50 text-sky-900 border-sky-200 dark:bg-sky-950 dark:text-sky-200 dark:border-sky-800',
      iconColor: 'text-sky-600 dark:text-sky-400',
    },
    success: {
      icon: CheckCircle,
      style: 'bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
    warning: {
      icon: AlertTriangle,
      style: 'bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-800',
      iconColor: 'text-amber-600 dark:text-amber-400',
    },
    danger: {
      icon: AlertCircle,
      style: 'bg-red-50 text-red-900 border-red-200 dark:bg-red-950 dark:text-red-200 dark:border-red-800',
      iconColor: 'text-red-600 dark:text-red-400',
    },
  };

  const { icon: Icon, style, iconColor } = configs[activeVariant];

  return (
    <div
      role="alert"
      className={twMerge(
        clsx('flex items-start gap-3 p-4 rounded-xl border text-start text-xs', style, className)
      )}
    >
      <Icon className={clsx('w-5 h-5 shrink-0 mt-0.5', iconColor)} />
      <div className="flex-1">
        {title && <h4 className="font-bold text-sm mb-1">{title}</h4>}
        <div className="leading-relaxed">{children}</div>
      </div>
    </div>
  );
};
