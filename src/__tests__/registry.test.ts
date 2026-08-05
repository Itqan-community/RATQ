import { describe, it, expect, afterEach, vi } from 'vitest';

describe('resource source registry mock gating (issue #175)', () => {
  const ORIGINAL_ENV = process.env.NEXT_PUBLIC_INCLUDE_MOCK_SOURCE;

  afterEach(() => {
    process.env.NEXT_PUBLIC_INCLUDE_MOCK_SOURCE = ORIGINAL_ENV;
    vi.resetModules();
  });

  it('excludes the ratq-native mock source by default', async () => {
    delete process.env.NEXT_PUBLIC_INCLUDE_MOCK_SOURCE;
    vi.resetModules();
    const { SOURCES } = await import('@/modules/resources/infrastructure/repositories/registry');
    expect(SOURCES.map((s) => s.id)).not.toContain('ratq');
  });

  it('includes the ratq-native mock source when NEXT_PUBLIC_INCLUDE_MOCK_SOURCE=true', async () => {
    process.env.NEXT_PUBLIC_INCLUDE_MOCK_SOURCE = 'true';
    vi.resetModules();
    const { SOURCES } = await import('@/modules/resources/infrastructure/repositories/registry');
    expect(SOURCES.map((s) => s.id)).toContain('ratq');
  });
});
