// GSAP Gallery Slider
// Clone-based infinite loop, arrow navigation + drag/swipe, one slide at a time

export function initGSAPGallerySlider() {
  if (typeof gsap === 'undefined') {
    console.warn(
      '⚠️ GSAP is required for the gallery slider. Please include GSAP.'
    );
    return;
  }
  if (typeof Draggable === 'undefined') {
    console.warn(
      '⚠️ GSAP Draggable plugin is required for the gallery slider. Please include Draggable.'
    );
    return;
  }

  gsap.registerPlugin(Draggable);

  const roots = document.querySelectorAll('[data-gallery-slider]');
  if (!roots.length) return;

  roots.forEach(root => initSlider(root));
}

function initSlider(root) {
  const track = root.querySelector('[data-gallery-slider-track]');
  const slides = Array.from(
    root.querySelectorAll('[data-gallery-slider-slide]')
  );
  const prevBtn = root.querySelector('[data-gallery-slider-prev]');
  const nextBtn = root.querySelector('[data-gallery-slider-next]');

  if (!track || slides.length < 2) return;

  // Clone last slide → prepend (seamless prev from slide 1)
  // Clone first slide → append (seamless next from last slide)
  const cloneLast = slides[slides.length - 1].cloneNode(true);
  const cloneFirst = slides[0].cloneNode(true);
  cloneLast.setAttribute('aria-hidden', 'true');
  cloneFirst.setAttribute('aria-hidden', 'true');
  track.prepend(cloneLast);
  track.append(cloneFirst);

  // Track order: [clone-last(0), slide1(1), ..., slideN(N), clone-first(N+1)]
  const totalCount = slides.length + 2;
  const lastRealIndex = slides.length;
  let currentIndex = 1;
  let isAnimating = false;

  function getX(index) {
    return -index * root.offsetWidth;
  }

  // Position track at first real slide
  gsap.set(track, { x: getX(1) });

  // After animating to a clone, silently reposition to the real counterpart
  function handleCloneWrap() {
    if (currentIndex === 0) {
      currentIndex = lastRealIndex;
      gsap.set(track, { x: getX(lastRealIndex) });
    } else if (currentIndex === totalCount - 1) {
      currentIndex = 1;
      gsap.set(track, { x: getX(1) });
    }
  }

  function goTo(targetIndex, duration) {
    isAnimating = true;
    currentIndex = targetIndex;
    gsap.to(track, {
      x: getX(targetIndex),
      duration: duration ?? 0.7,
      ease: 'power3.inOut',
      onComplete() {
        handleCloneWrap();
        isAnimating = false;
      }
    });
  }

  function next() {
    if (isAnimating) return;
    goTo(currentIndex + 1);
  }

  function prev() {
    if (isAnimating) return;
    goTo(currentIndex - 1);
  }

  prevBtn?.addEventListener('click', prev);
  nextBtn?.addEventListener('click', next);

  // Draggable for touch and mouse drag
  Draggable.create(track, {
    type: 'x',
    inertia: false,
    edgeResistance: 0.75,
    bounds: { minX: getX(totalCount - 1), maxX: 0 },
    onPress() {
      gsap.killTweensOf(track);
      isAnimating = false;
      this._startX = gsap.getProperty(track, 'x');
    },
    onDragEnd() {
      const delta = this.endX - this._startX;
      const threshold = root.offsetWidth * 0.2;

      if (delta < -threshold) {
        currentIndex = Math.min(currentIndex + 1, totalCount - 1);
      } else if (delta > threshold) {
        currentIndex = Math.max(currentIndex - 1, 0);
      }

      goTo(currentIndex, 0.5);
    }
  });

  // Reposition on window resize (slide widths change with container)
  window.addEventListener('resize', () => {
    gsap.set(track, { x: getX(currentIndex) });
  });
}
