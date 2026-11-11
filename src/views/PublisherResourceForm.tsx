// Live-mode create + edit form. Only fields Payload stores; the 7-step wizard (PublisherResourceNew) stays for mock mode.
// Create saves a DRAFT; publishing happens from the resource list (setResourceStatus).
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Alert } from '@/components/ui/Alert';
import { useAuthStore } from '@/store/useAuthStore';
import { hydrateFromPayload } from '@/lib/payloadResources';
import {
  PAYLOAD_TYPES,
  createResource,
  fetchResourceById,
  updateResource,
  uploadCoverImage,
  type WizardForm,
} from '@/lib/payloadOwnResources';

const EMPTY: WizardForm = {
  title_ar: '', summary_ar: '', readme_ar: '', resource_type: 'library',
  license_spdx: '', version: '1.0.0', repository_url: '', documentation_url: '', website_url: '',
};

export const PublisherResourceFormPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>(); // numeric Payload id; absent = create
  const myId = useAuthStore((s) => s.profile.id);

  const [form, setForm] = useState<WizardForm>(EMPTY);
  const [cover, setCover] = useState<File | null>(null);
  const [uploaded, setUploaded] = useState<{ file: File; id: number } | null>(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const set = (k: keyof WizardForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  useEffect(() => {
    // Wait for the session profile (direct visit / refresh): the loader checks ownership against it.
    if (!id || !myId.startsWith('payload_user_')) return;
    // Direct GET: independent of the list's 100-item cap. Form values come from the raw doc (see docToForm).
    void fetchResourceById(`payload_${id}`, myId).then(({ form: f, error: e }) => {
      if (f) {
        setForm(f);
        setError(null);
      } else setError(e);
      setLoading(false);
    });
  }, [id, myId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    let imageId = uploaded?.file === cover ? uploaded?.id : undefined; // retry reuses the upload, no orphan Media
    if (cover && imageId === undefined) {
      const up = await uploadCoverImage(cover, form.title_ar);
      if (up.error || up.id === null) {
        setSaving(false);
        setError(up.error);
        return;
      }
      imageId = up.id;
      setUploaded({ file: cover, id: up.id });
    }
    const err = id ? await updateResource(`payload_${id}`, form, imageId) : await createResource(form, imageId);
    if (err) {
      setSaving(false);
      setError(err);
      return;
    }
    await hydrateFromPayload(); // the public catalog is loaded once at boot: refresh it so edits show without a reload
    navigate('/publisher/resources');
  };

  if (loading) return <p className="text-sm text-fg-muted">{isAr ? 'جارٍ التحميل...' : 'Loading...'}</p>;

  return (
    <form onSubmit={submit} className="space-y-6 max-w-3xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-fg tracking-tight">
          {id ? (isAr ? 'تعديل المورد' : 'Edit Resource') : (isAr ? 'مورد جديد' : 'New Resource')}
        </h1>
        {!id && (
          <p className="text-fg-muted text-sm mt-1">
            {isAr ? 'يُحفظ كمسودة، وتنشره من قائمة الموارد.' : 'Saved as a draft. Publish it from the resources list.'}
          </p>
        )}
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      <Card className="p-6 space-y-4">
        <Input label={isAr ? 'الاسم' : 'Name'} required value={form.title_ar} onChange={set('title_ar')} />
        <Select
          label={isAr ? 'النوع' : 'Type'}
          value={form.resource_type}
          onChange={set('resource_type')}
          // A stored legacy type stays selectable so the dropdown never displays a value it won't send.
          options={[...new Set([form.resource_type, ...PAYLOAD_TYPES])].map((t) => ({ value: t, label: t }))}
        />
        <Input label={isAr ? 'نبذة قصيرة' : 'Short description'} required maxLength={160} value={form.summary_ar} onChange={set('summary_ar')} />
        <Textarea label={isAr ? 'الوصف الكامل' : 'Full description'} rows={6} value={form.readme_ar} onChange={set('readme_ar')} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label={isAr ? 'الترخيص (مثل MIT)' : 'License (e.g. MIT)'} required value={form.license_spdx} onChange={set('license_spdx')} dir="ltr" />
          <Input label={isAr ? 'الإصدار' : 'Version'} value={form.version} onChange={set('version')} dir="ltr" />
        </div>
        <Input label="GitHub" type="url" placeholder="https://github.com/..." value={form.repository_url} onChange={set('repository_url')} dir="ltr" />
        <Input label={isAr ? 'رابط التوثيق' : 'Documentation URL'} type="url" value={form.documentation_url} onChange={set('documentation_url')} dir="ltr" />
        <Input label={isAr ? 'الموقع الإلكتروني' : 'Website'} type="url" value={form.website_url} onChange={set('website_url')} dir="ltr" />
        <div>
          <label htmlFor="cover" className="block text-xs font-semibold text-fg mb-1.5">
            {id ? (isAr ? 'استبدال صورة الغلاف' : 'Replace cover image') : (isAr ? 'صورة الغلاف' : 'Cover image')}
          </label>
          <input
            id="cover"
            type="file"
            accept="image/png,image/jpeg,image/gif,image/webp"
            onChange={(e) => setCover(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-fg"
          />
          <p className="text-xs text-fg-subtle mt-1">PNG, JPEG, GIF, WebP</p>
        </div>
      </Card>

      <div className="flex justify-end gap-2">
        <Link to="/publisher/resources">
          <Button type="button" variant="ghost">{isAr ? 'إلغاء' : 'Cancel'}</Button>
        </Link>
        <Button type="submit" variant="primary" disabled={saving}>
          {saving ? (isAr ? 'جارٍ الحفظ...' : 'Saving...') : (isAr ? 'حفظ' : 'Save')}
        </Button>
      </div>
    </form>
  );
};

export default PublisherResourceFormPage;
