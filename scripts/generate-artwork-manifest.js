/* depends on chokidar
 * terminal: npm init -y
 * npm install chokidar
 * run script: node scripts/generate-artwork-manifest.js --watch
 * OR in VS code: run task -> generate artwork manifest (onetime) or watch artwork folder (updates when you add new img in pictures/artworks)
*/

const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

const ARTWORK_DIR = path.join(process.cwd(), 'pictures/artwork');
const MANIFEST_PATH = path.join(process.cwd(), 'data/artwork-manifest.json');

const categoryMap = {
  "illus": "Illustration",
  "anim": "Animation",
  "comic": "Comic",
  "sketch": "Sketch",
  "misc": "Misc"
};

function capitalizeWords(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function generateManifest() {
  const files = fs.readdirSync(ARTWORK_DIR)
    .filter(file => /\.(png|jpg|jpeg|webp|gif)$/i.test(file));

  let manifest = files.map(file => {
    const parts = file.replace(/\.[^/.]+$/, "").split('_');
    
    const date = parts[0] || new Date().toISOString().split('T')[0];
    const collection = capitalizeWords(parts[1] || 'uncategorized');
    const rawCategory = (parts[2] || 'misc').toLowerCase();
    const category = categoryMap[rawCategory] || capitalizeWords(rawCategory);
    const title = parts.length > 3 ? capitalizeWords(parts[3].replace(/-/g, ' ')) : 'Untitled';
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

  // Sort: date (newest → oldest), then title (alphabetically)
  manifest.sort((a, b) => {
    const dateDiff = new Date(b.date) - new Date(a.date);
    if (dateDiff !== 0) return dateDiff;
    return a.title.localeCompare(b.title);
  });

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`Updated manifest with ${manifest.length} artworks :3`);
}

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

generateManifest();
if (process.argv.includes('--watch')) watchArtworkFolder();
