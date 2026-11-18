// src/components/keys/KeyTable.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ApiKey } from '@/types';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { maskApiKey } from '@/lib/security';
import { formatDate } from '@/lib/format';
import { Key, RotateCw, Trash2, Clock, CheckCircle, AlertOctagon } from 'lucide-react';

interface KeyTableProps {
  keys: ApiKey[];
  onRotate: (keyId: string) => void;
  onRevoke: (keyId: string) => void;
}

export const KeyTable: React.FC<KeyTableProps> = ({ keys, onRotate, onRevoke }) => {
  const { t } = useTranslation('site');
  const [selectedKeyForRevoke, setSelectedKeyForRevoke] = useState<ApiKey | null>(null);

  if (keys.length === 0) {
    return (
      <div className="py-8 text-center text-xs text-fg-subtle">
        {t('key_table.empty')}
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-border bg-canvas text-start">
      <table className="w-full text-xs">
        <thead className="bg-subtle border-b border-border text-fg-subtle">
          <tr>
            <th className="py-3 px-4 font-bold">{t('key_table.col_name')}</th>
            <th className="py-3 px-4 font-bold">{t('key_table.col_resource')}</th>
            <th className="py-3 px-4 font-bold">{t('key_table.col_prefix')}</th>
            <th className="py-3 px-4 font-bold">{t('key_table.col_status')}</th>
            <th className="py-3 px-4 font-bold">{t('key_table.col_expires')}</th>
            <th className="py-3 px-4 font-bold">{t('key_table.col_usage')}</th>
            <th className="py-3 px-4 font-bold text-end">{t('key_table.col_actions')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle">
          {keys.map((k) => (
            <tr key={k.id} className="hover:bg-subtle/50 transition-colors">
              <td className="py-3 px-4 font-bold text-fg flex items-center gap-2">
                <Key className="w-3.5 h-3.5 text-qtd-600" />
                <span>{k.name_ar}</span>
              </td>
              <td className="py-3 px-4 text-fg-muted font-medium">
                {k.resource_title_ar || t('key_table.restricted_resource')}
              </td>
              <td className="py-3 px-4 font-mono text-2xs text-fg-subtle" dir="ltr">
                {maskApiKey(k.key_prefix)}
              </td>
              <td className="py-3 px-4">
                {k.status === 'active' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200">
                    <CheckCircle className="w-3 h-3" /> {t('key_table.active')}
                  </span>
                )}
                {k.status === 'rotating' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded border border-amber-200">
                    <Clock className="w-3 h-3" /> {t('key_table.rotating')}
                  </span>
                )}
                {k.status === 'revoked' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-red-700 bg-red-50 dark:bg-red-950 px-2 py-0.5 rounded border border-red-200">
                    <AlertOctagon className="w-3 h-3" /> {t('key_table.revoked')}
                  </span>
                )}
              </td>
              <td className="py-3 px-4 text-fg-subtle">
                {formatDate(k.expires_at)}
              </td>
              <td className="py-3 px-4 font-mono text-fg-muted">
                {t('key_table.requests', { n: k.usage_count.toLocaleString() })}
                {k.last_used_at && (
                  <div className="font-sans text-2xs text-fg-subtle">{t('key_table.last_used', { date: formatDate(k.last_used_at) })}</div>
                )}
              </td>
              <td className="py-3 px-4 text-end">
                {k.status === 'active' && (
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRotate(k.id)}
                      title={t('key_table.rotate_title')}
                      startIcon={<RotateCw className="w-3 h-3 text-fg-muted" />}
                    >
                      {t('key_table.rotate')}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedKeyForRevoke(k)}
                      title={t('key_table.revoke_title')}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      startIcon={<Trash2 className="w-3 h-3 text-red-600" />}
                    >
                      {t('key_table.revoke')}
                    </Button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedKeyForRevoke && (
        <ConfirmDialog
          isOpen={Boolean(selectedKeyForRevoke)}
          onClose={() => setSelectedKeyForRevoke(null)}
          onConfirm={() => {
            onRevoke(selectedKeyForRevoke.id);
            setSelectedKeyForRevoke(null);
          }}
          title={t('key_table.confirm_title')}
          description={t('key_table.confirm_body', { name: selectedKeyForRevoke.name_ar })}
          confirmLabel={t('key_table.confirm_yes')}
          isDestructive
        />
      )}
    </div>
  );
};
