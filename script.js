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
const lightboxImg = document.getElementById('lightboxImg');
const closeBtn = document.getElementById('closeBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const lbCaption = document.getElementById('lbCaption');

let currentIndex = 0;
let originIndex = 0;

function centeredRect(naturalW, naturalH){
  const maxW = window.innerWidth * 0.82;
  const maxH = window.innerHeight * 0.78;
  let w = naturalW, h = naturalH;
  const ratio = Math.min(maxW / w, maxH / h, 1.4);
  w *= ratio; h *= ratio;
  return {
    width: w,
    height: h,
    left: (window.innerWidth - w) / 2,
    top: (window.innerHeight - h) / 2,
  };
}

function setImgRect(el, rect){
  el.style.top = rect.top + 'px';
  el.style.left = rect.left + 'px';
  el.style.width = rect.width + 'px';
  el.style.height = rect.height + 'px';
}

function openLightbox(index){
  currentIndex = index;
  originIndex = index;
  const originEl = items[index];
  const startRect = originEl.getBoundingClientRect();

  lightbox.classList.add('open');
  lightboxImg.style.transition = 'none';
  lightboxImg.style.opacity = '1';
  lightboxImg.src = images[index];
  setImgRect(lightboxImg, startRect);
  lbCaption.textContent = `No. ${String(index + 1).padStart(2, '0')} — ${index + 1} / ${images.length}`;

  const finalize = () => {
    const natW = lightboxImg.naturalWidth || startRect.width;
    const natH = lightboxImg.naturalHeight || startRect.height;
    const finalRect = centeredRect(natW, natH);
    requestAnimationFrame(() => {
      lightboxImg.style.transition = '';
      setImgRect(lightboxImg, finalRect);
    });
  };

  if (lightboxImg.complete) {
    requestAnimationFrame(finalize);
  } else {
    lightboxImg.onload = finalize;
  }
}

function closeLightbox(){
  const originEl = items[originIndex];
  const targetRect = originEl.getBoundingClientRect();

  if (currentIndex === originIndex){
    lightboxImg.style.transition = 'top 0.4s cubic-bezier(.2,.7,.2,1), left 0.4s cubic-bezier(.2,.7,.2,1), width 0.4s cubic-bezier(.2,.7,.2,1), height 0.4s cubic-bezier(.2,.7,.2,1)';
    setImgRect(lightboxImg, targetRect);
  } else {
    lightboxImg.style.transition = 'opacity 0.3s ease';
    lightboxImg.style.opacity = '0';
  }

  lightbox.classList.remove('open');
  setTimeout(() => {
    lightboxImg.removeAttribute('style');
  }, 420);
}

function crossfadeTo(index){
  currentIndex = index;
  lightboxImg.style.transition = 'opacity 0.25s ease';
  lightboxImg.style.opacity = '0';
  setTimeout(() => {
    lightboxImg.src = images[currentIndex];
    lbCaption.textContent = `No. ${String(currentIndex + 1).padStart(2, '0')} — ${currentIndex + 1} / ${images.length}`;
    lightboxImg.onload = () => {
      const finalRect = centeredRect(lightboxImg.naturalWidth, lightboxImg.naturalHeight);
      lightboxImg.style.transition = 'none';
      setImgRect(lightboxImg, finalRect);
      requestAnimationFrame(() => {
        lightboxImg.style.transition = 'opacity 0.25s ease';
        lightboxImg.style.opacity = '1';
      });
    };
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
  const finalRect = centeredRect(lightboxImg.naturalWidth, lightboxImg.naturalHeight);
  lightboxImg.style.transition = 'none';
  setImgRect(lightboxImg, finalRect);
});