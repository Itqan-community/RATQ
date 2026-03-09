/**
 * Language Switching Module
 * Handles language switching between English and Arabic versions of files.
 *
 * New convention (directory-based):
 *   docs/en/file.md  <->  docs/ar/file.md
 *   content/cat/file.md  <->  content/cat/ar/file.md
 */

const LanguageManager = {
  currentLanguage: 'en',

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

  // ── path helpers ──────────────────────────────────────────────

  /**
   * Check whether a path points to an Arabic file.
   * @param {string} path
   * @returns {boolean}
   */
  isArPath(path) {
    if (path.startsWith('docs/ar/')) return true;
    // content/<category>/ar/<file>
    if (path.startsWith('content/') && /\/ar\//.test(path)) return true;
    return false;
  },

  /**
   * Derive the Arabic path from an English base path.
   * docs/en/X.md  →  docs/ar/X.md
   * content/cat/X.md  →  content/cat/ar/X.md
   * @param {string} enPath
   * @returns {string|null}
   */
  toArPath(enPath) {
    if (enPath.startsWith('docs/en/')) {
      return enPath.replace('docs/en/', 'docs/ar/');
    }
    // content/<category>/file.md  →  content/<category>/ar/file.md
    const lastSlash = enPath.lastIndexOf('/');
    if (lastSlash >= 0) {
      return enPath.substring(0, lastSlash + 1) + 'ar/' + enPath.substring(lastSlash + 1);
    }
    return null;
  },

  /**
   * Derive the English base path from an Arabic path.
   * docs/ar/X.md  →  docs/en/X.md
   * content/cat/ar/X.md  →  content/cat/X.md
   * @param {string} arPath
   * @returns {string}
   */
  toEnPath(arPath) {
    if (arPath.startsWith('docs/ar/')) {
      return arPath.replace('docs/ar/', 'docs/en/');
    }
    // content/cat/ar/file.md  →  content/cat/file.md
    return arPath.replace('/ar/', '/');
  },

  // ── public API (kept compatible) ──────────────────────────────

  /**
   * Build language mapping from file list (kept for compatibility).
   * In the new structure this is a no-op; mapping is derived from paths.
   * @param {Array} _files
   */
  buildLanguageMap(_files) {
    // No longer needed – paths are computed, not mapped.
  },

  /**
   * Get the appropriate file path for current language.
   * @param {string} filePath - Base (EN) file path
   * @returns {string} File path in current language
   */
  getLocalizedFile(filePath) {
    // Normalise to EN base first
    const basePath = this.getBaseFile(filePath);

    if (this.currentLanguage === 'ar') {
      if (this.hasArabicVersion(basePath)) {
        const arPath = this.toArPath(basePath);
        if (arPath) return arPath;
      }
      // Fallback to EN version when no AR exists
      return basePath;
    }
    return basePath;
  },

  /**
   * Get base (English) file path.
   * @param {string} filePath
   * @returns {string}
   */
  getBaseFile(filePath) {
    if (this.isArPath(filePath)) {
      return this.toEnPath(filePath);
    }
    return filePath;
  },

  /**
   * Check if file has Arabic version (via manifest hasAR flag).
   * @param {string} filePath - Base (EN) file path
   * @returns {boolean}
   */
  hasArabicVersion(filePath) {
    if (window.NavigationManager) {
      const enPath = this.getBaseFile(filePath);
      const file = window.NavigationManager.findFile(enPath);
      return !!(file && file.hasAR);
    }
    return false;
  },

  // ── language toggle / set ─────────────────────────────────────

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
      headerTitle.firstElementChild.textContent = this.currentLanguage === 'ar' ? 'رتق' : 'RATQ';
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
