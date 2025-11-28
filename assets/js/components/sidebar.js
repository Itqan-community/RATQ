/**
 * Sidebar Component
 * Navigation sidebar component
 */

const SidebarComponent = {
  sidebarNav: null,
  activePath: '',
  
  /**
   * Initialize sidebar
   */
  async init() {
    this.sidebarNav = document.getElementById('sidebar-nav');
    if (!this.sidebarNav) {
      console.error('Sidebar nav element not found');
      return;
    }
    
    // Preload Arabic titles if needed
    if (window.NavigationManager && window.LanguageManager && 
        window.LanguageManager.getCurrentLanguage() === 'ar') {
      await window.NavigationManager.preloadArabicTitles();
    }
    
    this.render();
  },
  
  /**
   * Render sidebar navigation
   */
  render() {
    if (!this.sidebarNav) return;
    
    const fileTree = window.NavigationManager.getFileTree();
    const currentLang = window.LanguageManager.getCurrentLanguage();
    
    // Clear existing content
    this.sidebarNav.innerHTML = '';
    
    // Render each group
    fileTree.forEach(group => {
      if (group.files.length === 0) return;
      
      // Group title
      const groupTitle = document.createElement('div');
      groupTitle.className = 'sidebar-group-title';
      groupTitle.textContent = group.name;
      this.sidebarNav.appendChild(groupTitle);
      
      // Group container
      const groupContainer = document.createElement('div');
      groupContainer.className = 'sidebar-group';
      
      // Render files in group
      group.files.forEach(file => {
        const fileItem = this.createSidebarItem(file, currentLang);
        groupContainer.appendChild(fileItem);
      });
      
      this.sidebarNav.appendChild(groupContainer);
    });
  },
  
  /**
   * Create sidebar item
   * @param {Object} file - File object
   * @param {string} currentLang - Current language
   * @returns {HTMLElement} Sidebar item element
   */
  createSidebarItem(file, currentLang) {
    const item = document.createElement('a');
    item.className = 'sidebar-item';
    item.href = '#';
    
    // Get localized file path
    const localizedPath = window.LanguageManager.getLocalizedFile(file.path);
    const route = window.Router.filePathToRoute(localizedPath);
    
    // Get title - use cached title from markdown if available (for Arabic), otherwise use fileManifest title
    let title = file.title;
    if (currentLang === 'ar' && window.NavigationManager) {
      const cachedTitle = window.NavigationManager.titleCache.get(localizedPath);
      if (cachedTitle) {
        title = cachedTitle;
      }
    }
    
    // Set item text
    item.textContent = title;
    
    // Set data attribute for file path
    item.setAttribute('data-file-path', file.path);
    item.setAttribute('data-route', route || '');
    
    // Handle click
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const route = item.getAttribute('data-route');
      window.Router.navigate(route);
    });
    
    // Check if this is the active item
    if (this.activePath === file.path) {
      item.classList.add('active');
    }
    
    return item;
  },
  
  /**
   * Set active sidebar item
   * @param {string} filePath - Active file path
   */
  setActive(filePath) {
    this.activePath = filePath;
    
    // Update all sidebar items
    const items = this.sidebarNav.querySelectorAll('.sidebar-item');
    items.forEach(item => {
      const itemPath = item.getAttribute('data-file-path');
      if (itemPath === filePath) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  },
  
  /**
   * Update sidebar for language change
   */
  async updateForLanguage() {
    // Preload Arabic titles if switching to Arabic
    if (window.NavigationManager && window.LanguageManager && 
        window.LanguageManager.getCurrentLanguage() === 'ar') {
      await window.NavigationManager.preloadArabicTitles();
    }
    
    this.render();
    // Re-set active item after render
    if (this.activePath) {
      this.setActive(this.activePath);
    }
  }
};

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.SidebarComponent = SidebarComponent;
}

