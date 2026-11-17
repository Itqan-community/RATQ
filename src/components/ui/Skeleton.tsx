// src/components/ui/Skeleton.tsx
import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'rectangular' | 'circular' | 'text';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
  ...props
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          'animate-pulse bg-muted',
          variant === 'circular' && 'rounded-full',
          variant === 'text' && 'h-4 rounded',
          variant === 'rectangular' && 'rounded-md',
          className
        )
      )}
      {...props}
    />
  );
};
