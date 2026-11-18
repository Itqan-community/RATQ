// localStorage keys. Renamed from the old RATQ prefix; old values are moved once at startup.
export const STORAGE_KEYS = {
  theme: 'qtd_theme',
  palette: 'qtd_palette',
  font: 'qtd_font',
  radius: 'qtd_radius',
  heroLayout: 'qtd_hero_layout',
  ligatures: 'qtd_ligatures',
  locale: 'qtd_locale',
  numeral: 'qtd_numeral',
  catalogCompact: 'qtd_catalog_compact_mode',
  themePresetGold: 'qtd_theme_preset_gold_v1',
  themeCustomizerFirstVisit: 'qtd_theme_customizer_first_visit_v1',
} as const;

// old key -> new key
export const LEGACY_KEYS: Record<string, string> = {
  ratq_theme: STORAGE_KEYS.theme,
  ratq_palette: STORAGE_KEYS.palette,
  ratq_font: STORAGE_KEYS.font,
  ratq_radius: STORAGE_KEYS.radius,
  ratq_hero_layout: STORAGE_KEYS.heroLayout,
  ratq_ligatures: STORAGE_KEYS.ligatures,
  ratq_locale: STORAGE_KEYS.locale,
  ratq_numeral: STORAGE_KEYS.numeral,
  retq_catalog_compact_mode: STORAGE_KEYS.catalogCompact,
  ratq_theme_preset_gold_v1: STORAGE_KEYS.themePresetGold,
  ratq_theme_customizer_first_visit_v1: STORAGE_KEYS.themeCustomizerFirstVisit,
};

type Store = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

// New key wins when both exist; the old key is always removed.
export const migrateStorageKeys = (storage: Store) => {
  try {
    for (const [oldKey, newKey] of Object.entries(LEGACY_KEYS)) {
      const old = storage.getItem(oldKey);
      if (old === null) continue;
      if (storage.getItem(newKey) === null) storage.setItem(newKey, old);
      storage.removeItem(oldKey);
    }
  } catch {
    // storage blocked (private mode): nothing to migrate
  }
};

// Side effect on import so stores that read at module load see migrated values.
if (typeof window !== 'undefined' && typeof window.localStorage?.getItem === 'function') {
  migrateStorageKeys(window.localStorage);
}
