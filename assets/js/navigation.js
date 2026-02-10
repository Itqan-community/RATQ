/**
 * Navigation Module
 * Handles file discovery and sidebar generation
 */

const NavigationManager = {
  fileTree: [],
  allFiles: [],
  titleCache: new Map(), // Cache for titles from markdown files

  /**
   * File structure manifest (fallback – overridden by manifest.json)
   */
  fileManifest: [
    // Docs
    { path: 'docs/en/index.md', title: 'RATQ', group: 'docs', hasAR: true },
    { path: 'docs/en/available-apps.md', title: 'Available Apps', group: 'docs', hasAR: true },
    { path: 'docs/en/development-guidelines.md', title: 'Development Guidelines', group: 'docs', hasAR: true },
    { path: 'docs/en/quran-foundation.md', title: 'Quran Foundation', group: 'docs', hasAR: true },

    // Apps
    { path: 'content/apps/eQuran.md', title: 'eQuran', group: 'apps' },
    { path: 'content/apps/Noor-Ul-Huda.md', title: 'Noor-Ul-Huda', group: 'apps' },
    { path: 'content/apps/quran.com.md', title: 'quran.com', group: 'apps' },
    { path: 'content/apps/Quran-Revision-Companion.md', title: 'Quran Revision Companion', group: 'apps' },

    // Resources
    { path: 'content/resources/AQQAC.md', title: 'AQQAC', group: 'resources' },
    { path: 'content/resources/QQAC.md', title: 'QQAC', group: 'resources' },
    { path: 'content/resources/QuranEnc.md', title: 'QuranEnc', group: 'resources' },
    { path: 'content/resources/quran-json.md', title: 'Quran JSON', group: 'resources', hasAR: true },
    { path: 'content/resources/quran.com-api.md', title: 'Quran.com API', group: 'resources', hasAR: true },
    { path: 'content/resources/quranic-questions-resources.md', title: 'Quranic Questions Resources', group: 'resources' },
    { path: 'content/resources/tanzil.md', title: 'Tanzil', group: 'resources', hasAR: true },

    // Technologies
    { path: 'content/technologies/Technologies.md', title: 'Technologies', group: 'technologies' },
    { path: 'content/technologies/alfanous.md', title: 'Alfanous', group: 'technologies', hasAR: true },
    { path: 'content/technologies/Alfanous_Build_Process.md', title: 'Alfanous Build Process', group: 'technologies' },
    { path: 'content/technologies/Kalimat.md', title: 'Kalimat', group: 'technologies', hasAR: true },
    { path: 'content/technologies/QuranAnalysis.md', title: 'QuranAnalysis', group: 'technologies', hasAR: true },
    { path: 'content/technologies/othman.md', title: 'Othman', group: 'technologies', hasAR: true },
    { path: 'content/technologies/quranic.md', title: 'Quranic', group: 'technologies', hasAR: true },
    { path: 'content/technologies/quranic-search-v2.md', title: 'Quranic Search v2', group: 'technologies', hasAR: true },
    { path: 'content/technologies/search_engines_benchmarking.md', title: 'Search Engines Benchmarking', group: 'technologies' },
  ],

  /**
   * Load file manifest from generated JSON
   * @returns {Promise<boolean>} True if manifest loaded successfully, false otherwise
   */
  async loadManifest() {
    try {
      // Get base path - Router might not be initialized yet, so detect from location
      let basePath = '/';
      if (window.Router && window.Router.basePath) {
        basePath = window.Router.basePath;
      } else {
        // Auto-detect base path from current location
        const pathname = window.location.pathname;
        if (pathname.startsWith('/RATQ/')) {
          basePath = '/RATQ/';
        }
      }

      const response = await fetch(`${basePath}manifest.json`);
      if (response.ok) {
        const data = await response.json();
        if (data && Array.isArray(data.files)) {
          this.fileManifest = data.files;
          return true;
        }
      }
    } catch (error) {
      console.warn('Failed to load manifest.json, using fallback:', error);
    }
    return false;
  },

  /**
   * Initialize navigation
   */
  async init() {
    // Try to load generated manifest first, fallback to hardcoded manifest
    await this.loadManifest();

    // Build file tree with current language
    const currentLang = window.LanguageManager ? window.LanguageManager.getCurrentLanguage() : 'en';
    this.buildFileTree(currentLang);

    // Build allFiles array from manifest (all are EN base files)
    this.allFiles = this.fileManifest.map(f => f.path);

    // Build language map (no-op in new structure, kept for compatibility)
    if (window.LanguageManager) {
      window.LanguageManager.buildLanguageMap(this.allFiles);
    }
  },

  /**
   * Build file tree structure.
   * In the new structure the manifest only contains EN base files.
   * buildFileTree simply groups them – language resolution happens at render time.
   * @param {string} currentLang - Current language ('en' or 'ar')
   */
  buildFileTree(currentLang = 'en') {
    const groups = {
      docs: [],
      apps: [],
      resources: [],
      technologies: []
    };

    // All manifest entries are EN base files – just group them
    this.fileManifest.forEach(file => {
      if (groups[file.group]) {
        groups[file.group].push(file);
      }
    });

    const groupNames = {
      docs: currentLang === 'ar' ? 'الرئيسية' : 'Main',
      apps: currentLang === 'ar' ? 'التطبيقات' : 'Apps',
      resources: currentLang === 'ar' ? 'الموارد' : 'Resources',
      technologies: currentLang === 'ar' ? 'التقنيات' : 'Technologies'
    };

    this.fileTree = [
      { name: groupNames.docs, files: groups.docs },
      { name: groupNames.apps, files: groups.apps },
      { name: groupNames.resources, files: groups.resources },
      { name: groupNames.technologies, files: groups.technologies }
    ];
  },

  /**
   * Get file tree
   * @returns {Array} File tree structure
   */
  getFileTree() {
    return this.fileTree;
  },

  /**
   * Get all files
   * @returns {Array} Array of all file paths
   */
  getAllFiles() {
    return this.allFiles;
  },

  /**
   * Find file by path
   * @param {string} path - File path
   * @returns {Object|null} File object or null
   */
  findFile(path) {
    return this.fileManifest.find(f => f.path === path) || null;
  },

  /**
   * Get file title
   * @param {string} path - File path
   * @returns {string} File title
   */
  getFileTitle(path) {
    // Check cache first (for Arabic pages with YAML front matter)
    if (this.titleCache.has(path)) {
      return this.titleCache.get(path);
    }

    // Try direct match
    const file = this.findFile(path);
    if (file) {
      return file.title;
    }

    // If AR path, look up the EN base entry
    if (window.LanguageManager && window.LanguageManager.isArPath(path)) {
      const enPath = window.LanguageManager.toEnPath(path);
      const enFile = this.findFile(enPath);
      if (enFile) return enFile.title;
    }

    // Fallback: extract title from filename
    const baseName = path.split('/').pop().replace(/\.md$/, '');
    return baseName;
  },

  /**
   * Fetch title from markdown file (for Arabic pages with YAML front matter)
   * @param {string} filePath - File path
   * @returns {Promise<string|null>} Title or null if not found
   */
  async fetchTitleFromFile(filePath) {
    // Only fetch for Arabic pages
    if (!window.LanguageManager || window.LanguageManager.getCurrentLanguage() !== 'ar') {
      return null;
    }

    // Only fetch for AR files
    if (!window.LanguageManager.isArPath(filePath)) {
      return null;
    }

    // Check cache first
    if (this.titleCache.has(filePath)) {
      return this.titleCache.get(filePath);
    }

    try {
      // Get base path from router
      const basePath = window.Router ? window.Router.basePath : '/';

      // Ensure path is absolute
      let normalizedPath = filePath;
      if (!normalizedPath.startsWith('/')) {
        normalizedPath = '/' + normalizedPath;
      }

      // Encode path
      const encodedPath = normalizedPath.split('/')
        .filter(segment => segment)
        .map(segment => encodeURIComponent(segment))
        .join('/');

      const finalPath = basePath + encodedPath;

      // Fetch the file
      const response = await fetch(finalPath);

      if (!response.ok) {
        return null;
      }

      // Get text - we only need the first part for front matter
      const fullText = await response.text();

      // Extract first 2KB (enough for front matter)
      const text = fullText.substring(0, 2048);

      // Parse front matter using MarkdownRenderer's method
      if (window.MarkdownRenderer && window.MarkdownRenderer.parseFrontMatter) {
        const { metadata } = window.MarkdownRenderer.parseFrontMatter(text);
        if (metadata.title) {
          // Cache the title
          this.titleCache.set(filePath, metadata.title);
          return metadata.title;
        }
      }

      return null;
    } catch (error) {
      console.warn('Error fetching title from file:', filePath, error);
      return null;
    }
  },

  /**
   * Preload titles for all Arabic files
   * @returns {Promise<void>}
   */
  async preloadArabicTitles() {
    if (!window.LanguageManager || window.LanguageManager.getCurrentLanguage() !== 'ar') {
      return;
    }

    const promises = this.fileManifest
      .filter(file => file.hasAR)
      .map(file => {
        const arPath = window.LanguageManager.toArPath(file.path);
        if (arPath) return this.fetchTitleFromFile(arPath);
        return Promise.resolve(null);
      });

    await Promise.allSettled(promises);
  },

  /**
   * Check if file exists in manifest
   * @param {string} path - File path
   * @returns {boolean} True if file exists
   */
  fileExists(path) {
    // Check if file is explicitly in manifest
    if (this.fileManifest.some(f => f.path === path)) {
      return true;
    }

    // For AR files: check if EN base file has hasAR flag
    if (window.LanguageManager && window.LanguageManager.isArPath(path)) {
      const enPath = window.LanguageManager.toEnPath(path);
      const baseFileEntry = this.fileManifest.find(f => f.path === enPath);
      if (baseFileEntry && baseFileEntry.hasAR === true) {
        return true;
      }
    }

    return false;
  }
};

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.NavigationManager = NavigationManager;
}
