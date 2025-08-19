to add
if i click on banner it goes home

/tatsumelon.com
|
├── index.html      #home page
├──README.md
|
|
├── pages/
|   ├── about.html
|   ├── contact.html
|   ├── commission.html
|   ├── onlin sop
|   ├── artwork
|   |   ├── index.html # art listing page, categories, and search
|   |   ├── timeline.html # Alternate timeline view
|   |   ├── [id].html # Dynamic artwork detail pages
|   |
|   ├── blogs
|   |   ├── index.html # blog listing page and search
|   |   ├── posts/
|   |   |   ├── yyyy-mm-dd_type_title_here.md
|   |
|   ├── Fanart
|   ├── FAQ
|   ├── Donat



|
├── public/
|   ├── images/
|   |   ├── global
|   |   |   ├── logo.svg
|   |   |   ├── bg-pattern.png
|   |   |   ├──
|   |
|   ├── favicon.ico     #16x16 pixel that is on page title
|   ├── fonts/
|
├── styles/
|   ├── main.css
│   ├── components/
│   │   ├── gallery.css        # Art grid styles
│   │   ├── timeline.css       # Timeline view styles
│   │   └── lightbox.css       # Lightbox styles
│   └── pages/
│       ├── blog.css           # Blog-specific styles
│       └── artwork.css        # Artwork page styles
|
├── scripts/
│   ├── main.js                # Global scripts
│   ├── components/
│   │   ├── lightbox.js        # Lightbox functionality
│   │   ├── gallery-filter.js  # Artwork filtering
│   │   └── timeline-view.js   # Timeline interactions
│   └── utils/
│       ├── image-loader.js    # Lazy loading
│       └── search.js         # Blog/artwork search
|
├── pictures/
|   ├── blog/
|   |   ├── 2024-06-20_art-cover.jpg
|   ├── artwork/
|   |   ├── YYYY-MM-DD_collection_category_title_tag.filetype
|
|
├── assets/ #misc unused/backups

.md blog example (use for text heavy)
---
title: "My Painting Process"
date: 2024-05-20
featured_image: /images/blog/process-1.jpg
---
Here's my workflow:

![Colors](/images/blog/colors.jpg)

.html example (structural pages)