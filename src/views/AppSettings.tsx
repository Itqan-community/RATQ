// src/views/AppSettings.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Alert } from '@/components/ui/Alert';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useAuthStore } from '@/store/useAuthStore';
import { isLive } from '@/lib/payloadAuth';
import { User, Globe, Shield, Download, Trash2, CheckCircle2 } from 'lucide-react';

export const AppSettingsPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const { profile, currentRole } = useAuthStore();

  const [displayName, setDisplayName] = useState(profile.display_name);
  const [bio, setBio] = useState(profile.bio || '');
  const [skills, setSkills] = useState(profile.skills.join(', '));
  const [numeralSystem, setNumeralSystem] = useState(profile.numeral_system);
  const [timezone, setTimezone] = useState(profile.timezone);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(profile, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ratq-profile-export-${profile.handle}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Live mode mirrors live RATQ: account info is read-only. Editing, data export and account deletion have no
  // Payload-backed flow yet, so they are hidden rather than pretending to succeed.
  if (isLive()) {
    return (
      <div className="space-y-8 max-w-4xl">
        <h1 className="text-2xl font-extrabold text-fg tracking-tight">
          {isAr ? 'إعدادات الحساب' : 'Account Settings'}
        </h1>
        <Card className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-fg mb-1.5">{isAr ? 'الاسم الظاهر' : 'Display Name'}</label>
            <Input value={profile.display_name} readOnly />
          </div>
          <div>
            <label className="block text-xs font-semibold text-fg mb-1.5">{isAr ? 'الدور' : 'Role'}</label>
            <Input value={currentRole} readOnly className="capitalize" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-fg tracking-tight">
          {isAr ? 'إعدادات الحساب والتفضيلات' : 'Account Settings & Preferences'}
        </h1>
        <p className="text-fg-muted text-sm mt-1">
          {isAr
            ? 'تحديث بيانات ملفك الشخصي، تفضيلات التدويل والأرقام، وإدارة خصوصية البيانات.'
            : 'Manage profile details, regional formatting preferences, and privacy controls.'}
        </p>
      </div>

      {savedSuccess && (
        <Alert variant="success" className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{isAr ? 'تم حفظ التعديلات بنجاح' : 'Settings saved successfully'}</span>
        </Alert>
      )}

      {/* Profile Form */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-fg mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-ratq-600" />
          <span>{isAr ? 'الملف الشخصي العام' : 'Public Profile'}</span>
        </h2>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-fg mb-1.5">
                {isAr ? 'الاسم الظاهر' : 'Display Name'}
              </label>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-fg mb-1.5">
                {isAr ? 'اسم المستخدم (المعرف)' : 'Username (Handle)'}
              </label>
              <Input value={profile.handle} disabled className="opacity-75" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-fg mb-1.5">
              {isAr ? 'نبذة تعريفية' : 'Biography'}
            </label>
            <Textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder={isAr ? 'اكتب نبذة مختصرة عن اهتماماتك التقنية...' : 'Brief description of your technical interests...'}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-fg mb-1.5">
              {isAr ? 'المهارات والتقنيات (مفصولة بفاصلة)' : 'Skills & Technologies (comma separated)'}
            </label>
            <Input
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="TypeScript, Python, NLP, PostgreSQL"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" variant="primary">
              {isAr ? 'حفظ التغييرات' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Regional & Internationalization */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-fg mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-ratq-600" />
          <span>{isAr ? 'التفضيلات الإقليمية والأرقام' : 'Localization & Formatting'}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-fg mb-1.5">
              {isAr ? 'نظام الأرقام المفضل' : 'Numeral System'}
            </label>
            <Select
              value={numeralSystem}
              onChange={(e) => setNumeralSystem(e.target.value as any)}
              options={[
                { value: 'western', label: isAr ? 'أرقام عربية غربية (1, 2, 3)' : 'Western Arabic (1, 2, 3)' },
                { value: 'eastern_arabic', label: isAr ? 'أرقام مشرقية (١, ٢, ٣)' : 'Eastern Arabic (١, ٢, ٣)' },
              ]}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-fg mb-1.5">
              {isAr ? 'المنطقة الزمنية' : 'Timezone'}
            </label>
            <Select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              options={[
                { value: 'Asia/Riyadh', label: 'Asia/Riyadh (UTC+3)' },
                { value: 'Africa/Cairo', label: 'Africa/Cairo (UTC+2)' },
                { value: 'Asia/Dubai', label: 'Asia/Dubai (UTC+4)' },
                { value: 'UTC', label: 'UTC (GMT)' },
              ]}
            />
          </div>
        </div>
      </Card>

      {/* GDPR & Privacy */}
      <Card className="p-6 border-red-200 dark:border-red-950/40">
        <h2 className="text-lg font-bold text-fg mb-2 flex items-center gap-2">
          <Shield className="w-5 h-5 text-red-600" />
          <span>{isAr ? 'الخصوصية وحماية البيانات (GDPR)' : 'Privacy & Data Rights'}</span>
        </h2>
        <p className="text-xs text-fg-muted mb-6">
          {isAr
            ? 'تلتزم رتق بالشفافية الكاملة وحق المستخدم في الوصول إلى بياناته وحذفها متى شاء.'
            : 'Export your entire profile metadata or request permanent deletion.'}
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleExportData} className="gap-2">
            <Download className="w-4 h-4" />
            <span>{isAr ? 'تصدير نسخة من بياناتي (JSON)' : 'Export My Data (JSON)'}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDeleteOpen(true)}
            className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isAr ? 'طلب حذف الحساب' : 'Delete Account'}</span>
          </Button>
        </div>
      </Card>

      {/* Confirm Deletion Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => {
          setIsDeleteOpen(false);
          alert(isAr ? 'تم استلام طلب حذف الحساب وسيتم تنفيذه خلال 14 يوماً.' : 'Deletion request submitted.');
        }}
        title={isAr ? 'تأكيد طلب حذف الحساب' : 'Confirm Account Deletion'}
        message={
          isAr
            ? 'هل أنت متأكد من رغبتك في حذف الحساب نهائياً؟ سيتم إلغاء جميع مفاتيح الـ API وتصاريح الاستخدام المرتبطة بحسابك.'
            : 'Are you sure you want to permanently delete your account? All active keys will be revoked.'
        }
        confirmText={isAr ? 'نعم، احذف الحساب' : 'Yes, Delete Account'}
        cancelText={isAr ? 'إلغاء' : 'Cancel'}
        variant="danger"
      />
    </div>
  );
};

export default AppSettingsPage;
