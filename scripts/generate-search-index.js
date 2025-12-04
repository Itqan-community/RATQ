#!/usr/bin/env node

/**
 * Search Index Generator
 * Generates search-index.json from all markdown files
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const MANIFEST_PATH = path.join(ROOT_DIR, 'manifest.json');
const OUTPUT_PATH = path.join(ROOT_DIR, 'search-index.json');

/**
 * Parse YAML front matter from markdown
 * @param {string} markdown - Markdown content
 * @returns {Object} Object with metadata and content
 */
function parseFrontMatter(markdown) {
  const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = markdown.match(frontMatterRegex);
  
  if (match) {
    const yaml = match[1];
    const content = match[2];
    const metadata = {};
    
    yaml.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      
      const colonIndex = trimmed.indexOf(':');
      if (colonIndex > 0) {
        const key = trimmed.substring(0, colonIndex).trim();
        let value = trimmed.substring(colonIndex + 1).trim();
        
        // Remove quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        
        metadata[key] = value;
      }
    });
    
    return { metadata, content };
  }
  
  return { metadata: {}, content: markdown };
}

/**
 * Get base file path (without language suffix)
 * @param {string} filePath - File path with possible language suffix
 * @returns {string} Base file path
 */
function getBaseFile(filePath) {
  return filePath.replace(/ - AR\.md$/, '.md').replace(/ -AR\.md$/, '.md');
}

/**
 * Detect language from file path
 * @param {string} filePath - File path
 * @returns {string} Language code ('en' or 'ar')
 */
function detectLanguage(filePath) {
  if (filePath.includes(' - AR.md') || filePath.includes(' -AR.md')) {
    return 'ar';
  }
  return 'en';
}

/**
 * Extract title from markdown (H1 heading)
 * @param {string} markdown - Markdown content
 * @returns {string|null} Title or null
 */
function extractTitleFromH1(markdown) {
  const h1Match = markdown.match(/^#\s+(.+)$/m);
  return h1Match ? h1Match[1].trim() : null;
}

/**
 * Get title from filename
 * @param {string} filePath - File path
 * @returns {string} Title from filename
 */
function getTitleFromFilename(filePath) {
  const filename = filePath.split('/').pop();
  let title = filename.replace(/\.md$/, '').replace(/\s*-\s*AR$/, '');
  return title;
}

/**
 * Process a markdown file and extract searchable content
 * @param {string} filePath - Path to markdown file
 * @param {Object} manifestEntry - Entry from manifest.json
 * @returns {Object|null} Search index entry or null if file doesn't exist
 */
function processMarkdownFile(filePath, manifestEntry) {
  const fullPath = path.join(ROOT_DIR, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.warn(`File not found: ${filePath}`);
    return null;
  }
  
  try {
    const content = fs.readFileSync(fullPath, 'utf8');
    const { metadata, content: markdownContent } = parseFrontMatter(content);
    
    // Get title: front matter > manifest > H1 > filename
    let title = metadata.title || 
                manifestEntry?.title || 
                extractTitleFromH1(markdownContent) || 
                getTitleFromFilename(filePath);
    
    // Get base path (without language suffix)
    const basePath = getBaseFile(filePath);
    
    // Detect language
    const language = detectLanguage(filePath);
    
    // Get group from manifest or infer from path
    const group = manifestEntry?.group || 
                  (filePath.startsWith('Apps/') ? 'apps' : 
                   filePath.startsWith('Technologies/') ? 'technologies' : 'root');
    
    return {
      path: basePath,
      title: title,
      content: markdownContent.trim(),
      language: language,
      group: group
    };
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Generate search index
 */
function generateSearchIndex() {
  console.log('Generating search index...');
  
  // Load manifest
  let manifest = { files: [] };
  if (fs.existsSync(MANIFEST_PATH)) {
    try {
      const manifestContent = fs.readFileSync(MANIFEST_PATH, 'utf8');
      manifest = JSON.parse(manifestContent);
    } catch (error) {
      console.error('Error reading manifest.json:', error.message);
      process.exit(1);
    }
  } else {
    console.warn('manifest.json not found, scanning filesystem...');
  }
  
  // Create a map of file paths to manifest entries
  const manifestMap = new Map();
  manifest.files.forEach(file => {
    manifestMap.set(file.path, file);
  });
  
  // Process all files from manifest
  const searchIndex = [];
  let processedCount = 0;
  let errorCount = 0;
  
  manifest.files.forEach(file => {
    const entry = processMarkdownFile(file.path, file);
    if (entry) {
      searchIndex.push(entry);
      processedCount++;
    } else {
      errorCount++;
    }
  });
  
  // Write search index
  try {
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(searchIndex, null, 2), 'utf8');
    console.log(`\n✓ Search index generated successfully!`);
    console.log(`  - Processed: ${processedCount} files`);
    console.log(`  - Errors: ${errorCount} files`);
    console.log(`  - Output: ${OUTPUT_PATH}`);
  } catch (error) {
    console.error('Error writing search-index.json:', error.message);
    process.exit(1);
  }
}

// Run generator
if (require.main === module) {
  generateSearchIndex();
}

module.exports = { generateSearchIndex };

