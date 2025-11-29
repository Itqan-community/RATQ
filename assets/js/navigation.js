/**
 * Navigation Module
 * Handles file discovery and sidebar generation
 */

const NavigationManager = {
  fileTree: [],
  allFiles: [],
  titleCache: new Map(), // Cache for titles from markdown files
  
  /**
   * File structure manifest
   * Since we can't dynamically list directories in static hosting,
   * we'll define the structure here
   */
  fileManifest: [
    // Root files
    { path: 'README.md', title: 'RATQ', group: 'root' },
    { path: 'Available Apps.md', title: 'Available Apps', group: 'root' },
    { path: 'Development Guidelines.md', title: 'Development Guidelines', group: 'root', hasAR: true },
    { path: 'Quran.Foundation.md', title: 'Quran Foundation', group: 'root', hasAR: true },
    
    // Apps directory
    { path: 'Apps/eQuran.md', title: 'eQuran', group: 'apps' },
    { path: 'Apps/Noor-Ul-Huda.md', title: 'Noor-Ul-Huda', group: 'apps' },
    { path: 'Apps/Quran Revision Companion.md', title: 'Quran Revision Companion', group: 'apps' },
    { path: 'Apps/quran.com.md', title: 'quran.com', group: 'apps' },
    
    // Technologies directory
    { path: 'Technologies/Technologies.md', title: 'Technologies', group: 'technologies' },
    { path: 'Technologies/alfanous.md', title: 'Alfanous', group: 'technologies' },
    { path: 'Technologies/Alfanous_Build_Process.md', title: 'Alfanous Build Process', group: 'technologies' },
    { path: 'Technologies/Kalimat.md', title: 'Kalimat', group: 'technologies' },
    { path: 'Technologies/othman.md', title: 'Othman', group: 'technologies' },
    { path: 'Technologies/quran-json.md', title: 'Quran JSON', group: 'technologies' },
    { path: 'Technologies/quran.com-api.md', title: 'Quran.com API', group: 'technologies' },
    { path: 'Technologies/QuranAnalysis.md', title: 'Quran Analysis', group: 'technologies' },
    { path: 'Technologies/quranic-search-v2.md', title: 'Quranic Search v2', group: 'technologies' },
    { path: 'Technologies/quranic.md', title: 'Quranic', group: 'technologies' },
    { path: 'Technologies/tanzil.md', title: 'Tanzil', group: 'technologies' }
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
    
    // Build allFiles array directly from manifest (manifest is source of truth)
    // All files (base and AR) are explicitly listed in manifest
    this.allFiles = this.fileManifest.map(f => f.path);
    
    // Build language map
    if (window.LanguageManager) {
      window.LanguageManager.buildLanguageMap(this.allFiles);
    }
  },
  
  /**
   * Build file tree structure
   * @param {string} currentLang - Current language ('en' or 'ar')
   */
  buildFileTree(currentLang = 'en') {
    const groups = {
      root: [],
      apps: [],
      technologies: []
    };
    
    // Track which base files have AR versions (from explicit AR files in manifest or hasAR flag)
    const baseFilesWithAR = new Set();
    
    // First pass: identify base files that have AR versions
    this.fileManifest.forEach(file => {
      const isARFile = file.path.includes(' - AR.md') || file.path.includes(' -AR.md');
      if (isARFile) {
        // Explicit AR file in manifest
        const baseFile = file.path.replace(/ - AR\.md$/, '.md').replace(/ -AR\.md$/, '.md');
        baseFilesWithAR.add(baseFile);
      } else if (file.hasAR === true) {
        // Base file with hasAR flag - check if AR file exists in manifest
        const arPath = file.path.replace(/\.md$/, ' - AR.md');
        const arFileExists = this.fileManifest.some(f => f.path === arPath);
        if (arFileExists) {
          baseFilesWithAR.add(file.path);
        }
      }
    });
    
    // Track which base files we've added to avoid duplicates
    const addedBaseFiles = new Set();
    
    // Second pass: add files based on language
    this.fileManifest.forEach(file => {
      const isARFile = file.path.includes(' - AR.md') || file.path.includes(' -AR.md');
      const baseFile = isARFile 
        ? file.path.replace(/ - AR\.md$/, '.md').replace(/ -AR\.md$/, '.md')
        : file.path;
      
      if (currentLang === 'en') {
        // In English mode: only show base files (not AR files)
        if (isARFile) {
          return;
        }
        // Add base file
        if (groups[file.group] && !addedBaseFiles.has(baseFile)) {
          groups[file.group].push(file);
          addedBaseFiles.add(baseFile);
        }
      } else {
        // In Arabic mode: prefer AR files, but show base files if no AR exists
        if (isARFile) {
          // Add AR file and mark base as added
          if (groups[file.group] && !addedBaseFiles.has(baseFile)) {
            groups[file.group].push(file);
            addedBaseFiles.add(baseFile);
          }
        } else {
          // Add base file only if we haven't added its AR version
          // Check both: if AR file was explicitly added, or if base file has hasAR flag
          const hasARVersion = baseFilesWithAR.has(baseFile);
          if (groups[file.group] && !addedBaseFiles.has(baseFile) && !hasARVersion) {
            groups[file.group].push(file);
            addedBaseFiles.add(baseFile);
          }
        }
      }
    });
    
    this.fileTree = [
      { name: 'Main', files: groups.root },
      { name: 'Apps', files: groups.apps },
      { name: 'Technologies', files: groups.technologies }
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
    
    const file = this.findFile(path);
    if (file) {
      return file.title;
    }
    // Fallback: extract title from filename
    const baseName = path.split('/').pop().replace(/\.md$/, '').replace(/ - AR$/, '');
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
    
    // Check if file has -AR suffix
    if (!filePath.includes(' - AR.md') && !filePath.includes(' -AR.md')) {
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
        const arPath = file.path.replace(/\.md$/, ' - AR.md');
        return this.fetchTitleFromFile(arPath);
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
    
    // For AR files: check if base file has hasAR flag (AR file might not be explicitly listed)
    if (path.includes(' - AR.md') || path.includes(' -AR.md')) {
      const baseFile = path.replace(/ - AR\.md$/, '.md').replace(/ -AR\.md$/, '.md');
      const baseFileEntry = this.fileManifest.find(f => f.path === baseFile);
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

