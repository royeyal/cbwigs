// filepath: /Users/royeyal/Documents/GitHub/cbwigs/src/js/textreveal.js

function initMaskTextScrollReveal() {
  console.log('🚨🚨🚨 TEXT REVEAL FUNCTION CALLED 🚨🚨🚨');
  console.log('🎯 initMaskTextScrollReveal: Starting initialization...');

  // Wait for fonts to load before initializing
  console.log('🔤 Checking font loading status...');

  function initializeTextReveal() {
    console.log(
      '✅ Fonts loaded, proceeding with text reveal initialization...'
    );

    // Ensure GSAP and required plugins are available
    if (typeof gsap === 'undefined') {
      console.error(
        '❌ GSAP is required for text reveal functionality. Please include GSAP in your project.'
      );
      return;
    }
    console.log(
      '✅ GSAP found:',
      typeof gsap,
      gsap.version || 'version unknown'
    );

    if (typeof SplitText === 'undefined') {
      console.error(
        '❌ GSAP SplitText plugin is required for text reveal functionality. Please include SplitText plugin.'
      );
      return;
    }
    console.log('✅ SplitText plugin found:', typeof SplitText);

    if (typeof ScrollTrigger === 'undefined') {
      console.error(
        '❌ GSAP ScrollTrigger plugin is required for text reveal functionality. Please include ScrollTrigger plugin.'
      );
      return;
    }
    console.log('✅ ScrollTrigger plugin found:', typeof ScrollTrigger);

    try {
      gsap.registerPlugin(SplitText, ScrollTrigger);
      console.log('✅ GSAP plugins registered successfully');
    } catch (_) {
      console.error('❌ Failed to register GSAP plugins');
      return;
    }

    const headings = document.querySelectorAll('[data-split="heading"]');
    console.log(
      '🔍 Found headings with data-split="heading":',
      headings.length
    );

    if (!headings.length) {
      console.log(
        'ℹ️ No text reveal elements found - this is normal, exiting gracefully'
      );
      return;
    }

    headings.forEach((heading, index) => {
      console.log(
        `📝 Processing heading ${index + 1}/${headings.length}:`,
        heading
      );
      console.log('  - Text content:', heading.textContent.trim());
      console.log('  - Element type:', heading.tagName);

      // Validate element has content
      if (!heading.textContent.trim()) {
        console.warn('⚠️ Heading has no text content, skipping:', heading);
        return;
      }

      try {
        console.log('✂️ Creating SplitText instance...');

        const split = new SplitText(heading, {
          type: 'lines,words',
          linesClass: 'line',
          wordsClass: 'word',
          onSplit(self) {
            console.log('🚨🚨🚨 ONSPLIT CALLBACK TRIGGERED 🚨🚨🚨');
            console.log('🎭 SplitText onSplit callback triggered');
            console.log('  - Self object:', self);
            console.log('  - Original element (self.original):', self.original);
            console.log('  - Elements array (self.elements):', self.elements);
            console.log(
              '  - First element (self.elements[0]):',
              self.elements?.[0]
            );
            console.log('  - Heading element from scope:', heading);
            console.log('  - Lines created:', self.lines?.length || 0);
            console.log('  - Words created:', self.words?.length || 0);

            // Use the heading element from the outer scope instead of self.original
            const targetElement =
              self.original || self.elements?.[0] || heading;

            console.log('🎯 Target element for visibility:', targetElement);

            if (!targetElement) {
              console.error('❌ No target element available!');
              return;
            }

            if (!document.contains(targetElement)) {
              console.error('❌ Target element is not in the DOM!');
              return;
            }

            console.log('✅ About to call gsap.set() on:', targetElement);

            try {
              console.log('🔧 Setting visibility on target element...');
              gsap.set(targetElement, { visibility: 'visible' });
              console.log('✅ Visibility set successfully');
            } catch (error) {
              console.error('❌ Failed to set visibility:', error);
              console.error('❌ Error details:', error.message, error.stack);
            }
          }
        });

        console.log('✅ SplitText created successfully:', split);
        console.log('  - Lines:', split.lines?.length || 0);
        console.log('  - Words:', split.words?.length || 0);

        // Add split-ready class after successful split
        if (split.lines && split.lines.length > 0) {
          heading.classList.add('split-ready');
          console.log('✅ Added split-ready class to heading');
        } else {
          console.warn(
            '⚠️ No lines created by SplitText, not adding split-ready class'
          );
        }

        // Set up scroll animation only if we have words to animate
        if (split.words && split.words.length > 0) {
          console.log('🎬 Setting up scroll animation...');

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
              console.log('🎯 ScrollTrigger activated for heading:', heading);
              gsap.to(split.words, {
                yPercent: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.08,
                ease: 'power2.out'
              });
            }
          });

          console.log('✅ Scroll animation setup complete');
        }
      } catch (error) {
        console.error('❌ Error processing heading:', error);
        console.error('  - Heading element:', heading);
      }
    });

    console.log('✅ Text reveal initialization complete');
  } // End of initializeTextReveal function

  // Check if fonts are already loaded
  if (document.fonts && document.fonts.ready) {
    console.log('🔤 Using document.fonts.ready API...');
    document.fonts.ready
      .then(() => {
        console.log('✅ Fonts loaded via document.fonts.ready');
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
    console.log(
      '🔤 document.fonts not supported, using load event fallback...'
    );
    // Fallback for older browsers
    if (document.readyState === 'complete') {
      console.log('✅ Document already complete, initializing immediately');
      initializeTextReveal();
    } else {
      window.addEventListener('load', () => {
        console.log('✅ Window load event fired, initializing text reveal');
        initializeTextReveal();
      });
    }
  }
}

// Export function for use in main module
export { initMaskTextScrollReveal };
