/**
 * Layout Grid Flip
 * Animates between different grid layouts using GSAP Flip plugin
 * Requires: GSAP and GSAP Flip plugin
 *
 * @description Handles grid layout switching with smooth GSAP Flip animations
 * Supports "large" (3 columns) and "small" (5 columns) layouts with responsive breakpoints
 */
export function initLayoutGridFlip() {
  // Debug: Check what's available
  // console.log('[Layout Grid Flip] Checking for Flip plugin...');
  // console.log('[Layout Grid Flip] window.gsap:', typeof window.gsap);
  // console.log('[Layout Grid Flip] window.gsap.Flip:', typeof window.gsap?.Flip);
  // console.log('[Layout Grid Flip] window.gsap.plugins:', window.gsap?.plugins);
  // console.log('[Layout Grid Flip] window.Flip:', typeof window.Flip);

  // Register Flip plugin if available (Webflow loads GSAP globally)
  if (typeof window.Flip !== 'undefined' && window.gsap?.registerPlugin) {
    try {
      window.gsap.registerPlugin(window.Flip);
      console.log('[Layout Grid Flip] Registered window.Flip with GSAP');
    } catch (_e) {
      console.log('[Layout Grid Flip] Plugin already registered or error:', _e);
    }
  }

  // Check if Flip is available (try multiple locations)
  const Flip = window.gsap?.Flip || window.gsap?.plugins?.Flip || window.Flip;
  console.log('[Layout Grid Flip] Flip resolved to:', Flip);

  if (!Flip) {
    console.warn(
      '[Layout Grid Flip] GSAP Flip plugin not available. Make sure Flip plugin is loaded in Webflow.'
    );
    return;
  }

  // console.log('[Layout Grid Flip] Flip plugin found, initializing...');

  const groups = document.querySelectorAll('[data-layout-group]');

  if (groups.length === 0) {
    console.warn(
      '[Layout Grid Flip] No [data-layout-group] elements found. Skipping initialization.'
    );
    return;
  }

  const ACTIVE_CLASS = 'is--active'; // The classes toggled on your buttons

  groups.forEach(group => {
    let activeTween = null;

    const buttons = group.querySelectorAll('[data-layout-button]');
    const grid = group.querySelector('[data-layout-grid]');
    const collection = group.querySelector('[data-layout-grid-collection]');
    if (!buttons.length || !grid || !collection) {
      console.warn(
        'Missing required HTML elements. Check the Osmo resoure documentation!'
      );
      return;
    }

    // a11y init
    buttons.forEach(b =>
      b.setAttribute('aria-pressed', String(b.classList.contains(ACTIVE_CLASS)))
    );

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetLayout = btn.getAttribute('data-layout-button'); // "large" | "small"
        const currentLayout = group.getAttribute('data-layout-status');
        if (currentLayout === targetLayout) return;

        // Kill any in-flight animation
        if (activeTween) {
          activeTween.kill();
          activeTween = null;
        }

        // Reduced-motion: just toggle and refresh
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          group.setAttribute('data-layout-status', targetLayout);
          buttons.forEach(b => {
            const isActive = b === btn;
            b.classList.toggle(ACTIVE_CLASS, isActive);
            b.setAttribute('aria-pressed', String(isActive));
          });
          window.ScrollTrigger?.refresh?.();
          if (window.lenis?.resize) window.lenis.resize();
          return;
        }

        // Record state of items
        const items = grid.querySelectorAll('[data-layout-grid-item]');
        const state = Flip.getState(items, { simple: true });

        // Measure current height on the collection (force layout first)
        collection.getBoundingClientRect();
        const prevH = collection.offsetHeight;

        // Switch to target layout
        group.setAttribute('data-layout-status', targetLayout);
        buttons.forEach(b => {
          const isActive = b === btn;
          b.classList.toggle(ACTIVE_CLASS, isActive);
          b.setAttribute('aria-pressed', String(isActive));
        });

        // Measure next height after switching
        collection.getBoundingClientRect();
        const nextH = collection.offsetHeight;

        // Pin collection height so items can go absolute without collapsing
        gsap.set(collection, { height: prevH });

        // Build timeline: Flip + collection height animation
        const tl = gsap.timeline({
          onStart: () => {
            group.setAttribute('data-transitioning', 'true');
          },
          onInterrupt: () => {
            group.removeAttribute('data-transitioning');
            gsap.set(collection, { clearProps: 'height' });
          },
          onComplete: () => {
            group.removeAttribute('data-transitioning');
            gsap.set(collection, { clearProps: 'height' });
            window.ScrollTrigger?.refresh?.();
            if (window.lenis?.resize) window.lenis.resize();
            activeTween = null;
          }
        });

        tl.add(
          Flip.from(state, {
            duration: 0.65,
            ease: 'power4.inOut',
            absolute: true,
            nested: true,
            prune: true,
            stagger:
              targetLayout === 'large'
                ? { each: 0.03, from: 'end' }
                : { each: 0.03, from: 'start' }
          }),
          0
        ).to(
          collection,
          {
            height: nextH,
            duration: 0.65,
            ease: 'power4.inOut'
          },
          0
        );

        activeTween = tl;
      });
    });
  });
}
