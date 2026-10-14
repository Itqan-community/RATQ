import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import { CommentSection } from '@/modules/resources/components/CommentSection';
import { LanguageProvider } from '@/shared/ui/i18n/LanguageContext';
import { ToastProvider } from '@/shared/ui/Toast';
import { postComment } from '@/modules/resources/application/use-cases/post-comment';
import { deleteComment } from '@/modules/resources/infrastructure/comments-api';
import { useComments } from '@/hooks/useResources';
import { useAuth } from '@/hooks/useAuth';
import type { Comment } from '@/types/resource';

vi.mock('@/hooks/useResources', () => ({
  useComments: vi.fn(),
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/modules/resources/application/use-cases/post-comment', () => ({
  postComment: vi.fn(),
}));

vi.mock('@/modules/resources/infrastructure/comments-api', () => ({
  deleteComment: vi.fn(),
}));

const mockedUseComments = vi.mocked(useComments);
const mockedUseAuth = vi.mocked(useAuth);
const mockedPostComment = vi.mocked(postComment);
const mockedDeleteComment = vi.mocked(deleteComment);

function comment(overrides: Partial<Comment> = {}): Comment {
  return {
    id: 1,
    author_name: 'Ava',
    author_id: 7,
    content: 'Great resource.',
    created_at: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}

function setup(comments: Comment[], userId: number | null = 7) {
  const mutate = vi.fn();
  mockedUseComments.mockReturnValue({ data: comments, isLoading: false, mutate } as never);
  mockedUseAuth.mockReturnValue({
    user: userId === null ? null : { id: userId, email: 'a@x.com', display_name: 'Ava', role: 'developer', created_at: '' },
  } as never);
  localStorage.setItem('ratq_locale', 'en');
  render(
    <LanguageProvider>
      <ToastProvider>
        <CommentSection resourceId={200001} resourceSlug="r" />
      </ToastProvider>
    </LanguageProvider>
  );
  act(() => {});
  return { mutate };
}

describe('CommentSection comment failures (RATQ#347)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows a toast and keeps the text when posting fails', async () => {
    mockedPostComment.mockRejectedValueOnce(new Error('500'));
    setup([]);
    fireEvent.change(screen.getByPlaceholderText('Leave a comment...'), {
      target: { value: 'hello' },
    });
    fireEvent.click(screen.getByText('Post'));
    await waitFor(() =>
      expect(screen.getByText('Failed to post comment.')).toBeInTheDocument()
    );
    expect(
      (screen.getByPlaceholderText('Leave a comment...') as HTMLTextAreaElement).value
    ).toBe('hello');
  });

  it('limits the textarea to 2000 characters with a counter and a label', () => {
    setup([]);
    const box = screen.getByPlaceholderText('Leave a comment...') as HTMLTextAreaElement;
    expect(box.maxLength).toBe(2000);
    expect(screen.getByText('0/2000')).toBeInTheDocument();
    expect(screen.getByLabelText('Your comment')).toBe(box);
    fireEvent.change(box, { target: { value: 'ab' } });
    expect(screen.getByText('2/2000')).toBeInTheDocument();
  });

  it('shows Delete on your own comment and deletes after confirm', async () => {
    const { mutate } = setup([comment()]);
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    mockedDeleteComment.mockResolvedValueOnce(undefined);
    fireEvent.click(screen.getByText('Delete'));
    expect(confirmSpy).toHaveBeenCalledWith('Delete this comment?');
    await waitFor(() => expect(mockedDeleteComment).toHaveBeenCalledWith(1));
    expect(screen.getByText('Comment deleted.')).toBeInTheDocument();
    expect(mutate).toHaveBeenCalled();
    confirmSpy.mockRestore();
  });

  it('does not delete when the confirm is dismissed', async () => {
    setup([comment()]);
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    fireEvent.click(screen.getByText('Delete'));
    await waitFor(() => expect(window.confirm).toHaveBeenCalled());
    expect(mockedDeleteComment).not.toHaveBeenCalled();
    (window.confirm as unknown as ReturnType<typeof vi.spyOn>).mockRestore();
  });

  it('shows no Delete on someone else’s comment', () => {
    setup([comment({ id: 2, author_id: 9, author_name: 'Noor' })]);
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });

  it('shows a toast when deleting fails', async () => {
    setup([comment()]);
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    mockedDeleteComment.mockRejectedValueOnce(new Error('500'));
    fireEvent.click(screen.getByText('Delete'));
    await waitFor(() =>
      expect(screen.getByText('Failed to delete comment.')).toBeInTheDocument()
    );
    (window.confirm as unknown as ReturnType<typeof vi.spyOn>).mockRestore();
  });
});
