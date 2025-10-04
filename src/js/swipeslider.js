// Import swiper styles
import '../styles/swipeslider.css';

function initSwiperSlider() {
  const swiperSliderGroups = document.querySelectorAll('[data-swiper-group]');

  if (swiperSliderGroups.length === 0) {
    console.info('No swiper elements found on the page.');
    return;
  }

  // Check if Swiper is available, if not, wait for it to load
  if (typeof Swiper === 'undefined') {
    console.info(
      'Swiper library not yet loaded. Waiting for it to be available...'
    );

    // Wait for Swiper to be loaded (with timeout)
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds max wait time

    const waitForSwiper = setInterval(() => {
      attempts++;

      if (typeof Swiper !== 'undefined') {
        clearInterval(waitForSwiper);
        console.info(
          'Swiper library loaded successfully. Initializing sliders...'
        );
        initializeSwiperSliders(swiperSliderGroups);
      } else if (attempts >= maxAttempts) {
        clearInterval(waitForSwiper);
        console.warn(
          'Swiper JS library not found after waiting. Make sure to load the Swiper library before initializing sliders.'
        );
      }
    }, 100); // Check every 100ms

    return;
  }

  // Swiper is already available, initialize immediately
  initializeSwiperSliders(swiperSliderGroups);
}

function initializeSwiperSliders(swiperSliderGroups) {
  swiperSliderGroups.forEach(swiperGroup => {
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
  });
}

// Auto-initialize when DOM is ready (for direct script loading)
document.addEventListener('DOMContentLoaded', () => {
  initSwiperSlider();
});

// Export for module usage
export { initSwiperSlider };
