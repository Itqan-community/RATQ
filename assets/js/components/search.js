/**
 * Search Component
 * UI component for search functionality
 */

const SearchComponent = {
  searchInput: null,
  resultsContainer: null,
  debounceTimer: null,
  selectedIndex: -1,
  currentResults: [],
  
  /**
   * Initialize search UI and event handlers
   */
  init() {
    this.createSearchInput();
    this.createResultsDropdown();
    this.attachEventListeners();
    this.updatePlaceholder();
    
    // Wait for search to be ready
    window.addEventListener('searchready', () => {
      if (this.searchInput) {
        this.searchInput.disabled = false;
        this.updatePlaceholder();
      }
    });
    
    // Update placeholder when language changes
    window.addEventListener('languagechange', () => {
      this.updatePlaceholder();
    });
  },
  
  /**
   * Update search input placeholder based on current language
   */
  updatePlaceholder() {
    if (!this.searchInput) return;
    
    const currentLang = window.LanguageManager 
      ? window.LanguageManager.getCurrentLanguage() 
      : 'en';
    
    this.searchInput.placeholder = currentLang === 'ar' 
      ? 'بحث...' 
      : 'Search...';
  },
  
  /**
   * Create search input element
   */
  createSearchInput() {
    const headerActions = document.querySelector('.header-actions');
    if (!headerActions) return;
    
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    
    this.searchInput = document.createElement('input');
    this.searchInput.type = 'text';
    this.searchInput.className = 'search-input';
    this.searchInput.disabled = true;
    this.searchInput.setAttribute('aria-label', 'Search documentation');
    this.searchInput.setAttribute('autocomplete', 'off');
    
    searchContainer.appendChild(this.searchInput);
    headerActions.insertBefore(searchContainer, headerActions.firstChild);
  },
  
  /**
   * Create results container
   */
  createResultsDropdown() {
    if (!this.searchInput) return;
    
    const searchContainer = this.searchInput.parentElement;
    if (!searchContainer) return;
    
    this.resultsContainer = document.createElement('div');
    this.resultsContainer.className = 'search-results';
    this.resultsContainer.setAttribute('role', 'listbox');
    this.resultsContainer.style.display = 'none';
    
    searchContainer.appendChild(this.resultsContainer);
  },
  
  /**
   * Attach event listeners
   */
  attachEventListeners() {
    if (!this.searchInput) return;
    
    // Input event with debouncing
    this.searchInput.addEventListener('input', (e) => {
      this.handleInput(e.target.value);
    });
    
    // Keyboard navigation
    this.searchInput.addEventListener('keydown', (e) => {
      this.handleKeyboard(e);
    });
    
    // Click outside to close
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-container')) {
        this.hide();
      }
    });
    
    // Focus management
    this.searchInput.addEventListener('focus', () => {
      if (this.currentResults.length > 0) {
        this.show();
      }
    });
  },
  
  /**
   * Handle search input with debouncing
   * @param {string} value - Input value
   */
  handleInput(value) {
    clearTimeout(this.debounceTimer);
    
    if (value.trim().length === 0) {
      this.hide();
      return;
    }
    
    this.debounceTimer = setTimeout(() => {
      this.performSearch(value);
    }, 300); // 300ms debounce
  },
  
  /**
   * Execute search and display results
   * @param {string} query - Search query
   */
  performSearch(query) {
    if (!window.SearchManager || !window.SearchManager.isReady) {
      return;
    }
    
    const results = window.SearchManager.search(query, { limit: 10 });
    this.currentResults = results;
    this.selectedIndex = -1;
    
    if (results.length > 0) {
      this.renderResults(results);
      this.show();
    } else {
      this.renderNoResults();
      this.show();
    }
  },
  
  /**
   * Render search results
   * @param {Array} results - Array of search results
   */
  renderResults(results) {
    if (!this.resultsContainer) return;
    
    this.resultsContainer.innerHTML = '';
    
    results.forEach((result, index) => {
      const item = document.createElement('div');
      item.className = 'search-result-item';
      item.setAttribute('role', 'option');
      item.setAttribute('data-index', index);
      
      if (index === this.selectedIndex) {
        item.classList.add('selected');
      }
      
      const title = document.createElement('div');
      title.className = 'search-result-title';
      title.innerHTML = this.highlightText(result.title, this.searchInput.value);
      
      const snippet = document.createElement('div');
      snippet.className = 'search-result-snippet';
      snippet.innerHTML = this.highlightText(result.snippet, this.searchInput.value);
      
      const path = document.createElement('div');
      path.className = 'search-result-path';
      path.textContent = result.path;
      
      item.appendChild(title);
      item.appendChild(snippet);
      item.appendChild(path);
      
      item.addEventListener('click', () => {
        this.navigateToResult(result);
      });
      
      item.addEventListener('mouseenter', () => {
        this.selectedIndex = index;
        this.updateSelection();
      });
      
      this.resultsContainer.appendChild(item);
    });
  },
  
  /**
   * Render no results message
   */
  renderNoResults() {
    if (!this.resultsContainer || !this.searchInput) return;
    
    this.resultsContainer.innerHTML = `
      <div class="search-result-empty">
        No results found for "${this.searchInput.value}"
      </div>
    `;
  },
  
  /**
   * Highlight search terms in text
   * @param {string} text - Text to highlight
   * @param {string} query - Search query
   * @returns {string} HTML with highlighted text
   */
  highlightText(text, query) {
    if (!query) return text;
    
    const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  },
  
  /**
   * Escape regex special characters
   * @param {string} str - String to escape
   * @returns {string} Escaped string
   */
  escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  },
  
  /**
   * Handle keyboard navigation
   * @param {KeyboardEvent} e - Keyboard event
   */
  handleKeyboard(e) {
    if (!this.resultsContainer || this.resultsContainer.style.display === 'none') {
      return;
    }
    
    const items = this.resultsContainer.querySelectorAll('.search-result-item');
    if (items.length === 0) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.selectedIndex = Math.min(this.selectedIndex + 1, items.length - 1);
        this.updateSelection();
        this.scrollToSelected();
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
        this.updateSelection();
        this.scrollToSelected();
        break;
        
      case 'Enter':
        e.preventDefault();
        if (this.selectedIndex >= 0 && this.currentResults[this.selectedIndex]) {
          this.navigateToResult(this.currentResults[this.selectedIndex]);
        }
        break;
        
      case 'Escape':
        e.preventDefault();
        this.hide();
        if (this.searchInput) {
          this.searchInput.blur();
        }
        break;
    }
  },
  
  /**
   * Update selected item styling
   */
  updateSelection() {
    if (!this.resultsContainer) return;
    
    const items = this.resultsContainer.querySelectorAll('.search-result-item');
    items.forEach((item, index) => {
      if (index === this.selectedIndex) {
        item.classList.add('selected');
      } else {
        item.classList.remove('selected');
      }
    });
  },
  
  /**
   * Scroll to selected item
   */
  scrollToSelected() {
    if (!this.resultsContainer) return;
    
    const items = this.resultsContainer.querySelectorAll('.search-result-item');
    if (this.selectedIndex >= 0 && items[this.selectedIndex]) {
      items[this.selectedIndex].scrollIntoView({ block: 'nearest' });
    }
  },
  
  /**
   * Navigate to selected result
   * @param {Object} result - Search result object
   */
  navigateToResult(result) {
    if (!window.Router) return;
    
    // Convert file path to route
    const route = window.Router.filePathToRoute(result.path);
    window.Router.navigate(route);
    
    // Hide results and clear input
    this.hide();
    if (this.searchInput) {
      this.searchInput.value = '';
      this.searchInput.blur();
    }
  },
  
  /**
   * Show results dropdown
   */
  show() {
    if (this.resultsContainer) {
      this.resultsContainer.style.display = 'block';
    }
  },
  
  /**
   * Hide results dropdown
   */
  hide() {
    if (this.resultsContainer) {
      this.resultsContainer.style.display = 'none';
    }
    this.selectedIndex = -1;
  }
};

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.SearchComponent = SearchComponent;
}

