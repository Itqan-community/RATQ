/**
 * Language Switching Module
 * Handles language switching between English and Arabic versions of files
 */

const LanguageManager = {
  currentLanguage: 'en',
  languageMap: new Map(), // Maps base files to their AR versions
  
  /**
   * Initialize language manager
   */
  init() {
    // Check URL for language parameter first
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    
    if (urlLang === 'ar' || urlLang === 'en') {
      this.currentLanguage = urlLang;
      localStorage.setItem('ratq-language', this.currentLanguage);
    } else {
      // Load language preference from localStorage
      const savedLang = localStorage.getItem('ratq-language');
      if (savedLang === 'ar' || savedLang === 'en') {
        this.currentLanguage = savedLang;
      }
    }
    
    // Update UI
    this.updateLanguageUI();
  },
  
  /**
   * Build language mapping from file list
   * @param {Array} files - Array of file paths
   */
  buildLanguageMap(files) {
    this.languageMap.clear();
    
    files.forEach(file => {
      // Check if file has -AR suffix
      if (file.includes(' - AR.md') || file.includes(' -AR.md')) {
        // Extract base filename
        const baseFile = file.replace(/ - AR\.md$/, '.md').replace(/ -AR\.md$/, '.md');
        // Map base file to AR version
        this.languageMap.set(baseFile, file);
        // Also map AR version to itself
        this.languageMap.set(file, file);
      } else {
        // Map base file to itself
        this.languageMap.set(file, file);
        // Check if AR version exists
        const arVersion = file.replace(/\.md$/, ' - AR.md');
        if (files.includes(arVersion)) {
          this.languageMap.set(arVersion, arVersion);
        }
      }
    });
  },
  
  /**
   * Get the appropriate file path for current language
   * @param {string} filePath - Base file path
   * @returns {string} File path in current language
   */
  getLocalizedFile(filePath) {
    if (this.currentLanguage === 'ar') {
      // Get base file path (remove AR suffix if already present)
      const baseFile = this.getBaseFile(filePath);
      
      // Check if language map has an AR version for this base file
      if (this.languageMap.has(baseFile)) {
        const mappedFile = this.languageMap.get(baseFile);
        // If mapped file is an AR version, return it
        if (mappedFile.includes(' - AR.md') || mappedFile.includes(' -AR.md')) {
          return mappedFile;
        }
      }
      
      // Try constructing AR version and check if it exists in map
      const arVersion = baseFile.replace(/\.md$/, ' - AR.md');
      if (this.languageMap.has(arVersion)) {
        return arVersion;
      }
      
      // Fallback to base file if AR doesn't exist
      return baseFile;
    } else {
      // For English, remove -AR suffix if present
      return filePath.replace(/ - AR\.md$/, '.md').replace(/ -AR\.md$/, '.md');
    }
  },
  
  /**
   * Get base file path (without language suffix)
   * @param {string} filePath - File path with possible language suffix
   * @returns {string} Base file path
   */
  getBaseFile(filePath) {
    return filePath.replace(/ - AR\.md$/, '.md').replace(/ -AR\.md$/, '.md');
  },
  
  /**
   * Check if file has Arabic version
   * @param {string} filePath - Base file path
   * @returns {boolean} True if AR version exists
   */
  hasArabicVersion(filePath) {
    const arVersion = filePath.replace(/\.md$/, ' - AR.md');
    return this.languageMap.has(arVersion);
  },
  
  /**
   * Toggle language
   */
  toggleLanguage() {
    this.currentLanguage = this.currentLanguage === 'en' ? 'ar' : 'en';
    localStorage.setItem('ratq-language', this.currentLanguage);
    this.updateLanguageUI();
    
    // Update URL with language parameter
    this.updateURL();
    
    // Dispatch language change event
    window.dispatchEvent(new CustomEvent('languagechange', {
      detail: { language: this.currentLanguage }
    }));
  },
  
  /**
   * Set language
   * @param {string} lang - Language code ('en' or 'ar')
   */
  setLanguage(lang) {
    if (lang === 'en' || lang === 'ar') {
      this.currentLanguage = lang;
      localStorage.setItem('ratq-language', this.currentLanguage);
      this.updateLanguageUI();
      
      // Update URL with language parameter
      this.updateURL();
      
      window.dispatchEvent(new CustomEvent('languagechange', {
        detail: { language: this.currentLanguage }
      }));
    }
  },
  
  /**
   * Update URL with language parameter
   */
  updateURL() {
    if (!window.Router) return;
    
    // Get current route
    const currentRoute = window.Router.getCurrentRoute();
    
    // Build new URL with language parameter using router's navigate method
    // This ensures proper encoding and base path handling
    const basePath = window.Router.basePath || '/';
    let encodedRoute = currentRoute 
      ? currentRoute.split('/').map(segment => encodeURIComponent(segment)).join('/')
      : '';
    
    let fullPath = basePath + encodedRoute;
    
    // Add language parameter
    if (this.currentLanguage === 'ar') {
      const url = new URL(fullPath, window.location.origin);
      url.searchParams.set('lang', 'ar');
      fullPath = url.pathname + url.search;
    }
    
    // Update URL without reload (replace to avoid adding to history)
    window.history.replaceState({ route: currentRoute }, '', fullPath);
  },
  
  /**
   * Update language UI elements
   */
  updateLanguageUI() {
    const langToggle = document.getElementById('language-toggle');
    const langText = document.getElementById('language-text');
    const headerTitle = document.getElementById('header-title');
    
    if (langToggle && langText) {
      langText.textContent = this.currentLanguage === 'en' ? 'AR' : 'EN';
      langToggle.setAttribute('aria-label', `Switch to ${this.currentLanguage === 'en' ? 'Arabic' : 'English'}`);
    }
    
    // Update header title based on language
    if (headerTitle) {
      headerTitle.textContent = this.currentLanguage === 'ar' ? 'رتق' : 'RATQ';
    }
    
    // Update document direction for Arabic
    if (this.currentLanguage === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', 'en');
    }
  },
  
  /**
   * Get current language
   * @returns {string} Current language code
   */
  getCurrentLanguage() {
    return this.currentLanguage;
  }
};

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.LanguageManager = LanguageManager;
}

