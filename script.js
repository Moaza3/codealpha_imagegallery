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
    'images/img10.jpg'
];

const gallery = document.getElementById('gallery');
const items = [];

document.getElementById('photoCount').textContent =
    `${images.length} photographs`;

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

    item.addEventListener('click', () => {
        openLightbox(index);
    });

    item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();

        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        item.style.transform =
            `perspective(700px)
            rotateX(${(-y * 8).toFixed(2)}deg)
            rotateY(${(x * 8).toFixed(2)}deg)
            scale(1.02)`;
    });

    item.addEventListener('mouseleave', () => {
        item.style.transform = '';
    });

    gallery.appendChild(item);
    items.push(item);
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const item = entry.target;
            const index = items.indexOf(item);

            setTimeout(() => {
                item.classList.add('visible');
            }, (index % 12) * 60);

            observer.unobserve(item);
        }
    });
}, {
    threshold: 0.1
});

items.forEach((item) => {
    observer.observe(item);
});

const lightbox = document.getElementById('lightbox');
const frame = document.getElementById('lightboxFrame');
const lightboxImg = document.getElementById('lightboxImg');
const closeBtn = document.getElementById('closeBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const caption = document.getElementById('lbCaption');

let currentIndex = 0;
let originIndex = 0;

function getBoxSize(width, height) {
    const maxWidth = Math.min(window.innerWidth * 0.94, 1200);
    const maxHeight = window.innerHeight * 0.90;

    const scale = Math.min(
        maxWidth / width,
        maxHeight / height
    );

    return {
        width: width * scale,
        height: height * scale
    };
}

function getThumbnailPosition(rect, box) {
    const scale = Math.max(
        rect.width / box.width,
        rect.height / box.height,
        0.05
    );

    const imageX = rect.left + rect.width / 2;
    const imageY = rect.top + rect.height / 2;

    const screenX = window.innerWidth / 2;
    const screenY = window.innerHeight / 2;

    const x = imageX - screenX;
    const y = imageY - screenY;

    return `
        translate(-50%, -50%)
        translate(${x}px, ${y}px)
        scale(${scale})
    `;
}

function openLightbox(index) {
    currentIndex = index;
    originIndex = index;

    const rect = items[index].getBoundingClientRect();

    lightbox.classList.add('open');
    lightboxImg.style.opacity = '1';
    lightboxImg.src = images[index];

    caption.textContent =
        `No. ${String(index + 1).padStart(2, '0')} — ${index + 1} / ${images.length}`;

    function startAnimation() {
        const box = getBoxSize(
            lightboxImg.naturalWidth || rect.width,
            lightboxImg.naturalHeight || rect.height
        );

        frame.style.transition = 'none';
        frame.style.width = box.width + 'px';
        frame.style.height = box.height + 'px';

        frame.style.transform =
            getThumbnailPosition(rect, box);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                frame.style.transition = '';
                frame.style.transform =
                    'translate(-50%, -50%) scale(1)';
            });
        });
    }

    if (lightboxImg.complete && lightboxImg.naturalWidth) {
        startAnimation();
    } else {
        lightboxImg.onload = startAnimation;
    }
}

function closeLightbox() {
    const rect = items[originIndex].getBoundingClientRect();

    if (currentIndex === originIndex) {
        const box = getBoxSize(
            lightboxImg.naturalWidth || rect.width,
            lightboxImg.naturalHeight || rect.height
        );

        frame.style.transition =
            'transform 0.4s cubic-bezier(.2,.7,.2,1)';

        frame.style.transform =
            getThumbnailPosition(rect, box);
    } else {
        frame.style.transition = 'opacity 0.3s ease';
        frame.style.opacity = '0';
    }

    lightbox.classList.remove('open');

    setTimeout(() => {
        frame.removeAttribute('style');
    }, 420);
}

function changeImage(index) {
    currentIndex = index;
    lightboxImg.style.opacity = '0';

    setTimeout(() => {
        lightboxImg.src = images[currentIndex];

        caption.textContent =
            `No. ${String(currentIndex + 1).padStart(2, '0')} — ${currentIndex + 1} / ${images.length}`;

        function resizeFrame() {
            const box = getBoxSize(
                lightboxImg.naturalWidth,
                lightboxImg.naturalHeight
            );

            frame.style.transition =
                'width 0.35s ease, height 0.35s ease';

            frame.style.width = box.width + 'px';
            frame.style.height = box.height + 'px';

            lightboxImg.style.opacity = '1';
        }

        if (lightboxImg.complete && lightboxImg.naturalWidth) {
            resizeFrame();
        } else {
            lightboxImg.onload = resizeFrame;
        }
    }, 220);
}

function showNext() {
    const next = (currentIndex + 1) % images.length;
    changeImage(next);
}

function showPrevious() {
    const previous =
        (currentIndex - 1 + images.length) % images.length;

    changeImage(previous);
}

closeBtn.addEventListener('click', closeLightbox);
nextBtn.addEventListener('click', showNext);
prevBtn.addEventListener('click', showPrevious);

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) {
        return;
    }

    if (e.key === 'ArrowRight') {
        showNext();
    }

    if (e.key === 'ArrowLeft') {
        showPrevious();
    }

    if (e.key === 'Escape') {
        closeLightbox();
    }
});

window.addEventListener('resize', () => {
    if (!lightbox.classList.contains('open')) {
        return;
    }

    if (!lightboxImg.naturalWidth) {
        return;
    }

    const box = getBoxSize(
        lightboxImg.naturalWidth,
        lightboxImg.naturalHeight
    );

    frame.style.transition = 'none';
    frame.style.width = box.width + 'px';
    frame.style.height = box.height + 'px';
    frame.style.transform =
        'translate(-50%, -50%) scale(1)';
});