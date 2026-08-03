import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { CommentRow } from '@/components/developer/CommentRow';
import { LanguageProvider } from '@/i18n/LanguageContext';
import type { Comment } from '@/types/resource';

function createComment(overrides: Partial<Comment> = {}): Comment {
  return {
    id: 1,
    author_name: 'Test User',
    content: 'This is a test comment.',
    created_at: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}

function renderWithProvider(ui: React.ReactElement) {
  localStorage.setItem('ratq_locale', 'en');
  const result = render(<LanguageProvider>{ui}</LanguageProvider>);
  act(() => {});
  return result;
}

describe('CommentRow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders resource name', () => {
    renderWithProvider(<CommentRow comment={createComment()} resourceName="Test Resource" />);
    expect(screen.getByText('Test Resource')).toBeInTheDocument();
  });

  it('renders comment content', () => {
    renderWithProvider(<CommentRow comment={createComment()} resourceName="Test Resource" />);
    expect(screen.getByText('This is a test comment.')).toBeInTheDocument();
  });

  it('renders creation date', () => {
    renderWithProvider(<CommentRow comment={createComment()} resourceName="Test Resource" />);
    expect(screen.getByText(/2024/)).toBeInTheDocument();
  });

  it('renders comment with special characters and HTML entities', () => {
    renderWithProvider(
      <CommentRow comment={createComment({ content: 'Comment with <special> & "characters" — and émojis 🎉' })} resourceName="Test Resource" />
    );
    expect(screen.getByText(/Comment with/)).toBeInTheDocument();
  });
});
