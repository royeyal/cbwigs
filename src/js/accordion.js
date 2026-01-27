function initAccordionCSS() {
  // console.log('🎵 Initializing accordion functionality...');

  document.querySelectorAll('[data-accordion-css-init]').forEach(accordion => {
    const closeSiblings =
      accordion.getAttribute('data-accordion-close-siblings') === 'true';
    const accordionItems = accordion.querySelectorAll(
      '[data-accordion-status]'
    );

    // Initialize ARIA attributes and keyboard support for each item
    accordionItems.forEach(item => {
      const toggle = item.querySelector('[data-accordion-toggle]');
      const content = item.querySelector('.accordion-css__item-bottom');

      if (!toggle || !content) return;

      // Generate unique IDs for ARIA relationships
      const contentId = `accordion-content-${Math.random().toString(36).substr(2, 9)}`;
      content.id = contentId;

      // Add ARIA attributes to toggle
      toggle.setAttribute('role', 'button');
      toggle.setAttribute('aria-controls', contentId);
      toggle.setAttribute('tabindex', '0');

      // Set initial aria-expanded based on current status
      const isActive = item.getAttribute('data-accordion-status') === 'active';
      toggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    });

    // Function to toggle accordion item
    const toggleAccordionItem = singleAccordion => {
      const toggle = singleAccordion.querySelector('[data-accordion-toggle]');
      if (!toggle) return;

      const isActive =
        singleAccordion.getAttribute('data-accordion-status') === 'active';
      const newStatus = isActive ? 'not-active' : 'active';

      singleAccordion.setAttribute('data-accordion-status', newStatus);
      toggle.setAttribute(
        'aria-expanded',
        newStatus === 'active' ? 'true' : 'false'
      );

      // When [data-accordion-close-siblings="true"]
      if (closeSiblings && !isActive) {
        accordion
          .querySelectorAll('[data-accordion-status="active"]')
          .forEach(sibling => {
            if (sibling !== singleAccordion) {
              sibling.setAttribute('data-accordion-status', 'not-active');
              const siblingToggle = sibling.querySelector(
                '[data-accordion-toggle]'
              );
              if (siblingToggle) {
                siblingToggle.setAttribute('aria-expanded', 'false');
              }
            }
          });
      }
    };

    // Click handler
    accordion.addEventListener('click', event => {
      const toggle = event.target.closest('[data-accordion-toggle]');
      if (!toggle) return;

      const singleAccordion = toggle.closest('[data-accordion-status]');
      if (!singleAccordion) return;

      toggleAccordionItem(singleAccordion);
    });

    // Keyboard handler
    accordion.addEventListener('keydown', event => {
      const toggle = event.target.closest('[data-accordion-toggle]');
      if (!toggle) return;

      const singleAccordion = toggle.closest('[data-accordion-status]');
      if (!singleAccordion) return;

      // Enter or Space to toggle
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleAccordionItem(singleAccordion);
      }

      // Arrow key navigation (optional but recommended for a11y)
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        const currentIndex =
          Array.from(accordionItems).indexOf(singleAccordion);
        let nextIndex;

        if (event.key === 'ArrowDown') {
          nextIndex = (currentIndex + 1) % accordionItems.length;
        } else {
          nextIndex =
            (currentIndex - 1 + accordionItems.length) % accordionItems.length;
        }

        const nextToggle = accordionItems[nextIndex].querySelector(
          '[data-accordion-toggle]'
        );
        if (nextToggle) {
          nextToggle.focus();
        }
      }

      // Home/End keys to jump to first/last item
      if (event.key === 'Home') {
        event.preventDefault();
        const firstToggle = accordionItems[0].querySelector(
          '[data-accordion-toggle]'
        );
        if (firstToggle) firstToggle.focus();
      }

      if (event.key === 'End') {
        event.preventDefault();
        const lastToggle = accordionItems[
          accordionItems.length - 1
        ].querySelector('[data-accordion-toggle]');
        if (lastToggle) lastToggle.focus();
      }
    });
  });

  // console.log('✅ Accordion initialization complete!');
}

// Export the function for use in main.js
export { initAccordionCSS };
