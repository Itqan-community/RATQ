// src/components/review/BadgeChecklist.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Textarea } from '@/components/ui/Textarea';
import { Resource } from '@/types';
import { ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';

interface BadgeChecklistProps {
  resource: Resource;
  onAward: (level: any, notes: string) => void;
  onReject: (notes: string) => void;
}

export const BadgeChecklist: React.FC<BadgeChecklistProps> = ({
  resource,
  onAward,
  onReject,
}) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    'c_tech_links': true,
    'c_tech_sha256': true,
    'c_meta_summary': true,
  });
  const [notes, setNotes] = useState('');

  const criteria = [
    {
      id: 'c_tech_links',
      category: 'تقني وأمني (35%)',
      label: 'سلامة الروابط وتوافر الملفات وخلوها من المخاطر البرمجية',
      required: true,
    },
    {
      id: 'c_tech_sha256',
      category: 'تقني وأمني (35%)',
      label: 'مطابقة بصمة SHA-256 للملف مع السجل وتوافق إصدارات SemVer',
      required: true,
    },
    {
      id: 'c_meta_summary',
      category: 'معرفي وتوثيق (25%)',
      label: 'اكتمال الوصف الفني وتعليمات التركيب وتحديد حالات الاستخدام',
      required: true,
    },
    {
      id: 'c_sacred_verify',
      category: 'علمي وشرعي (30% — إلزامي)',
      label: 'صحة الإسناد ومطابقة المصادر المعتمدة وخلو المحتوى من أي تحريف أو خطأ',
      required: resource.contains_quranic_text,
    },
    {
      id: 'c_legal_license',
      category: 'قانوني وتراخيص (10%)',
      label: 'وضوح بنود الترخيص ومطابقة حقوق الناشر الفكرية والتأليف',
      required: true,
    },
  ];

  const toggleItem = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const allRequiredPassed = criteria
    .filter((c) => c.required)
    .every((c) => checkedItems[c.id]);

  return (
    <div className="flex flex-col gap-6 text-start p-6 rounded-xl border border-border bg-canvas">
      <div>
        <h3 className="text-base font-bold text-fg flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-ratq-700" />
          <span>قائمة التحقق الموزونة لمعيار إتقان (إصدار 1.0)</span>
        </h3>
        <p className="text-xs text-fg-subtle mt-1">
          قم بفحص ومطابقة البنود قبل منح الشارة للمورد: <strong>{resource.title_ar}</strong>
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {criteria.map((c) => (
          <div
            key={c.id}
            className="p-3.5 rounded-lg border border-border-subtle bg-subtle flex items-start justify-between gap-3"
          >
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold text-fg-subtle">{c.category}</span>
              <Checkbox
                checked={Boolean(checkedItems[c.id])}
                onChange={() => toggleItem(c.id)}
                label={c.label}
              />
            </div>
            {c.required && (
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded shrink-0">
                إلزامي
              </span>
            )}
          </div>
        ))}
      </div>

      <Textarea
        label="ملاحظات المراجعة والتحكيم الفني"
        rows={3}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="سجل ملاحظاتك الفنية، الأدلة المرفقة، أو أسباب القرار..."
      />

      {!allRequiredPassed && (
        <div className="p-3 rounded-lg border border-amber-200 bg-amber-50 text-amber-900 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>لا يمكن منح شارة معتمد قبل استيفاء كافة البنود الإلزامية بنجاح.</span>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-border-subtle">
        <Button
          variant="danger"
          size="sm"
          onClick={() => onReject(notes || 'عدم استيفاء المعايير الإلزامية للمراجعة.')}
        >
          رفض منح الشارة
        </Button>
        <Button
          variant="gold"
          size="sm"
          disabled={!allRequiredPassed}
          onClick={() => onAward('certified', notes)}
          startIcon={<CheckCircle2 className="w-4 h-4" />}
        >
          منح شارة «معتمد»
        </Button>
      </div>
    </div>
  );
};
