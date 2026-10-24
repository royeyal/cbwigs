// Masked heading reveal: SplitText slides a heading's lines, words or
// characters up into view. See docs/text-reveal.md.

// Section titles reveal without any attribute: an h2 styled as a display
// heading. Card titles, rich-text headings and other h2 styles stay static.
const AUTO_TARGETS = 'h2.heading-style-h1, h2.heading-style-h2';

// Anything else opts in with an attribute; data-split-reveal="none" opts out.
const OPT_IN_TARGETS = '[data-split="heading"], [data-split-reveal]';

const SPLIT_CONFIG = {
  lines: { duration: 0.8, stagger: 0.08 },
  words: { duration: 0.6, stagger: 0.06 },
  chars: { duration: 0.4, stagger: 0.01 }
};

const SPLIT_TYPES = {
  lines: 'lines',
  words: 'lines,words',
  chars: 'lines,words,chars'
};

// Undoes the CSS that hides [data-split="heading"] before first paint.
const show = el => el.classList.add('split-ready');

// Split lines are blocks only as wide as their own text, so a split element
// is as wide as its longest line. Inside a parent that shrinks to fit (a grid
// item with justify-self: end, a flex item) the parent narrows and shifts
// until revert(), then jumps. Holding the unsplit width avoids that;
// max-width lets it still shrink with the viewport, which re-splits.
// The computed width is rounded down to 3 decimals, and split text is a
// fraction of a pixel wider than unsplit text, so pinning it exactly wraps a
// one-line heading onto two lines until the revert (a layout shift). Round
// up and add 1px; max-width keeps a full-width heading inside its parent.
function pinWidth(el) {
  const { width, maxWidth } = el.style;
  el.style.width = `${Math.ceil(parseFloat(getComputedStyle(el).width)) + 1}px`;
  el.style.maxWidth = '100%';
  return () => {
    el.style.width = width;
    el.style.maxWidth = maxWidth;
  };
}

function reveal(heading, playNow) {
  const type = SPLIT_CONFIG[heading.dataset.splitReveal]
    ? heading.dataset.splitReveal
    : 'lines';
  const { duration, stagger } = SPLIT_CONFIG[type];
  const unpinWidth = pinWidth(heading);

  try {
    SplitText.create(heading, {
      type: SPLIT_TYPES[type],
      mask: 'lines', // wrap each line in an overflow: clip div
      autoSplit: true,
      linesClass: 'line',
      wordsClass: 'word',
      charsClass: 'char',
      // Runs again on every re-split. SplitText reverts the animation returned
      // here (and with it its ScrollTrigger) first, so triggers don't pile up.
      onSplit(self) {
        show(heading);
        return gsap.from(self[type], {
          yPercent: 100,
          opacity: 0,
          duration,
          stagger,
          ease: 'expo.out',
          scrollTrigger: playNow
            ? undefined
            : { trigger: heading, start: 'clamp(top 90%)', once: true },
          // Back to the original markup for screen readers and resizing
          onComplete: () => {
            self.revert();
            unpinWidth();
          }
        });
      }
    });
  } catch (error) {
    unpinWidth();
    throw error;
  }
}

function initMaskTextScrollReveal() {
  const targets = document.querySelectorAll(
    `${AUTO_TARGETS}, ${OPT_IN_TARGETS}`
  );
  if (!targets.length) {
    return;
  }

  if (
    typeof gsap === 'undefined' ||
    typeof SplitText === 'undefined' ||
    typeof ScrollTrigger === 'undefined'
  ) {
    console.error(
      '❌ Text reveal needs GSAP with SplitText and ScrollTrigger; showing headings without animation.'
    );
    targets.forEach(show);
    return;
  }

  // The CSS already keeps every heading visible for reduced motion.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  gsap.registerPlugin(SplitText, ScrollTrigger);

  const run = () => {
    targets.forEach(heading => {
      if (
        heading.dataset.splitReveal === 'none' ||
        !heading.textContent.trim()
      ) {
        show(heading);
        return;
      }

      // Never hide text that's already on screen. A heading the CSS hid
      // before first paint (data-split="heading") reveals right away;
      // any other one is left as it is.
      const onScreen = heading.getBoundingClientRect().top < window.innerHeight;
      if (onScreen && !heading.matches('[data-split="heading"]')) {
        return;
      }

      try {
        reveal(heading, onScreen);
      } catch (error) {
        console.error('❌ Text reveal failed:', heading, error);
        show(heading);
      }
    });
  };

  // Split after the web fonts load, so line breaks match the real font.
  (document.fonts?.ready ?? Promise.resolve()).then(run, run);
}

export { initMaskTextScrollReveal };
