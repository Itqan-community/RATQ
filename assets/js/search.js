/**
 * Search Module
 * Handles search functionality using FlexSearch
 */

const SearchManager = {
  index: null,
  documents: [],
  isReady: false,
  
  /**
   * Initialize search index
   */
  async init() {
    if (typeof FlexSearch === 'undefined') {
      console.error('FlexSearch library not loaded');
      return;
    }
    
    try {
      // Get base path from router
      const basePath = window.Router ? window.Router.basePath : '/';
      
      // Load search index
      const response = await fetch(`${basePath}search-index.json`);
      if (!response.ok) {
        throw new Error(`Failed to load search index: ${response.status}`);
      }
      
      this.documents = await response.json();
      
      // Create FlexSearch index
      // Configure for both English and Arabic text
      this.index = new FlexSearch.Document({
        document: {
          id: 'path',
          index: [
            {
              field: 'title',
              // Custom tokenizer for Arabic support
              // Splits on word boundaries and includes Arabic character sequences
              tokenize: function(str) {
                if (!str) return [];
                const tokens = new Set();
                // Split on whitespace, punctuation, and Arabic word boundaries
                const words = str.split(/[\s\p{P}\u200C\u200D]+/u).filter(w => w.length > 0);
                words.forEach(word => {
                  if (word.length > 0) {
                    tokens.add(word);
                    // For Arabic words, add character n-grams for substring matching
                    if (/[\u0600-\u06FF]/.test(word) && word.length >= 2) {
                      // Add 2-4 character sequences (n-grams) for Arabic
                      for (let i = 0; i <= word.length - 2; i++) {
                        const maxLen = Math.min(4, word.length - i);
                        for (let len = 2; len <= maxLen; len++) {
                          tokens.add(word.substring(i, i + len));
                        }
                      }
                    }
                  }
                });
                return Array.from(tokens);
              }
            },
            {
              field: 'content',
              // Same tokenizer for content
              tokenize: function(str) {
                if (!str) return [];
                const tokens = new Set();
                const words = str.split(/[\s\p{P}\u200C\u200D]+/u).filter(w => w.length > 0);
                words.forEach(word => {
                  if (word.length > 0) {
                    tokens.add(word);
                    if (/[\u0600-\u06FF]/.test(word) && word.length >= 2) {
                      for (let i = 0; i <= word.length - 2; i++) {
                        const maxLen = Math.min(4, word.length - i);
                        for (let len = 2; len <= maxLen; len++) {
                          tokens.add(word.substring(i, i + len));
                        }
                      }
                    }
                  }
                });
                return Array.from(tokens);
              }
            }
          ],
          store: ['title', 'path', 'language', 'group']
        },
        // Enable bidirectional matching for Arabic RTL text
        context: {
          resolution: 9,
          depth: 2,
          bidirectional: true
        },
        cache: 100
      });
      
      // Add all documents to index
      this.documents.forEach(doc => {
        this.index.add(doc);
      });
      
      this.isReady = true;
      console.log('Search index initialized:', this.documents.length, 'documents');
    } catch (error) {
      console.error('Error initializing search:', error);
      this.isReady = false;
    }
  },
  
  /**
   * Search for documents
   * @param {string} query - Search query
   * @param {number} limit - Maximum number of results
   * @returns {Array} Search results
   */
  search(query, limit = 15) {
    if (!this.isReady || !query || query.trim().length === 0) {
      return [];
    }
    
    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 2) {
      return [];
    }
    
    try {
      // Check if query contains Arabic characters
      const hasArabic = /[\u0600-\u06FF]/.test(trimmedQuery);
      
      // Perform search with appropriate options
      const searchOptions = {
        limit: limit * 2, // Get more results to filter by language
        enrich: true
      };
      
      // For Arabic, we might need to search differently
      // FlexSearch should handle it, but we ensure proper matching
      const results = this.index.search(trimmedQuery, searchOptions);
      
      // Flatten and process results
      const processedResults = [];
      const seenPaths = new Set();
      
      // Get current language preference
      const currentLang = window.LanguageManager 
        ? window.LanguageManager.getCurrentLanguage() 
        : 'en';
      
      // Process results - prefer current language
      const currentLangResults = [];
      const otherLangResults = [];
      
      // FlexSearch Document API returns array of field results
      // Each field result has: { field: 'fieldName', result: [documents] }
      results.forEach(fieldResult => {
        if (fieldResult.field === 'title' || fieldResult.field === 'content') {
          // fieldResult.result is array of matching documents
          fieldResult.result.forEach(doc => {
            // With enrich: true, stored fields are directly on doc
            // doc.id is the document ID (path in our case)
            const path = doc.id || doc.path;
            if (!seenPaths.has(path)) {
              seenPaths.add(path);
              
              // Get stored fields (they should be directly on doc with enrich: true)
              const document = {
                path: path,
                title: doc.title || '',
                language: doc.language || 'en',
                group: doc.group || 'root',
                score: doc.score || 0
              };
              
              // Separate by language preference
              if (document.language === currentLang) {
                currentLangResults.push(document);
              } else {
                otherLangResults.push(document);
              }
            }
          });
        }
      });
      
      // Combine: current language first, then others
      processedResults.push(...currentLangResults);
      processedResults.push(...otherLangResults);
      
      // Limit results
      return processedResults.slice(0, limit);
    } catch (error) {
      console.error('Error performing search:', error);
      return [];
    }
  },
  
  /**
   * Get excerpt from content with highlighted matches
   * @param {string} content - Full content
   * @param {string} query - Search query
   * @param {number} maxLength - Maximum excerpt length
   * @returns {string} Excerpt with highlighted matches
   */
  getExcerpt(content, query, maxLength = 150) {
    if (!content) return '';
    
    const queryLower = query.toLowerCase();
    const contentLower = content.toLowerCase();
    
    // Find first occurrence
    const index = contentLower.indexOf(queryLower);
    
    if (index === -1) {
      // No match found, return beginning
      return content.substring(0, maxLength) + (content.length > maxLength ? '...' : '');
    }
    
    // Extract excerpt around match
    const start = Math.max(0, index - maxLength / 2);
    const end = Math.min(content.length, index + query.length + maxLength / 2);
    
    let excerpt = content.substring(start, end);
    
    // Highlight matches (simple case-insensitive replacement)
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    excerpt = excerpt.replace(regex, '<mark>$1</mark>');
    
    // Add ellipsis if needed
    if (start > 0) excerpt = '...' + excerpt;
    if (end < content.length) excerpt = excerpt + '...';
    
    return excerpt;
  },
  
  /**
   * Get document by path
   * @param {string} path - Document path
   * @returns {Object|null} Document or null
   */
  getDocument(path) {
    return this.documents.find(doc => doc.path === path) || null;
  },
  
  /**
   * Check if search is ready
   * @returns {boolean} True if search is ready
   */
  ready() {
    return this.isReady;
  }
};

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.SearchManager = SearchManager;
}

