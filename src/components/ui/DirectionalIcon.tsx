// src/components/ui/DirectionalIcon.tsx
import React from 'react';
import { useThemeStore } from '@/store/useThemeStore';
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ArrowDownLeft,
  LucideIcon,
} from 'lucide-react';

export type DirectionalIconName =
  | 'chevron-next'
  | 'chevron-prev'
  | 'arrow-next'
  | 'arrow-prev'
  | 'arrow-external';

interface DirectionalIconProps extends React.SVGProps<SVGSVGElement> {
  name?: DirectionalIconName;
  ltrIcon?: LucideIcon;
  rtlIcon?: LucideIcon;
  className?: string;
  size?: number;
}

export const DirectionalIcon: React.FC<DirectionalIconProps> = ({
  name,
  ltrIcon,
  rtlIcon,
  className = 'w-4 h-4',
  size = 16,
  ...props
}) => {
  const direction = useThemeStore((state) => state.direction);
  const isRtl = direction === 'rtl';

  if (ltrIcon || rtlIcon) {
    const Icon = isRtl ? (rtlIcon || ltrIcon) : (ltrIcon || rtlIcon);
    if (!Icon) return null;
    return <Icon size={size} className={className} {...(props as any)} />;
  }

  switch (name) {
    case 'chevron-next':
      return isRtl ? (
        <ChevronLeft size={size} className={className} {...(props as any)} />
      ) : (
        <ChevronRight size={size} className={className} {...(props as any)} />
      );
    case 'chevron-prev':
      return isRtl ? (
        <ChevronRight size={size} className={className} {...(props as any)} />
      ) : (
        <ChevronLeft size={size} className={className} {...(props as any)} />
      );
    case 'arrow-next':
      return isRtl ? (
        <ArrowLeft size={size} className={className} {...(props as any)} />
      ) : (
        <ArrowRight size={size} className={className} {...(props as any)} />
      );
    case 'arrow-prev':
      return isRtl ? (
        <ArrowRight size={size} className={className} {...(props as any)} />
      ) : (
        <ArrowLeft size={size} className={className} {...(props as any)} />
      );
    case 'arrow-external':
      return isRtl ? (
        <ArrowDownLeft size={size} className={className} {...(props as any)} />
      ) : (
        <ArrowUpRight size={size} className={className} {...(props as any)} />
      );
    default:
      return null;
  }
};
