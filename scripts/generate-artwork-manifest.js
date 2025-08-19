//file format: YYYY-MM-DD_collection_category_title_tag.filetype
const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

const ARTWORK_DIR = path.join(__dirname, '../pictures/artwork');
const MANIFEST_PATH = path.join(__dirname, '../data/artwork-manifest.json');

// Map shorthand -> full category name
const categoryMap = {
  "illus": "Illustration",
  "anim": "Animation",
  "sketch": "Sketch",
  "misc": "Misc"
};

/**
 * Capitalize first letter of each word in a string
 */
function capitalizeWords(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Generate the manifest file from current artwork directory
 */
function generateManifest() {
  const files = fs.readdirSync(ARTWORK_DIR)
    .filter(file => /\.(png|jpg|jpeg|webp|gif)$/i.test(file));

  const manifest = files.map(file => {
    // Parse filename: YYYY-MM-DD_collection_category_title_tag.filetype
    const parts = file.replace(/\.[^/.]+$/, "").split('_');
    
    const date = parts[0] || new Date().toISOString().split('T')[0];
    const collection = capitalizeWords(parts[1] || 'uncategorized');
    
    // Lookup category from shorthand map
    const rawCategory = (parts[2] || 'misc').toLowerCase();
    const category = categoryMap[rawCategory] || capitalizeWords(rawCategory);

    // Title: 3 (convert hyphens to spaces and capitalize)
    const title = parts.length > 3 ? capitalizeWords(parts[3].replace(/-/g, ' ')) : 'Untitled';
    
    // Tag: 4 if exists (convert hyphens to spaces and capitalize)
    const tag = parts.length > 4 ? capitalizeWords(parts[4].replace(/-/g, ' ')) : '';

    return {
      src: `/pictures/artwork/${file}`,
      date,
      collection,
      category,
      title,
      tag
    };
  });

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`Updated manifest with ${manifest.length} artworks :3`);
}

/**
 * Watch for file changes
 */
function watchArtworkFolder() {
  console.log(`Watching for changes in ${ARTWORK_DIR}...`);
  
  chokidar.watch(ARTWORK_DIR)
    .on('add', (path) => {
      console.log(`+ New file detected: ${path}`);
      generateManifest();
    })
    .on('unlink', (path) => {
      console.log(`- File removed: ${path}`);
      generateManifest();
    });
}

// Run immediately + watch if --watch flag is passed
generateManifest();
if (process.argv.includes('--watch')) watchArtworkFolder();
