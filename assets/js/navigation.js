/**
 * Navigation Module
 * Handles file discovery and sidebar generation
 */

const NavigationManager = {
  fileTree: [],
  allFiles: [],
  
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
    this.fileManifest.forEach(file => {
      if (file.hasAR) {
        const arPath = file.path.replace(/\.md$/, ' - AR.md');
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
    const file = this.findFile(path);
    if (file) {
      return file.title;
    }
    // Fallback: extract title from filename
    const baseName = path.split('/').pop().replace(/\.md$/, '').replace(/ - AR$/, '');
    return baseName;
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

