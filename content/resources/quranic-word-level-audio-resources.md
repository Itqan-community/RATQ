# Word-Level Quran Recitation Resources

This file contains a list of available solutions that provide Quran recitation segmented at the individual word level.

Unlike traditional resources that provide recitation at the ayah level only, word-level audio enables precise synchronization between the Quranic text and the recited audio. This capability is essential for advanced Quranic applications that require interaction with each word individually.

These resources include: standalone word-level audio datasets, APIs that provide word-level timestamps, alignment tools, and AI-based approaches.


## Importance of Word-Level Audio Recitations

Providing word-level segmented recitations is beneficial for many applications such as:

* Quran learning applications for non-Arabic speakers
* Educational and gamified Quran apps
* Word highlighting during playback
* Pronunciation and Tajweed training tools
* Linguistic alignment and speech analysis research

## Resource Categories

### 1. Standalone Word-Level Audio Datasets (No Timestamps)

These datasets provide one separate audio file for each Quranic word, without accompanying timing metadata.

They are suitable for:

* Vocabulary training
* Repetition exercises
* Flashcard applications
* Word-level listening activities

#### Example

* Buraaq Word-Level Quran Audio Dataset
  A HuggingFace-hosted dataset containing audio files for each Quranic word.
  [https://huggingface.co/datasets/Buraaq/quran-md-words](https://huggingface.co/datasets/Buraaq/quran-md-words)


### 2. Ayah Recitations with Word-Level Timestamps

These solutions provide full ayah recitations along with structured timing data for each word within the ayah.

This enables:

* Word-by-word highlighting during playback
* Precise synchronization between text and audio
* Advanced interactive recitation experiences

#### Examples

* Quran Foundation Audio API
  Provides recitations with structured timing data.
  [https://api-docs.quran.foundation/docs/sdk/audio/](https://api-docs.quran.foundation/docs/sdk/audio/)

* QuranWBW (Word-by-Word Recitation)
  A web platform that provides word-by-word Quran recitation.
  [https://quranwbw.com/](https://quranwbw.com/)
  [https://github.com/marwan/quranwbw](https://github.com/marwan/quranwbw)


### 3.  Alignment Tools

These tools generate word-level timestamps programmatically by aligning the Quranic text with recitation audio files.

They are particularly useful when pre-existing timing metadata is not available, or when custom recitations require precise text–audio alignment.

#### Example

* quran-align
  [https://github.com/cpfair/quran-align](https://github.com/cpfair/quran-align)


### 4. AI-Based Word-Level Timestamping (Experimental)

These approaches rely on speech recognition models to extract estimated word-level timestamps from recitation audio.

These solutions are experimental and may require manual validation before production use.

#### Examples

* whisper-timestamped
  [https://github.com/linto-ai/whisper-timestamped](https://github.com/linto-ai/whisper-timestamped)

* WhisperX
  [https://github.com/m-bain/whisperX](https://github.com/m-bain/whisperX)
