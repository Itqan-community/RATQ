// src/views/PublisherClaim.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { CopyButton } from '@/components/ui/CopyButton';
import { DEMO_PUBLISHERS } from '@/lib/mockData';
import { ShieldCheck, Globe, FileText, CheckCircle2, Upload } from 'lucide-react';

export const PublisherClaimPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const publisher = DEMO_PUBLISHERS[0];

  const initialDomain = (publisher.website_url || publisher.website || 'qurantech.org').replace('https://', '');
  const [domain, setDomain] = useState(initialDomain);
  const [verifying, setVerifying] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);
  const [activeMethod, setActiveMethod] = useState<'dns' | 'doc'>('dns');

  const txtRecordValue = `ratq-site-verification=rtk_claim_9f83a8b271d`;

  const handleVerifyDns = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setVerifiedSuccess(true);
    }, 1200);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-fg tracking-tight">
          {isAr ? 'توثيق هوية جهة النشر (Publisher Verification)' : 'Publisher Accreditation & Claim'}
        </h1>
        <p className="text-fg-muted text-sm mt-1">
          {isAr
            ? 'احصل على شارة الجهة الموثقة لتعزيز مصداقية الحزم البرمجية والبيانات القرآنية التي تنشرها.'
            : 'Verify domain ownership or submit official institutional credentials for verified badge.'}
        </p>
      </div>

      {/* Current Status Card */}
      <Card className="p-6 bg-emerald-500/10 border-emerald-500/30 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-fg">
                {isAr ? publisher.name_ar : publisher.name_en}
              </h2>
              <Badge variant="primary" className="bg-emerald-600 text-white text-xs">
                {isAr ? 'جهة موثقة رسمياً' : 'Officially Verified'}
              </Badge>
            </div>
            <p className="text-xs text-fg-muted mt-0.5">
              {isAr
                ? 'تم التحقق من النطاق الرسمي والسجل المؤسسي في 15 يناير 2026.'
                : 'Accreditation verified on Jan 15, 2026 via primary domain.'}
            </p>
          </div>
        </div>
      </Card>

      {/* Methods Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveMethod('dns')}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold border transition-all flex items-center justify-center gap-2 ${
            activeMethod === 'dns'
              ? 'bg-ratq-600 text-white border-ratq-600 shadow-sm'
              : 'bg-canvas-card border-border text-fg-muted hover:text-fg'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>{isAr ? 'التحقق عبر سجل النطاق (DNS TXT)' : 'DNS TXT Record'}</span>
        </button>

        <button
          onClick={() => setActiveMethod('doc')}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold border transition-all flex items-center justify-center gap-2 ${
            activeMethod === 'doc'
              ? 'bg-ratq-600 text-white border-ratq-600 shadow-sm'
              : 'bg-canvas-card border-border text-fg-muted hover:text-fg'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{isAr ? 'إرفاق السجل أو الترخيص المؤسسي' : 'Institutional Accreditation Document'}</span>
        </button>
      </div>

      {/* Tab 1: DNS */}
      {activeMethod === 'dns' && (
        <Card className="p-6 md:p-8 space-y-6">
          <div>
            <h3 className="font-bold text-fg text-base mb-1">
              {isAr ? 'إثبات الملكية عبر سجل DNS' : 'Domain DNS Verification'}
            </h3>
            <p className="text-xs text-fg-muted">
              {isAr
                ? 'أضف سجل TXT التالي إلى مزود النطاق الخاص بمؤسستك للتحقق الفوري المؤتمت:'
                : 'Add the following TXT record to your DNS configuration:'}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-fg mb-1.5">
              {isAr ? 'اسم النطاق' : 'Domain Name'}
            </label>
            <Input
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="example.org"
            />
          </div>

          <div className="p-4 rounded-xl bg-canvas-subtle border border-border space-y-2">
            <span className="text-xs text-fg-subtle block">
              {isAr ? 'قيمة سجل TXT المطلوب:' : 'TXT Record Value:'}
            </span>
            <div className="flex items-center justify-between bg-canvas p-2.5 rounded-lg border border-border font-mono text-xs text-fg" dir="ltr">
              <span>{txtRecordValue}</span>
              <CopyButton textToCopy={txtRecordValue} />
            </div>
          </div>

          {verifiedSuccess && (
            <Alert variant="success">
              {isAr ? 'تم التحقق من سجل DNS بنجاح وتحديث حالة النطاق.' : 'DNS verified successfully.'}
            </Alert>
          )}

          <div className="flex justify-end">
            <Button
              variant="primary"
              loading={verifying}
              onClick={handleVerifyDns}
              className="gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isAr ? 'فحص ومطابقة سجل DNS الآن' : 'Verify DNS Now'}</span>
            </Button>
          </div>
        </Card>
      )}

      {/* Tab 2: Document */}
      {activeMethod === 'doc' && (
        <Card className="p-6 md:p-8 space-y-6">
          <div>
            <h3 className="font-bold text-fg text-base mb-1">
              {isAr ? 'إرفاق ترخيص الجمعية أو المركز القرآني' : 'Institutional Credentials Upload'}
            </h3>
            <p className="text-xs text-fg-muted">
              {isAr
                ? 'للجمعيات الخيرية والمراكز القرآنية: يمكنك رفع نسخة رسمية من ترخيص العمل لإجازتها يدوياً من إدارة المنصة.'
                : 'Upload official non-profit accreditation or governmental registry documents.'}
            </p>
          </div>

          <div className="border-2 border-dashed border-border hover:border-ratq-400 rounded-2xl p-8 text-center space-y-3 cursor-pointer transition-colors">
            <Upload className="w-8 h-8 text-fg-subtle mx-auto" />
            <div className="text-sm font-semibold text-fg">
              {isAr ? 'اسحب ملف الترخيص هنا أو اضغط للاختيار' : 'Drag file here or click to browse'}
            </div>
            <div className="text-xs text-fg-subtle">
              PDF, PNG, JPG (حجم أقصى 10 ميجابايت)
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="primary" onClick={() => alert(isAr ? 'تم استلام الملف للمراجعة اليدوية' : 'File uploaded for manual review')}>
              {isAr ? 'تقديم للتدقيق' : 'Submit Document'}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default PublisherClaimPage;
