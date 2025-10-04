// Import Swiper library and modules
import { Swiper } from 'swiper';
import { Navigation, Scrollbar } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';

// Import custom swiper styles
import '../styles/swipeslider.css';

function initSwiperSlider() {
  const swiperSliderGroups = document.querySelectorAll('[data-swiper-group]');

  if (swiperSliderGroups.length === 0) {
    console.info('No swiper elements found on the page.');
    return;
  }

  // Swiper is now bundled and available, initialize immediately
  initializeSwiperSliders(swiperSliderGroups);
}

// Function to detect RTL direction
function isRTL() {
  // Check document direction
  const htmlDir = document.documentElement.dir || document.dir;
  const bodyDir = document.body.dir;

  // Check CSS direction property
  const computedStyle = window.getComputedStyle(document.documentElement);
  const cssDirection = computedStyle.direction;

  // Priority: explicit dir attribute > CSS direction > default (LTR)
  if (htmlDir) return htmlDir.toLowerCase() === 'rtl';
  if (bodyDir) return bodyDir.toLowerCase() === 'rtl';
  if (cssDirection) return cssDirection.toLowerCase() === 'rtl';

  return false;
}

function initializeSwiperSliders(swiperSliderGroups) {
  // Detect RTL once for all swipers
  const isRTLLayout = isRTL();

  if (isRTLLayout) {
    console.info(
      'RTL layout detected - configuring Swiper for right-to-left direction'
    );
  }

  swiperSliderGroups.forEach(swiperGroup => {
    const swiperSliderWrap = swiperGroup.querySelector('[data-swiper-wrap]');
    if (!swiperSliderWrap) {
      console.warn('Swiper wrapper not found in swiper group:', swiperGroup);
      return;
    }

    const prevButton = swiperGroup.querySelector('[data-swiper-prev]');
    const nextButton = swiperGroup.querySelector('[data-swiper-next]');
    const scrollbar = swiperGroup.querySelector('.swiper-scrollbar');

    const swiper = new Swiper(swiperSliderWrap, {
      // Register modules
      modules: [Navigation, Scrollbar],

      // RTL configuration
      direction: 'horizontal',
      rtl: isRTLLayout,

      // Infinite loop
      loop: true,

      // Default amount of slides per view
      slidesPerView: 1.25,
      spaceBetween: 0, // Let CSS handle spacing via padding
      speed: 600,
      mousewheel: true,
      grabCursor: true,
      breakpoints: {
        // when window width is >= 480px
        480: {
          slidesPerView: 1.8,
          spaceBetween: 0 // Let CSS handle spacing
        },
        // when window width is >= 992px
        992: {
          slidesPerView: 3.5,
          spaceBetween: 0 // Let CSS handle spacing
        }
      },
      navigation:
        prevButton && nextButton
          ? {
              // In RTL, swap the button assignments to maintain intuitive navigation
              nextEl: isRTLLayout ? prevButton : nextButton,
              prevEl: isRTLLayout ? nextButton : prevButton
            }
          : false,
      scrollbar: scrollbar
        ? {
            el: scrollbar,
            hide: false,
            draggable: true
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
