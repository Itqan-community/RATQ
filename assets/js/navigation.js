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
   * Initialize navigation
   */
  init() {
    this.buildFileTree();
    this.allFiles = this.fileManifest.map(f => f.path);
    
    // Add AR versions to file list
    // First, add explicit hasAR files
    this.fileManifest.forEach(file => {
      if (file.hasAR) {
        const arPath = file.path.replace(/\.md$/, ' - AR.md');
        if (!this.allFiles.includes(arPath)) {
          this.allFiles.push(arPath);
        }
      }
    });
    
    // Also add any AR files that are explicitly in the manifest
    this.fileManifest.forEach(file => {
      if (file.path.includes(' - AR.md') || file.path.includes(' -AR.md')) {
        if (!this.allFiles.includes(file.path)) {
          this.allFiles.push(file.path);
        }
      }
    });
    
    // Auto-detect AR versions for all base files (not just those with hasAR flag)
    // This handles cases where AR files exist but aren't explicitly marked or listed
    this.fileManifest.forEach(file => {
      // Skip if already has hasAR flag (already processed above)
      if (file.hasAR) return;
      
      // Skip if this is already an AR file
      if (file.path.includes(' - AR.md') || file.path.includes(' -AR.md')) return;
      
      // Construct potential AR path
      const arPath = file.path.replace(/\.md$/, ' - AR.md');
      
      // Check if AR file exists in manifest (some AR files might be listed separately)
      const arFileInManifest = this.fileManifest.some(f => f.path === arPath);
      
      // Add to allFiles if found in manifest OR if we want to auto-detect
      // We'll add it and let the file system/fetch handle if it doesn't exist
      // This allows AR files to work even if not explicitly in manifest
      if (!this.allFiles.includes(arPath)) {
        // Add potential AR file - the language manager will handle mapping
        // If file doesn't exist, fetch will fail gracefully
        this.allFiles.push(arPath);
      }
    });
    
    // Build language map
    if (window.LanguageManager) {
      window.LanguageManager.buildLanguageMap(this.allFiles);
    }
  },
  
  /**
   * Build file tree structure
   */
  buildFileTree() {
    const groups = {
      root: [],
      apps: [],
      technologies: []
    };
    
    this.fileManifest.forEach(file => {
      if (groups[file.group]) {
        groups[file.group].push(file);
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
    return this.allFiles.includes(path);
  }
};

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.NavigationManager = NavigationManager;
}

