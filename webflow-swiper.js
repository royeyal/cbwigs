// Webflow-optimized Swiper initialization
// This version handles dynamic loading better for Webflow projects

function initSwiperSlider() {
  const swiperSliderGroups = document.querySelectorAll('[data-swiper-group]');

  if (swiperSliderGroups.length === 0) {
    console.info('No swiper elements found on the page.');
    return;
  }

  // Function to actually initialize the swipers
  function initializeSwipers() {
    swiperSliderGroups.forEach(swiperGroup => {
      // Skip if already initialized
      if (swiperGroup.swiperInstance) {
        return;
      }

      const swiperSliderWrap = swiperGroup.querySelector('[data-swiper-wrap]');
      if (!swiperSliderWrap) {
        console.warn('Swiper wrapper not found in swiper group:', swiperGroup);
        return;
      }

      const prevButton = swiperGroup.querySelector('[data-swiper-prev]');
      const nextButton = swiperGroup.querySelector('[data-swiper-next]');
      const pagination = swiperGroup.querySelector('.swiper-pagination');

      const swiper = new Swiper(swiperSliderWrap, {
        slidesPerView: 1.25,
        spaceBetween: 20,
        speed: 600,
        mousewheel: true,
        grabCursor: true,
        breakpoints: {
          // when window width is >= 480px
          480: {
            slidesPerView: 1.8,
            spaceBetween: 20
          },
          // when window width is >= 992px
          992: {
            slidesPerView: 3.5,
            spaceBetween: 20
          }
        },
        navigation:
          prevButton && nextButton
            ? {
                nextEl: nextButton,
                prevEl: prevButton
              }
            : false,
        pagination: pagination
          ? {
              el: pagination,
              type: 'bullets',
              clickable: true
            }
          : false,
        keyboard: {
          enabled: true,
          onlyInViewport: false
        }
      });

      // Store swiper instance for potential external access
      swiperGroup.swiperInstance = swiper;
      console.info('Swiper initialized successfully');
    });
  }

  // Check if Swiper is available
  if (typeof Swiper !== 'undefined') {
    // Swiper is already available, initialize immediately
    initializeSwipers();
    return;
  }

  // Swiper not available yet, set up multiple strategies to detect when it loads

  // Strategy 1: Polling (most reliable)
  let attempts = 0;
  const maxAttempts = 100; // 10 seconds max wait time
  
  const pollForSwiper = setInterval(() => {
    attempts++;
    
    if (typeof Swiper !== 'undefined') {
      clearInterval(pollForSwiper);
      console.info('Swiper library detected via polling. Initializing sliders...');
      initializeSwipers();
    } else if (attempts >= maxAttempts) {
      clearInterval(pollForSwiper);
      console.warn(
        'Swiper JS library not found after 10 seconds. Please ensure Swiper is loaded before this script.'
      );
    }
  }, 100); // Check every 100ms

  // Strategy 2: Listen for window.Swiper to be defined (if set via property assignment)
  let originalSwiper = window.Swiper;
  Object.defineProperty(window, 'Swiper', {
    get: function() {
      return originalSwiper;
    },
    set: function(value) {
      originalSwiper = value;
      if (value && typeof value === 'function') {
        setTimeout(() => {
          if (typeof Swiper !== 'undefined') {
            clearInterval(pollForSwiper);
            console.info('Swiper library detected via property setter. Initializing sliders...');
            initializeSwipers();
          }
        }, 50);
      }
    },
    configurable: true
  });

  // Strategy 3: MutationObserver to detect script tag additions (backup)
  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.tagName === 'SCRIPT' && node.src && node.src.includes('swiper')) {
              node.addEventListener('load', () => {
                setTimeout(() => {
                  if (typeof Swiper !== 'undefined') {
                    clearInterval(pollForSwiper);
                    observer.disconnect();
                    console.info('Swiper library detected via script load event. Initializing sliders...');
                    initializeSwipers();
                  }
                }, 100);
              });
            }
          });
        }
      });
    });
    
    observer.observe(document.head, { childList: true, subtree: true });
    observer.observe(document.body, { childList: true, subtree: true });
  }
}

// Multiple initialization strategies
document.addEventListener('DOMContentLoaded', initSwiperSlider);

// Also try on window load (in case DOM is already ready)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSwiperSlider);
} else {
  // DOM is already loaded
  setTimeout(initSwiperSlider, 50);
}

// Expose function globally for manual initialization if needed
window.initSwiperSlider = initSwiperSlider;