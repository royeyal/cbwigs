// Multilevel Navigation script

function initNavigation() {
  if (!initNavigation._hasResizeListener) {
    initNavigation._hasResizeListener = true;
    window.addEventListener('resize', debounce(initNavigation, 200));
  }

  const isMobile = window.innerWidth < 768;
  if (isMobile && initNavigation._lastMode !== 'mobile') {
    initMobileMenu();
    initNavigation._lastMode = 'mobile';
  } else if (!isMobile && initNavigation._lastMode !== 'desktop') {
    initDesktopDropdowns();
    initNavigation._lastMode = 'desktop';
  }

  // Initialize sticky nav scroll effect (runs on both mobile and desktop)
  if (!initNavigation._stickyNavInitialized) {
    initStickyNavScroll();
    initNavigation._stickyNavInitialized = true;
  }
}

function debounce(fn, delay) {
  let timer;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(fn, delay);
  };
}

function initMobileMenu() {
  const btn = document.querySelector('[data-menu-button]');
  const nav = document.querySelector('[data-menu-status]');
  if (!btn || !nav) return;

  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', 'mobile-navigation');
  nav.setAttribute('id', 'mobile-navigation');
  nav.setAttribute('role', 'navigation');
  nav.setAttribute('aria-label', 'Main navigation');

  if (!btn._mobileClick) {
    btn._mobileClick = true;
    btn.addEventListener('click', () => {
      const open = nav.dataset.menuStatus === 'open';
      nav.dataset.menuStatus = open ? 'closed' : 'open';
      btn.setAttribute('aria-expanded', !open);

      // Close all dropdowns when closing the menu
      if (open) {
        Array.from(document.querySelectorAll('[data-dropdown-toggle]')).forEach(
          toggle => {
            toggle.dataset.dropdownToggle = 'closed';
            toggle.setAttribute('aria-expanded', 'false');
          }
        );
      }
    });
  }

  Array.from(document.querySelectorAll('[data-dropdown-toggle]')).forEach(
    (toggle, i) => {
      const dd = toggle.nextElementSibling;
      if (!dd || !dd.classList.contains('nav-dropdown')) return;
      if (toggle._mobileDropdownInit) return;
      toggle._mobileDropdownInit = true;

      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-haspopup', 'true');
      toggle.setAttribute('aria-controls', `dropdown-${i}`);

      dd.setAttribute('id', `dropdown-${i}`);
      dd.setAttribute('role', 'menu');
      dd.querySelectorAll('.nav-dropdown__link').forEach(link =>
        link.setAttribute('role', 'menuitem')
      );

      toggle.addEventListener('click', () => {
        const open = toggle.dataset.dropdownToggle === 'open';
        Array.from(document.querySelectorAll('[data-dropdown-toggle]')).forEach(
          other => {
            if (other !== toggle) {
              other.dataset.dropdownToggle = 'closed';
              other.setAttribute('aria-expanded', 'false');
              if (other === document.activeElement) other.blur();
            }
          }
        );
        toggle.dataset.dropdownToggle = open ? 'closed' : 'open';
        toggle.setAttribute('aria-expanded', !open);
        if (open && toggle === document.activeElement) toggle.blur();
      });
    }
  );
}

function initDesktopDropdowns() {
  const toggles = Array.from(
    document.querySelectorAll('[data-dropdown-toggle]')
  );
  const links = Array.from(
    document.querySelectorAll('.nav-link:not([data-dropdown-toggle])')
  );

  toggles.forEach((toggle, i) => {
    const dd = toggle.nextElementSibling;
    if (!dd || !dd.classList.contains('nav-dropdown') || toggle._desktopInit)
      return;
    toggle._desktopInit = true;

    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-haspopup', 'true');
    toggle.setAttribute('aria-controls', `desktop-dropdown-${i}`);

    dd.setAttribute('id', `desktop-dropdown-${i}`);
    dd.setAttribute('role', 'menu');
    dd.setAttribute('aria-hidden', 'true');
    dd.querySelectorAll('.nav-dropdown__link').forEach(link =>
      link.setAttribute('role', 'menuitem')
    );

    toggle.addEventListener('click', e => {
      e.preventDefault();
      toggles.forEach(other => {
        if (other !== toggle) {
          other.dataset.dropdownToggle = 'closed';
          other.setAttribute('aria-expanded', 'false');
          const otherDropdown = other.nextElementSibling;
          if (otherDropdown) otherDropdown.setAttribute('aria-hidden', 'true');
        }
      });
      const open = toggle.dataset.dropdownToggle !== 'open';
      toggle.dataset.dropdownToggle = 'open';
      toggle.setAttribute('aria-expanded', 'true');
      dd.setAttribute('aria-hidden', 'false');
      if (open) {
        const first = dd.querySelector('.nav-dropdown__link');
        if (first) first.focus();
      }
    });

    toggle.addEventListener('mouseenter', () => {
      const anyOpen = toggles.some(x => x.dataset.dropdownToggle === 'open');
      toggles.forEach(other => {
        if (other !== toggle) {
          other.dataset.dropdownToggle = 'closed';
          other.setAttribute('aria-expanded', 'false');
          const otherDropdown = other.nextElementSibling;
          if (otherDropdown) otherDropdown.setAttribute('aria-hidden', 'true');
        }
      });
      if (anyOpen) {
        setTimeout(() => {
          toggle.dataset.dropdownToggle = 'open';
          toggle.setAttribute('aria-expanded', 'true');
          dd.setAttribute('aria-hidden', 'false');
        }, 20);
      } else {
        toggle.dataset.dropdownToggle = 'open';
        toggle.setAttribute('aria-expanded', 'true');
        dd.setAttribute('aria-hidden', 'false');
      }
    });

    dd.addEventListener('mouseleave', () => {
      toggle.dataset.dropdownToggle = 'closed';
      toggle.setAttribute('aria-expanded', 'false');
      dd.setAttribute('aria-hidden', 'true');
    });

    toggle.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle.click();
      } else if (e.key === 'Escape') {
        toggle.dataset.dropdownToggle = 'closed';
        toggle.setAttribute('aria-expanded', 'false');
        dd.setAttribute('aria-hidden', 'true');
        toggle.focus();
      }
    });

    dd.addEventListener('keydown', e => {
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
        toggle.dataset.dropdownToggle = 'closed';
        toggle.setAttribute('aria-expanded', 'false');
        dd.setAttribute('aria-hidden', 'true');
        toggle.focus();
      }
    });

    // Close dropdown when focus leaves the entire dropdown area
    dd.addEventListener('focusout', () => {
      // Use setTimeout to allow the browser to update activeElement
      setTimeout(() => {
        if (
          !dd.contains(document.activeElement) &&
          document.activeElement !== toggle
        ) {
          toggle.dataset.dropdownToggle = 'closed';
          toggle.setAttribute('aria-expanded', 'false');
          dd.setAttribute('aria-hidden', 'true');
        }
      }, 0);
    });
  });

  links.forEach(link => {
    link.addEventListener('mouseenter', () => {
      toggles.forEach(toggle => {
        toggle.dataset.dropdownToggle = 'closed';
        toggle.setAttribute('aria-expanded', 'false');
        const dd = toggle.nextElementSibling;
        if (dd) dd.setAttribute('aria-hidden', 'true');
      });
    });
  });

  document.addEventListener('click', e => {
    const inside = toggles.some(toggle => {
      const dd = toggle.nextElementSibling;
      return toggle.contains(e.target) || (dd && dd.contains(e.target));
    });
    if (!inside) {
      toggles.forEach(toggle => {
        toggle.dataset.dropdownToggle = 'closed';
        toggle.setAttribute('aria-expanded', 'false');
        const dd = toggle.nextElementSibling;
        if (dd) dd.setAttribute('aria-hidden', 'true');
      });
    }
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
