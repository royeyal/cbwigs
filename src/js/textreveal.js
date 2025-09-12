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

    const headings = document.querySelectorAll('[data-split="heading"]');

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
        const split = new SplitText(heading, {
          type: 'lines,words',
          linesClass: 'line',
          wordsClass: 'word',
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
              gsap.set(targetElement, { visibility: 'visible' });
            } catch (error) {
              console.error('❌ Failed to set visibility:', error);
            }
          }
        });

        // Add split-ready class after successful split
        if (split.lines && split.lines.length > 0) {
          heading.classList.add('split-ready');
        }

        // Set up scroll animation only if we have words to animate
        if (split.words && split.words.length > 0) {
          // Set initial state
          gsap.set(split.words, {
            yPercent: 100,
            opacity: 0
          });

          // Create scroll trigger
          ScrollTrigger.create({
            trigger: heading,
            start: 'top 80%',
            onEnter: () => {
              gsap.to(split.words, {
                yPercent: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.08,
                ease: 'power2.out'
              });
            }
          });
        }
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
