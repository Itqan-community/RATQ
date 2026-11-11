import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { MOCK_ROUTES } from '@/lib/mockRoutes';

// Every Demo route must be owned by a story in docs/notion-stories.md (the source for the Notion board).
const stories = readFileSync('docs/notion-stories.md', 'utf8');

describe('notion stories', () => {
  it.each(MOCK_ROUTES)('notionStories_MockRoute_HasStory (%s)', (route) => {
    expect(stories).toContain(`\`${route}\``);
  });
});
