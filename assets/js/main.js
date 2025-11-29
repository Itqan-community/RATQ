/**
 * Main Entry Point
 * Initializes the application
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Initialize Theme Manager
    if (window.ThemeManager) {
      window.ThemeManager.init();
    }
    
    // Initialize Language Manager
    if (window.LanguageManager) {
      window.LanguageManager.init();
    }
    
    // Initialize Navigation Manager
    if (window.NavigationManager) {
      await window.NavigationManager.init();
    }
    
    // Configure Markdown Renderer
    if (window.MarkdownRenderer) {
      window.MarkdownRenderer.configureMarked();
    }
    
    // Initialize Sidebar (async - will preload titles)
    if (window.SidebarComponent) {
      await window.SidebarComponent.init();
    }
    
    // Initialize Router
    if (window.Router) {
      window.Router.init();
    }
    
    // Set up theme toggle button
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle && window.ThemeManager) {
      themeToggle.addEventListener('click', () => {
        window.ThemeManager.toggleTheme();
      });
    }
    
    // Set up language toggle button
    const langToggle = document.getElementById('language-toggle');
    if (langToggle && window.LanguageManager) {
      langToggle.addEventListener('click', () => {
        window.LanguageManager.toggleLanguage();
      });
    }
    
    // Set up "Go to Home" button
    const goHomeBtn = document.getElementById('go-home-btn');
    if (goHomeBtn && window.Router) {
      goHomeBtn.addEventListener('click', () => {
        window.Router.navigate('', true);
      });
    }
    
    // Listen for language changes to update sidebar and reload content
    window.addEventListener('languagechange', async () => {
      // Update sidebar (async - will preload titles)
      if (window.SidebarComponent) {
        await window.SidebarComponent.updateForLanguage();
      }
      
      // Reload current page with new language
      if (window.Router) {
        window.Router.reload();
      }
    });
    
    // Handle markdown link clicks (delegated event listener)
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;
      
      const href = link.getAttribute('href');
      if (!href) return;
      
      // Skip external links and anchors
      if (href.startsWith('http://') || 
          href.startsWith('https://') || 
          href.startsWith('mailto:') ||
          href.startsWith('#')) {
        return;
      }
      
      // Handle internal routes (either marked as internal or starting with /)
      const isInternal = link.getAttribute('data-internal-link') === 'true';
      if (isInternal || (href.startsWith('/') && !href.startsWith('//'))) {
        e.preventDefault();
        if (window.Router) {
          // Remove leading slash and base path for navigation
          let route = href.replace(/^\/+/, '');
          // Remove query string and hash for route processing
          route = route.split('?')[0].split('#')[0];
          // Remove base path if present
          if (window.Router.basePath && window.Router.basePath !== '/') {
            const basePathWithoutSlash = window.Router.basePath.replace(/^\/+|\/+$/g, '');
            if (route.startsWith(basePathWithoutSlash + '/')) {
              route = route.substring(basePathWithoutSlash.length + 1);
            }
          }
          // Navigate - router will preserve language parameter
          window.Router.navigate(route);
        }
      }
    });
    
    console.log('RATQ application initialized');
  } catch (error) {
    console.error('Error initializing application:', error);
    
    // Show error to user
    const errorDiv = document.getElementById('content-error');
    const errorMessage = document.getElementById('error-message');
    if (errorDiv && errorMessage) {
      errorDiv.style.display = 'flex';
      errorMessage.textContent = 'Failed to initialize application. Please refresh the page.';
    }
  }
});

