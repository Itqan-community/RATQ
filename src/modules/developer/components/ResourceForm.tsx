'use client';

import { useState } from 'react';
import { useTranslations } from '@/shared/ui/i18n';
import { Slug } from '@/modules/resources/domain/value-objects/slug';
import type { ResourceType } from '@/types/resource';
import { uploadMedia } from '@/modules/developer/infrastructure/resources-api';

interface ResourceFormProps {
  onSubmit: (data: {
    name: string;
    type: ResourceType;
    short_description: string;
    image?: number | null;
    description: string;
    license: string;
    github_url: string;
    documentation_url: string;
  }) => void;
  initial?: {
    name?: string;
    type?: ResourceType;
    short_description?: string;
    image_url?: string | null;
    description?: string;
    license?: string;
    github_url?: string;
    documentation_url?: string;
  };
  submitLabel?: string;
}

export function ResourceForm({ onSubmit, initial, submitLabel }: ResourceFormProps) {
  const t = useTranslations();
  const copy = t.dashboard.form;
  const [name, setName] = useState(initial?.name || '');
  const [type, setType] = useState<ResourceType>(initial?.type || 'library');
  const [shortDescription, setShortDescription] = useState(initial?.short_description || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [license, setLicense] = useState(initial?.license || '');
  const [github_url, setGithubUrl] = useState(initial?.github_url || '');
  const [documentation_url, setDocumentationUrl] = useState(initial?.documentation_url || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initial?.image_url || null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : initial?.image_url || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setImageError(null);
    let image: number | null | undefined = undefined;
    if (imageFile) {
      setUploadingImage(true);
      try {
        const uploaded = await uploadMedia(imageFile);
        image = uploaded.id;
      } catch (err) {
        setUploadingImage(false);
        setImageError(err instanceof Error ? err.message : 'Failed to upload image');
        return;
      }
      setUploadingImage(false);
    }
    onSubmit({ name, type, short_description: shortDescription, image, description, license, github_url, documentation_url });
  };

  const resourceTypes: { value: ResourceType; label: string }[] = [
    { value: 'library', label: t.catalog.types.library },
    { value: 'sdk', label: t.catalog.types.sdk },
    { value: 'dataset', label: t.catalog.types.dataset },
    { value: 'api', label: t.catalog.types.api },
    { value: 'tafsir', label: t.catalog.types.tafsir },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-start">
      <div>
        <label className="mb-1 block text-sm font-heading text-[var(--text-secondary)]">{copy.name} *</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" required placeholder={copy.resourceNamePlaceholder} />
        {/* Preview only - the backend computes the authoritative slug on save (payload-backend/src/collections/Resources.ts), this just mirrors that Unicode-aware algorithm so the developer isn't surprised by it (issue #170). */}
        {name.trim() && <p className="mt-1 text-xs text-[var(--text-muted)]" dir="ltr">/{Slug.fromName(name).toString()}</p>}
      </div>
      <div>
        <label className="mb-1 block text-sm font-heading text-[var(--text-secondary)]">{copy.type} *</label>
        <select value={type} onChange={(e) => setType(e.target.value as ResourceType)} className="input-field">
          {resourceTypes.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-heading text-[var(--text-secondary)]">{copy.shortDescription} *</label>
        <input type="text" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} className="input-field" required placeholder={copy.shortDescriptionPlaceholder} maxLength={160} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-heading text-[var(--text-secondary)]">{copy.fullDescription} *</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="input-field min-h-[100px] resize-y" required placeholder={copy.fullDescriptionPlaceholder} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-heading text-[var(--text-secondary)]">Image</label>
        {imagePreview && (
          <img src={imagePreview} alt="" className="mb-2 h-32 w-full rounded-lg object-cover" />
        )}
        <input type="file" accept="image/*" onChange={handleImageChange} className="input-field" />
        {imageError && <p className="mt-1 text-xs text-red-600">{imageError}</p>}
      </div>
      <div>
        <label className="mb-1 block text-sm font-heading text-[var(--text-secondary)]">{copy.license}</label>
        <input type="text" value={license} onChange={(e) => setLicense(e.target.value)} className="input-field" required placeholder={copy.licensePlaceholder} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-heading text-[var(--text-secondary)]">{copy.githubUrl}</label>
        <input type="url" value={github_url} onChange={(e) => setGithubUrl(e.target.value)} className="input-field" placeholder={copy.githubPlaceholder} dir="ltr" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-heading text-[var(--text-secondary)]">{copy.documentationUrl}</label>
        <input type="url" value={documentation_url} onChange={(e) => setDocumentationUrl(e.target.value)} className="input-field" placeholder={copy.docsPlaceholder} dir="ltr" />
      </div>
      <button type="submit" disabled={uploadingImage} className="btn-primary w-full disabled:opacity-60">{uploadingImage ? 'Uploading image...' : (submitLabel || t.dashboard.resources.saveResource)}</button>
    </form>
  );
}