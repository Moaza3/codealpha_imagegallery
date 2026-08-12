// Apni images lagane ke liye yahan paths change karo, e.g. 'images/img1.jpg'
const images = [
  'images/img1.jpg',
  'images/img2.jpg',
  'images/img3.jpg',
  'images/img4.jpg',
  'images/img5.jpg',
  'images/img6.jpg',
  'images/img7.jpg',
  'images/img8.jpg',
  'images/img9.jpg',
  'images/img10.jpg',
];

const gallery = document.getElementById('gallery');
const items = [];

document.getElementById('photoCount').textContent = `${images.length} photographs`;

// ===== BUILD GRID =====
images.forEach((src, index) => {
  const item = document.createElement('div');
  item.className = 'gallery-item';

  const img = document.createElement('img');
  img.src = src;
  img.alt = 'Gallery image';
  img.loading = 'lazy';

  const tag = document.createElement('div');
  tag.className = 'tag';
  tag.textContent = `No. ${String(index + 1).padStart(2, '0')}`;

  item.appendChild(img);
  item.appendChild(tag);
  item.addEventListener('click', () => openLightbox(index));

  // subtle 3D tilt on hover
  item.addEventListener('mousemove', (e) => {
    const rect = item.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    item.style.transform = `perspective(700px) rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg) scale(1.02)`;
  });
  item.addEventListener('mouseleave', () => {
    item.style.transform = '';
  });

  gallery.appendChild(item);
  items.push(item);
});

// ===== STAGGERED SCROLL-REVEAL =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting){
      const el = entry.target;
      const idx = items.indexOf(el);
      setTimeout(() => el.classList.add('visible'), (idx % 12) * 60);
      observer.unobserve(el);
    }
  });
}, { threshold: 0.1 });

items.forEach((item) => observer.observe(item));

// ===== LIGHTBOX (morph from thumbnail) =====
const lightbox = document.getElementById('lightbox');
const lightboxFrame = document.getElementById('lightboxFrame');
const lightboxImg = document.getElementById('lightboxImg');
const closeBtn = document.getElementById('closeBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const lbCaption = document.getElementById('lbCaption');

let currentIndex = 0;
let originIndex = 0;

// box size that respects the image's real aspect ratio, capped to fit the screen
function fittedBoxSize(natW, natH){
  const maxW = Math.min(window.innerWidth * 0.94, 1200);
  const maxH = window.innerHeight * 0.90;
  const ratio = Math.min(maxW / natW, maxH / natH);
  return { w: natW * ratio, h: natH * ratio };
}

// transform that visually places the (given size, centered) lightbox frame
// on top of a given thumbnail's rect, so it can morph FROM there
function transformToMatchRect(rect, box){
  const scale = Math.max(rect.width / box.w, rect.height / box.h, 0.05);
  const originCenterX = rect.left + rect.width / 2;
  const originCenterY = rect.top + rect.height / 2;
  const viewportCenterX = window.innerWidth / 2;
  const viewportCenterY = window.innerHeight / 2;
  const dx = originCenterX - viewportCenterX;
  const dy = originCenterY - viewportCenterY;
  return `translate(-50%, -50%) translate(${dx}px, ${dy}px) scale(${scale})`;
}

function openLightbox(index){
  currentIndex = index;
  originIndex = index;
  const rect = items[index].getBoundingClientRect();

  lightbox.classList.add('open');
  lightboxImg.style.opacity = '1';
  lightboxImg.src = images[index];
  lbCaption.textContent = `No. ${String(index + 1).padStart(2, '0')} — ${index + 1} / ${images.length}`;

  const runMorph = () => {
    const box = fittedBoxSize(lightboxImg.naturalWidth || rect.width, lightboxImg.naturalHeight || rect.height);

    // size the frame to match THIS image's real aspect ratio, then start it
    // exactly on top of the clicked thumbnail, no transition
    lightboxFrame.style.transition = 'none';
    lightboxFrame.style.width = box.w + 'px';
    lightboxFrame.style.height = box.h + 'px';
    lightboxFrame.style.transform = transformToMatchRect(rect, box);

    // next frame: flip to centered full size, letting CSS transition animate it
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        lightboxFrame.style.transition = '';
        lightboxFrame.style.transform = 'translate(-50%, -50%) scale(1)';
      });
    });
  };

  if (lightboxImg.complete && lightboxImg.naturalWidth){
    runMorph();
  } else {
    lightboxImg.onload = runMorph;
  }
}

function closeLightbox(){
  const rect = items[originIndex].getBoundingClientRect();

  if (currentIndex === originIndex){
    const box = fittedBoxSize(lightboxImg.naturalWidth || rect.width, lightboxImg.naturalHeight || rect.height);
    lightboxFrame.style.transition = 'transform 0.4s cubic-bezier(.2,.7,.2,1)';
    lightboxFrame.style.transform = transformToMatchRect(rect, box);
  } else {
    lightboxFrame.style.transition = 'opacity 0.3s ease';
    lightboxFrame.style.opacity = '0';
  }

  lightbox.classList.remove('open');
  setTimeout(() => {
    lightboxFrame.removeAttribute('style');
  }, 420);
}

function crossfadeTo(index){
  currentIndex = index;
  lightboxImg.style.opacity = '0';
  setTimeout(() => {
    lightboxImg.src = images[currentIndex];
    lbCaption.textContent = `No. ${String(currentIndex + 1).padStart(2, '0')} — ${currentIndex + 1} / ${images.length}`;

    const applySize = () => {
      const box = fittedBoxSize(lightboxImg.naturalWidth, lightboxImg.naturalHeight);
      lightboxFrame.style.transition = 'width 0.35s ease, height 0.35s ease';
      lightboxFrame.style.width = box.w + 'px';
      lightboxFrame.style.height = box.h + 'px';
      lightboxImg.style.opacity = '1';
    };

    if (lightboxImg.complete && lightboxImg.naturalWidth){
      applySize();
    } else {
      lightboxImg.onload = applySize;
    }
  }, 220);
}

function showNext(){ crossfadeTo((currentIndex + 1) % images.length); }
function showPrev(){ crossfadeTo((currentIndex - 1 + images.length) % images.length); }

closeBtn.addEventListener('click', closeLightbox);
nextBtn.addEventListener('click', showNext);
prevBtn.addEventListener('click', showPrev);

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'ArrowRight') showNext();
  if (e.key === 'ArrowLeft') showPrev();
  if (e.key === 'Escape') closeLightbox();
});

window.addEventListener('resize', () => {
  if (!lightbox.classList.contains('open') || !lightboxImg.naturalWidth) return;
  const box = fittedBoxSize(lightboxImg.naturalWidth, lightboxImg.naturalHeight);
  lightboxFrame.style.transition = 'none';
  lightboxFrame.style.width = box.w + 'px';
  lightboxFrame.style.height = box.h + 'px';
  lightboxFrame.style.transform = 'translate(-50%, -50%) scale(1)';
});