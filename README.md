# 🖼️ Animated Image Gallery

A visually rich, interactive image gallery built with pure HTML, CSS, and JavaScript. Developed during the Frontend Development Internship at CodeAlpha. Features a masonry-style layout, smooth scroll-in animations, an interactive 3D tilt hover effect, and a fully animated lightbox viewer.

## 🌐 Live Demo

**[View Live Gallery](https://moaza3.github.io/codealpha_imagegallery/)**

> If GitHub Pages isn't enabled yet for this repo: go to **Settings → Pages → Source → main branch → Save**, and the link above will go live within a minute.

## 🛠️ Tech Stack

- **HTML5** — Semantic structure
- **CSS3** — Custom properties, CSS Grid, animations, media queries
- **JavaScript (Vanilla)** — DOM manipulation, Intersection Observer API, event handling
- **Google Fonts** — Cormorant Garamond & Inter

No frameworks or libraries used — built entirely with vanilla JS and CSS to strengthen core fundamentals.

## ✨ Features

- 🎨 **Masonry-style responsive grid** — Dynamic, editorial-style photo layout using CSS Grid with varied tile sizes
- 🖱️ **3D tilt-on-hover effect** — Gallery tiles respond to mouse movement with a subtle perspective tilt
- 🌊 **Scroll-triggered animations** — Images fade and slide into view using the Intersection Observer API, staggered for a natural cascading effect
- 🔍 **Animated lightbox viewer** — Clicking an image opens a full-screen viewer that smoothly scales up from the clicked thumbnail's exact position
- ⌨️ **Keyboard navigation** — Navigate the lightbox using Left/Right arrow keys, and close it with `Esc`
- ➡️⬅️ **Next/Previous controls** — Click-based navigation buttons inside the lightbox
- 📱 **Fully responsive** — Grid adapts from 4 columns (desktop) to 3 (tablet) to 2 (mobile)
- 🖼️ **Lazy loading** — Images load only as needed for better performance
- 🏷️ **Numbered tags** — Each photo displays a subtle index tag on hover

## 🚀 How to Run Locally

### 1. Clone the Repository
```bash
git clone https://github.com/Moaza3/codealpha_imagegallery.git
cd codealpha_imagegallery
```

### 2. Add Your Images
Create an `images` folder in the root directory and add 10 images named:
```
img1.jpg, img2.jpg, img3.jpg, ... img10.jpg
```

### 3. Open in Browser
Simply open `index.html` in your browser — no build tools or server required.

```bash
# Or use a local server (optional, for smoother testing)
npx serve .
```

## 📁 Project Structure

```
codealpha_imagegallery/
├── images/
│   ├── img1.jpg
│   ├── img2.jpg
│   └── ...
├── index.html
├── style.css
├── script.js
└── README.md
```

## 👤 Built By

**Moaza**
Frontend Development Intern — CodeAlpha | 2026
