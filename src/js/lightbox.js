/**
 * Gallery lightbox, styled by src/styles/lightbox.css. See docs/lightbox.md.
 *
 * Adapted from the dorongiatmusic theme's lightbox (Osmo's Click to Zoom, Basic) and its
 * gallery hover hint. The photo grows from its thumbnail to fill the screen, and shrinks back
 * on close.
 *
 * - Triggers are the Events template's existing buttons: [data-gallery] [data-lightbox="trigger"],
 *   each around one image. Each [data-gallery] is one gallery.
 * - The overlay is a native <dialog> the script creates. It sits in the browser's top layer,
 *   above the navbar and the UserWay button, makes the page inert, keeps focus inside and
 *   returns it on close.
 * - The thumbnails are cropped (3:2); the zoomed photo shows the whole image. The animation
 *   scales it uniformly and clips it to the thumbnail's frame, so it never stretches.
 * - Next and previous: buttons, the arrow keys and a sideways swipe, with a counter.
 * - Closes on a click (outside the buttons), Escape, the close button or scrolling the page.
 * - Each trigger gets a zoom badge, shown on hover and focus (always on touch screens).
 */

const CONFIG = {
  openDuration: 0.55,
  closeDuration: 0.45,
  slideDuration: 0.45,
  openEase: 'power3.out',
  closeEase: 'power2.inOut',
  slideEase: 'power3.out',
  backdrop: 'rgba(0, 0, 0, 0.9)',
  transparent: 'rgba(0, 0, 0, 0)',
  // Corner radius of the zoomed photo, in px
  radius: 8,
  swipeDistance: 40
};

const TRIGGER = '[data-gallery] [data-lightbox="trigger"]';

// The visible text is Webflow's; these are the accessible names.
const LABELS = {
  he: {
    dialog: 'גלריית תמונות',
    open: 'הגדלת התמונה',
    prev: 'התמונה הקודמת',
    next: 'התמונה הבאה',
    close: 'סגירה'
  },
  en: {
    dialog: 'Photo gallery',
    open: 'Enlarge image',
    prev: 'Previous image',
    next: 'Next image',
    close: 'Close'
  }
};

const CHEVRON =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>';
const CROSS =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';
// Lucide "maximize-2"
const ZOOM_ICON =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 3h6v6"/><path d="m21 3-7 7"/><path d="m3 21 7-7"/><path d="M9 21H3v-6"/></svg>';

let lightbox;
let clone = null;
let triggers = [];
let index = 0;
let isOpen = false;
let isAnimating = false;
let openScrollY = 0;
let swiped = false;

export function initLightbox() {
  const all = [...document.querySelectorAll(TRIGGER)].filter(trigger =>
    trigger.querySelector('img')
  );
  if (!all.length || typeof gsap === 'undefined') return;

  const labels = document.documentElement.lang.startsWith('he')
    ? LABELS.he
    : LABELS.en;

  all.forEach(trigger => {
    if (!trigger.hasAttribute('aria-label')) {
      const alt = trigger.querySelector('img').alt.trim();
      trigger.setAttribute(
        'aria-label',
        alt ? `${labels.open}: ${alt}` : labels.open
      );
    }
    addZoomBadge(trigger);
  });

  lightbox = createLightbox(labels);
  document.addEventListener('click', onDocumentClick);
}

function addZoomBadge(trigger) {
  if (trigger.querySelector('.zoom-badge')) return;
  const badge = document.createElement('span');
  badge.className = 'zoom-badge';
  badge.innerHTML = ZOOM_ICON;
  trigger.append(badge);
}

function createLightbox(labels) {
  const dialog = document.createElement('dialog');
  dialog.className = 'zoom-lightbox';
  // Focus goes to the dialog, not its first button: a key that opened it could press that
  // button on key-up
  dialog.tabIndex = -1;
  dialog.setAttribute('aria-label', labels.dialog);
  dialog.innerHTML = `
    <button type="button" class="zoom-lightbox_close" data-action="close" aria-label="${labels.close}">${CROSS}</button>
    <button type="button" class="zoom-lightbox_prev" data-action="prev" aria-label="${labels.prev}">${CHEVRON}</button>
    <button type="button" class="zoom-lightbox_next" data-action="next" aria-label="${labels.next}">${CHEVRON}</button>
    <p class="zoom-lightbox_counter" aria-live="polite"></p>`;
  document.body.append(dialog);

  dialog.addEventListener('click', onLightboxClick);
  dialog.addEventListener('keydown', onLightboxKeydown);
  // Escape: animate the close instead of the browser's instant one
  dialog.addEventListener('cancel', event => {
    event.preventDefault();
    close();
  });
  // A forced close (Escape twice in Chrome) skips the animation; tidy up. The event comes
  // later than the close itself, so skip it if the lightbox has been opened again since.
  dialog.addEventListener('close', () => {
    if (!dialog.open && (isOpen || isAnimating)) reset();
  });
  addSwipe(dialog);
  return dialog;
}

function onDocumentClick(event) {
  if (lightbox.contains(event.target)) return;
  const trigger = event.target.closest(TRIGGER);
  if (!trigger) return;
  const gallery = trigger.closest('[data-gallery]');
  const group = [
    ...gallery.querySelectorAll('[data-lightbox="trigger"]')
  ].filter(item => item.querySelector('img'));
  if (!group.includes(trigger)) return;
  event.preventDefault();
  open(trigger, group);
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function duration(seconds) {
  return prefersReducedMotion() ? 0 : seconds;
}

function imageOf(trigger) {
  return trigger.querySelector('img');
}

function isLoaded(img) {
  return img.complete && img.naturalWidth > 0;
}

/* A lazy image that hasn't loaded yet: load it, then run the callback */
function whenLoaded(img, callback) {
  if (isLoaded(img)) return true;
  img.loading = 'eager';
  img.addEventListener('load', callback, { once: true });
  return false;
}

/* The largest box with the photo's proportions that fits inside the lightbox's padding */
function fitSize(img) {
  const style = window.getComputedStyle(lightbox);
  const maxWidth =
    lightbox.clientWidth -
    parseFloat(style.paddingLeft) -
    parseFloat(style.paddingRight);
  const maxHeight =
    lightbox.clientHeight -
    parseFloat(style.paddingTop) -
    parseFloat(style.paddingBottom);
  const aspect = img.naturalWidth / img.naturalHeight;
  let width = maxWidth;
  let height = width / aspect;
  if (height > maxHeight) {
    height = maxHeight;
    width = height * aspect;
  }
  return { width, height };
}

function makeClone(img) {
  const copy = img.cloneNode(false);
  copy.className = 'zoom-lightbox_image';
  copy.removeAttribute('style');
  copy.removeAttribute('width');
  copy.removeAttribute('height');
  copy.loading = 'eager';
  // Let the browser pick a large file from srcset, if the image has one
  copy.sizes = '100vw';
  gsap.set(copy, fitSize(img));
  applyState(copy, restState());
  return copy;
}

/*
 * The clone's transform and clip, as numbers. At rest it sits in the middle of the lightbox,
 * whole. "From the thumbnail" it is scaled uniformly to cover the thumbnail's frame (like the
 * thumbnail's object-fit: cover) and clipped to that frame, in its own, unscaled pixels.
 */
function restState() {
  return { x: 0, y: 0, scale: 1, insetX: 0, insetY: 0, radius: CONFIG.radius };
}

function frameState(trigger, box) {
  const frame = trigger.getBoundingClientRect();
  const radius =
    parseFloat(window.getComputedStyle(trigger).borderTopLeftRadius) || 0;
  const scale = Math.max(frame.width / box.width, frame.height / box.height);
  return {
    x: frame.left + frame.width / 2 - (box.left + box.width / 2),
    y: frame.top + frame.height / 2 - (box.top + box.height / 2),
    scale,
    insetX: (box.width - frame.width / scale) / 2,
    insetY: (box.height - frame.height / scale) / 2,
    radius: radius / scale
  };
}

function applyState(element, state) {
  gsap.set(element, {
    x: state.x,
    y: state.y,
    scale: state.scale,
    clipPath: `inset(${state.insetY}px ${state.insetX}px round ${state.radius}px)`
  });
}

function mix(from, to, t) {
  const result = {};
  for (const key of Object.keys(from)) {
    result[key] = from[key] + (to[key] - from[key]) * t;
  }
  return result;
}

function updateControls() {
  const many = triggers.length > 1;
  lightbox
    .querySelectorAll('[data-action="prev"], [data-action="next"]')
    .forEach(button => {
      button.hidden = !many;
    });
  lightbox.querySelector('.zoom-lightbox_counter').textContent = many
    ? `${index + 1} / ${triggers.length}`
    : '';
}

function open(trigger, group) {
  if (isOpen || isAnimating) return;
  const img = imageOf(trigger);
  if (!whenLoaded(img, () => open(trigger, group))) return;

  isAnimating = true;
  triggers = group;
  index = group.indexOf(trigger);
  openScrollY = window.scrollY;

  // Open before measuring, so the lightbox has its size
  gsap.set(lightbox, { backgroundColor: CONFIG.transparent });
  lightbox.showModal();
  lightbox.focus();

  clone = makeClone(img);
  lightbox.prepend(clone);
  updateControls();

  const box = clone.getBoundingClientRect();
  const state = frameState(trigger, box);
  applyState(clone, state);

  gsap.to(lightbox, {
    backgroundColor: CONFIG.backdrop,
    duration: duration(0.3),
    ease: 'none'
  });
  gsap.to(state, {
    ...restState(),
    duration: duration(CONFIG.openDuration),
    ease: CONFIG.openEase,
    onUpdate: () => applyState(clone, state),
    onComplete: () => {
      isAnimating = false;
      isOpen = true;
      window.addEventListener('scroll', onScroll, { passive: true });
    }
  });
}

function close() {
  if (!isOpen || isAnimating) return;
  isAnimating = true;
  window.removeEventListener('scroll', onScroll);

  const trigger = triggers[index];
  // The clone is at rest here, so this is its resting box
  const box = clone.getBoundingClientRect();
  const frame = trigger.getBoundingClientRect();
  const onScreen =
    frame.bottom > 0 && frame.top < window.innerHeight && frame.width > 0;

  if (onScreen) {
    // Follow the thumbnail if the page scrolls while the photo shrinks back
    const start = restState();
    const progress = { t: 0 };
    gsap.to(progress, {
      t: 1,
      duration: duration(CONFIG.closeDuration),
      ease: CONFIG.closeEase,
      onUpdate: () =>
        applyState(clone, mix(start, frameState(trigger, box), progress.t)),
      onComplete: finishClose
    });
  } else {
    // The thumbnail is off screen (after next/previous): fade instead
    gsap.to(clone, {
      opacity: 0,
      scale: 0.9,
      duration: duration(CONFIG.closeDuration),
      ease: CONFIG.closeEase,
      onComplete: finishClose
    });
  }

  gsap.to(lightbox, {
    backgroundColor: CONFIG.transparent,
    duration: duration(0.3),
    ease: 'power2.in',
    delay: duration(CONFIG.closeDuration * 0.4)
  });
}

function finishClose() {
  const current = triggers[index];
  reset();
  lightbox.close();
  // The dialog returns focus to the thumbnail that opened it; after next/previous, the one shown
  current.focus({ preventScroll: true });
}

function reset() {
  window.removeEventListener('scroll', onScroll);
  lightbox.querySelectorAll('.zoom-lightbox_image').forEach(el => el.remove());
  gsap.set(lightbox, { clearProps: 'backgroundColor' });
  clone = null;
  isOpen = false;
  isAnimating = false;
}

function isRTL() {
  return window.getComputedStyle(lightbox).direction === 'rtl';
}

/* direction 1 = next, -1 = previous. In Hebrew, next comes in from the left */
function go(direction) {
  if (!isOpen || isAnimating || triggers.length < 2) return;
  const nextIndex = (index + direction + triggers.length) % triggers.length;
  const img = imageOf(triggers[nextIndex]);
  if (!whenLoaded(img, () => go(direction))) return;

  isAnimating = true;
  index = nextIndex;
  const outgoing = clone;
  clone = makeClone(img);
  lightbox.prepend(clone);
  updateControls();

  const shift =
    (isRTL() ? 1 : -1) * direction * Math.min(window.innerWidth * 0.3, 240);
  const time = duration(CONFIG.slideDuration);
  gsap
    .timeline({
      onComplete: () => {
        outgoing.remove();
        isAnimating = false;
      }
    })
    .to(
      outgoing,
      { x: shift, opacity: 0, duration: time, ease: CONFIG.slideEase },
      0
    )
    .fromTo(
      clone,
      { x: -shift, opacity: 0 },
      { x: 0, opacity: 1, duration: time, ease: CONFIG.slideEase },
      0
    );
}

function onLightboxClick(event) {
  const action = event.target
    .closest('[data-action]')
    ?.getAttribute('data-action');
  if (action === 'prev') {
    go(-1);
  } else if (action === 'next') {
    go(1);
  } else if (!swiped) {
    close();
  }
  swiped = false;
}

function onLightboxKeydown(event) {
  if (event.key === 'ArrowLeft') {
    go(isRTL() ? 1 : -1);
  } else if (event.key === 'ArrowRight') {
    go(isRTL() ? -1 : 1);
  }
}

function onScroll() {
  if (Math.abs(window.scrollY - openScrollY) >= 2) close();
}

/* A sideways swipe. In Hebrew, swiping right brings the next photo in from the left */
function addSwipe(dialog) {
  let startX = 0;
  let startY = 0;
  dialog.addEventListener('pointerdown', event => {
    startX = event.clientX;
    startY = event.clientY;
  });
  dialog.addEventListener('pointerup', event => {
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    if (Math.abs(dx) < CONFIG.swipeDistance || Math.abs(dx) < Math.abs(dy)) {
      return;
    }
    // The click that follows a swipe shouldn't close the lightbox
    swiped = true;
    go(dx > 0 === isRTL() ? 1 : -1);
  });
}
