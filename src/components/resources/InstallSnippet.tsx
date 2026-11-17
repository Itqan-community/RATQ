// src/components/resources/InstallSnippet.tsx
import React, { useState } from 'react';
import { CopyButton } from '@/components/ui/CopyButton';
import { Terminal } from 'lucide-react';
import { clsx } from 'clsx';

interface InstallSnippetProps {
  instructions?: Record<string, string>;
}

export const InstallSnippet: React.FC<InstallSnippetProps> = ({ instructions }) => {
  if (!instructions || Object.keys(instructions).length === 0) return null;

  const platforms = Object.keys(instructions);
  const [activePlatform, setActivePlatform] = useState(platforms[0]);
  const activeCommand = instructions[activePlatform] || '';

  return (
    <div className="w-full rounded-xl border border-border bg-subtle overflow-hidden text-start my-4">
      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-border bg-muted/60 px-3 py-1.5">
        <div className="flex items-center gap-1 overflow-x-auto">
          <Terminal className="w-4 h-4 text-fg-subtle ms-1 me-2 shrink-0" />
          {platforms.map((plat) => (
            <button
              key={plat}
              onClick={() => setActivePlatform(plat)}
              className={clsx(
                'text-xs font-mono font-bold px-2.5 py-1 rounded transition-colors cursor-pointer',
                activePlatform === plat
                  ? 'bg-canvas text-fg shadow-2xs'
                  : 'text-fg-subtle hover:text-fg'
              )}
            >
              {plat}
            </button>
          ))}
        </div>

        <CopyButton text={activeCommand} size="sm" variant="ghost" />
      </div>

      {/* Code Display (LTR) */}
      <div className="p-4 overflow-x-auto" dir="ltr">
        <pre className="font-mono text-xs text-fg selection:bg-ratq-500 selection:text-white">
          <code>{activeCommand}</code>
        </pre>
      </div>
    </div>
  );
};
