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
      
      // Create a shared tokenizer function for consistency
      const arabicTokenizer = function(str) {
        if (!str) return [];
        const tokens = new Set();
        // Split on whitespace, punctuation, and Arabic word boundaries
        // Include zero-width characters used in Arabic
        const words = str.split(/[\s\p{P}\u200C\u200D]+/u).filter(w => w.length > 0);
        
        words.forEach(word => {
          if (word.length > 0) {
            // Always add the full word
            tokens.add(word);
            
            // For Arabic words, handle common patterns for better matching
            if (/[\u0600-\u06FF]/.test(word)) {
              // Add the word without common prefixes (ال, ب, ك, ل, etc.)
              const withoutPrefix = word.replace(/^(ال|ب|ك|ل|و|ف|س|ت|أ|إ|آ)/, '').trim();
              if (withoutPrefix !== word && withoutPrefix.length > 0) {
                tokens.add(withoutPrefix);
              }
              
              // For longer Arabic words (4+ chars), add meaningful substrings
              // Focus on beginning and end sequences for better matching
              if (word.length >= 4) {
                // Add 3-5 char sequences from the beginning
                for (let len = 3; len <= Math.min(5, word.length); len++) {
                  tokens.add(word.substring(0, len));
                }
                // Add 3-5 char sequences from the end (for suffix matching)
                if (word.length > 3) {
                  for (let len = 3; len <= Math.min(5, word.length); len++) {
                    tokens.add(word.substring(word.length - len));
                  }
                }
              } else if (word.length >= 2) {
                // For shorter words, add all 2-char sequences
                for (let i = 0; i <= word.length - 2; i++) {
                  tokens.add(word.substring(i, i + 2));
                }
              }
            }
          }
        });
        
        return Array.from(tokens);
      };
      
      // Create FlexSearch index
      // Configure for both English and Arabic text
      this.index = new FlexSearch.Document({
        document: {
          id: 'path',
          index: [
            {
              field: 'title',
              tokenize: arabicTokenizer
            },
            {
              field: 'content',
              tokenize: arabicTokenizer
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
      // FlexSearch will automatically tokenize the query using the same tokenizer
      // But for Arabic, we also try searching without common prefixes
      let searchQueries = [trimmedQuery];
      
      // For Arabic queries, also try without common prefixes
      if (/[\u0600-\u06FF]/.test(trimmedQuery)) {
        const withoutPrefix = trimmedQuery.replace(/^(ال|ب|ك|ل|و|ف|س|ت|أ|إ|آ)/, '');
        if (withoutPrefix !== trimmedQuery && withoutPrefix.length > 0) {
          searchQueries.push(withoutPrefix);
        }
      }
      
      // Perform search - FlexSearch will handle tokenization
      // We search with all query variations and combine results
      const allResults = [];
      searchQueries.forEach(query => {
        const results = this.index.search(query, {
          limit: limit * 2,
          enrich: true
        });
        if (results && results.length > 0) {
          allResults.push(...results);
        }
      });
      
      // Use the first query's results (most relevant) or combine if needed
      const results = allResults.length > 0 ? allResults : this.index.search(trimmedQuery, {
        limit: limit * 2,
        enrich: true
      });
      
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
   * Tokenize search query to match indexed tokens
   * @param {string} query - Search query
   * @returns {Array} Tokenized query terms
   */
  tokenizeQuery(query) {
    if (!query) return [];
    const tokens = new Set();
    
    // Split on whitespace, punctuation, and Arabic word boundaries
    const words = query.split(/[\s\p{P}\u200C\u200D]+/u).filter(w => w.length > 0);
    
    words.forEach(word => {
      if (word.length > 0) {
        tokens.add(word);
        
        // For Arabic words, also add without common prefixes
        if (/[\u0600-\u06FF]/.test(word)) {
          const withoutPrefix = word.replace(/^(ال|ب|ك|ل|و|ف|س|ت|أ|إ|آ)/, '');
          if (withoutPrefix !== word && withoutPrefix.length > 0) {
            tokens.add(withoutPrefix);
          }
          
          // Add character n-grams for partial matching
          if (word.length >= 2) {
            for (let i = 0; i <= word.length - 2; i++) {
              const maxLen = Math.min(5, word.length - i);
              for (let len = 2; len <= maxLen; len++) {
                tokens.add(word.substring(i, i + len));
              }
            }
          }
        }
      }
    });
    
    return Array.from(tokens);
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

