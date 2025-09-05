// filepath: /Users/royeyal/Documents/GitHub/cbwigs/src/js/textreveal.js

const splitConfig = {
  lines: { duration: 0.8, stagger: 0.08 },
  words: { duration: 0.6, stagger: 0.06 },
  chars: { duration: 0.4, stagger: 0.01 }
};

function initMaskTextScrollReveal() {
  // Ensure GSAP plugins are available
  if (typeof gsap === 'undefined') {
    console.error(
      'GSAP is required for text reveal animations. Please include GSAP in your project.'
    );
    return;
  }

  if (typeof SplitText === 'undefined') {
    console.error(
      'GSAP SplitText plugin is required for text reveal animations. Please include SplitText plugin.'
    );
    return;
  }

  if (typeof ScrollTrigger === 'undefined') {
    console.error(
      'GSAP ScrollTrigger plugin is required for text reveal animations. Please include ScrollTrigger plugin.'
    );
    return;
  }

  try {
    gsap.registerPlugin(SplitText, ScrollTrigger);
  } catch (error) {
    console.error('Failed to register GSAP plugins:', error);
    return;
  }
  const headings = document.querySelectorAll('[data-split="heading"]');
  if (!headings.length) return;

  headings.forEach(heading => {
    const type = heading.dataset.splitReveal || 'lines';
    const typesToSplit =
      type === 'lines'
        ? 'lines'
        : type === 'words'
          ? 'lines, words'
          : 'lines, words, chars';

    SplitText.create(heading, {
      type: typesToSplit,
      mask: 'lines', // v3.13+: wrap lines with a clipping element
      autoSplit: true,
      linesClass: 'line',
      wordsClass: 'word',
      charsClass: 'letter',
      onSplit(self) {
        const targets =
          type === 'lines'
            ? self.lines
            : type === 'words'
              ? self.words
              : self.chars;

        const cfg = splitConfig[type];

        heading.classList.add('split-ready'); // new: wins any CSS specificity games
        gsap.set(self.original, { visibility: 'visible' }); // existing: sets inline style

        return gsap.from(targets, {
          yPercent: 110,
          duration: cfg.duration,
          stagger: cfg.stagger,
          ease: 'expo.out',
          scrollTrigger:
            typeof ScrollTrigger !== 'undefined'
              ? {
                  trigger: heading,
                  start: 'top 80%',
                  once: true
                }
              : undefined,
          onComplete: () => self.revert()
        });
      }
    });
  });
}

// Export function for use in main module
export { initMaskTextScrollReveal };
