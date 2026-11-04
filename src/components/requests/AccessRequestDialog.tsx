// src/components/requests/AccessRequestDialog.tsx
import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { Resource } from '@/types';
import { mockRepo } from '@/lib/supabase';
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
  const [purpose, setPurpose] = useState('');
  const [intendedUse, setIntendedUse] = useState<any>('research');
  const [days, setDays] = useState('90');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!purpose || purpose.trim().length < 15) {
      setError('يرجى كتابة شرح وافٍ للغرض من الاستخدام (15 حرفاً على الأقل).');
      return;
    }
    if (!agreed) {
      setError('يجب الموافقة على شروط الترخيص والاستخدام.');
      return;
    }

    setLoading(true);
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
      setError('تعذر تقديم الطلب حالياً.');
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="طلب وصول لمورد مقيّد" maxWidth="md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-start">
        <div className="flex items-center gap-2 p-3 rounded-lg bg-gold-50 dark:bg-gold-950/40 border border-gold-200 text-gold-900 dark:text-gold-200 text-xs">
          <Lock className="w-4 h-4 shrink-0" />
          <span>
            هذا المورد يتطلب موافقة الناشر <strong>({resource.publisher?.name_ar || 'الناشر'})</strong> قبل إصدار مفتاح الـ API.
          </span>
        </div>

        <Textarea
          label="الغرض من الاستخدام والمشروع التطبيقي"
          required
          rows={3}
          value={purpose}
          onChange={(e) => {
            setPurpose(e.target.value);
            setError(null);
          }}
          placeholder="وضح طبيعة تطبيقك أو بحثك، الفئات المستفيدة، وتوقعات استهلاك البيانات..."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="نوع الاستخدام"
            options={[
              { value: 'research', label: 'أبحاث ودراسات أكاديمية' },
              { value: 'education', label: 'تعليمي / تحفيظ' },
              { value: 'nonprofit', label: 'خيري غير ربحي' },
              { value: 'personal', label: 'تجربة شخصية' },
              { value: 'commercial', label: 'تطبيق تجاري' },
            ]}
            value={intendedUse}
            onChange={(e) => setIntendedUse(e.target.value)}
          />

          <Select
            label="المدة المطلوبة"
            options={[
              { value: '30', label: '30 يوماً' },
              { value: '90', label: '90 يوماً (المعتاد)' },
              { value: '180', label: '180 يوماً' },
              { value: '365', label: 'سنة كاملة' },
            ]}
            value={days}
            onChange={(e) => setDays(e.target.value)}
          />
        </div>

        <Checkbox
          checked={agreed}
          onChange={(val: any) => setAgreed(Boolean(typeof val === 'boolean' ? val : val?.target?.checked))}
          label="أتعهد بالالتزام بشروط الترخيص المعلنة للمورد وعدم إساءة استخدام البيانات."
        />

        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

        <div className="flex justify-end gap-2 pt-3 border-t border-border-subtle">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            إلغاء
          </Button>
          <Button variant="primary" size="sm" type="submit" isLoading={loading}>
            تقديم الطلب
          </Button>
        </div>
      </form>
    </Modal>
  );
};
