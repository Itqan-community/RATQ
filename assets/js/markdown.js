/**
 * Markdown Rendering Module
 * Handles fetching and rendering markdown files
 */

const MarkdownRenderer = {
  cache: new Map(),
  
  /**
   * Configure marked options
   */
  configureMarked() {
    if (typeof marked !== 'undefined') {
      // Configure marked with options
      marked.setOptions({
        breaks: true,
        gfm: true,
        headerIds: true,
        mangle: false
      });
    }
  },
  
  /**
   * Fetch markdown file
   * @param {string} filePath - Path to markdown file
   * @returns {Promise<string>} Markdown content
   */
  async fetchMarkdown(filePath) {
    // Check cache first
    if (this.cache.has(filePath)) {
      return this.cache.get(filePath);
    }
    
    try {
      // Get base path from router
      const basePath = window.Router ? window.Router.basePath : '/';
      
      // Ensure path is absolute from root (starts with /)
      // This prevents relative path resolution issues
      let normalizedPath = filePath;
      if (!normalizedPath.startsWith('/')) {
        normalizedPath = '/' + normalizedPath;
      }
      
      // Encode file path for URLs (handles spaces and special characters)
      // Split path and encode each segment separately to preserve slashes
      const encodedPath = normalizedPath.split('/')
        .filter(segment => segment) // Remove empty segments
        .map(segment => encodeURIComponent(segment))
        .join('/');
      
      // Prepend base path (e.g., /RATQ/)
      const finalPath = basePath + encodedPath;
      
      const response = await fetch(finalPath);
      
      if (!response.ok) {
        throw new Error(`Failed to load ${filePath}: ${response.status} ${response.statusText}`);
      }
      
      const content = await response.text();
      
      // Cache the content
      this.cache.set(filePath, content);
      
      return content;
    } catch (error) {
      console.error('Error fetching markdown:', error);
      throw error;
    }
  },
  
  /**
   * Render markdown to HTML
   * @param {string} markdown - Markdown content
   * @returns {string} HTML content
   */
  renderMarkdown(markdown) {
    if (typeof marked === 'undefined') {
      console.error('marked library not loaded');
      return '<p>Error: Markdown parser not available</p>';
    }
    
    try {
      return marked.parse(markdown);
    } catch (error) {
      console.error('Error rendering markdown:', error);
      return '<p>Error rendering markdown content</p>';
    }
  },
  
  /**
   * Process markdown content (fix links, etc.)
   * @param {string} html - HTML content
   * @param {string} currentPath - Current file path
   * @returns {string} Processed HTML
   */
  processHTML(html, currentPath) {
    // Create a temporary container to manipulate HTML
    const temp = document.createElement('div');
    temp.innerHTML = html;
    
    // Fix relative links
    const links = temp.querySelectorAll('a[href]');
    links.forEach(link => {
      const href = link.getAttribute('href');
      
      // Skip external links and anchors
      if (!href || 
          href.startsWith('http://') || 
          href.startsWith('https://') || 
          href.startsWith('mailto:') ||
          href.startsWith('#')) {
        return;
      }
      
      // Handle relative markdown links
      if (href.endsWith('.md') || (!href.includes('#') && !href.startsWith('/') && !href.startsWith('http'))) {
        // Convert to route
        let route = href.replace(/\.md$/, '');
        
        // Handle relative paths
        if (route.startsWith('./')) {
          route = route.substring(2);
        }
        
        // Build full path
        if (currentPath && !route.startsWith('/')) {
          const currentDir = currentPath.substring(0, currentPath.lastIndexOf('/'));
          if (route.startsWith('../')) {
            // Handle parent directory
            const parts = currentDir.split('/').filter(p => p);
            const routeParts = route.split('/').filter(p => p);
            routeParts.forEach(part => {
              if (part === '..') {
                parts.pop();
              } else {
                parts.push(part);
              }
            });
            route = parts.join('/');
          } else if (!route.includes('/')) {
            // Same directory
            route = currentDir ? `${currentDir}/${route}` : route;
          }
        }
        
        // Ensure route starts with /
        if (!route.startsWith('/')) {
          route = `/${route}`;
        }
        
        // Update href to use route
        link.setAttribute('href', route);
        link.setAttribute('data-internal-link', 'true');
      }
    });
    
    return temp.innerHTML;
  },
  
  /**
   * Load and render markdown file
   * @param {string} filePath - Path to markdown file
   * @returns {Promise<string>} Rendered HTML
   */
  async loadAndRender(filePath) {
    try {
      // Show loading state
      this.showLoading();
      
      // Get localized file path
      const localizedPath = window.LanguageManager 
        ? window.LanguageManager.getLocalizedFile(filePath)
        : filePath;
      
      // Fetch markdown
      const markdown = await this.fetchMarkdown(localizedPath);
      
      // Render to HTML
      let html = this.renderMarkdown(markdown);
      
      // Process HTML (fix links, etc.)
      html = this.processHTML(html, localizedPath);
      
      // Hide loading, show content
      this.hideLoading();
      
      return html;
    } catch (error) {
      this.showError(error.message);
      throw error;
    }
  },
  
  /**
   * Show loading state
   */
  showLoading() {
    const loading = document.getElementById('content-loading');
    const content = document.getElementById('markdown-content');
    const error = document.getElementById('content-error');
    
    if (loading) loading.style.display = 'flex';
    if (content) content.style.display = 'none';
    if (error) error.style.display = 'none';
  },
  
  /**
   * Hide loading state
   */
  hideLoading() {
    const loading = document.getElementById('content-loading');
    if (loading) loading.style.display = 'none';
  },
  
  /**
   * Show error state
   * @param {string} message - Error message
   */
  showError(message) {
    const loading = document.getElementById('content-loading');
    const content = document.getElementById('markdown-content');
    const error = document.getElementById('content-error');
    const errorMessage = document.getElementById('error-message');
    
    if (loading) loading.style.display = 'none';
    if (content) content.style.display = 'none';
    if (error) error.style.display = 'flex';
    if (errorMessage) errorMessage.textContent = message;
  },
  
  /**
   * Display rendered content
   * @param {string} html - HTML content
   */
  displayContent(html) {
    const content = document.getElementById('markdown-content');
    const error = document.getElementById('content-error');
    const loading = document.getElementById('content-loading');
    
    if (content) {
      content.innerHTML = html;
      content.style.display = 'block';
    }
    if (error) error.style.display = 'none';
    if (loading) loading.style.display = 'none';
    
    // Scroll to top
    window.scrollTo(0, 0);
  },
  
  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }
};

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.MarkdownRenderer = MarkdownRenderer;
}

