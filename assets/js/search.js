/**
 * Search Manager Module
 * Handles search index building, caching, and searching
 */

const SearchManager = {
  index: null,
  searchData: [],
  isReady: false,
  cacheKey: 'ratq_search_index',
  cacheMetaKey: 'ratq_search_meta',

  /**
   * Normalize Arabic characters for better search matching
   * Makes variations interchangeable: ءأآإ, ؤ و, ي ى, ة ه
   * @param {string} text - Text to normalize
   * @returns {string} Normalized text
   */
  normalizeArabic(text) {
    if (!text || typeof text !== 'string') return text;

    return text
      // Normalize ءأآإ to أ (all variations become أ)
      .replace(/[ءأآإ]/g, 'أ')
      // Normalize ؤ و to و (all variations become و)
      .replace(/[ؤو]/g, 'و')
      // Normalize ي ى to ي (all variations become ي)
      .replace(/[يى]/g, 'ي')
      // Normalize ة ه to ه (all variations become ه)
      .replace(/[ةه]/g, 'ه');
  },

  /**
   * Create FlexSearch encoder that normalizes Arabic characters
   * @returns {Function} Encoder function for FlexSearch
   */
  createArabicEncoder() {
    const self = this;
    return function (str) {
      // Normalize Arabic characters first
      const normalized = self.normalizeArabic(str);
      // Then apply lowercase for case-insensitive search
      return normalized.toLowerCase();
    };
  },

  /**
   * Initialize search index with cache validation
   */
  async init() {
    try {
      // 1. Try to load pre-built index
      const loaded = await this.loadPrebuiltIndex();

      if (loaded) {
        this.isReady = true;
        window.dispatchEvent(new CustomEvent('searchready'));
        return;
      }

      console.warn('Pre-built index not found or invalid, falling back to runtime indexing');

      // Fallback: Runtime indexing
      // 1. Get file list from NavigationManager
      const allFiles = window.NavigationManager.getAllFiles();
      // ... (rest of old logic fallback if needed, or we can just fail gracefully)
      // For now, let's keep the fallback but simplified or just rely on the new method 
      // as the primary.

      if (!allFiles || allFiles.length === 0) {
        console.warn('No files available for indexing');
        return;
      }

      // 2. Check file modification dates
      const fileVersions = await this.checkFileDates(allFiles);

      // 3. Validate cache (client-side cache)
      const cacheValid = await this.validateCache(fileVersions);

      if (cacheValid) {
        // Load from cache
        const loaded = this.loadCachedIndex();
        if (loaded) {
          this.isReady = true;
          window.dispatchEvent(new CustomEvent('searchready'));
          return;
        }
      }

      // 4. Build new index (runtime)
      await this.buildIndex(allFiles, fileVersions);
      this.isReady = true;
      window.dispatchEvent(new CustomEvent('searchready'));
    } catch (error) {
      console.error('Error initializing search:', error);
      this.isReady = false;
    }
  },

  /**
   * Load and index the pre-built search-index.json
   * @returns {Promise<boolean>} True if successful
   */
  async loadPrebuiltIndex() {
    try {
      const basePath = window.Router ? window.Router.basePath : '/';
      // Adjust path if needed (e.g. if site is in subdirectory)
      const response = await fetch(`${basePath}search-index.json`);
      if (!response.ok) return false;

      this.searchData = await response.json();

      if (!this.searchData || !Array.isArray(this.searchData)) return false;

      // Initialize FlexSearch
      if (typeof FlexSearch === 'undefined') {
        console.error('FlexSearch library not loaded');
        return false;
      }

      const arabicEncoder = this.createArabicEncoder();

      this.index = new FlexSearch.Index({
        preset: 'performance',
        tokenize: 'forward',
        cache: 100,
        encode: arabicEncoder,
        context: {
          depth: 2,
          resolution: 9
        }
      });

      // Add documents to index
      this.searchData.forEach((doc, idx) => {
        const searchableText = `${doc.title} ${doc.content}`;
        this.index.add(idx, searchableText);
      });

      return true;
    } catch (e) {
      console.warn('Failed to load prebuilt index:', e);
      return false;
    }
  },

  /**
   * Check Last-Modified headers via HEAD requests
   * @param {Array<string>} filePaths - Array of file paths
   * @returns {Promise<Object>} Map of filePath -> timestamp
   */
  async checkFileDates(filePaths) {
    const basePath = window.Router ? window.Router.basePath : '/';
    const fileVersions = {};

    // Make HEAD requests in parallel
    const requests = filePaths.map(async (filePath) => {
      try {
        let normalizedPath = filePath;
        if (!normalizedPath.startsWith('/')) {
          normalizedPath = '/' + normalizedPath;
        }

        const encodedPath = normalizedPath.split('/')
          .filter(segment => segment)
          .map(segment => encodeURIComponent(segment))
          .join('/');

        const finalPath = basePath + encodedPath;
        const response = await fetch(finalPath, { method: 'HEAD' });

        if (response.ok) {
          const lastModified = response.headers.get('Last-Modified');
          fileVersions[filePath] = lastModified ? new Date(lastModified).getTime() : Date.now();
        } else {
          fileVersions[filePath] = Date.now(); // Fallback to current time
        }
      } catch (error) {
        console.warn(`Failed to check date for ${filePath}:`, error);
        fileVersions[filePath] = Date.now(); // Fallback
      }
    });

    await Promise.all(requests);
    return fileVersions;
  },

  /**
   * Validate cached index against current file dates
   * @param {Object} fileVersions - Map of filePath -> timestamp
   * @returns {Promise<boolean>} True if cache is valid
   */
  async validateCache(fileVersions) {
    try {
      const cacheMeta = localStorage.getItem(this.cacheMetaKey);
      if (!cacheMeta) return false;

      const meta = JSON.parse(cacheMeta);
      if (!meta.timestamp || !meta.fileVersions) return false;

      // Check if any file is newer than cache
      for (const [filePath, currentDate] of Object.entries(fileVersions)) {
        const cachedDate = meta.fileVersions[filePath];
        if (!cachedDate || currentDate > cachedDate) {
          return false; // Cache is stale
        }
      }

      // Check if any cached file is missing from current list
      for (const filePath of Object.keys(meta.fileVersions)) {
        if (!fileVersions.hasOwnProperty(filePath)) {
          return false; // File was removed
        }
      }

      return true; // Cache is valid
    } catch (error) {
      console.warn('Error validating cache:', error);
      return false;
    }
  },

  /**
   * Fetch all markdown files and build FlexSearch index
   * @param {Array<string>} filePaths - Array of file paths
   * @param {Object} fileVersions - Map of filePath -> timestamp
   */
  async buildIndex(filePaths, fileVersions) {
    const basePath = window.Router ? window.Router.basePath : '/';
    const searchData = [];

    // Fetch all files in parallel
    const fetchPromises = filePaths.map(async (filePath) => {
      try {
        let normalizedPath = filePath;
        if (!normalizedPath.startsWith('/')) {
          normalizedPath = '/' + normalizedPath;
        }

        const encodedPath = normalizedPath.split('/')
          .filter(segment => segment)
          .map(segment => encodeURIComponent(segment))
          .join('/');

        const finalPath = basePath + encodedPath;
        const response = await fetch(finalPath);

        if (!response.ok) {
          console.warn(`Failed to fetch ${filePath}`);
          return null;
        }

        const content = await response.text();
        const parsed = this.parseMarkdownForSearch(filePath, content);

        if (parsed) {
          // Determine language from file path
          const isAR = window.LanguageManager
            ? window.LanguageManager.isArPath(filePath)
            : (filePath.includes('/ar/'));
          const language = isAR ? 'ar' : 'en';

          // Get group from NavigationManager
          const fileInfo = window.NavigationManager.findFile(filePath);
          const group = fileInfo ? fileInfo.group : 'unknown';

          return {
            id: filePath,
            path: filePath,
            title: parsed.title,
            content: parsed.content,
            language: language,
            group: group
          };
        }
      } catch (error) {
        console.warn(`Error processing ${filePath}:`, error);
      }
      return null;
    });

    const results = await Promise.all(fetchPromises);
    this.searchData = results.filter(item => item !== null);

    // Initialize FlexSearch index with Arabic normalization encoder
    if (typeof FlexSearch === 'undefined') {
      console.error('FlexSearch library not loaded');
      return;
    }

    // Create encoder that normalizes Arabic characters
    const arabicEncoder = this.createArabicEncoder();

    this.index = new FlexSearch.Index({
      preset: 'performance',
      tokenize: 'forward',
      cache: 100,
      encode: arabicEncoder, // Use custom encoder for Arabic normalization
      context: {
        depth: 2,
        resolution: 9
      }
    });

    // Add documents to index (normalization happens via encoder)
    this.searchData.forEach((doc, idx) => {
      // Encoder will normalize Arabic characters automatically
      const searchableText = `${doc.title} ${doc.content}`;
      this.index.add(idx, searchableText);
    });

    // Cache the index
    this.cacheIndex(fileVersions);
  },

  /**
   * Extract title and content from markdown
   * @param {string} filePath - File path
   * @param {string} markdown - Markdown content
   * @returns {Object|null} Object with title and content, or null
   */
  parseMarkdownForSearch(filePath, markdown) {
    // Reuse MarkdownRenderer's front matter parsing
    if (window.MarkdownRenderer) {
      const { metadata, content } = window.MarkdownRenderer.parseFrontMatter(markdown);
      const title = metadata.title ||
        window.MarkdownRenderer.extractTitleFromH1(markdown) ||
        window.MarkdownRenderer.getTitleFromFilename(filePath);

      // Remove front matter and clean content
      const cleanContent = content.trim();

      return { title, content: cleanContent };
    }

    // Fallback parsing
    const h1Match = markdown.match(/^#\s+(.+)$/m);
    const title = h1Match ? h1Match[1].trim() :
      filePath.split('/').pop().replace(/\.md$/, '').replace(/\s*-\s*AR$/, '');

    // Remove front matter if present
    let content = markdown.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, '');
    content = content.replace(/^#\s+.*$/m, ''); // Remove H1
    content = content.trim();

    return { title, content };
  },

  /**
   * Store index in localStorage
   * @param {Object} fileVersions - Map of filePath -> timestamp
   */
  cacheIndex(fileVersions) {
    try {
      // Serialize FlexSearch index
      const indexExport = this.index.export();

      const cacheData = {
        index: indexExport,
        data: this.searchData,
        timestamp: Date.now()
      };

      const cacheMeta = {
        timestamp: Date.now(),
        fileVersions: fileVersions
      };

      localStorage.setItem(this.cacheKey, JSON.stringify(cacheData));
      localStorage.setItem(this.cacheMetaKey, JSON.stringify(cacheMeta));
    } catch (error) {
      console.warn('Error caching index:', error);
      // localStorage might be full, try to clear old cache
      try {
        localStorage.removeItem(this.cacheKey);
        localStorage.removeItem(this.cacheMetaKey);
      } catch (e) {
        console.error('Failed to clear cache:', e);
      }
    }
  },

  /**
   * Load index from localStorage
   * @returns {boolean} True if loaded successfully
   */
  loadCachedIndex() {
    try {
      const cacheData = localStorage.getItem(this.cacheKey);
      if (!cacheData) return false;

      const parsed = JSON.parse(cacheData);
      this.searchData = parsed.data;

      // Reconstruct FlexSearch index with Arabic normalization encoder
      if (typeof FlexSearch === 'undefined') {
        console.error('FlexSearch library not loaded');
        return false;
      }

      // Create encoder that normalizes Arabic characters
      const arabicEncoder = this.createArabicEncoder();

      this.index = new FlexSearch.Index({
        preset: 'performance',
        tokenize: 'forward',
        cache: 100,
        encode: arabicEncoder, // Use custom encoder for Arabic normalization
        context: {
          depth: 2,
          resolution: 9
        }
      });

      this.index.import(parsed.index);
      return true;
    } catch (error) {
      console.warn('Error loading cached index:', error);
      return false;
    }
  },

  /**
   * Execute search with language filtering
   * @param {string} query - Search query
   * @param {Object} options - Search options
   * @returns {Array} Array of search results
   */
  search(query, options = {}) {
    if (!this.isReady || !this.index || !query || query.trim().length === 0) {
      return [];
    }

    const trimmedQuery = query.trim();
    // Query normalization happens automatically via FlexSearch encoder
    // No need to normalize manually - encoder handles it
    const currentLang = window.LanguageManager
      ? window.LanguageManager.getCurrentLanguage()
      : 'en';

    // Search using FlexSearch (encoder normalizes query automatically)
    const results = this.index.search(trimmedQuery, {
      limit: options.limit || 500,
      suggest: options.suggest || false
    });

    // Map results to full document data
    const mappedResults = results
      .map(idx => this.searchData[idx])
      .filter(doc => {
        // Filter by current language
        if (doc.language !== currentLang) return false;
        return true;
      })
      .map(doc => {
        // Normalize for relevance scoring (FlexSearch already matched, but we score for ranking)
        const normalizedTitle = this.normalizeArabic(doc.title);
        const normalizedContent = this.normalizeArabic(doc.content);
        const normalizedQuery = this.normalizeArabic(trimmedQuery);

        // Calculate relevance score (using normalized text for matching)
        const titleMatch = normalizedTitle.toLowerCase().includes(normalizedQuery.toLowerCase());
        const contentMatch = normalizedContent.toLowerCase().includes(normalizedQuery.toLowerCase());
        const score = titleMatch ? 2 : (contentMatch ? 1 : 0);

        // Generate snippet (use original content for display, normalized for matching)
        const snippet = this.getSnippet(doc.content, trimmedQuery, 150);

        return {
          path: doc.path,
          title: doc.title,
          snippet: snippet,
          group: doc.group,
          score: score
        };
      })
      .sort((a, b) => b.score - a.score) // Sort by relevance
      .slice(0, options.limit || 10); // Limit results

    return mappedResults;
  },

  /**
   * Generate result snippets with highlights
   * @param {string} content - Content to snippet
   * @param {string} query - Search query
   * @param {number} maxLength - Maximum snippet length
   * @returns {string} Snippet text
   */
  getSnippet(content, query, maxLength = 150) {
    // Normalize both content and query for matching
    const normalizedContent = this.normalizeArabic(content);
    const normalizedQuery = this.normalizeArabic(query);

    const queryLower = normalizedQuery.toLowerCase();
    const contentLower = normalizedContent.toLowerCase();
    const queryIndex = contentLower.indexOf(queryLower);

    if (queryIndex === -1) {
      // No match, return beginning of content
      return content.substring(0, maxLength).trim() + '...';
    }

    // Find snippet around match (use original content for display)
    const start = Math.max(0, queryIndex - maxLength / 2);
    const end = Math.min(content.length, queryIndex + query.length + maxLength / 2);

    let snippet = content.substring(start, end);
    if (start > 0) snippet = '...' + snippet;
    if (end < content.length) snippet = snippet + '...';

    return snippet.trim();
  }
};

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.SearchManager = SearchManager;
}

