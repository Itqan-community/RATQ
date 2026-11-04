// src/components/ui/CodeBlock.tsx
import React from 'react';
import { CopyButton } from './CopyButton';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language, filename }) => {
  return (
    <div className="w-full rounded-xl border border-border bg-subtle overflow-hidden text-start my-3">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted text-xs font-mono">
        <span className="text-fg-muted font-medium">{filename || language || 'code'}</span>
        <CopyButton text={code} size="sm" variant="ghost" />
      </div>
      <div className="p-4 overflow-x-auto" dir="ltr">
        <pre className="font-mono text-xs text-fg leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};
