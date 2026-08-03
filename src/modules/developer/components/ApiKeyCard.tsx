'use client';

import { useEffect, useRef, useState } from 'react';
import type { APIKey } from '@/types/resource';

interface ApiKeyCardProps {
  apiKey: APIKey;
  onRevoke?: (id: number) => void;
}

export function ApiKeyCard({ apiKey, onRevoke }: ApiKeyCardProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const maskKey = (k: string) => {
    if (k.length <= 10) return '••••••••';
    return k.substring(0, 10) + '••••••••';
  };

  const handleCopy = async () => {
    if (!apiKey.key) return;
    try {
      await navigator.clipboard.writeText(apiKey.key);
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard write failed - do not set copied=true
    }
  };

  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-heading font-semibold text-sm">{apiKey.name}</span>
            <span className="badge bg-blue-100 text-blue-800 text-xs">{apiKey.scope}</span>
          </div>
          <code className="text-xs bg-[var(--bg-secondary)] px-2 py-1 rounded block break-all font-mono">
            {apiKey.key ? maskKey(apiKey.key) : `${apiKey.key_prefix ?? ''}••••••••`}
          </code>
          <div className="flex items-center gap-3 mt-2 text-xs text-[var(--text-muted)]">
            <span>
              {new Date(apiKey.created_at).toLocaleDateString('ar', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
            {apiKey.last_used_at && (
              <span>آخر استخدام: {new Date(apiKey.last_used_at).toLocaleDateString('ar', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}</span>
            )}
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          {apiKey.key && (
            <button
              type="button"
              onClick={handleCopy}
              className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                copied
                  ? 'bg-green-100 text-green-700'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {copied ? 'تم النسخ' : 'نسخ'}
            </button>
          )}
          {onRevoke && (
            <button
              type="button"
              onClick={() => onRevoke(apiKey.id)}
              className="text-xs px-3 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
            >
              إبطال
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
