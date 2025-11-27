/**
 * Router Module
 * Handles History API routing
 */

const Router = {
  currentPath: '',
  routes: new Map(),
  
  /**
   * Initialize router
   */
  init() {
    // Handle initial load
    this.handleRoute();
    
    // Listen for popstate (back/forward buttons)
    window.addEventListener('popstate', () => {
      this.handleRoute();
    });
    
    // Listen for language changes to reload current page
    window.addEventListener('languagechange', () => {
      this.reload();
    });
  },
  
  /**
   * Get current path from URL
   * @returns {string} Current path
   */
  getCurrentPath() {
    let path = window.location.pathname;
    
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
    const encodedRoute = route 
      ? '/' + route.split('/').map(segment => encodeURIComponent(segment)).join('/')
      : '/';
    
    if (replace) {
      window.history.replaceState({ route }, '', encodedRoute);
    } else {
      window.history.pushState({ route }, '', encodedRoute);
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
      const html = await window.MarkdownRenderer.loadAndRender(baseFilePath);
      window.MarkdownRenderer.displayContent(html);
      
      // Update page title
      const title = window.NavigationManager.getFileTitle(baseFilePath);
      document.title = title ? `${title} - RATQ` : 'RATQ';
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

