/**
 * Router Module
 * Handles History API routing
 */

const Router = {
  currentPath: '',
  routes: new Map(),
  basePath: '/RATQ/', // GitHub Pages base path
  
  /**
   * Get base path from script tag or default
   */
  getBasePath() {
    // Try to get base path from script tag data attribute or meta tag
    const script = document.querySelector('script[data-base-path]');
    if (script) {
      const basePath = script.getAttribute('data-base-path');
      if (basePath) {
        this.basePath = basePath.endsWith('/') ? basePath : basePath + '/';
        return this.basePath;
      }
    }
    
    // Auto-detect base path from current location
    const pathname = window.location.pathname;
    if (pathname.startsWith('/RATQ/')) {
      this.basePath = '/RATQ/';
    } else {
      this.basePath = '/';
    }
    
    return this.basePath;
  },
  
  /**
   * Initialize router
   */
  init() {
    // Get base path
    this.getBasePath();
    
    // Check for redirect path from 404.html
    const redirectPath = sessionStorage.getItem('redirectPath');
    if (redirectPath) {
      sessionStorage.removeItem('redirectPath');
      // Remove base path from redirect path
      let route = redirectPath.replace(this.basePath, '').replace(/^\/+|\/+$/g, '');
      // Remove query string for route processing
      route = route.split('?')[0].split('#')[0];
      this.navigate(route, true);
      return;
    }
    
    // Handle initial load - preserve language parameter if present
    const currentPath = this.getCurrentPath();
    const urlParams = new URLSearchParams(window.location.search);
    const lang = urlParams.get('lang');
    
    // If language is in URL but not in path, update URL to include it
    if (lang === 'ar' && window.LanguageManager && window.LanguageManager.getCurrentLanguage() === 'ar') {
      // Ensure URL has language parameter
      this.navigate(currentPath, true);
    } else {
      // Handle initial load normally
      this.handleRoute();
    }
    
    // Listen for popstate (back/forward buttons)
    window.addEventListener('popstate', () => {
      // Update language from URL if changed
      if (window.LanguageManager) {
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang === 'ar' || urlLang === 'en') {
          window.LanguageManager.setLanguage(urlLang);
        }
      }
      this.handleRoute();
    });
    
    // Listen for language changes to reload current page
    window.addEventListener('languagechange', () => {
      this.reload();
    });
  },
  
  /**
   * Get current path from URL
   * @returns {string} Current path (without base path)
   */
  getCurrentPath() {
    let path = window.location.pathname;
    
    // Remove base path
    if (this.basePath !== '/' && path.startsWith(this.basePath)) {
      path = path.substring(this.basePath.length);
      // Ensure path starts with / for processing
      if (!path.startsWith('/')) {
        path = '/' + path;
      }
    }
    
    // Decode URL-encoded characters (handles %20 for spaces, etc.)
    try {
      path = decodeURIComponent(path);
    } catch (e) {
      // If decoding fails, use path as-is
      console.warn('Failed to decode path:', path);
    }
    
    // Remove leading/trailing slashes
    return path.replace(/^\/+|\/+$/g, '') || '';
  },
  
  /**
   * Convert route path to file path
   * @param {string} route - Route path
   * @returns {string} File path
   */
  routeToFilePath(route) {
    if (!route) {
      return 'README.md';
    }
    
    // Decode URL-encoded characters if present
    try {
      route = decodeURIComponent(route);
    } catch (e) {
      // If decoding fails, use route as-is
    }
    
    // Add .md extension if not present
    if (!route.endsWith('.md')) {
      route = `${route}.md`;
    }
    
    return route;
  },
  
  /**
   * Convert file path to route path
   * @param {string} filePath - File path
   * @returns {string} Route path
   */
  filePathToRoute(filePath) {
    // Remove .md extension
    let route = filePath.replace(/\.md$/, '');
    
    // Remove leading/trailing slashes
    route = route.replace(/^\/+|\/+$/g, '');
    
    return route || '';
  },
  
  /**
   * Navigate to a route
   * @param {string} route - Route path
   * @param {boolean} replace - Whether to replace history entry
   */
  navigate(route, replace = false) {
    // Normalize route - remove leading/trailing slashes
    route = route.replace(/^\/+|\/+$/g, '');
    
    // Encode each path segment separately to handle spaces and special chars
    // This preserves slashes while encoding spaces and other special characters
    let encodedRoute = route 
      ? route.split('/').map(segment => encodeURIComponent(segment)).join('/')
      : '';
    
    // Prepend base path
    let fullPath = this.basePath + encodedRoute;
    
    // Preserve language query parameter if present
    if (window.LanguageManager && window.LanguageManager.getCurrentLanguage() === 'ar') {
      const url = new URL(fullPath, window.location.origin);
      url.searchParams.set('lang', 'ar');
      fullPath = url.pathname + url.search;
    }
    
    if (replace) {
      window.history.replaceState({ route }, '', fullPath);
    } else {
      window.history.pushState({ route }, '', fullPath);
    }
    
    // Handle route
    this.handleRoute();
  },
  
  /**
   * Reload current route
   */
  reload() {
    this.handleRoute();
  },
  
  /**
   * Handle current route
   */
  async handleRoute() {
    const route = this.getCurrentPath();
    this.currentPath = route;
    
    // Convert route to file path
    const filePath = this.routeToFilePath(route);
    
    // Get base file path (for navigation)
    const baseFilePath = window.LanguageManager 
      ? window.LanguageManager.getBaseFile(filePath)
      : filePath;
    
    // Check if file exists
    if (!window.NavigationManager.fileExists(baseFilePath)) {
      // File doesn't exist, show 404 or redirect to home
      console.warn(`File not found: ${baseFilePath}`);
      if (route !== '') {
        // Redirect to home if not already there
        this.navigate('', true);
        return;
      }
    }
    
    // Update active sidebar item
    if (window.SidebarComponent) {
      window.SidebarComponent.setActive(baseFilePath);
    }
    
    // Load and render markdown
    try {
      const result = await window.MarkdownRenderer.loadAndRender(baseFilePath);
      window.MarkdownRenderer.displayContent(result.html);
      
      // Update page title - use extracted title if available, otherwise fallback
      let title = result.title;
      if (!title) {
        // Fallback to navigation manager title
        title = window.NavigationManager 
          ? window.NavigationManager.getFileTitle(baseFilePath)
          : null;
      }
      
      // Get site name based on language
      const siteName = window.LanguageManager && window.LanguageManager.getCurrentLanguage() === 'ar' 
        ? 'رتق' 
        : 'RATQ';
      
      document.title = title ? `${title} - ${siteName}` : siteName;
    } catch (error) {
      console.error('Error loading route:', error);
      // Error is already handled by MarkdownRenderer
    }
  },
  
  /**
   * Get current route
   * @returns {string} Current route
   */
  getCurrentRoute() {
    return this.currentPath;
  }
};

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.Router = Router;
}

