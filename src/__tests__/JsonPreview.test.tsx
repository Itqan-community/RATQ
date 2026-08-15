import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { JsonPreview } from '@/modules/resources/components/preview/JsonPreview';

describe('JsonPreview', () => {
  it('renders nothing when there is no json_content', () => {
    const { container } = render(<JsonPreview data={{}} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders formatted, syntax-highlighted JSON', () => {
    render(<JsonPreview data={{ json_content: '{"name":"tafsir","count":3,"active":true,"note":null}' }} />);
    expect(screen.getByText(/"name":/)).toBeInTheDocument();
    expect(screen.getByText('"tafsir"')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('falls back to a plain <pre> block for invalid JSON', () => {
    render(<JsonPreview data={{ json_content: 'not valid json' }} />);
    expect(screen.getByText('not valid json')).toBeInTheDocument();
  });

  // Regression test: json_content is publisher-supplied and was previously
  // injected via dangerouslySetInnerHTML with unescaped string values,
  // allowing stored XSS (e.g. a string value containing an <img onerror>
  // tag would execute for every visitor viewing the resource preview).
  it('never renders HTML markup embedded in a JSON string value', () => {
    const payload = '<img src=x onerror=alert(1)>';
    const { container } = render(
      <JsonPreview data={{ json_content: JSON.stringify({ x: payload }) }} />
    );

    // The payload must appear as literal, visible text...
    expect(container.textContent).toContain(payload);
    // ...and must never be parsed into a real <img> element.
    expect(container.querySelector('img')).toBeNull();
  });
});
