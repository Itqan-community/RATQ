// src/components/ui/Card.tsx
import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ className, hoverable = false, children, ...props }) => {
  return (
    <div
      className={twMerge(
        clsx(
          'rounded-xl border border-border bg-canvas text-fg transition-all duration-200',
          hoverable && 'hover:border-border-strong hover:shadow-sm',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
