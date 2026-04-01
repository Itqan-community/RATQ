# Alfanous Search Engine — Rust vs Python Comparison

Search mode accuracy across 9 test words  
Date: April 2026

---

## Summary

Three search modes were tested: Root (`>>`), Lemma (`>`), and Stem (no prefix). Each mode was evaluated against 9 Arabic words using the original Python Alfanous engine as the ground truth.

| Mode | Avg Recall | Notes |
|---|---|---|
| Root (`>>`) | ~12% | Most critical gap — morphological expansion largely absent |
| Lemma (`>`) | ~65% | Performs well on exact forms, fails on root expansion |
| Stem (no prefix) | ~85% | Strongest mode, some false positives present |

---

## Root Search (`>>` prefix)

Root search is the most significant gap. The original engine expands a root like ط-ي-ر to catch all derived forms (طير، طائر، تطيروا، مستطير...). The Rust project appears to match near-exact forms only.

| Word | Original | Rust | Notes |
|---|---|---|---|
| الألباب | 19 | 16 | Missing أسباب (same root ل-ب-ب) |
| جبل | 39 | 3 | Missing all جبال/جبلة plurals and derived forms |
| ربوة | 15 | 1 | Missing ربا/يربو/ربت and all root ر-ب-و forms |
| الباب | 26 | 5 | Missing أبواب/مآب plural and derived forms |
| طير | 24 | 2 | Missing طائر/تطيروا/مستطير and all ط-ي-ر forms |
| سأل | 118 | 1 | Missing nearly all — يسألون/مسؤول/سؤال etc. |
| ملأ | 40 | 1 | Missing ملأ (council)/امتلأ/فملئت and all forms |
| دابة | 22 | 14 | Missing دابر/دواب plural forms |
| ناقة | 4 | 4 | ✓ Correct |

---

## Lemma Search (`>` prefix)

Lemma results closely mirror Root results in the Rust project, suggesting they may share the same code path rather than having distinct morphological expansion levels. For ناقة, the original returns 9 results including 2 false positives from نفقة (sharing the ن-ق root sequence); the Rust project returns only the 4 exact matches, missing 3 valid ناقة/الناقة forms.

| Word | Original | Rust | Notes |
|---|---|---|---|
| الألباب | ~16 | 16 | ✓ Matches |
| جبل | ~3 | 3 | ✓ Likely correct (singular only) |
| ربوة | ~1 | 1 | ✓ Matches |
| الباب | ~5 | 5 | ✓ Matches |
| طير | >1 | 1 | Under-returning — طير vs طيرا missed |
| سأل | >1 | 1 | Under-returning — nearly all forms missed |
| ملأ | 30 | 1 | Major miss — lemmatization not expanding |
| دابة | 22 | 14 | Missing دابر/دواب |
| ناقة | 9 | 4 | Missing القمر 27, الأعراف 77, الإسراء 59 + 2 نفقة false positives in original |

---

## Stem Search (no prefix)

The strongest mode. Correct on most simple cases, but produces occasional false positives (e.g., الألباب matching الباب) and misses some morphological variants like دابر for دابة.

| Word | Original | Rust | Notes |
|---|---|---|---|
| الألباب | 19 | 21 | 2 false positives: الباب mixed in |
| جبل | 3 | 3 | ✓ Correct |
| ربوة | 1 | 1 | ✓ Correct |
| الباب | 7 | 9 | Different false positives on both sides |
| طير | 1 | 1 | ✓ Correct |
| سأل | 1 | 1 | ✓ Correct |
| ملأ | 1 | 1 | ✓ Correct |
| دابة | 18 | 14 | Missing 4 دابر forms |
| ناقة | 6 | 4 | Rust is more precise — original had 2 نفقة false positives |

---

## Key Findings & Recommendations

1. **Root expander is the priority** — The gap between 1 and 118 results for سأل is the clearest signal. Implement a proper trilateral root lookup table with all derived patterns (فَعَلَ، فَاعِل، مَفْعُول...).

2. **Lemma ≠ Root** — Currently these two modes return nearly identical results. Lemma should return all inflections of a base word; Root should return all words sharing the same root.

3. **Stem false positives** — الألباب matching الباب indicates the stem stripping is too aggressive. Consider a minimum stem length or a stop-word list.

4. **دابر forms missing in all modes** — The root د-ب-ر is not being caught even in Root mode. Check root derivation table completeness.

5. **Original false positives in ناقة lemma** — The Python engine returns 9 results including نفقة ayahs (البقرة 270, التوبة 121) as false positives — the Rust project is actually more precise here.
