# Alfanous: Arabic Quran Search Engine API

## [Overview](#table-of-contents)

**Alfanous** is a free, open-source Quranic search engine API for Arabic text. It supports both simple and advanced full-text searches over the Quran, using an efficient index to deliver fast, relevant results. The engine is built on the **Whoosh** library (a pure-Python search engine), and it includes Arabic-specific processing (stemming, root analysis, etc.) to handle the language’s complexities.

## Table of Contents

- [Overview](#overview)
- [Table of Contents](#table-of-contents)
- [Features](#features)
- [Installation and Usage](#installation-and-usage)
- [Advanced Queries](#advanced-queries)
- [Result Format](#result-format)
- [Architecture & Code Structure](#architecture--code-structure)
- [Development & Contribution](#development--contribution)
- [License](#license)

## [Features](#table-of-contents)

- **Advanced Query Syntax**: Supports quoted phrases, Boolean operators (`+`, `|`, `-`), wildcards, and range queries.
- **Multilingual & Transliteration**: Queries can be in Arabic or Romanized forms (Buckwalter, ISO, ArabTeX, etc.).
- **Customizable Output**: Supports flags for text scripts, translations, highlights, pagination, and sorting.
- **Rich Results**: Returns structured JSON with verse info, context, annotations, and optional recitations.
- **Multiple Interfaces**: Provides Python API, CLI, web, and GUI access.

## [Installation and Usage](#table-of-contents)

### Package

Install the Alfanous API via pip:

```bash
sudo pip3 install alfanous
```

Now, you can use the API as follows:

1. **Command-line**

```bash
$ alfanous-console -a search -q الله     # search for "الله"
$ alfanous-console -a suggest -q مءصدة   # get spelling suggestions
```

2. **Python API**

```python
import alfanous
results = alfanous.search(u"الله")
# or use the general do() interface with a dictionary:
results = alfanous.do({"action": "search", "query": u"Allh"})  # Buckwalter transliteration
```

These return the same JSON structure as the console.

### Source

> **Note**: The source code is written in Python 2.7 and it is not compatible with Python 3. You need to use a compatible version of Python 2.7.

> **Note**: I tested the code after making many changes to the code to make it python3 compatible and didn't test it with python2.

1. clone the repository:

```bash
git clone https://github.com/Alfanous-team/alfanous.git
```

2. Go to the directory:

```bash
cd alfanous
```

3. Install dependencies:

```bash
pip3 install pyparsing epydoc sphinx
```

4. Build the indexes:

```bash
make build
```

5. Go to alfanous directory

````

6. Setup the package:

```bash
python3 setup.py install
````

Now, you can use `alfanous-console` command to search for a word or phrase.

> **Another Note**: After testing the code, I faced an issue where it does not return any results and always fail, whenever I search for anything. I am currently debugging the issue.

### Web API

The JSON service is available online. For example:

```url
http://alfanous.org/jos2?action=search&query=الله or
http://alfanous.org/jos2?action=search&query=Allh
```

will perform a search and return JSON.

> **Note**: The web API is available online but it seems that it has some issues, many requests get exceeding limit error, and I am not sure why. Also, it does have some inconvenient responses, so its can not count on these responses.

**Query Flags and Parameters for the Web API**

| **Parameter**     | **Description**                                 |
| ----------------- | ----------------------------------------------- |
| `action`          | Operation type: `search`, `suggest`, or `show`. |
| `query`           | Search keywords (Arabic or transliteration).    |
| `script`          | `standard` or `uthmani`.                        |
| `vocalized`       | Include diacritics.                             |
| `recitation`      | Audio recitation ID.                            |
| `translation`     | Translation ID.                                 |
| `highlight`       | Highlight format (`css`, `html`, etc.).         |
| `sortedby`        | Sorting method.                                 |
| `page`, `perpage` | Pagination.                                     |

## [Advanced Queries](#table-of-contents)

Alfanous supports a rich query language. Examples:

### Phrase search:

Enclose text in quotes, e.g. `"الحمد لله"` to find the exact phrase

### Boolean logic:

Use `+` for `AND`, `|` for `OR`, `-` for `NOT`. E.g. `الصلاة + الزكاة` (verses containing both), (`الصلاة - الزكاة`) (verses with `الصلاة` but without `الزكاة`)

### Wildcards:

Asterisk `*` matches any number of chars, e.g. `*نبي*` (words containing `نبي`), and question mark `?` for a single char (e.g. `نعم؟` to match نعم followed by any letter)

### Fielded search:

Search specific fields by prefix, e.g. `سورة:يس` to search within Sura names, or `رقم_السورة:114 + aya_id:1` to pinpoint Sura 114 Aya 1. See the Fields list for all indexed fields (e.g. `موضوع` for topic, `آية_` for partially vocalized text).

### Range queries:

Specify numeric ranges, e.g. `رقم_السورة:[1 الى 5]` to restrict Sura 1–5, possibly combined with a term: `رقم_السورة:[1 الى 5] + الله`.

### Partially specified diacritics:

Use field queries with a leading Arabic letter, e.g. `آية_:'مَن'` matches verses where some vowels spell “مَن”

### Root/lemma searches:

Use `{root,type=...}` for part-of-speech filters, or derivation symbols: `>مالك` finds words with lemma مالك, `>>مالك` finds words with root مالك.

These powerful options let you craft very specific searches. (For example, to find all verses about `Allah` in the first five chapters: use `رقم_السورة:[1 الى 5] + الله`.)

### Example

flags

```json
{
  "action": "search",
  "query": "الكوثر",
  "sortedby": "score",
  "page": 1,
  "word_info": true,
  "highlight": "css",
  "script": "standard",
  "prev_aya": true,
  "next_aya": true,
  "sura_info": true,
  "aya_position_info": true,
  "aya_theme_info": true,
  "aya_stat_info": true,
  "aya_sajda_info": true,
  "annotation_word": true,
  "annotation_aya": true,
  "translation": "None",
  "recitation": 1
}
```

## [Result Format](#table-of-contents)

The API returns JSON. For example, the response of the above [flags](#example):

```json
{
  "search": {
    "runtime": 1.0951571464538574,
    "interval": {
      "start": 1,
      "total": 1,
      "end": 1
    },
    "words": {
      "global": {
        "nb_words": 1,
        "nb_matches": 1,
        "nb_vocalizations": 1
      },
      "individual": {
        "1": {
          "word": "\u0627\u0644\u0643\u0648\u062b\u0631",
          "nb_matches": 1,
          "nb_ayas": 1,
          "nb_vocalizations": 1,
          "vocalizations": [
            "\u0627\u0644\u0652\u0643\u064e\u0648\u0652\u062b\u064e\u0631\u064e"
          ]
        }
      }
    },

    "ayas": {
      "1": {
        "identifier": {
          "gid": 6205,
          "aya_id": 1,
          "sura_id": 108,
          "sura_name": "\u0627\u0644\u0643\u0648\u062b\u0631"
        },
        "aya": {
          "id": 1,
          "text": "\u0625\u0650\u0646\u0651\u064e\u0627\u0623\u064e\u0639\u0652\u0637\u064e\u064a\u0652\u0646\u064e\u0627\u0643\u064e <span class=\"match term0\">\u0627\u0644\u0652\u0643\u064e\u0648\u0652\u062b\u064e\u0631\u064e</span>",
          "recitation": "http://www.everyayah.com/data/Abdul_Basit_Murattal_64kbps/108001.mp3",
          "translation": null,
          "prev_aya": {
            "id": 7,
            "sura": "\u0627\u0644\u0645\u0627\u0639\u0648\u0646",
            "text": "\u0648\u064e\u064a\u064e\u0645\u0652\u0646\u064e\u0639\u064f\u0648\u0646\u064e \u0627\u0644\u0652\u0645\u064e\u0627\u0639\u064f\u0648\u0646\u064e"
          },
          "next_aya": {
            "id": 2,
            "sura": "\u0627\u0644\u0643\u0648\u062b\u0631",
            "text": "\u0641\u064e\u0635\u064e\u0644\u0651\u0650 \u0644\u0650\u0631\u064e\u0628\u0651\u0650\u0643\u064e \u0648\u064e\u0627\u0646\u0652\u062d\u064e\u0631\u0652"
          }
        },

        "sura": {
          "id": 108,
          "name": "\u0627\u0644\u0643\u0648\u062b\u0631",
          "type": "\u0645\u0643\u064a\u0629",
          "order": 15,
          "ayas": 3,
          "stat": {
            "words": 10,
            "letters": 42,
            "godnames": 0
          }
        },
        "theme": {
          "chapter": "\u0623\u0631\u0643\u0627\u0646 \u0627\u0644\u0625\u0633\u0644\u0627\u0645 ",
          "topic": "\u0627\u0644\u062d\u062c \u0648\u0627\u0644\u0639\u0645\u0631\u0629 ",
          "subtopic": null
        },

        "position": {
          "rub": 0,
          "manzil": 7,
          "ruku": 550,
          "hizb": 60,
          "page": 602
        },
        "sajda": {
          "exist": false,
          "id": null,
          "type": null
        },

        "stat": {
          "letters": 16,
          "godnames": 0,
          "words": 3
        },
        "annotations": {
          "1": {
            "arabicroot": null,
            "arabicmood": null,
            "number": null,
            "spelled": "\u0627\u0646\u0627\u0653",
            "aspect": null,
            "word_gid": 75871,
            "word_id": 1,
            "mood": null,
            "arabicspecial": "\u0625\u0650\u0646\u0651",
            "state": null,
            "arabiclemma": "\u0625\u0650\u0646\u0651",
            "gid": 116333,
            "type": "Particles",
            "aya_id": 1,
            "arabictoken": null,
            "form": null,
            "pos": "Accusative particle",
            "arabiccase": "\u0645\u0646\u0635\u0648\u0628",
            "part": "\u062c\u0630\u0639",
            "normalized": "\u0625\u0646\u0627\u0653",
            "case": "Accusative case",
            "sura_id": 108,
            "word": "\u0625\u0650\u0646\u0651\u064e\u0627\u0653",
            "derivation": null,
            "arabicpos": "\u062d\u0631\u0641 \u0646\u0635\u0628",
            "person": null,
            "token": null,
            "gender": null,
            "voice": null,
            "order": 1
          },
          "2": {
            "arabicroot": "\u0639\u0637\u0648",
            "arabicmood": null,
            "number": "\u062c\u0645\u0639",
            "spelled": "\u0627\u0639\u0637\u064a\u0646\u0670\u0643",
            "aspect": "Perfect verb",
            "word_gid": 75872,
            "word_id": 2,
            "mood": null,
            "arabicspecial": null,
            "state": null,
            "arabiclemma": null,
            "gid": 116335,
            "type": "Verbs",
            "aya_id": 1,
            "arabictoken": null,
            "form": "Fourth form",
            "pos": "Verb",
            "arabiccase": null,
            "part": "\u062c\u0630\u0639",
            "normalized": "\u0623\u0639\u0637\u064a\u0646\u0670\u0643",
            "case": null,
            "sura_id": 108,
            "word": "\u0623\u064e\u0639\u0652\u0637\u064e\u064a\u0652\u0646\u064e\u0670\u0643\u064e",
            "derivation": null,
            "arabicpos": "\u0641\u0639\u0644",
            "person": "\u0645\u062a\u0643\u0644\u0645",
            "token": null,
            "gender": "\u0645\u0630\u0651\u0643\u0631",
            "voice": null,
            "order": 1
          },
          "3": {
            "arabicroot": null,
            "arabicmood": null,
            "number": null,
            "spelled": "\u0671\u0644\u0643\u0648\u062b\u0631",
            "aspect": null,
            "word_gid": 75873,
            "word_id": 3,
            "mood": null,
            "arabicspecial": null,
            "state": null,
            "arabiclemma": null,
            "gid": 116337,
            "type": "determiner",
            "aya_id": 1,
            "arabictoken": "\u0627\u0644",
            "form": null,
            "pos": null,
            "arabiccase": null,
            "part": "\u0633\u0627\u0628\u0642",
            "normalized": "\u0671\u0644\u0643\u0648\u062b\u0631",
            "case": null,
            "sura_id": 108,
            "word": "\u0671\u0644\u0652\u0643\u064e\u0648\u0652\u062b\u064e\u0631\u064e",
            "derivation": null,
            "arabicpos": null,
            "person": null,
            "token": "al",
            "gender": null,
            "voice": null,
            "order": 1
          }
        }
      }
    },
    "translation_info": {}
  },

  "error": {
    "code": 0,
    "msg": "success ## action=search ; query=\u0627\u0644\u0643\u0648\u062b\u0631"
  }
}
```

This illustrates the structure: under `ayas`, each hit has an `identifier` (global Aya ID, Sura ID/name), the verse text and any requested media (e.g. `recitation`), plus optional adjacent verses (`prev_aya`/`next_aya`). The `sura` object describes chapter info (id, name, revelation order, word count, etc.). The `annotations` object (if enabled) gives linguistic details per word (roots, part of speech, case, etc.)
(If any error occurs, the error block reports it.)

## [Architecture & Code Structure](#table-of-contents)

Alfanous is organized into several Python packages. The core API lives in the `alfanous` package, which contains modules for each step of processing :

- **Data.py** – loads Quranic text, translations, and auxiliary tables (from JSON or database).
- **TextProcessing.py** – normalizes and indexes Arabic text (handling tashkeel, normalization).
- **QueryProcessing.py** – parses the user query, applies boolean logic and constructs a Whoosh query.
- **Indexing.py / Searching.py** – manage and execute searches on the Whoosh indexes.
- **ResultsProcessing.py** – formats the raw search hits into the JSON structure.
- **Suggestions.py** – generates spelling suggestions when `action=suggest` is used.
- **Romanization.py** – converts Arabic text into Latin transcription schemes.
- **Threading.py** – supports multi-threaded queries for large searches.
- **Configs/Resources**: Static Quran and linguistic data are stored under `resources/` (JSON) and compiled into Python in `dynamic_resources/` for speed The Whoosh indexes themselves are stored in `indexes/`
  Configuration files (`configs/`) allow customizing default behaviors.

- **alfanous-import**: A separate utility package for building and updating the data. It has tools to download raw resources, parse them, and run a Transformer that populates the database and creates Whoosh indexes.

This modular design makes the engine extensible: for instance, adding a new transliteration scheme involves updating Romanization.py, and a new search interface can simply call the API.

## [Development & Contribution](#table-of-contents)

Licensed under **AGPL-3.0**.
Clone and build locally for development:

```bash
git clone https://github.com/Alfanous-team/alfanous.git
cd alfanous
make build
```

Before building, you need to make some changes to the source code if you need to run it with python 3:

1. In `MAKEFILE`, you need to make sure that it does not try to run the scripts with python 2. I did it as follows, but you can do it however you see fit.

```bash
## Python version and command
PYTHON_VERSION_MAJ=$(shell python -c 'import sys; print(sys.version_info[0])')
ifeq '$(PYTHON_VERSION_MAJ)' '3'
PYTHON_COMMAND="python3"
else
PYTHON_COMMAND="python"
endif
```

2. The code is old and uses python2 syntax , so you need to make changes to make it work. For example :

   1. Many `print` statements are using the old syntax.
   2. In many places, the code uses an old method of dict `has_key()`, so you need to use the new syntax, `key in dict`.
   3. It uses a deprecated data type `Encode`, so you need to change it to `str` if it is not already.
   4. etc...
      > If you need all the changes I already done, you can use [my updated fork of the project](https://github.com/IbrahimMurad/alfanous).

3. You need to install some required packages, `pyparsing`, `epydoc`, `sphinx`.

```bash
python3 -m venv .venv
source .venv/bin/activate
pip3 install pyparsing epydoc sphinx
```

4. Change `cgi` to `html` in `/src/alfanous/Support/whoosh/highlight.py`

```python
from html import escape as htmlescape
```

## Resources

- [Tanzil](./tanzil.md): for Quran text, and translations.
- [QuranCorpus](https://corpus.quran.com/): for Quranic corpus.

## [License](#table-of-contents)

AGPL-3.0 License
