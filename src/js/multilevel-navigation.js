// Multilevel Navigation script
//
// Every listener is registered once. Handlers check the current mode
// ('mobile' below 768px, 'desktop' otherwise), so crossing the breakpoint
// never runs both modes' logic for the same interaction.

const MOBILE_MAX_WIDTH = 768;
let navMode = null;

function initNavigation() {
  if (!initNavigation._initialized) {
    initNavigation._initialized = true;
    bindMobileMenu();
    bindDropdowns();
    window.addEventListener('resize', debounce(updateNavMode, 200));

    // Sticky nav scroll effect (runs on both mobile and desktop)
    initStickyNavScroll();
  }

  updateNavMode();
}

function debounce(fn, delay) {
  let timer;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(fn, delay);
  };
}

function getToggles() {
  return Array.from(document.querySelectorAll('[data-dropdown-toggle]'));
}

// Toggles whose next sibling is a .nav-dropdown, with their index among all toggles
function getDropdownPairs() {
  return getToggles()
    .map((toggle, i) => ({ toggle, dd: toggle.nextElementSibling, i }))
    .filter(({ dd }) => dd && dd.classList.contains('nav-dropdown'));
}

function updateNavMode() {
  const mode = window.innerWidth < MOBILE_MAX_WIDTH ? 'mobile' : 'desktop';
  if (mode === navMode) return;
  const previousMode = navMode;
  navMode = mode;

  // Don't carry an open dropdown across the breakpoint
  if (previousMode) {
    getToggles().forEach(toggle => {
      if (toggle.dataset.dropdownToggle === 'open') {
        toggle.dataset.dropdownToggle = 'closed';
      }
    });
  }

  if (mode === 'mobile') {
    applyMobileAria();
  } else {
    applyDesktopAria();
  }
}

function applyMobileAria() {
  const btn = document.querySelector('[data-menu-button]');
  const nav = document.querySelector('[data-menu-status]');
  if (btn && nav) {
    btn.setAttribute(
      'aria-expanded',
      String(nav.dataset.menuStatus === 'open')
    );
    btn.setAttribute('aria-controls', 'mobile-navigation');
    nav.setAttribute('id', 'mobile-navigation');
    nav.setAttribute('role', 'navigation');
    nav.setAttribute('aria-label', 'Main navigation');
  }

  getDropdownPairs().forEach(({ toggle, dd, i }) => {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-haspopup', 'true');
    toggle.setAttribute('aria-controls', `dropdown-${i}`);

    dd.setAttribute('id', `dropdown-${i}`);
    dd.setAttribute('role', 'menu');
    // aria-hidden is only managed in desktop mode
    dd.removeAttribute('aria-hidden');
    dd.querySelectorAll('.nav-dropdown__link').forEach(link =>
      link.setAttribute('role', 'menuitem')
    );
  });
}

function applyDesktopAria() {
  getDropdownPairs().forEach(({ toggle, dd, i }) => {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-haspopup', 'true');
    toggle.setAttribute('aria-controls', `desktop-dropdown-${i}`);

    dd.setAttribute('id', `desktop-dropdown-${i}`);
    dd.setAttribute('role', 'menu');
    dd.setAttribute('aria-hidden', 'true');
    dd.querySelectorAll('.nav-dropdown__link').forEach(link =>
      link.setAttribute('role', 'menuitem')
    );
  });
}

function bindMobileMenu() {
  const btn = document.querySelector('[data-menu-button]');
  const nav = document.querySelector('[data-menu-status]');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const open = nav.dataset.menuStatus === 'open';
    nav.dataset.menuStatus = open ? 'closed' : 'open';
    btn.setAttribute('aria-expanded', !open);

    // Close all dropdowns when closing the menu
    if (open) {
      getToggles().forEach(toggle => {
        toggle.dataset.dropdownToggle = 'closed';
        toggle.setAttribute('aria-expanded', 'false');
      });
    }
  });
}

// Desktop: close a toggle and hide its dropdown
function closeDesktopDropdown(toggle) {
  toggle.dataset.dropdownToggle = 'closed';
  toggle.setAttribute('aria-expanded', 'false');
  const dd = toggle.nextElementSibling;
  if (dd) dd.setAttribute('aria-hidden', 'true');
}

// Desktop: open a toggle and show its dropdown
function openDesktopDropdown(toggle, dd) {
  toggle.dataset.dropdownToggle = 'open';
  toggle.setAttribute('aria-expanded', 'true');
  dd.setAttribute('aria-hidden', 'false');
}

function onMobileToggleClick(toggle, toggles) {
  const open = toggle.dataset.dropdownToggle === 'open';
  toggles.forEach(other => {
    if (other !== toggle) {
      other.dataset.dropdownToggle = 'closed';
      other.setAttribute('aria-expanded', 'false');
      if (other === document.activeElement) other.blur();
    }
  });
  toggle.dataset.dropdownToggle = open ? 'closed' : 'open';
  toggle.setAttribute('aria-expanded', !open);
  if (open && toggle === document.activeElement) toggle.blur();
}

function onDesktopToggleClick(e, toggle, dd, toggles) {
  e.preventDefault();
  toggles.forEach(other => {
    if (other !== toggle) closeDesktopDropdown(other);
  });
  const opening = toggle.dataset.dropdownToggle !== 'open';
  openDesktopDropdown(toggle, dd);
  if (opening) {
    const first = dd.querySelector('.nav-dropdown__link');
    if (first) first.focus();
  }
}

function bindDropdowns() {
  const toggles = getToggles();
  const pairs = getDropdownPairs();
  if (!pairs.length) return;

  const isDesktop = () => navMode === 'desktop';

  pairs.forEach(({ toggle, dd }) => {
    toggle.addEventListener('click', e => {
      if (isDesktop()) {
        onDesktopToggleClick(e, toggle, dd, toggles);
      } else {
        onMobileToggleClick(toggle, toggles);
      }
    });

    toggle.addEventListener('mouseenter', () => {
      if (!isDesktop()) return;
      const anyOpen = toggles.some(x => x.dataset.dropdownToggle === 'open');
      toggles.forEach(other => {
        if (other !== toggle) closeDesktopDropdown(other);
      });
      if (anyOpen) {
        setTimeout(() => openDesktopDropdown(toggle, dd), 20);
      } else {
        openDesktopDropdown(toggle, dd);
      }
    });

    dd.addEventListener('mouseleave', () => {
      if (!isDesktop()) return;
      closeDesktopDropdown(toggle);
    });

    toggle.addEventListener('keydown', e => {
      if (!isDesktop()) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle.click();
      } else if (e.key === 'Escape') {
        closeDesktopDropdown(toggle);
        toggle.focus();
      }
    });

    dd.addEventListener('keydown', e => {
      if (!isDesktop()) return;
      const items = Array.from(dd.querySelectorAll('.nav-dropdown__link'));
      const idx = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        items[(idx + 1) % items.length].focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        items[(idx - 1 + items.length) % items.length].focus();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closeDesktopDropdown(toggle);
        toggle.focus();
      }
    });

    // Close dropdown when focus leaves the entire dropdown area
    dd.addEventListener('focusout', () => {
      if (!isDesktop()) return;
      // Use setTimeout to allow the browser to update activeElement
      setTimeout(() => {
        if (
          !dd.contains(document.activeElement) &&
          document.activeElement !== toggle
        ) {
          closeDesktopDropdown(toggle);
        }
      }, 0);
    });
  });

  // Desktop: hovering a plain top-level link closes any open dropdown
  document
    .querySelectorAll('.nav-link:not([data-dropdown-toggle])')
    .forEach(link => {
      link.addEventListener('mouseenter', () => {
        if (!isDesktop()) return;
        toggles.forEach(closeDesktopDropdown);
      });
    });

  // Desktop: a click outside every toggle and dropdown closes them all
  document.addEventListener('click', e => {
    if (!isDesktop()) return;
    const inside = toggles.some(toggle => {
      const dd = toggle.nextElementSibling;
      return toggle.contains(e.target) || (dd && dd.contains(e.target));
    });
    if (!inside) toggles.forEach(closeDesktopDropdown);
  });
}

function initStickyNavScroll() {
  // Check if nav element exists first
  const nav = document.querySelector('.nav');
  if (!nav) return;

  // Check if GSAP and ScrollTrigger are available
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn(
      '⚠️ GSAP or ScrollTrigger not found for sticky nav scroll effect'
    );
    return;
  }

  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  // Create ScrollTrigger to add/remove class based on scroll position
  ScrollTrigger.create({
    start: 'top -50', // Trigger after scrolling 50px down
    end: 99999,
    toggleClass: { className: 'is-scrolled', targets: '.nav' }
    // markers: true, // Uncomment for debugging
  });
}

// Export function for use in main module
export { initNavigation };
