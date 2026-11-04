// src/components/ui/ConfirmDialog.tsx
import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  message?: string;
  confirmLabel?: string;
  confirmText?: string;
  cancelLabel?: string;
  cancelText?: string;
  isDestructive?: boolean;
  variant?: 'danger' | 'warning' | 'primary';
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  message,
  confirmLabel,
  confirmText,
  cancelLabel,
  cancelText,
  isDestructive = false,
  variant,
  isLoading = false,
}) => {
  const effectiveDescription = description || message || '';
  const effectiveConfirmLabel = confirmText || confirmLabel || 'تأكيد';
  const effectiveCancelLabel = cancelText || cancelLabel || 'إلغاء';
  const isDanger = isDestructive || variant === 'danger';

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm">
      <div className="flex flex-col gap-4 text-start">
        <div className="flex items-center gap-3">
          {isDanger && (
            <div className="p-2 rounded-full bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
          )}
          <div>
            <h3 className="text-base font-bold text-fg">{title}</h3>
            <p className="text-xs text-fg-subtle mt-1">{effectiveDescription}</p>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-2 pt-3 border-t border-border-subtle">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            {effectiveCancelLabel}
          </Button>
          <Button
            variant={isDanger ? 'danger' : 'primary'}
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {effectiveConfirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
