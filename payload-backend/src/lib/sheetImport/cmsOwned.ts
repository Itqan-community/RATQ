// Sheet rows describing something the Itqan CMS already lists (matched by name, publisher and content on 2026-11-23).
// The CMS entry was there first and wins: these rows are imported as drafts, so the catalog shows each item once.
// Rows with no CMS counterpart (for example kfgqpc-dev-bazzi) stay published.
export const CMS_OWNED_SHEET_IDS = new Set([
  'kfgqpc-dev-hafs', // CMS 138 Unicode Uthmanic Font (Hafs)
  'kfgqpc-dev-hafs-smart', // CMS 137
  'kfgqpc-dev-warsh', // CMS 139
  'kfgqpc-dev-shubah', // CMS 140
  'kfgqpc-dev-qalun', // CMS 141
  'kfgqpc-dev-duri', // CMS 142
  'kfgqpc-dev-susi', // CMS 143
  'kfgqpc-dev-tafsir-muyassar', // CMS 144 Tafseer Muyassar
  'kfgqpc-dev-ghareeb', // CMS 145 Muyassar of Ghareeb Al-Quran
  'kfgqpc-dev-tajweed-muyassar', // CMS 146 Tajweed Muyassar
  'qf-tafsir-15', // CMS 4 Tafsir Altabari
])
