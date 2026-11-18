import { describe, it, expect } from 'vitest';
import { LEGACY_KEYS, migrateStorageKeys } from '@/lib/storageKeys';

const fake = (seed: Record<string, string> = {}) => {
  const m = new Map(Object.entries(seed));
  return {
    getItem: (k: string) => (m.has(k) ? (m.get(k) as string) : null),
    setItem: (k: string, v: string) => void m.set(k, v),
    removeItem: (k: string) => void m.delete(k),
    dump: () => Object.fromEntries(m),
  };
};

describe('migrateStorageKeys', () => {
  it('moves an old-only value to the new key and deletes the old one', () => {
    const s = fake({ ratq_theme: 'dark', ratq_locale: 'en' });
    migrateStorageKeys(s);
    expect(s.dump()).toEqual({ qtd_theme: 'dark', qtd_locale: 'en' });
  });

  it('keeps the new value and still deletes the old key when both exist', () => {
    const s = fake({ ratq_theme: 'dark', qtd_theme: 'light' });
    migrateStorageKeys(s);
    expect(s.dump()).toEqual({ qtd_theme: 'light' });
  });

  it('leaves a new-only value alone and does nothing on empty storage', () => {
    const s = fake({ qtd_font: 'suisse' });
    migrateStorageKeys(s);
    expect(s.dump()).toEqual({ qtd_font: 'suisse' });
    const e = fake();
    migrateStorageKeys(e);
    expect(e.dump()).toEqual({});
  });

  it('migrates the misspelled catalog key and the one-time flags', () => {
    const s = fake({
      retq_catalog_compact_mode: 'true',
      ratq_theme_preset_gold_v1: 'true',
      ratq_theme_customizer_first_visit_v1: 'true',
    });
    migrateStorageKeys(s);
    expect(s.dump()).toEqual({
      qtd_catalog_compact_mode: 'true',
      qtd_theme_preset_gold_v1: 'true',
      qtd_theme_customizer_first_visit_v1: 'true',
    });
  });

  it('is idempotent and leaves unrelated keys', () => {
    const s = fake({ ratq_palette: 'navy', other: 'x' });
    migrateStorageKeys(s);
    migrateStorageKeys(s);
    expect(s.dump()).toEqual({ qtd_palette: 'navy', other: 'x' });
  });

  it('covers every key the app used before', () => {
    expect(Object.keys(LEGACY_KEYS).sort()).toEqual(
      [
        'ratq_font', 'ratq_hero_layout', 'ratq_ligatures', 'ratq_locale', 'ratq_numeral',
        'ratq_palette', 'ratq_radius', 'ratq_theme', 'ratq_theme_customizer_first_visit_v1',
        'ratq_theme_preset_gold_v1', 'retq_catalog_compact_mode',
      ].sort(),
    );
  });

  it('does not throw when storage throws', () => {
    const bad = { getItem: () => { throw new Error('denied'); }, setItem: () => {}, removeItem: () => {} };
    expect(() => migrateStorageKeys(bad)).not.toThrow();
  });
});

describe('stores read migrated values at startup', () => {
  it('useThemeStore keeps a saved dark theme and palette from the old keys', async () => {
    const { vi } = await import('vitest');
    localStorage.clear();
    localStorage.setItem('ratq_theme', 'dark');
    localStorage.setItem('ratq_palette', 'navy');
    localStorage.setItem('ratq_theme_preset_gold_v1', 'true');
    vi.resetModules();
    const { useThemeStore } = await import('@/store/useThemeStore');
    expect(useThemeStore.getState().theme).toBe('dark');
    expect(useThemeStore.getState().palette).toBe('navy');
    expect(localStorage.getItem('ratq_theme')).toBeNull();
    expect(localStorage.getItem('qtd_palette')).toBe('navy');
  });
});
