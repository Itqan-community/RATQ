// src/components/keys/ApiKeyRevealDialog.tsx
import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { AlertTriangle, Key } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ApiKeyRevealDialogProps {
  isOpen: boolean;
  onClose: () => void;
  rawKey: string;
  keyName?: string;
  keyPrefix?: string;
}

export const ApiKeyRevealDialog: React.FC<ApiKeyRevealDialogProps> = ({
  isOpen,
  onClose,
  rawKey,
  keyName,
}) => {
  const { t } = useTranslation('site');
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('reveal.title')}
      maxWidth="md"
    >
      <div className="flex flex-col gap-4 text-start">
        {/* Security Warning Callout */}
        <div className="p-3.5 rounded-xl border border-amber-300 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="block font-bold mb-0.5">{t('reveal.warning_title')}</strong>
            {t('reveal.warning_body')}
          </div>
        </div>

        <div>
          <label htmlFor="api-key-reveal" className="text-xs font-semibold text-fg-subtle mb-1 block">
            {t('reveal.key_for', { name: keyName || t('reveal.default_name') })}
          </label>
          <div className="flex items-center gap-2 p-2.5 rounded-lg border border-border bg-subtle">
            <Key className="w-4 h-4 text-ratq-600 shrink-0" />
            <input
              id="api-key-reveal"
              type="text"
              readOnly
              value={rawKey}
              dir="ltr"
              className="w-full bg-transparent font-mono text-xs text-fg select-all focus:outline-none"
            />
            <CopyButton text={rawKey} size="sm" variant="outline" />
          </div>
        </div>

        <div className="pt-3 border-t border-border-subtle flex justify-end">
          <Button variant="secondary" size="sm" onClick={onClose}>
            {t('reveal.done')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
