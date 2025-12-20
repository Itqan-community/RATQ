/**
 * Card Component
 * shadcn-style card component for vanilla JS
 */

const Card = {
  /**
   * Create a card element
   * @param {Object} options - Card options
   * @param {string} options.title - Card title
   * @param {string|HTMLElement} options.content - Card content (HTML string or element)
   * @param {string} options.className - Additional CSS classes
   * @returns {HTMLElement} Card element
   */
  create({
    title = '',
    content = '',
    className = ''
  }) {
    const card = document.createElement('div');
    card.className = `card ${className}`.trim();
    
    if (title) {
      const header = document.createElement('div');
      header.className = 'card-header';
      
      const titleEl = document.createElement('h3');
      titleEl.className = 'card-title';
      titleEl.textContent = title;
      
      header.appendChild(titleEl);
      card.appendChild(header);
    }
    
    if (content) {
      const contentEl = document.createElement('div');
      contentEl.className = 'card-content';
      
      if (typeof content === 'string') {
        contentEl.innerHTML = content;
      } else if (content instanceof HTMLElement) {
        contentEl.appendChild(content);
      }
      
      card.appendChild(contentEl);
    }
    
    return card;
  }
};

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.Card = Card;
}

