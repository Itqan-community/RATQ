// src/components/ui/CopyButton.tsx
import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from './Button';

interface CopyButtonProps {
  text?: string;
  textToCopy?: string;
  label?: string;
  size?: 'sm' | 'md';
  variant?: 'outline' | 'ghost' | 'secondary';
  className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  textToCopy,
  label = 'نسخ',
  size = 'sm',
  variant = 'outline',
  className,
}) => {
  const [copied, setCopied] = useState(false);
  const rawText = text || textToCopy || '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rawText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCopy}
      className={className}
      startIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
    >
      {copied ? 'تم النسخ' : label}
    </Button>
  );
};
