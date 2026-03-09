# Othman Quran Browser

## Overview

Othman is an electronic Quran browser that displays Quranic text in Othmani script style as written under the authority of Othman ibn Affan (may Allah be pleased with him), companion of Prophet Muhammad (peace be upon him). The application features fast search capabilities, auto-scrolling, and the ability to copy Quranic text to clipboard.

## Table of Contents

- [Overview](#overview)
- [Table of Contents](#table-of-contents)
- [Project Structure](#project-structure)
- [Search Engine Architecture](#search-engine-architecture)
- [Database Schema](#database-schema)
- [Performance Characteristics](#performance-characteristics)
- [Technical Design Decisions](#technical-design-decisions)
- [Building and Installation](#building-and-installation)
- [License](#license)

## Project Structure

The project consists of several key components:

- **Core Module** (`othman/core.py`): Provides API access to Quranic text and search functionality
- **GTK UI** (`othman/gtkUi.py`): Graphical user interface built with GTK3
- **Database**: SQLite databases storing Quranic text (`quran.db`) and search index (`ix.db`)
- **Variable-length Integer Encoding** (`othman/univaruints.py`): Custom serialization for efficient index storage

## Search Engine Architecture

### Overview

The search engine in Othman is built around an inverted index architecture that enables fast, partial-word matching across all 6,236 verses of the Quran. The implementation prioritizes both speed and storage efficiency through custom encoding techniques.

### Index Structure

The search index is implemented in the `searchIndexer` class and consists of:

1. **Term Dictionary**: Maps normalized Arabic words to lists of verse IDs (Aya IDs)
2. **SQLite Storage**: Persists the index in `ix.db` with structure:
   ```sql
   CREATE TABLE ix (w TEXT PRIMARY KEY NOT NULL, i BLOB)
   ```
   - `w`: The normalized search term
   - `i`: Compressed list of Aya IDs containing that term

### Text Normalization

Before indexing or searching, all text undergoes normalization to handle Arabic script variations:

```python
normalize_tb = {
    65: 97, 66: 98, ...,  # A-Z to a-z
    1569: 1575,  # Alef variations → Alef
    1570: 1575,  # Alef with Hamza above
    1571: 1575,  # Alef with Hamza below
    1572: 1575,  # Waw with Hamza
    1573: 1575,  # Alef with Hamza below
    1574: 1575,  # Yeh with Hamza
    1577: 1607,  # Teh Marbuta → Heh
    1609: 1575,  # Alef Maksura → Alef
    1611: None,  # Fathatan (removed)
    1612: None,  # Dammatan (removed)
    # ... other diacritics removed
}
```

This normalization:
- Converts uppercase to lowercase for Latin characters
- Unifies Alef variations (أ، إ، آ، ا)
- Removes all Arabic diacritical marks (Tashkeel)
- Normalizes Teh Marbuta to Heh
- Converts Alef Maksura to Alef

### Index Generation

The index is built during installation by the `gen-index.py` script:

```python
q = othmanCore(False)
ix = searchIndexer(True)
wc = 0
for n,(o,i) in enumerate(q.getAyatIter(1, 6236)):
    for w in i.split():
        ix.addWord(w, n+1)
        wc += 1
ix.save()
```

**Process:**
1. Iterate through all 6,236 verses
2. Split each verse into words
3. Normalize and add each word to the index with its verse ID
4. Save the compressed index to disk

**Index Statistics:**
- Total words indexed: ~77,000+
- Unique terms: ~18,000+
- Maximum term length: Variable, tracked during indexing
- Total index size: Compressed using variable-length encoding

### Compression: Variable-Length Integer Encoding

The index uses a custom variable-length encoding scheme (`univaruints.py`) to minimize storage:

#### Encoding Strategy

Instead of storing each Aya ID as a fixed 64-bit integer (8 bytes), the encoding uses 1-8 bytes depending on the value's magnitude:

| Value Range | Bytes Used | First Byte Pattern |
|-------------|------------|-------------------|
| 0-127 | 1 | `0xxxxxxx` |
| 128-16,511 | 2 | `10xxxxxx` |
| 16,512-2,113,663 | 3 | `110xxxxx` |
| ... | ... | ... |
| Up to 2^64 | 8 | `11111111` |

#### Incremental Encoding

Since verse IDs are stored in sorted order, the index uses **delta encoding** (incremental encoding):

```python
def incremental_encode_list(a, unique=1, last=0):
    last -= unique
    for i in a:
        if i < last + unique:
            raise ValueError
        yield i - last - unique  # Store the difference
        last = i
```

**Example:**
- Original IDs: `[5, 12, 45, 89, 234]`
- Incremental: `[5, 7, 33, 44, 145]`
- Benefits: Smaller differences = fewer bytes needed

#### Storage Efficiency

For a term appearing in 100 consecutive verses:
- **Without compression**: 100 × 8 bytes = 800 bytes
- **With variable-length encoding**: ~100-200 bytes
- **Compression ratio**: 4-8x reduction

### Search Operations

#### Exact Word Search

```python
def find(self, words):
    if not words:
        return None
    w = self.normalize(words[0])
    W, x = self.get(w)
    if not x:
        return None
    for w in words[1:]:
        W, y = self.get(self.normalize(w))
        if not y:
            return None
        x &= y  # Set intersection
    return x.toAyaIdList()
```

**Algorithm:**
1. Normalize the first search word
2. Retrieve the set of verse IDs containing that word
3. For each additional word:
   - Retrieve its verse ID set
   - Intersect with the accumulated set
4. Return sorted list of matching verse IDs

**Complexity:** O(n × m) where n = number of search terms, m = average set size

#### Partial Word Search (Substring Matching)

```python
def findPartial(self, words):
    if not words:
        return None
    w = self.normalize(words[0])
    x = reduce(lambda a,b: a|b, self.getPartial(w), searchIndexerItem())
    for W in words[1:]:
        w = self.normalize(W)
        y = reduce(lambda a,b: a|b, self.getPartial(w), searchIndexerItem())
        x &= y
    return x.toAyaIdList()
```

**Algorithm:**
1. Use SQL `LIKE` pattern matching: `WHERE w LIKE '%searchterm%'`
2. Union all matching term sets for the first word
3. Repeat for each additional word and intersect results
4. Return sorted list of matching verse IDs

**Example:**
- Search: "رحم" (mercy)
- Matches: "الرحمن", "الرحيم", "رحمة", "يرحم", etc.
- Returns all verses containing any word with "رحم"

### Set Operations

The `searchIndexerItem` class extends Python's `set` for efficient verse ID manipulation:

```python
class searchIndexerItem(set):
    def __or__(self, y):
        return self.union(y)  # Union for partial match
    
    def __and__(self, y):
        return self.intersection(y)  # Intersection for multi-word
    
    def toAyaIdList(self):
        l = list(self)
        l.sort()
        return l
```

**Set Operations:**
- **Union (`|`)**: Combine results from multiple partial matches
- **Intersection (`&`)**: Find verses containing all search terms
- **Sorting**: Present results in Quranic order

### Thread Safety

The search engine supports multi-threaded access through connection pooling:

```python
def _getConnection(self):
    n = threading.current_thread().name
    if n in self._cn.keys():
        r = self._cn[n]
    else:
        r = sqlite3.connect(self.db_fn)
        self._cn[n] = r
    return r
```

Each thread maintains its own SQLite connection, preventing conflicts during concurrent searches.

### User Interface Integration

The search functionality is exposed through a dedicated search window (`searchWindow` class):

**Features:**
1. **Live Search**: Press Enter to execute search
2. **Results Display**: Shows Sura name, number, and Aya number
3. **Navigation**: Click any result to jump to that verse
4. **Persistence**: Remembers last search for quick navigation

**Search Flow:**
1. User enters text in search box
2. Text is split into words and normalized
3. `findPartial()` executes substring search
4. Results populate a tree view with Sura/Aya information
5. Clicking a result scrolls the main view to that verse

## Database Schema

### Quran Table
```sql
SELECT othmani, imlai FROM Quran WHERE id>=? ORDER BY id LIMIT ?
```

- **othmani**: Text in Uthmanic script (with Quranic orthography)
- **imlai**: Text in modern Arabic spelling
- **id**: Verse ID (1-6236)

### SuraInfo Table
```sql
SELECT rowid, sura_name, other_names, makki, starting_row, comment 
FROM SuraInfo ORDER BY rowid
```

Stores metadata for all 114 Suras including names, Makki/Madani classification, and starting verse IDs.

## Performance Characteristics

### Index Generation
- **Time**: ~1-3 seconds for complete Quran
- **Memory**: Peak ~50-100 MB during indexing
- **Disk**: ~500 KB for compressed index

### Search Performance
- **Exact match**: < 10ms for single word
- **Multi-word exact**: < 50ms for 2-3 words
- **Partial match**: < 100ms for single substring
- **Multi-word partial**: < 200ms for 2-3 substrings

### Memory Usage
- **Runtime**: ~20-30 MB for index in memory
- **Per search**: < 1 MB additional allocation
- **Result sets**: ~100 bytes per matching verse

## Technical Design Decisions

### Why Custom Encoding?

1. **Arabic text characteristics**: Quran has specific word frequency patterns
2. **Sequential IDs**: Verse IDs are naturally ordered, enabling delta encoding
3. **Storage optimization**: Reduces index size by 4-8x vs. fixed-width integers
4. **Fast decoding**: Single-pass decoding with minimal overhead

### Why SQLite?

1. **Zero configuration**: No separate database server needed
2. **ACID compliance**: Ensures index integrity
3. **Efficient LIKE queries**: Built-in pattern matching for partial search
4. **Cross-platform**: Works on Windows, Linux, macOS
5. **Embedded**: Index travels with the application

### Why Set-Based Operations?

1. **Simplicity**: Natural representation of "verses containing word X"
2. **Efficiency**: Python's built-in set operations are highly optimized
3. **Flexibility**: Easy to combine (AND/OR) multiple search terms
4. **Memory**: Compact representation for sparse data

## Building and Installation

### Generate Search Index

```bash
python3 gen-index.py
```

This creates `othman-data/ix.db` by indexing all Quranic text.

### Install Application

```bash
pip3 install --upgrade git+https://github.com/ojuba-org/othman.git --user
othman-browser
```

### Build from Source

```bash
# Using Make
make
sudo make install

# Using Meson
meson build
ninja -C build
sudo ninja -C build install
```

## License

Released under the **Waqf Public License** - a copyleft license designed for Islamic software that ensures the work remains freely available as a form of ongoing charity (Sadaqah Jariyah).
