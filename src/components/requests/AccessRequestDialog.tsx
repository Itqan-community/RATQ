// src/components/requests/AccessRequestDialog.tsx
import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { Resource } from '@/types';
import { mockRepo } from '@/lib/supabase';
import { isLive } from '@/lib/payloadAuth';
import { hydrateRequests, submitRequest } from '@/lib/payloadRequests';
import { Lock } from 'lucide-react';

interface AccessRequestDialogProps {
  resource: Resource;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AccessRequestDialog: React.FC<AccessRequestDialogProps> = ({
  resource,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation('site');
  const [purpose, setPurpose] = useState('');
  const [intendedUse, setIntendedUse] = useState<any>('research');
  const [days, setDays] = useState('90');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!purpose || purpose.trim().length < 15) {
      setError(t('access_request.err_purpose'));
      return;
    }
    if (!agreed) {
      setError(t('access_request.err_terms'));
      return;
    }

    setLoading(true);
    if (isLive()) {
      // Live mode never fakes success: non-live (snapshot/mock) resources get submitRequest's refusal.
      const err = await submitRequest(resource.id, purpose.trim());
      if (err) {
        setError(err);
        setLoading(false);
        return;
      }
      await hydrateRequests();
      setLoading(false);
      onSuccess();
      onClose();
      return;
    }
    try {
      mockRepo.createRequest({
        resource_id: resource.id,
        purpose_ar: purpose,
        intended_use: intendedUse,
        requested_days: parseInt(days, 10),
      });
      setLoading(false);
      onSuccess();
      onClose();
    } catch {
      setError(t('access_request.err_submit'));
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('access_request.title')} maxWidth="md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-start">
        <div className="flex items-center gap-2 p-3 rounded-lg bg-gold-50 dark:bg-gold-950/40 border border-gold-200 text-gold-900 dark:text-gold-200 text-xs">
          <Lock className="w-4 h-4 shrink-0" />
          <span>
            <Trans t={t} i18nKey="access_request.approval_note" values={{ name: resource.publisher?.name_ar || t('access_request.publisher_fallback') }} components={{ b: <strong /> }} />
          </span>
        </div>

        <Textarea
          label={t('access_request.purpose')}
          required
          rows={3}
          value={purpose}
          onChange={(e) => {
            setPurpose(e.target.value);
            setError(null);
          }}
          placeholder={t('access_request.purpose_placeholder')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label={t('access_request.use_type')}
            options={[
              { value: 'research', label: t('access_request.use_research') },
              { value: 'education', label: t('access_request.use_education') },
              { value: 'nonprofit', label: t('access_request.use_nonprofit') },
              { value: 'personal', label: t('access_request.use_personal') },
              { value: 'commercial', label: t('access_request.use_commercial') },
            ]}
            value={intendedUse}
            onChange={(e) => setIntendedUse(e.target.value)}
          />

          <Select
            label={t('access_request.duration')}
            options={[
              { value: '30', label: t('access_request.d30') },
              { value: '90', label: t('access_request.d90') },
              { value: '180', label: t('access_request.d180') },
              { value: '365', label: t('access_request.d365') },
            ]}
            value={days}
            onChange={(e) => setDays(e.target.value)}
          />
        </div>

        <Checkbox
          checked={agreed}
          onChange={(val: any) => setAgreed(Boolean(typeof val === 'boolean' ? val : val?.target?.checked))}
          label={t('access_request.pledge')}
        />

        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

        <div className="flex justify-end gap-2 pt-3 border-t border-border-subtle">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            {t('access_request.cancel')}
          </Button>
          <Button variant="primary" size="sm" type="submit" isLoading={loading}>
            {t('access_request.submit')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
