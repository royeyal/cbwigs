// filepath: /Users/royeyal/Documents/GitHub/cbwigs/src/js/textreveal.js

function initMaskTextScrollReveal() {
  // Wait for fonts to load before initializing
  function initializeTextReveal() {
    // Ensure GSAP and required plugins are available
    if (typeof gsap === 'undefined') {
      console.error(
        '❌ GSAP is required for text reveal functionality. Please include GSAP in your project.'
      );
      return;
    }

    if (typeof SplitText === 'undefined') {
      console.error(
        '❌ GSAP SplitText plugin is required for text reveal functionality. Please include SplitText plugin.'
      );
      return;
    }

    if (typeof ScrollTrigger === 'undefined') {
      console.error(
        '❌ GSAP ScrollTrigger plugin is required for text reveal functionality. Please include ScrollTrigger plugin.'
      );
      return;
    }

    try {
      gsap.registerPlugin(SplitText, ScrollTrigger);
    } catch (_) {
      console.error('❌ Failed to register GSAP plugins');
      return;
    }

    // Configuration for different split types
    const splitConfig = {
      lines: { duration: 0.8, stagger: 0.08 },
      words: { duration: 0.6, stagger: 0.06 },
      chars: { duration: 0.4, stagger: 0.01 }
    };

    const headings = document.querySelectorAll(
      '[data-split="heading"], [data-split-reveal]'
    );

    if (!headings.length) {
      return;
    }

    headings.forEach((heading, _index) => {
      // Validate element has content
      if (!heading.textContent.trim()) {
        console.warn('⚠️ Heading has no text content, skipping:', heading);
        return;
      }

      try {
        // Find the split type, the default is 'lines'
        const type = heading.dataset.splitReveal || 'lines';
        const typesToSplit =
          type === 'lines'
            ? ['lines']
            : type === 'words'
              ? ['lines', 'words']
              : ['lines', 'words', 'chars'];

        const config = splitConfig[type] || splitConfig.lines;

        // Use GSAP 3.13.0+ autoSplit with onRevert functionality
        SplitText.create(heading, {
          type: typesToSplit.join(','),
          mask: 'lines', // wrap each line in an overflow:hidden div
          autoSplit: true,
          linesClass: 'line',
          wordsClass: 'word',
          charsClass: 'char',
          onSplit(self) {
            // Use the heading element from the outer scope instead of self.original
            const targetElement =
              self.original || self.elements?.[0] || heading;

            if (!targetElement) {
              console.error('❌ No target element available!');
              return;
            }

            if (!document.contains(targetElement)) {
              console.error('❌ Target element is not in the DOM!');
              return;
            }

            try {
              gsap.set(targetElement, { autoAlpha: 1 });
            } catch (error) {
              console.error('❌ Failed to set visibility:', error);
            }

            // Add split-ready class after successful split
            if (self.lines && self.lines.length > 0) {
              heading.classList.add('split-ready');
            }

            // Determine which elements to animate based on type
            const elementsToAnimate =
              type === 'lines'
                ? self.lines
                : type === 'words'
                  ? self.words
                  : self.chars;

            // Return animation - it will be cleaned up and time-synced on each onSplit() call
            if (elementsToAnimate && elementsToAnimate.length > 0) {
              // Set initial state
              gsap.set(elementsToAnimate, {
                yPercent: 100,
                opacity: 0
              });

              // Check if heading is an H1 tag
              const isH1 = heading.tagName.toLowerCase() === 'h1';

              if (isH1) {
                // For H1 tags, animate immediately without ScrollTrigger
                return gsap.to(elementsToAnimate, {
                  yPercent: 0,
                  opacity: 1,
                  duration: config.duration,
                  stagger: config.stagger,
                  ease: 'expo.out',
                  onComplete: () => {
                    // Revert the element to its original (unsplit) state after animation
                    // This helps with performance and accessibility
                    self.revert();
                  }
                });
              } else {
                // For other headings, use ScrollTrigger
                return ScrollTrigger.create({
                  trigger: heading,
                  start: 'clamp(top 80%)',
                  onEnter: () => {
                    gsap.to(elementsToAnimate, {
                      yPercent: 0,
                      opacity: 1,
                      duration: config.duration,
                      stagger: config.stagger,
                      ease: 'expo.out',
                      onComplete: () => {
                        // Revert the element to its original (unsplit) state after animation
                        // This helps with performance and accessibility
                        self.revert();
                      }
                    });
                  }
                });
              }
            }
          }
        });
      } catch (error) {
        console.error('❌ Error processing heading:', error);
      }
    });
  } // End of initializeTextReveal function

  // Check if fonts are already loaded
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready
      .then(() => {
        initializeTextReveal();
      })
      .catch(error => {
        console.warn(
          '⚠️ Font loading detection failed, proceeding anyway:',
          error
        );
        initializeTextReveal();
      });
  } else {
    // Fallback for older browsers
    if (document.readyState === 'complete') {
      initializeTextReveal();
    } else {
      window.addEventListener('load', () => {
        initializeTextReveal();
      });
    }
  }
}

// Export function for use in main module
export { initMaskTextScrollReveal };
