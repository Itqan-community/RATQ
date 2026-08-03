'use client';

import { useMemo, useState } from 'react';
import { useDeveloperAPIKeys } from '@/hooks/useDeveloperAPIKeys';
import { useDeveloperResources } from '@/hooks/useDeveloperResources';
import { ApiKeyCard } from '@/components/developer/ApiKeyCard';
import { api } from '@/lib/api-client';
import type { APIKey } from '@/types/resource';

export default function DeveloperAccessPage() {
  const { data: apiKeys, isLoading, mutate } = useDeveloperAPIKeys();
  // Create-form resource choices are the developer's *owned* resources,
  // since that's the only real-id list already fetched here. API keys
  // likely belong on resources with an *approved access request* instead -
  // upgrade to that list once such an endpoint/hook exists.
  const { data: resources } = useDeveloperResources();
  const [selectedResource, setSelectedResource] = useState<string>('all');
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyResourceId, setNewKeyResourceId] = useState<number | null>(null);
  const [newKeyScope, setNewKeyScope] = useState('read');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Filter options must match the slugs actually present on api-keys
  // (resource_slug from toApiKey), not the developer's owned-resource list -
  // a key can point at a resource the developer doesn't own (or vice versa).
  const filterOptions = useMemo(() => {
    const seen = new Map<string, string>();
    for (const k of apiKeys ?? []) seen.set(k.resource_slug, k.resource_name);
    return Array.from(seen, ([slug, name]) => ({ slug, name }));
  }, [apiKeys]);

  const createResourceOptions = useMemo(
    () => (resources ?? []).map((r) => ({ id: r.id, name: r.name })),
    [resources]
  );

  const handleRevoke = async (keyId: number) => {
    if (!confirm('هل أنت متأكد من إلغاء هذا المفتاح؟')) return;
    await api.developer.apiKeys.revoke(keyId);
    mutate();
  };

  const handleCreate = async () => {
    if (!newKeyResourceId) return;
    setCreating(true);
    setCreateError(null);
    try {
      const created = await api.developer.apiKeys.create(newKeyResourceId, newKeyScope, newKeyName);
      await mutate([created, ...(apiKeys ?? [])], { revalidate: false });
      setNewKeyName('');
    } catch {
      setCreateError('فشل إنشاء المفتاح.');
    } finally {
      setCreating(false);
    }
  };

  const filteredKeys = selectedResource === 'all'
    ? (apiKeys ?? [])
    : (apiKeys ?? []).filter((k: APIKey) => k.resource_slug === selectedResource);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="card p-4 animate-pulse">
            <div className="skeleton h-4 w-1/3 rounded mb-2" />
            <div className="skeleton h-3 w-2/3 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-xl font-bold text-[var(--text-primary)]">الوصول لدي</h2>
        <span className="text-sm text-[var(--text-muted)]">
          {(apiKeys ?? []).length} مفتاح API
        </span>
      </div>

      {/* Resource filter */}
      <select
        value={selectedResource}
        onChange={(e) => setSelectedResource(e.target.value)}
        className="input-field text-sm py-2 px-3 mb-6 w-64"
      >
        <option value="all">كل الموارد</option>
        {filterOptions.map((r) => (
          <option key={r.slug} value={r.slug}>{r.name}</option>
        ))}
      </select>

      {/* Create new key form */}
      <div className="card p-4 mb-6">
        <h3 className="font-heading font-semibold text-sm mb-3">إنشاء مفتاح جديد</h3>
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            placeholder="اسم المفتاح"
            className="input-field text-sm py-2 px-3 flex-grow"
          />
          <select
            value={newKeyResourceId ?? ''}
            onChange={(e) => setNewKeyResourceId(e.target.value ? Number(e.target.value) : null)}
            className="input-field text-sm py-2 px-3"
          >
            <option value="" disabled>اختر موردا</option>
            {createResourceOptions.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
          <select
            value={newKeyScope}
            onChange={(e) => setNewKeyScope(e.target.value)}
            className="input-field text-sm py-2 px-3"
          >
            <option value="read">قراءة فقط</option>
            <option value="read,write">قراءة وكتابة</option>
          </select>
          <button
            onClick={handleCreate}
            disabled={creating || !newKeyResourceId}
            className="btn-primary text-sm py-2 px-4 disabled:opacity-50"
          >
            {creating ? 'جارٍ الإنشاء...' : 'إنشاء'}
          </button>
        </div>
        {createError && <p className="mt-2 text-xs text-red-600">{createError}</p>}
      </div>

      {/* API Keys list */}
      {filteredKeys.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-[var(--text-muted)]">لا توجد مفاتيح API</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredKeys.map((key: APIKey) => (
            <ApiKeyCard key={key.id} apiKey={key} onRevoke={handleRevoke} />
          ))}
        </div>
      )}
    </div>
  );
}
