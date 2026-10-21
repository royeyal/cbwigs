gsap.defaults({
  ease: 'power4.inOut',
  duration: 0.8
});

// Detect RTL direction
function isRTL() {
  const htmlDir = document.documentElement.dir || document.dir;
  const bodyDir = document.body.dir;
  const computedStyle = window.getComputedStyle(document.documentElement);
  const cssDirection = computedStyle.direction;

  if (htmlDir) return htmlDir.toLowerCase() === 'rtl';
  if (bodyDir) return bodyDir.toLowerCase() === 'rtl';
  if (cssDirection) return cssDirection.toLowerCase() === 'rtl';

  return false;
}

// Visible text and accessible names for the nav buttons, and the dialog's
// name. The script owns the button text because Webflow can't localize it
// (the labels are custom span elements). Each name contains its visible text,
// so speech input still matches.
const LABELS = {
  he: {
    dialog: 'גלריית תמונות',
    prev: { text: 'הקודם', name: 'התמונה הקודמת' },
    next: { text: 'הבא', name: 'התמונה הבאה' },
    close: { text: 'סגירה', name: 'סגירה' }
  },
  en: {
    dialog: 'Photo gallery',
    prev: { text: 'Previous', name: 'Previous image' },
    next: { text: 'Next', name: 'Next image' },
    close: { text: 'Close', name: 'Close' }
  }
};

function setLabel(element, label) {
  if (element && !element.hasAttribute('aria-label')) {
    element.setAttribute('aria-label', label);
  }
}

function setButtonLabel(button, { text, name }) {
  if (!button) return;
  const textElement = button.querySelector('span');
  if (textElement) textElement.textContent = text;
  setLabel(button, name);
}

function createLightbox(
  container,
  {
    onStart,
    onOpen,
    onClose,
    onCloseComplete,
    fadeGridOnOpen = true,
    flipBackOnClose = false
  } = {}
) {
  // Detect RTL layout
  const isRTLLayout = isRTL();

  const elements = {
    wrapper: container.querySelector('[data-lightbox="wrapper"]'),
    triggers: container.querySelectorAll('[data-lightbox="trigger"]'),
    triggerParents: container.querySelectorAll(
      '[data-lightbox="trigger-parent"]'
    ),
    items: container.querySelectorAll('[data-lightbox="item"]'),
    nav: container.querySelectorAll('[data-lightbox="nav"]'),
    counter: {
      current: container.querySelector('[data-lightbox="counter-current"]'),
      total: container.querySelector('[data-lightbox="counter-total"]')
    },
    buttons: {
      prev: container.querySelector('[data-lightbox="prev"]'),
      next: container.querySelector('[data-lightbox="next"]'),
      close: container.querySelector('[data-lightbox="close"]')
    }
  };

  if (!elements.wrapper || !elements.items.length) return;

  // Webflow's .padding-global (position: relative; z-index: 2) gives every
  // section its own stacking context, which traps the fixed wrapper under
  // later sections and the navbar. On <body> it covers the whole page.
  document.body.appendChild(elements.wrapper);

  // The clicked image moves into the wrapper while open, so look for it in
  // both places.
  const find = selector =>
    container.querySelector(selector) ||
    elements.wrapper.querySelector(selector);

  const labels = document.documentElement.lang.startsWith('he')
    ? LABELS.he
    : LABELS.en;
  setLabel(elements.wrapper, labels.dialog);
  setButtonLabel(elements.buttons.prev, labels.prev);
  setButtonLabel(elements.buttons.next, labels.next);
  setButtonLabel(elements.buttons.close, labels.close);

  let isOpen = false;
  let openedFrom = null;

  // Create our main timeline that will coordinate all animations
  const mainTimeline = gsap.timeline();

  // ————————— COUNTER ————————— //
  if (elements.counter.total) {
    elements.counter.total.textContent = elements.triggers.length;
  }

  // ————————— CLOSE FUNCTION ————————— //
  function closeLightbox() {
    if (!isOpen) return;
    isOpen = false;

    // on close callback
    onClose?.();

    document.documentElement.classList.remove('is-lightbox-open');
    openedFrom?.focus({ preventScroll: true });

    // First, we clear any running animations to prevent conflicts
    mainTimeline.clear();
    gsap.killTweensOf([
      elements.wrapper,
      elements.nav,
      elements.triggerParents,
      elements.items,
      find('[data-lightbox="original"]')
    ]);

    const tl = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      onComplete: () => {
        elements.wrapper.classList.remove('is-active');

        // Show all hidden images in lightbox items
        elements.items.forEach(item => {
          item.classList.remove('is-active');
          const lightboxImage = item.querySelector('img');
          if (lightboxImage) {
            lightboxImage.style.display = '';
          }
        });

        // Clear any lingering transform properties on the original image
        const originalImg = find('[data-lightbox="original"]');
        if (originalImg) {
          gsap.set(originalImg, { clearProps: 'all' });
        }

        // Remove the fixed height from the trigger parent
        const originalParent = container.querySelector(
          '[data-lightbox="original-parent"]'
        );
        if (originalParent) {
          originalParent.parentElement.style.removeProperty('height');
        }

        // on close complete callback
        onCloseComplete?.();
      }
    });

    // First, find and move back the original item
    const originalItem = find('[data-lightbox="original"]');
    const originalParent = container.querySelector(
      '[data-lightbox="original-parent"]'
    );

    if (originalItem && originalParent) {
      if (flipBackOnClose) {
        // Get the state before moving for Flip animation
        const state = Flip.getState(originalItem);

        // Move the item back to its original parent
        originalParent.appendChild(originalItem);

        // Animate the flip back
        tl.add(
          Flip.from(state, {
            targets: originalItem,
            absolute: true,
            duration: 0.6,
            ease: 'power2.inOut',
            onComplete: () => {
              originalParent.removeAttribute('data-lightbox');
              originalItem.removeAttribute('data-lightbox');
              gsap.set(originalItem, { clearProps: 'all' });
            }
          }),
          0
        );
      } else {
        // Just move it back without animation
        gsap.set(originalItem, { clearProps: 'all' });
        originalParent.appendChild(originalItem);
        originalParent.removeAttribute('data-lightbox');
        originalItem.removeAttribute('data-lightbox');
      }
    }

    // Find active slide
    const activeLightboxSlide = elements.wrapper.querySelector(
      '[data-lightbox="item"].is-active'
    );

    // Return animation
    // Only animate grid items back if they were faded out
    if (fadeGridOnOpen) {
      tl.to(elements.triggerParents, {
        autoAlpha: 1,
        duration: 0.5,
        stagger: 0.03,
        overwrite: true
      });
    }

    tl.to(
      elements.nav,
      {
        autoAlpha: 0,
        y: '1rem',
        duration: 0.4,
        stagger: 0
      },
      fadeGridOnOpen ? '<' : 0
    )
      .to(
        elements.wrapper,
        {
          backgroundColor: 'rgba(0,0,0,0)',
          duration: 0.4
        },
        '<'
      )
      .to(
        activeLightboxSlide,
        {
          autoAlpha: 0,
          duration: 0.4
        },
        '<'
      )
      .set([elements.items, activeLightboxSlide, elements.triggerParents], {
        clearProps: fadeGridOnOpen ? 'all' : 'opacity,visibility'
      });

    // Add this timeline to our main timeline
    mainTimeline.add(tl);
  }

  // ————————— CLICK-OUTSIDE FUNCTIONALITY ————————— //
  function handleOutsideClick(event) {
    if (event.detail === 0) {
      return;
    }

    const clickedElement = event.target;
    const isOutside = !clickedElement.closest(
      '[data-lightbox="item"].is-active img, [data-lightbox="nav"], [data-lightbox="close"]'
    );

    if (isOutside) {
      closeLightbox();
    }
  }

  // The wrapper is no longer inside the container, so listen on it directly
  elements.wrapper.addEventListener('click', handleOutsideClick);

  // ————————— TOGGLE ACTIVE ITEM IN LIGHTBOX ————————— //
  function updateActiveItem(index) {
    elements.items.forEach(item => item.classList.remove('is-active'));
    elements.items[index].classList.add('is-active');

    if (elements.counter.current) {
      elements.counter.current.textContent = index + 1;
    }
  }

  // ————————— CLICK TO OPEN ————————— //
  elements.triggers.forEach((trigger, index) => {
    trigger.addEventListener('click', () => {
      // On start of open callback
      onStart?.();

      isOpen = true;
      openedFrom = trigger;
      document.documentElement.classList.add('is-lightbox-open');

      // Clear any running animations before starting new ones
      mainTimeline.clear();
      gsap.killTweensOf([
        elements.wrapper,
        elements.nav,
        elements.triggerParents
      ]);

      const img = trigger.querySelector('img');
      const state = Flip.getState(img);

      // Store the trigger's current height before the FLIP animation
      // So the grid does not collapse
      const triggerRect = trigger.getBoundingClientRect();
      trigger.parentElement.style.height = `${triggerRect.height}px`;

      // Save element and parent that was clicked
      trigger.setAttribute('data-lightbox', 'original-parent');
      img.setAttribute('data-lightbox', 'original');

      // Set correct lightbox item to visible
      updateActiveItem(index);

      const tl = gsap.timeline({
        onComplete: () => {
          // The nav is hidden until it fades in, so focus it only now
          elements.buttons.close?.focus({ preventScroll: true });

          // On open callback
          onOpen?.();
        }
      });
      elements.wrapper.classList.add('is-active');
      const targetItem = elements.items[index];

      // Hide the original image in the lightbox item
      const lightboxImage = targetItem.querySelector('img');
      if (lightboxImage) {
        lightboxImage.style.display = 'none';
      }

      // Fade out other grid items (if enabled)
      if (fadeGridOnOpen) {
        elements.triggerParents.forEach(otherTrigger => {
          if (otherTrigger !== trigger) {
            gsap.to(otherTrigger, {
              autoAlpha: 0,
              duration: 0.4,
              stagger: 0.02,
              overwrite: true
            });
          }
        });
      }

      // Flip clicked image into lightbox
      if (!targetItem.contains(img)) {
        targetItem.appendChild(img);
        tl.add(
          Flip.from(state, {
            targets: img,
            absolute: true,
            duration: 0.6,
            ease: 'power2.inOut'
          }),
          0
        );
      }

      // Animate in our navigation and background
      tl.to(
        elements.wrapper,
        {
          backgroundColor: 'rgba(0,0,0,0.75)',
          duration: 0.6
        },
        0
      ).fromTo(
        elements.nav,
        {
          autoAlpha: 0,
          y: '1rem'
        },
        {
          autoAlpha: 1,
          y: '0rem',
          duration: 0.6,
          stagger: { each: 0.05, from: 'center' }
        },
        0.2
      );

      // Add this timeline to our main timeline
      mainTimeline.add(tl);
    });
  });

  // ————————— NAV BUTTONS ————————— //
  // No RTL swap: the nav row mirrors in RTL, so "prev" already sits on the
  // reading-start side (the right in Hebrew).
  const nextButton = elements.buttons.next;
  const prevButton = elements.buttons.prev;

  if (nextButton) {
    nextButton.addEventListener('click', () => {
      const currentIndex = Array.from(elements.items).findIndex(item =>
        item.classList.contains('is-active')
      );
      const nextIndex = (currentIndex + 1) % elements.items.length;
      updateActiveItem(nextIndex);
    });
  }

  if (prevButton) {
    prevButton.addEventListener('click', () => {
      const currentIndex = Array.from(elements.items).findIndex(item =>
        item.classList.contains('is-active')
      );
      const prevIndex =
        (currentIndex - 1 + elements.items.length) % elements.items.length;
      updateActiveItem(prevIndex);
    });
  }

  if (elements.buttons.close) {
    elements.buttons.close.addEventListener('click', closeLightbox);
  }

  // ————————— KEYBOARD NAV ————————— //
  document.addEventListener('keydown', event => {
    if (!isOpen) return;
    switch (event.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'Tab': {
        // Keep focus inside the dialog
        const buttons = Array.from(elements.wrapper.querySelectorAll('button'));
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        const inside = elements.wrapper.contains(document.activeElement);
        if (event.shiftKey && (!inside || document.activeElement === first)) {
          event.preventDefault();
          last?.focus();
        } else if (
          !event.shiftKey &&
          (!inside || document.activeElement === last)
        ) {
          event.preventDefault();
          first?.focus();
        }
        break;
      }
      case 'ArrowRight':
        // In RTL, right arrow goes to previous
        if (isRTLLayout) {
          prevButton?.click();
        } else {
          nextButton?.click();
        }
        break;
      case 'ArrowLeft':
        // In RTL, left arrow goes to next
        if (isRTLLayout) {
          nextButton?.click();
        } else {
          prevButton?.click();
        }
        break;
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const wrappers = document.querySelectorAll('[data-gallery]');
  wrappers.forEach(wrapper => {
    // SUPPORTED CALLBACKS:
    createLightbox(wrapper, {
      //   onStart: () => console.log("Starting"),
      //   onOpen: () => console.log("Open"),
      //   onClose: () => console.log("Closing"),
      //   onCloseComplete: () => console.log("Done"),
      fadeGridOnOpen: false, // Default: true (fades out grid items)
      flipBackOnClose: true // Default: false (image fades out vs animates back)
    });
  });
});
