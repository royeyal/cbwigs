function initBasicGSAPSlider() {
  // Ensure GSAP and Draggable are available
  if (typeof gsap === 'undefined') {
    console.error(
      '❌ GSAP is required for slider functionality. Please include GSAP in your project.'
    );
    return;
  }

  if (typeof Draggable === 'undefined') {
    console.error(
      '❌ GSAP Draggable plugin is required for slider functionality. Please include Draggable plugin.'
    );
    return;
  }

  try {
    gsap.registerPlugin(Draggable);
  } catch (error) {
    console.error('❌ Failed to register GSAP Draggable plugin:', error);
    return;
  }

  // Check if any sliders exist on the page
  const sliderElements = document.querySelectorAll('[data-gsap-slider-init]');

  if (sliderElements.length === 0) {
    return;
  }

  sliderElements.forEach((root, _index) => {
    if (root._sliderDraggable) {
      root._sliderDraggable.kill();
    }

    const collection = root.querySelector('[data-gsap-slider-collection]');
    const track = root.querySelector('[data-gsap-slider-list]');
    const items = Array.from(root.querySelectorAll('[data-gsap-slider-item]'));
    const controls = Array.from(
      root.querySelectorAll('[data-gsap-slider-control]')
    );

    // Validate required elements
    if (!collection) {
      console.error(
        '❌ Missing required element: [data-gsap-slider-collection]'
      );
      return;
    }
    if (!track) {
      console.error('❌ Missing required element: [data-gsap-slider-list]');
      return;
    }
    if (items.length === 0) {
      console.error('❌ No slider items found: [data-gsap-slider-item]');
      return;
    }

    // Inject aria attributes
    console.log('♿ Setting up accessibility attributes...');
    root.setAttribute('role', 'region');
    root.setAttribute('aria-roledescription', 'carousel');
    root.setAttribute('aria-label', 'Slider');
    collection.setAttribute('role', 'group');
    collection.setAttribute('aria-roledescription', 'Slides List');
    collection.setAttribute('aria-label', 'Slides');
    items.forEach((slide, i) => {
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-roledescription', 'Slide');
      slide.setAttribute('aria-label', `Slide ${i + 1} of ${items.length}`);
      slide.setAttribute('aria-hidden', 'true');
      slide.setAttribute('aria-selected', 'false');
      slide.setAttribute('tabindex', '-1');

      // Initially disable all focusable elements in slides
      const focusableElements = slide.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );
      focusableElements.forEach(element => {
        const currentTabindex = element.getAttribute('tabindex') || '0';
        element.setAttribute('data-original-tabindex', currentTabindex);
        element.setAttribute('tabindex', '-1');
        element.setAttribute('aria-hidden', 'true');
      });
    });
    controls.forEach(btn => {
      const dir = btn.getAttribute('data-gsap-slider-control');
      btn.setAttribute('role', 'button');
      btn.setAttribute(
        'aria-label',
        dir === 'prev' ? 'Previous Slide' : 'Next Slide'
      );
      btn.disabled = true;
      btn.setAttribute('aria-disabled', 'true');
    });

    // Determine if slider runs
    console.log('📏 Computing slider dimensions...');
    const styles = getComputedStyle(root);
    const statusVar = styles.getPropertyValue('--slider-status').trim();
    let spvVar = parseFloat(styles.getPropertyValue('--slider-spv'));
    const rect = items[0].getBoundingClientRect();
    const marginRight = parseFloat(getComputedStyle(items[0]).marginRight);
    const slideW = rect.width + marginRight;
    if (isNaN(spvVar)) {
      spvVar = collection.clientWidth / slideW;
    }
    const spv = Math.max(1, Math.min(spvVar, items.length));
    const sliderEnabled = statusVar === 'on' && spv < items.length;

    console.log('📊 Slider calculations:');
    console.log('  - Status var (--slider-status):', statusVar);
    console.log('  - SPV var (--slider-spv):', spvVar);
    console.log('  - First item rect:', rect);
    console.log('  - Margin right:', marginRight);
    console.log('  - Slide width:', slideW);
    console.log('  - Collection width:', collection.clientWidth);
    console.log('  - Calculated SPV:', spv);
    console.log('  - Items length:', items.length);
    console.log('  - Slider enabled:', sliderEnabled);

    root.setAttribute(
      'data-gsap-slider-status',
      sliderEnabled ? 'active' : 'not-active'
    );

    if (!sliderEnabled) {
      console.log('⏹️ Slider disabled - tearing down...');
      // Teardown when disabled
      track.removeAttribute('style');
      track.onmouseenter = null;
      track.onmouseleave = null;
      track.removeAttribute('data-gsap-slider-list-status');
      root.removeAttribute('role');
      root.removeAttribute('aria-roledescription');
      root.removeAttribute('aria-label');
      collection.removeAttribute('role');
      collection.removeAttribute('aria-roledescription');
      collection.removeAttribute('aria-label');
      items.forEach(slide => {
        slide.removeAttribute('role');
        slide.removeAttribute('aria-roledescription');
        slide.removeAttribute('aria-label');
        slide.removeAttribute('aria-hidden');
        slide.removeAttribute('aria-selected');
        slide.removeAttribute('tabindex');
        slide.removeAttribute('data-gsap-slider-item-status');

        // Restore focusable elements
        const focusableElements = slide.querySelectorAll(
          'a, button, input, textarea, select, [data-original-tabindex]'
        );
        focusableElements.forEach(element => {
          const originalTabindex = element.getAttribute(
            'data-original-tabindex'
          );
          if (originalTabindex !== null) {
            element.setAttribute('tabindex', originalTabindex);
            element.removeAttribute('data-original-tabindex');
          }
          element.removeAttribute('aria-hidden');
        });
      });
      controls.forEach(btn => {
        btn.disabled = false;
        btn.removeAttribute('role');
        btn.removeAttribute('aria-label');
        btn.removeAttribute('aria-disabled');
        btn.removeAttribute('data-gsap-slider-control-status');
      });
      return;
    }

    // Track hover state
    track.onmouseenter = () => {
      track.setAttribute('data-gsap-slider-list-status', 'grab');
    };
    track.onmouseleave = () => {
      track.removeAttribute('data-gsap-slider-list-status');
    };

    //Ccalculate bounds and snap points
    const vw = collection.clientWidth;
    const tw = track.scrollWidth;
    const maxScroll = Math.max(tw - vw, 0);
    const minX = -maxScroll;
    const maxX = 0;
    const maxIndex = maxScroll / slideW;
    const full = Math.floor(maxIndex);
    const snapPoints = [];
    for (let i = 0; i <= full; i++) {
      snapPoints.push(-i * slideW);
    }
    if (full < maxIndex) {
      snapPoints.push(-maxIndex * slideW);
    }

    let activeIndex = 0;
    const setX = gsap.quickSetter(track, 'x', 'px');
    let collectionRect = collection.getBoundingClientRect();

    function updateStatus(x) {
      if (x > maxX || x < minX) {
        return;
      }

      // Clamp and find closest snap
      const calcX = x > maxX ? maxX : x < minX ? minX : x;
      let closest = snapPoints[0];
      snapPoints.forEach(pt => {
        if (Math.abs(pt - calcX) < Math.abs(closest - calcX)) {
          closest = pt;
        }
      });
      activeIndex = snapPoints.indexOf(closest);

      // Update Slide Attributes
      items.forEach((slide, i) => {
        const r = slide.getBoundingClientRect();
        const leftEdge = r.left - collectionRect.left;
        const slideCenter = leftEdge + r.width / 2;
        const inView = slideCenter > 0 && slideCenter < collectionRect.width;
        const status =
          i === activeIndex ? 'active' : inView ? 'inview' : 'not-active';
        const isActive = i === activeIndex;

        slide.setAttribute('data-gsap-slider-item-status', status);
        slide.setAttribute('aria-selected', isActive ? 'true' : 'false');
        slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
        slide.setAttribute('tabindex', isActive ? '0' : '-1');

        // Manage focusable elements within slides to prevent focus conflicts
        const focusableElements = slide.querySelectorAll(
          'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );

        focusableElements.forEach(element => {
          if (isActive) {
            // Restore original tabindex or set to 0 if it was disabled
            const originalTabindex = element.getAttribute(
              'data-original-tabindex'
            );
            if (originalTabindex !== null) {
              element.setAttribute('tabindex', originalTabindex);
              element.removeAttribute('data-original-tabindex');
            }
            element.removeAttribute('aria-hidden');
          } else {
            // Store original tabindex and disable focus
            const currentTabindex = element.getAttribute('tabindex') || '0';
            element.setAttribute('data-original-tabindex', currentTabindex);
            element.setAttribute('tabindex', '-1');
            element.setAttribute('aria-hidden', 'true');
          }
        });
      });

      // Update Controls
      controls.forEach(btn => {
        const dir = btn.getAttribute('data-gsap-slider-control');
        const can =
          dir === 'prev'
            ? activeIndex > 0
            : activeIndex < snapPoints.length - 1;

        btn.disabled = !can;
        btn.setAttribute('aria-disabled', can ? 'false' : 'true');
        btn.setAttribute(
          'data-gsap-slider-control-status',
          can ? 'active' : 'not-active'
        );
      });
    }

    controls.forEach(btn => {
      const dir = btn.getAttribute('data-gsap-slider-control');
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        const delta = dir === 'next' ? 1 : -1;
        const target = activeIndex + delta;
        gsap.to(track, {
          duration: 0.4,
          x: snapPoints[target],
          onUpdate: () => updateStatus(gsap.getProperty(track, 'x'))
        });
      });
    });

    // Initialize Draggable
    console.log('🎮 Creating Draggable instance...');
    console.log('  - Track element:', track);
    console.log('  - Bounds:', { minX, maxX });
    console.log('  - Snap points:', snapPoints);

    try {
      root._sliderDraggable = Draggable.create(track, {
        type: 'x',
        // cursor: 'inherit',
        // activeCursor: 'inherit',
        inertia: true,
        bounds: { minX, maxX },
        throwResistance: 2000,
        dragResistance: 0.05,
        maxDuration: 0.6,
        minDuration: 0.2,
        edgeResistance: 0.75,
        snap: { x: snapPoints, duration: 0.4 },
        onPress() {
          track.setAttribute('data-gsap-slider-list-status', 'grabbing');
          collectionRect = collection.getBoundingClientRect();
        },
        onDrag() {
          setX(this.x);
          updateStatus(this.x);
        },
        onThrowUpdate() {
          setX(this.x);
          updateStatus(this.x);
        },
        onThrowComplete() {
          setX(this.endX);
          updateStatus(this.endX);
          track.setAttribute('data-gsap-slider-list-status', 'grab');
        },
        onRelease() {
          setX(this.x);
          updateStatus(this.x);
          track.setAttribute('data-gsap-slider-list-status', 'grab');
        }
      })[0];

      console.log(
        '✅ Draggable instance created successfully:',
        root._sliderDraggable
      );
    } catch (error) {
      console.error('❌ Failed to create Draggable instance:', error);
      return;
    }

    // Initial state
    console.log('🎬 Setting initial slider state...');
    setX(0);
    updateStatus(0);
    console.log('✅ Slider initialization complete!');
  });
}

// Debouncer: For resizing the window
function debounceOnWidthChange(fn, ms) {
  let last = innerWidth,
    timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (innerWidth !== last) {
        console.log('📏 Window resized, reinitializing sliders...');
        last = innerWidth;
        fn.apply(this, args);
      }
    }, ms);
  };
}

// Export the initialization function and setup resize handling
export { initBasicGSAPSlider };

// Set up resize handler for slider responsiveness
if (typeof window !== 'undefined') {
  console.log('🔄 Setting up window resize handler for sliders...');
  window.addEventListener(
    'resize',
    debounceOnWidthChange(initBasicGSAPSlider, 200)
  );
}
