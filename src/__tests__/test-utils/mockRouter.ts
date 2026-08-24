import { vi } from 'vitest';
import type { useRouter } from 'next/navigation';

export function createMockRouter(
  overrides?: Partial<ReturnType<typeof useRouter>>
): ReturnType<typeof useRouter> {
  return {
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
    ...overrides,
  };
}
