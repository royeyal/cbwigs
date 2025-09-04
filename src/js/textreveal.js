// filepath: /Users/royeyal/Documents/GitHub/cbwigs/src/js/textreveal.js
// Ensure GSAP plugins are registered (GSAP is loaded elsewhere)
try {
  if (typeof gsap !== 'undefined' && typeof SplitText !== 'undefined') {
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(SplitText, ScrollTrigger);
    } else {
      gsap.registerPlugin(SplitText);
    }
  }
} catch (_) {}

const splitConfig = {
  lines: { duration: 0.8, stagger: 0.08 },
  words: { duration: 0.6, stagger: 0.06 },
  chars: { duration: 0.4, stagger: 0.01 }
};

function initMaskTextScrollReveal() {
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

document.addEventListener('DOMContentLoaded', () => {
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready
      .then(initMaskTextScrollReveal)
      .catch(initMaskTextScrollReveal);
  } else {
    initMaskTextScrollReveal();
  }
});

// Export for potential module usage
export { initMaskTextScrollReveal };