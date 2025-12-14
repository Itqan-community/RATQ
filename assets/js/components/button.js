/**
 * Button Component
 * shadcn-style button component for vanilla JS
 */

const Button = {
  /**
   * Create a button element
   * @param {Object} options - Button options
   * @param {string} options.text - Button text
   * @param {string} options.variant - Button variant (default, outline, ghost)
   * @param {string} options.className - Additional CSS classes
   * @param {Function} options.onClick - Click handler
   * @param {string} options.type - Button type (button, submit, reset)
   * @returns {HTMLElement} Button element
   */
  create({
    text = '',
    variant = 'default',
    className = '',
    onClick = null,
    type = 'button',
    ariaLabel = null
  }) {
    const button = document.createElement('button');
    button.type = type;
    button.className = `btn btn-${variant} ${className}`.trim();
    button.textContent = text;
    
    if (ariaLabel) {
      button.setAttribute('aria-label', ariaLabel);
    }
    
    if (onClick) {
      button.addEventListener('click', onClick);
    }
    
    return button;
  },
  
  /**
   * Update button variant
   * @param {HTMLElement} button - Button element
   * @param {string} variant - New variant
   */
  setVariant(button, variant) {
    // Remove existing variant classes
    button.className = button.className.replace(/btn-\w+/g, '');
    // Add new variant
    button.classList.add(`btn-${variant}`);
  }
};

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.Button = Button;
}

