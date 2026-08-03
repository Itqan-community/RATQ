'use client';

interface JsonPreviewProps {
  data: {
    json_content?: string;
  };
}

function SyntaxHighlight({ json }: { json: string }): React.ReactNode {
  try {
    const parsed = JSON.parse(json);
    const formatted = JSON.stringify(parsed, null, 2);
    const lines = formatted.split('\n');

    return (
      <pre className="text-xs font-mono overflow-x-auto">
        {lines.map((line, i) => {
          const highlighted = line.replace(
            /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
            (match) => {
              let cls = 'text-[var(--text-primary)]';
              if (/^"/.test(match)) {
                cls = /:$/.test(match)
                  ? 'text-[var(--accent-primary)] font-semibold'
                  : 'text-[var(--success)]';
              } else if (/true|false/.test(match)) {
                cls = 'text-[var(--error)]';
              } else if (/null/.test(match)) {
                cls = 'text-[var(--text-muted)]';
              }
              return `<span class="${cls}">${match}</span>`;
            }
          );
          return (
            <div key={i} dangerouslySetInnerHTML={{ __html: highlighted }} />
          );
        })}
      </pre>
    );
  } catch {
    return (
      <pre className="text-xs font-mono text-[var(--text-muted)] overflow-x-auto">
        {json}
      </pre>
    );
  }
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
