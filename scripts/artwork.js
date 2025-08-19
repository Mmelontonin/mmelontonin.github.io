/**
 * ARTWORK GALLERY APPLICATION
 * Handles all artwork gallery functionality
 */

// DOM Elements
const elements = {
    gridViewBtn: document.getElementById('grid-view'),
    timelineViewBtn: document.getElementById('timeline-view'),
    artworkGrid: document.getElementById('artwork-grid'),
    timelineContainer: document.getElementById('timeline-view'),
    lightbox: document.getElementById('lightbox'),
    searchInput: document.getElementById('search'),
    collectionFilters: document.getElementById('collection-filters'),
    categoryFilters: document.getElementById('category-filters'),
    lightboxImage: document.getElementById('lightbox-image'),
    lightboxTitle: document.getElementById('lightbox-title'),
    lightboxMeta: document.getElementById('lightbox-meta'),
    lightboxTags: document.getElementById('lightbox-tags')
};

// State
let currentLightboxIndex = 0;

/**
 * Initialize the gallery
 */

let artworks = [];

async function initGallery() {
    
    // Load from generated manifest
    const response = await fetch('/data/artwork-manifest.json');
    artworks = await response.json();

    switchToGridView();

    renderArtworkGrid();
    setupFilters();
    setupEventListeners();
    
    // Set active filter from sidebar links
    document.querySelectorAll('[data-filter]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const filterType = link.dataset.filter;
            const value = link.dataset.value;
            setActiveFilter(filterType, value);
        });
    });
}

/**
 * Render artwork grid
 * @param {Array} filteredArtworks
 */

function renderArtworkGrid(filteredArtworks = artworks) {
    elements.artworkGrid.innerHTML = filteredArtworks.map(art => `
        <div class="art-card" data-id="${art.src}">
            <img src="${art.src}" alt="${art.title}" loading="lazy">
            <div class="art-card-info">
                <h3>${art.title}</h3>
                <!-- Removed the collection/category line -->
            </div>
        </div>
    `).join('');
}

/**
 * Setup filter checkboxes
 */
function setupFilters() {
    const collections = [...new Set(artworks.map(a => a.collection))];
    const categories = [...new Set(artworks.map(a => a.category))];
    
    elements.collectionFilters.innerHTML = collections.map(c => `
        <label>
            <input type="checkbox" value="${c}" checked> ${c}
        </label>
    `).join('');
    
    elements.categoryFilters.innerHTML = categories.map(c => `
        <label>
            <input type="checkbox" value="${c}" checked> ${c}
        </label>
    `).join('');
}

/**
 * Set active filter from sidebar links
 */
function setActiveFilter(type, value) {
    // Uncheck all checkboxes in this group
    document.querySelectorAll(`#${type}-filters input`).forEach(checkbox => {
        checkbox.checked = (checkbox.value === value);
    });
    
    applyFilters();
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // View toggle buttons
    elements.gridViewBtn.addEventListener('click', switchToGridView);
    elements.timelineViewBtn.addEventListener('click', switchToTimelineView);
    
    // Search input
    elements.searchInput.addEventListener('input', applyFilters);
    
    // Filter checkbox changes - ADD THIS
    document.querySelectorAll('#collection-filters input, #category-filters input').forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
    
    // Lightbox navigation
    document.querySelector('.left-arrow').addEventListener('click', () => navigateLightbox(-1));
    document.querySelector('.right-arrow').addEventListener('click', () => navigateLightbox(1));
    document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    
    // Mobile touch navigation for lightbox
    document.querySelector('.mobile-nav-area.left').addEventListener('click', () => navigateLightbox(-1));
    document.querySelector('.mobile-nav-area.right').addEventListener('click', () => navigateLightbox(1));

    // Artwork card clicks
    elements.artworkGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.art-card');
        if (card) {
            const index = [...document.querySelectorAll('.art-card')].indexOf(card);
            openLightbox(index);
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
}

/**
 * Handle keyboard events
 */
function handleKeyboardNavigation(e) {
    if (elements.lightbox.style.display !== 'flex') return;
    
    switch(e.key) {
        case 'ArrowLeft': navigateLightbox(-1); break;
        case 'ArrowRight': navigateLightbox(1); break;
        case 'Escape': closeLightbox(); break;
    }
}

/**
 * Switch to grid view
 */
function switchToGridView() {
    elements.gridViewBtn.classList.add('active');
    elements.timelineViewBtn.classList.remove('active');
    elements.artworkGrid.style.display = 'grid';
    elements.timelineContainer.style.display = 'none';

    elements.gridViewBtn.style.display = 'none';
    elements.timelineViewBtn.style.display = 'block';
    elements.timelineViewBtn.textContent = 'Timeline View';
}

/**
 * Switch to timeline view
 */
function switchToTimelineView() {
    elements.timelineViewBtn.classList.add('active');
    elements.gridViewBtn.classList.remove('active');
    elements.artworkGrid.style.display = 'none';
    elements.timelineContainer.style.display = 'block';
    renderTimelineView();
    
    elements.timelineViewBtn.style.display = 'none';
    elements.gridViewBtn.style.display = 'block';
    elements.gridViewBtn.textContent = 'Grid View';
}

/**
 * Apply all active filters
 */
function applyFilters() {
    const searchTerm = elements.searchInput.value.toLowerCase();
    const collectionFilters = getCheckedValues('collection-filters');
    const categoryFilters = getCheckedValues('category-filters');
    
    const filtered = artworks.filter(art => {
        const matchesSearch = art.title.toLowerCase().includes(searchTerm) || 
                            (art.tag && art.tag.toLowerCase().includes(searchTerm));
        
        const matchesCollection = collectionFilters.length === 0 || 
                                collectionFilters.includes(art.collection);
                                
        const matchesCategory = categoryFilters.length === 0 || 
                              categoryFilters.includes(art.category);
        
        return matchesSearch && matchesCollection && matchesCategory;
    });
    
    if (elements.artworkGrid.style.display !== 'none') {
        renderArtworkGrid(filtered);
    } else {
        renderTimelineView(filtered);
    }
}
/**
 * Get checked values from filter group
 */
function getCheckedValues(groupId) {
    return [...document.querySelectorAll(`#${groupId} input:checked`)].map(i => i.value);
}

/**
 * Open lightbox with specific artwork
 */
function openLightbox(index) {
    currentLightboxIndex = index;
    const art = artworks[index];
    
    elements.lightboxImage.src = art.src;
    elements.lightboxTitle.textContent = art.title;
    elements.lightboxMeta.textContent = 
        `${new Date(art.date).toLocaleDateString()} • ${art.collection} • ${art.category}`;
    
    elements.lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    if (art.tag && art.tag.trim() !== '') {
        elements.lightboxTags.innerHTML = `<strong>Tags:</strong> ${art.tag}`;
        elements.lightboxTags.style.display = 'block';
    } else {
        elements.lightboxTags.style.display = 'none';
    }
}

/**
 * Navigate through artworks in lightbox
 */
function navigateLightbox(direction) {
    currentLightboxIndex = (currentLightboxIndex + direction + artworks.length) % artworks.length;
    openLightbox(currentLightboxIndex);
}

/**
 * Close lightbox
 */
function closeLightbox() {
    elements.lightbox.style.display = 'none';
    document.body.style.overflow = '';
}

/**
 * Render timeline view
 */
function renderTimelineView(filteredArtworks = artworks) {
    if (!filteredArtworks.length) {
        elements.timelineContainer.innerHTML = `<p class="no-results">No artworks found</p>`;
        return;
    }

    elements.timelineContainer.innerHTML = '';

    const grouped = filteredArtworks.reduce((acc, art) => {
        const year = art.date.split('-')[0];
        if (!acc[year]) acc[year] = [];
        acc[year].push(art);
        return acc;
    }, {});

    Object.entries(grouped)
        .sort((a, b) => b[0] - a[0])
        .forEach(([year, arts]) => {
            const yearSection = document.createElement('div');
            yearSection.className = 'timeline-year';
            
            const yearHeader = document.createElement('h2');
            yearHeader.textContent = year;
            yearSection.appendChild(yearHeader);
            
            const itemsContainer = document.createElement('div');
            itemsContainer.className = 'timeline-items';
            
            arts.forEach(art => {
                const item = document.createElement('div');
                item.className = 'timeline-item';
                
                const img = document.createElement('img');
                img.src = art.src;
                img.alt = art.title;
                img.loading = 'lazy';
                
                // Add error handling
                img.onerror = () => {
                    console.error('Failed to load image:', art.src);
                    img.style.display = 'none';
                };
                
                const infoDiv = document.createElement('div');
                infoDiv.className = 'item-info';
                
                const titleSpan = document.createElement('span');
                titleSpan.className = 'item-title';
                titleSpan.textContent = art.title;
                
                infoDiv.appendChild(titleSpan);
                item.appendChild(img);
                item.appendChild(infoDiv);
                itemsContainer.appendChild(item);
            });
            
            yearSection.appendChild(itemsContainer);
            elements.timelineContainer.appendChild(yearSection);
        });
}

// Initialize the gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', initGallery);