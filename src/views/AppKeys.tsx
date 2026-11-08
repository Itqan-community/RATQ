// src/views/AppKeys.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { DEMO_API_KEYS, DEMO_RESOURCES } from '@/lib/mockData';
import { ApiKey } from '@/types';
import { mockRepo } from '@/lib/supabase';
import { isLive } from '@/lib/payloadAuth';
import { createKey, hydrateKeys, revokeKey, rotateKey } from '@/lib/payloadKeys';
import { KeyTable } from '@/components/keys/KeyTable';
import { ApiKeyRevealDialog } from '@/components/keys/ApiKeyRevealDialog';
import { Plus, ShieldCheck, Lock } from 'lucide-react';

export const AppKeysPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const live = isLive();
  // Live: only real Payload keys/resources (the server already scopes keys to the signed-in owner).
  const resources = live ? mockRepo.getResources().filter((r) => r.id.startsWith('payload_')) : DEMO_RESOURCES;
  const [keys, setKeys] = useState<ApiKey[]>(() =>
    live ? mockRepo.getKeys().filter((k) => k.id.startsWith('payload_key_')) : DEMO_API_KEYS
  );
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [selectedResourceId, setSelectedResourceId] = useState((live ? resources[0] : DEMO_RESOURCES[2])?.id ?? '');
  const [revealedKey, setRevealedKey] = useState<string | null>(null);
  const [keyError, setKeyError] = useState<string | null>(null);

  const reloadLiveKeys = async () => {
    await hydrateKeys();
    setKeys(mockRepo.getKeys().filter((k) => k.id.startsWith('payload_key_')));
  };

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    if (live) {
      const { key, error } = await createKey(selectedResourceId, newKeyName.trim());
      if (!key) {
        setKeyError(error);
        return;
      }
      setKeyError(null);
      setIsCreateOpen(false);
      setNewKeyName('');
      setRevealedKey(key); // shown once; the server keeps only a hash
      await reloadLiveKeys();
      return;
    }

    const rawKey = `rtk_live_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;
    const prefix = rawKey.substring(9, 17);

    const resource = DEMO_RESOURCES.find((r) => r.id === selectedResourceId);

    const newKeyItem: ApiKey = {
      id: `key_${Date.now()}`,
      resource_id: selectedResourceId,
      owner_profile_id: 'user_dev_001',
      name_ar: newKeyName,
      key_prefix: prefix,
      scopes: ['resources:read', 'api:call'],
      rate_limit_per_hour: 1000,
      rate_limit_per_day: 10000,
      status: 'active',
      expires_at: new Date(Date.now() + 180 * 86400000).toISOString(),
      usage_count: 0,
      created_at: new Date().toISOString(),
      resource_title_ar: resource?.title_ar || 'مورد قرآني',
    };

    setKeys((prev) => [newKeyItem, ...prev]);
    setIsCreateOpen(false);
    setNewKeyName('');
    setRevealedKey(rawKey);
  };

  const handleRotate = async (keyId: string) => {
    if (live && keyId.startsWith('payload_key_')) {
      const old = keys.find((k) => k.id === keyId);
      if (!old) return;
      const { key, error } = await rotateKey(keyId, old.resource_id, old.name_ar);
      setKeyError(error);
      if (key) setRevealedKey(key);
      await reloadLiveKeys();
      return;
    }
    const rawKey = `rtk_live_rot_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;
    const prefix = rawKey.substring(13, 21);

    setKeys((prev) =>
      prev.map((k) =>
        k.id === keyId
          ? {
              ...k,
              key_prefix: prefix,
              status: 'active',
              updated_at: new Date().toISOString(),
            }
          : k
      )
    );
    setRevealedKey(rawKey);
  };

  const handleRevoke = async (keyId: string) => {
    if (live && keyId.startsWith('payload_key_')) {
      setKeyError(await revokeKey(keyId));
      await reloadLiveKeys();
      return;
    }
    setKeys((prev) =>
      prev.map((k) =>
        k.id === keyId ? { ...k, status: 'revoked', revoked_at: new Date().toISOString() } : k
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-fg tracking-tight">
            {isAr ? 'مفاتيح API والتصاريح البرمجية' : 'API Credentials & Keys'}
          </h1>
          <p className="text-fg-muted text-sm mt-1">
            {isAr
              ? 'إدارة مفاتيح الاستدعاء المشفرة واستبدالها وإبطالها وفق ميثاق الحماية المشدد.'
              : 'Generate, rotate, and revoke hashed credentials for protected resources.'}
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setIsCreateOpen(true)} className="gap-2 shrink-0">
          <Plus className="w-4 h-4 shrink-0" />
          <span>{isAr ? 'إنشاء مفتاح جديد' : 'Generate New Key'}</span>
        </Button>
      </div>

      {/* Security Banner (ADR-004) */}
      <Card className="p-5 bg-deep-900 text-white border-deep-800">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-white/10 text-ratq-400 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-base">
                {isAr ? 'حماية معمارية المفاتيح (SHA-256)' : 'Zero Raw Key Storage Guarantee'}
              </h3>
              <Badge variant="primary" className="bg-ratq-500/30 text-ratq-300 border-ratq-500/40 text-[10px]">
                {isAr ? 'مشفّر' : 'Encrypted'}
              </Badge>
            </div>
            <p className="text-white/80 text-xs leading-relaxed">
              {isAr
                ? 'لا يتم تخزين المفاتيح الخام في قواعد البيانات إطلاقاً. تقتصر قاعدة البيانات على حفظ أول 8 خانات وبصمة SHA-256. لن تتمكن من رؤية المفتاح مرة أخرى بعد إغلاق نافذة العرض.'
                : 'Raw keys are never stored in plain text. Only an 8-character prefix and a SHA-256 hash exist in Postgres.'}
            </p>
          </div>
        </div>
      </Card>

      {/* Keys Table Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-fg">
            {isAr ? 'المفاتيح الحالية' : 'Active Keys'}
          </h2>
          <span className="text-xs text-fg-muted">
            {isAr ? `إجمالي المفاتيح: ${keys.length}` : `Total keys: ${keys.length}`}
          </span>
        </div>

        <KeyTable keys={keys} onRotate={handleRotate} onRevoke={handleRevoke} />
      </Card>

      {/* Create Key Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title={isAr ? 'إصدار مفتاح API جديد' : 'Generate API Key'}
      >
        <form onSubmit={handleCreateKey} className="space-y-4">
          <p className="text-xs text-fg-muted">
            {isAr
              ? 'اختر المورد وحدد اسماً وصفياً للمفتاح ليساعدك على تتبعه في تطبيقاتك.'
              : 'Choose the authorized resource and provide an identifier for this key.'}
          </p>

          <div>
            <label className="block text-xs font-semibold text-fg mb-1.5">
              {isAr ? 'اسم المفتاح (مثال: سيرفر الإنتاج، تطبيق الجوال)' : 'Key Label'}
            </label>
            <Input
              required
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder={isAr ? 'تطبيق ويب - خادم الإنتاج' : 'e.g. Web App Production'}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-fg mb-1.5">
              {isAr ? 'المورد المصرح به' : 'Target Resource'}
            </label>
            <Select
              value={selectedResourceId}
              onChange={(e) => setSelectedResourceId(e.target.value)}
              options={resources.map((r) => ({
                value: r.id,
                label: (isAr ? r.title_ar : r.title_en) || r.title_ar,
              }))}
            />
          </div>

          {!live && (
          <div className="p-3 rounded-lg bg-canvas-subtle border border-border text-2xs text-fg-muted flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-ratq-600 shrink-0 mt-0.5" />
            <span>
              {isAr
                ? 'الحصة الافتراضية: 1,000 استدعاء في الساعة / 10,000 استدعاء في اليوم.'
                : 'Default rate limit: 1,000 requests/hour and 10,000 requests/day.'}
            </span>
          </div>
          )}
          {keyError && <p role="alert" className="text-xs text-red-600">{keyError}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>
              {isAr ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button type="submit" variant="primary">
              {isAr ? 'توليد المفتاح' : 'Generate'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Reveal Dialog */}
      <ApiKeyRevealDialog
        isOpen={Boolean(revealedKey)}
        onClose={() => setRevealedKey(null)}
        rawKey={revealedKey || ''}
        keyPrefix="rtk_live"
      />
    </div>
  );
};

export default AppKeysPage;
