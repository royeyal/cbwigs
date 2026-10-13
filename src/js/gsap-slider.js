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
    // Re-init on width change: drop the old Draggable and any running tween.
    // Listeners and the live region are created once (below) and reused.
    if (root._sliderDraggable) {
      root._sliderDraggable.kill();
      root._sliderDraggable = null;
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
    // console.log('♿ Setting up accessibility attributes...');
    root.setAttribute('role', 'region');
    root.setAttribute('aria-roledescription', 'carousel');
    root.setAttribute('aria-label', 'Slider');
    root.setAttribute('tabindex', '0'); // Make slider focusable for keyboard navigation
    collection.setAttribute('role', 'group');
    collection.setAttribute('aria-roledescription', 'Slides List');
    collection.setAttribute('aria-label', 'Slides');

    // Add live region for screen reader announcements (once per slider)
    if (!root._liveRegion) {
      const liveRegion = document.createElement('div');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only'; // Visually hidden
      liveRegion.style.cssText =
        'position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;';
      root.appendChild(liveRegion);
      root._liveRegion = liveRegion;
    }
    items.forEach((slide, i) => {
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-roledescription', 'Slide');
      slide.setAttribute('aria-label', `Slide ${i + 1} of ${items.length}`);
      slide.setAttribute('aria-hidden', 'true');
      slide.setAttribute('aria-selected', 'false');

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
      btn.setAttribute('tabindex', '0'); // Make buttons focusable
    });

    // Controls and arrow keys are bound once; each init swaps in its own
    // root._sliderGoTo (null while the slider is off).
    if (!root._sliderListenersBound) {
      root._sliderListenersBound = true;
      controls.forEach(btn => {
        const dir = btn.getAttribute('data-gsap-slider-control');
        btn.addEventListener('click', () => {
          if (btn.disabled) return;
          root._sliderGoTo?.(dir === 'next' ? 1 : -1);
        });
      });
      root.addEventListener('keydown', event => {
        if (!root.contains(document.activeElement)) return;
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        if (!root._sliderGoTo) return;
        event.preventDefault();
        root._sliderGoTo(event.key === 'ArrowRight' ? 1 : -1);
      });
    }
    root._sliderGoTo = null;
    gsap.killTweensOf(track);

    // Determine if slider runs
    // console.log('📏 Computing slider dimensions...');
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

    // console.log('📊 Slider calculations:');
    // console.log('  - Status var (--slider-status):', statusVar);
    // console.log('  - SPV var (--slider-spv):', spvVar);
    // console.log('  - First item rect:', rect);
    // console.log('  - Margin right:', marginRight);
    // console.log('  - Slide width:', slideW);
    // console.log('  - Collection width:', collection.clientWidth);
    // console.log('  - Calculated SPV:', spv);
    // console.log('  - Items length:', items.length);
    // console.log('  - Slider enabled:', sliderEnabled);

    root.setAttribute(
      'data-gsap-slider-status',
      sliderEnabled ? 'active' : 'not-active'
    );

    if (!sliderEnabled) {
      // Teardown when disabled
      gsap.set(track, { clearProps: 'transform' });
      track.removeAttribute('style');
      track.onmouseenter = null;
      track.onmouseleave = null;
      track.removeAttribute('data-gsap-slider-list-status');
      root.removeAttribute('role');
      root.removeAttribute('aria-roledescription');
      root.removeAttribute('aria-label');
      root.removeAttribute('tabindex');

      // Remove live region
      if (root._liveRegion) {
        root._liveRegion.remove();
        root._liveRegion = null;
      }

      collection.removeAttribute('role');
      collection.removeAttribute('aria-roledescription');
      collection.removeAttribute('aria-label');
      items.forEach(slide => {
        slide.removeAttribute('role');
        slide.removeAttribute('aria-roledescription');
        slide.removeAttribute('aria-label');
        slide.removeAttribute('aria-hidden');
        slide.removeAttribute('aria-selected');

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

    // Bounds and snap points. Snap points come from the measured slide
    // positions (so flex gap and margins are included), capped at the drag
    // bound so the last stop is reachable.
    const setX = gsap.quickSetter(track, 'x', 'px');
    setX(0);

    const vw = collection.clientWidth;
    const tw = track.scrollWidth;
    const maxScroll = Math.max(tw - vw, 0);
    const minX = -maxScroll;
    const maxX = 0;

    // Each slide's horizontal span relative to the collection's left edge
    // with the track at x = 0.
    const collectionLeft = collection.getBoundingClientRect().left;
    const slideSpans = items.map(slide => {
      const r = slide.getBoundingClientRect();
      const left = r.left - collectionLeft;
      return { left, right: left + r.width, width: r.width };
    });

    const firstLeft = slideSpans[0].left;
    const snapPoints = [];
    slideSpans.forEach(span => {
      const point = Math.max(-(span.left - firstLeft), minX);
      if (!snapPoints.some(p => Math.abs(p - point) < 1)) {
        snapPoints.push(point);
      }
    });

    let activeIndex = 0;

    // True when at least half of slide i is inside the collection at track x
    function isSlideInView(i, x) {
      const span = slideSpans[i];
      if (!span || span.width <= 0) return false;
      const overlap = Math.min(span.right + x, vw) - Math.max(span.left + x, 0);
      return overlap >= span.width / 2 - 1;
    }

    function updateStatus(x) {
      // Clamp (edge resistance lets a drag overshoot) and find closest snap
      const calcX = x > maxX ? maxX : x < minX ? minX : x;
      let closest = snapPoints[0];
      snapPoints.forEach(pt => {
        if (Math.abs(pt - calcX) < Math.abs(closest - calcX)) {
          closest = pt;
        }
      });
      activeIndex = snapPoints.indexOf(closest);

      // Announce the visible range to screen readers ("Slides 2–4 of 6")
      if (root._liveRegion) {
        const visible = items
          .map((_, i) => i)
          .filter(i => i === activeIndex || isSlideInView(i, closest));
        const first = visible[0] + 1;
        const last = visible[visible.length - 1] + 1;
        const range =
          first === last ? `Slide ${first}` : `Slides ${first}–${last}`;
        const text = `${range} of ${items.length}`;
        if (root._liveRegion.textContent !== text) {
          root._liveRegion.textContent = text;
        }
      }

      // Update Slide Attributes. Every slide in view at the snapped position
      // stays exposed (all 3 cards at --slider-spv: 3), not only the current
      // one; a slide counts as in view when at least half of it is visible.
      items.forEach((slide, i) => {
        const isCurrent = i === activeIndex;
        const isActive = isCurrent || isSlideInView(i, closest);

        // IMPORTANT: Blur focused elements BEFORE setting aria-hidden
        if (!isActive && slide.contains(document.activeElement)) {
          document.activeElement.blur();
        }

        slide.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
        slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');

        // Manage focusable elements within slides to prevent focus conflicts
        const focusableElements = slide.querySelectorAll(
          'a, button, input, textarea, select, [tabindex]'
        );

        focusableElements.forEach(element => {
          if (isActive) {
            // Restore original tabindex
            const originalTabindex = element.getAttribute(
              'data-original-tabindex'
            );
            if (originalTabindex !== null) {
              if (originalTabindex === '0' || originalTabindex === '') {
                element.removeAttribute('tabindex');
              } else {
                element.setAttribute('tabindex', originalTabindex);
              }
              element.removeAttribute('data-original-tabindex');
            }
            element.removeAttribute('aria-hidden');
          } else {
            // Store original tabindex and disable focus
            if (!element.hasAttribute('data-original-tabindex')) {
              const currentTabindex = element.getAttribute('tabindex');
              element.setAttribute(
                'data-original-tabindex',
                currentTabindex || '0'
              );
            }
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

    root._sliderGoTo = delta => {
      const target = activeIndex + delta;
      if (target < 0 || target >= snapPoints.length) return;
      gsap.to(track, {
        duration: 0.4,
        x: snapPoints[target],
        overwrite: true,
        onUpdate: () => updateStatus(gsap.getProperty(track, 'x'))
      });
    };

    // Initialize Draggable
    // console.log('🎮 Creating Draggable instance...');
    // console.log('  - Track element:', track);
    // console.log('  - Bounds:', { minX, maxX });
    // console.log('  - Snap points:', snapPoints);

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

      // console.log(
      //   '✅ Draggable instance created successfully:',
      //   root._sliderDraggable
      // );
    } catch (error) {
      console.error('❌ Failed to create Draggable instance:', error);
      return;
    }

    // Initial state
    // console.log('🎬 Setting initial slider state...');
    updateStatus(0);
    // console.log('✅ Slider initialization complete!');
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
        // console.log('📏 Window resized, reinitializing sliders...');
        last = innerWidth;
        fn(...args);
      }
    }, ms);
  };
}

// Export the initialization function and setup resize handling
export { initBasicGSAPSlider };

// Set up resize handler for slider responsiveness
if (typeof window !== 'undefined') {
  // console.log('🔄 Setting up window resize handler for sliders...');
  window.addEventListener(
    'resize',
    debounceOnWidthChange(initBasicGSAPSlider, 200)
  );
}
