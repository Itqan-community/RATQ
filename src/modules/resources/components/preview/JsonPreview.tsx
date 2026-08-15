'use client';

interface JsonPreviewProps {
  data: {
    json_content?: string;
  };
}

const TOKEN_PATTERN =
  /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g;

function classifyToken(match: string): string {
  if (/^"/.test(match)) {
    return /:$/.test(match)
      ? 'text-[var(--accent-primary)] font-semibold'
      : 'text-[var(--success)]';
  }
  if (/true|false/.test(match)) return 'text-[var(--error)]';
  if (/null/.test(match)) return 'text-[var(--text-muted)]';
  return 'text-[var(--text-primary)]';
}

// Splits a formatted JSON line into plain-text and token segments and
// renders each as its own text node/span - never as raw HTML, so JSON
// string values (which may come from user/publisher input) can't be
// interpreted as markup no matter what characters they contain.
function highlightLine(line: string, key: number): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let partIndex = 0;

  for (const match of line.matchAll(TOKEN_PATTERN)) {
    const [token] = match;
    const start = match.index ?? 0;
    if (start > lastIndex) {
      parts.push(line.slice(lastIndex, start));
    }
    parts.push(
      <span key={partIndex++} className={classifyToken(token)}>
        {token}
      </span>
    );
    lastIndex = start + token.length;
  }
  if (lastIndex < line.length) {
    parts.push(line.slice(lastIndex));
  }

  return <div key={key}>{parts}</div>;
}

function SyntaxHighlight({ json }: { json: string }): React.ReactNode {
  let lines: string[] | null = null;
  try {
    const parsed = JSON.parse(json);
    lines = JSON.stringify(parsed, null, 2).split('\n');
  } catch {
    lines = null;
  }

  if (lines === null) {
    return (
      <pre className="text-xs font-mono text-[var(--text-muted)] overflow-x-auto">
        {json}
      </pre>
    );
  }

  return (
    <pre className="text-xs font-mono overflow-x-auto">
      {lines.map((line, i) => highlightLine(line, i))}
    </pre>
  );
}

export function JsonPreview({ data }: JsonPreviewProps) {
  const { json_content } = data;

  if (!json_content) return null;

  return (
    <div>
      <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
        Formatted JSON
      </h4>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-md p-4 max-h-96 overflow-auto">
        <SyntaxHighlight json={json_content} />
      </div>
    </div>
  );
}
