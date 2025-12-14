/**
 * Theme Manager
 * Handles dark mode switching
 */

const ThemeManager = {
  currentTheme: 'light',
  
  /**
   * Initialize theme manager
   */
  init() {
    // Load theme preference from localStorage or system preference
    const savedTheme = localStorage.getItem('ratq-theme');
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || savedTheme === 'light') {
      this.currentTheme = savedTheme;
    } else if (systemPrefersDark) {
      this.currentTheme = 'dark';
    }
    
    this.applyTheme();
    this.updateThemeUI();
    
    // Listen for system theme changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('ratq-theme')) {
          this.currentTheme = e.matches ? 'dark' : 'light';
          this.applyTheme();
          this.updateThemeUI();
        }
      });
    }
  },
  
  /**
   * Apply theme to document
   */
  applyTheme() {
    if (this.currentTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  },
  
  /**
   * Toggle theme
   */
  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('ratq-theme', this.currentTheme);
    this.applyTheme();
    this.updateThemeUI();
  },
  
  /**
   * Set theme
   * @param {string} theme - Theme name ('light' or 'dark')
   */
  setTheme(theme) {
    if (theme === 'light' || theme === 'dark') {
      this.currentTheme = theme;
      localStorage.setItem('ratq-theme', this.currentTheme);
      this.applyTheme();
      this.updateThemeUI();
    }
  },
  
  /**
   * Update theme UI elements
   */
  updateThemeUI() {
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
      themeIcon.textContent = this.currentTheme === 'dark' ? '☀️' : '🌙';
    }
  },
  
  /**
   * Get current theme
   * @returns {string} Current theme
   */
  getCurrentTheme() {
    return this.currentTheme;
  }
};

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.ThemeManager = ThemeManager;
}

