/**
 * Search Component
 * UI component for search functionality
 */

const SearchComponent = {
  searchInput: null,
  searchResults: null,
  searchContainer: null,
  isOpen: false,
  selectedIndex: -1,
  currentResults: [],
  debounceTimer: null,
  
  /**
   * Initialize search component
   */
  init() {
    this.searchInput = document.getElementById('search-input');
    this.searchResults = document.getElementById('search-results');
    this.searchContainer = document.getElementById('search-container');
    
    if (!this.searchInput || !this.searchResults || !this.searchContainer) {
      console.error('Search elements not found');
      return;
    }
    
    // Update placeholder based on language
    this.updatePlaceholder();
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Listen for language changes
    window.addEventListener('languagechange', () => {
      this.updatePlaceholder();
    });
  },
  
  /**
   * Update search input placeholder based on language
   */
  updatePlaceholder() {
    if (!this.searchInput) return;
    
    const currentLang = window.LanguageManager 
      ? window.LanguageManager.getCurrentLanguage() 
      : 'en';
    
    this.searchInput.placeholder = currentLang === 'ar' ? 'بحث...' : 'Search...';
  },
  
  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Input event with debounce
    this.searchInput.addEventListener('input', (e) => {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.handleSearch(e.target.value);
      }, 200);
    });
    
    // Focus event
    this.searchInput.addEventListener('focus', () => {
      if (this.currentResults.length > 0) {
        this.showResults();
      }
    });
    
    // Blur event (with delay to allow clicks)
    this.searchInput.addEventListener('blur', () => {
      setTimeout(() => {
        this.hideResults();
      }, 200);
    });
    
    // Keyboard navigation
    this.searchInput.addEventListener('keydown', (e) => {
      this.handleKeyDown(e);
    });
    
    // Click outside to close
    document.addEventListener('click', (e) => {
      if (!this.searchContainer.contains(e.target)) {
        this.hideResults();
      }
    });
  },
  
  /**
   * Handle search input
   * @param {string} query - Search query
   */
  handleSearch(query) {
    if (!window.SearchManager || !window.SearchManager.ready()) {
      this.showMessage('Search index not ready');
      return;
    }
    
    if (!query || query.trim().length < 2) {
      this.currentResults = [];
      this.hideResults();
      return;
    }
    
    // Perform search
    const results = window.SearchManager.search(query, 15);
    this.currentResults = results;
    
    if (results.length === 0) {
      this.showMessage('No results found');
    } else {
      this.renderResults(results, query);
      this.showResults();
    }
  },
  
  /**
   * Render search results
   * @param {Array} results - Search results
   * @param {string} query - Search query
   */
  renderResults(results, query) {
    this.searchResults.innerHTML = '';
    this.selectedIndex = -1;
    
    results.forEach((result, index) => {
      const item = document.createElement('div');
      item.className = 'search-result-item';
      item.setAttribute('role', 'option');
      item.setAttribute('data-index', index);
      item.setAttribute('data-path', result.path);
      
      // Get excerpt from content
      const fullContent = this.getFullContent(result.path);
      const excerpt = window.SearchManager.getExcerpt(fullContent, query);
      
      // Get group display name
      const groupName = this.getGroupName(result.group);
      
      // Build HTML
      item.innerHTML = `
        <div class="search-result-title">${this.highlightMatches(result.title, query)}</div>
        <div class="search-result-path">${groupName}</div>
        ${excerpt ? `<div class="search-result-excerpt">${excerpt}</div>` : ''}
      `;
      
      // Click handler
      item.addEventListener('click', () => {
        this.navigateToResult(result);
      });
      
      // Mouse enter handler
      item.addEventListener('mouseenter', () => {
        this.selectedIndex = index;
        this.updateSelection();
      });
      
      this.searchResults.appendChild(item);
    });
  },
  
  /**
   * Get full content for a file path
   * @param {string} filePath - File path
   * @returns {string} Full content
   */
  getFullContent(filePath) {
    if (!window.SearchManager) {
      return '';
    }
    
    const doc = window.SearchManager.getDocument(filePath);
    return doc ? doc.content : '';
  },
  
  /**
   * Get group display name
   * @param {string} group - Group identifier
   * @returns {string} Display name
   */
  getGroupName(group) {
    const groupNames = {
      'root': 'Main',
      'apps': 'Apps',
      'technologies': 'Technologies'
    };
    return groupNames[group] || group;
  },
  
  /**
   * Highlight matches in text
   * @param {string} text - Text to highlight
   * @param {string} query - Search query
   * @returns {string} Text with highlighted matches
   */
  highlightMatches(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  },
  
  /**
   * Show search results
   */
  showResults() {
    if (this.currentResults.length > 0) {
      this.searchResults.style.display = 'block';
      this.isOpen = true;
      this.searchContainer.classList.add('search-active');
    }
  },
  
  /**
   * Hide search results
   */
  hideResults() {
    this.searchResults.style.display = 'none';
    this.isOpen = false;
    this.selectedIndex = -1;
    this.searchContainer.classList.remove('search-active');
  },
  
  /**
   * Show message in results
   * @param {string} message - Message to show
   */
  showMessage(message) {
    this.searchResults.innerHTML = `<div class="search-result-message">${message}</div>`;
    this.searchResults.style.display = 'block';
    this.isOpen = true;
    this.searchContainer.classList.add('search-active');
  },
  
  /**
   * Handle keyboard navigation
   * @param {KeyboardEvent} e - Keyboard event
   */
  handleKeyDown(e) {
    if (!this.isOpen || this.currentResults.length === 0) {
      return;
    }
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.selectedIndex = Math.min(this.selectedIndex + 1, this.currentResults.length - 1);
        this.updateSelection();
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
        this.updateSelection();
        break;
        
      case 'Enter':
        e.preventDefault();
        if (this.selectedIndex >= 0 && this.selectedIndex < this.currentResults.length) {
          this.navigateToResult(this.currentResults[this.selectedIndex]);
        } else if (this.currentResults.length > 0) {
          // Navigate to first result if nothing selected
          this.navigateToResult(this.currentResults[0]);
        }
        break;
        
      case 'Escape':
        e.preventDefault();
        this.hideResults();
        this.searchInput.blur();
        break;
    }
  },
  
  /**
   * Update selection highlight
   */
  updateSelection() {
    const items = this.searchResults.querySelectorAll('.search-result-item');
    items.forEach((item, index) => {
      if (index === this.selectedIndex) {
        item.classList.add('selected');
        // Scroll into view if needed
        item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      } else {
        item.classList.remove('selected');
      }
    });
  },
  
  /**
   * Navigate to search result
   * @param {Object} result - Search result
   */
  navigateToResult(result) {
    if (!window.Router) {
      console.error('Router not available');
      return;
    }
    
    // Convert file path to route
    const route = window.Router.filePathToRoute(result.path);
    
    // Navigate
    window.Router.navigate(route);
    
    // Close search
    this.hideResults();
    this.searchInput.value = '';
    this.searchInput.blur();
  },
  
  /**
   * Focus search input
   */
  focus() {
    if (this.searchInput) {
      this.searchInput.focus();
    }
  },
  
  /**
   * Open search (for keyboard shortcut)
   */
  open() {
    this.focus();
    // If there's a query, show results
    if (this.searchInput.value.trim().length >= 2) {
      this.handleSearch(this.searchInput.value);
    }
  }
};

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.SearchComponent = SearchComponent;
}

