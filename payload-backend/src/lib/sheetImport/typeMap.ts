import type { RESOURCE_TYPES } from '../../collections/Resources'
import type { SheetRow } from './parse'

type ResourceType = (typeof RESOURCE_TYPES)[number]

// Every distinct "content_domain_en | resource_type_en" pair in the sheet. Content domain drives the type;
// resource type only breaks ties (web tool, library, desktop app -> program).
// A new pair in the sheet throws on purpose: add it here rather than guess.
const TYPE_BY_PAIR: Record<string, ResourceType> = {
  'Arabic fonts | Fonts': 'font',
  'Audio recitations / word timing | Web tool (data review and contribution)': 'recitation',
  'Audio recitations | Open-source library / application': 'recitation',
  'Audio recitations | Web tool (developer utility)': 'recitation',
  "Benefits and guidance (Fawa'id) | API (REST)": 'tafsir',
  "Counting of ayahs ('Add al-Ay) | API (REST)": 'api',
  'Directory of Quranic apps | Showcase platform (app directory)': 'program',
  'Experimental features | Experimental platform': 'program',
  'Fonts | Web tool (developer utility)': 'font',
  'Gharib al-Quran / word meanings | Dataset (Word file)': 'linguistic',
  "I'rab (grammatical analysis) | API (REST)": 'linguistic',
  'Makki and Madani | API (REST)': 'api',
  'Morphology (Sarf) | API (REST)': 'linguistic',
  "Morphology and grammar (I'rab) | Web tool (data review and contribution)": 'linguistic',
  'Mushaf and recitation app | Open-source library / application': 'mushaf',
  'Mushaf page images (pages) | Dataset (vector images)': 'mushaf',
  "Mushaf page images, translations of the Quran's meanings, tafsirs and books | Embed service (iframe)": 'mushaf',
  'Mushaf page layout | Web tool (data review and contribution)': 'mushaf',
  'Mutashabihat (similar phrases) of the Quran | Web tool (data review and contribution)': 'search',
  'Names of surahs and their virtues | API (REST)': 'api',
  'Occasions of revelation (Asbab al-Nuzul) | API (REST)': 'tafsir',
  'Page, range of pages | API (REST)': 'mushaf',
  'Proper names and places | API (REST)': 'api',
  'Published, but returned no content in testing | API (REST)': 'api',
  'Quran web application | Open-source library / application': 'program',
  'Quranic fonts (Uthmani script) | Fonts': 'font',
  'Quranic text (Uthmani script) | Dataset + font': 'dataset',
  'Quranic text (Uthmani script) | Desktop application (publishing tool)': 'program',
  'Quranic text (Uthmani script) | Desktop application': 'program',
  'Quranic text (script variants) | Web tool (developer utility)': 'program',
  'Quranic text / fonts | Web tool (data review and contribution)': 'program',
  'Quranic text | Web tool (developer utility)': 'program',
  'Surah information | Web tool (data review and contribution)': 'program',
  'Surah objectives (Maqasid) | API (REST)': 'tafsir',
  'Tafsir (translated) | API (REST)': 'tafsir',
  'Tafsir | API (REST)': 'tafsir',
  'Tafsir | Dataset': 'tafsir',
  'Tafsir | Web tool (data review and contribution)': 'tafsir',
  "Tafsir, gharib (rare words), mushkil al-i'rab, rhetoric of ayahs, surah objectives and topics, Makki and Madani, benefits, surah correlations | API (REST)": 'tafsir',
  'Tajweed | API (REST)': 'tajweed',
  'Tajweed | Digital book (Word file)': 'tajweed',
  'Tajweed | Web tool (data review and contribution)': 'tajweed',
  "Translation of the Quran's meanings + audio translation | API (REST) + downloadable files": 'translation',
  "Translation of the Quran's meanings | API (REST) + downloadable files": 'translation',
  "Translation of the Quran's meanings | API (REST)": 'translation',
  "Translations of the Quran's meanings | Web tool (data review and contribution)": 'translation',
  'Transliteration / word pronunciation | Web tool (data review and contribution)': 'linguistic',
  'Transliteration | Web tool (data review and contribution)': 'linguistic',
  'Unicode / fonts | Web tool (developer utility)': 'font',
  'User data (bookmarks, notes, reading progress, goals) | API (REST) + OAuth2/OIDC': 'api',
  'Virtues of surahs | API (REST)': 'api',
  'Word-by-word translation | Web tool (data review and contribution)': 'translation',
}

export function mapResourceType(row: SheetRow): ResourceType {
  const pair = `${row.content_domain_en?.trim()} | ${row.resource_type_en?.trim()}`
  const type = TYPE_BY_PAIR[pair]
  if (!type) throw new Error(`Sheet row ${row.id}: no resource type mapped for "${pair}"`)
  return type
}
