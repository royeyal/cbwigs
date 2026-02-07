// Main entry point for all GSAP animations
import '../styles/main.css';
import { initMaskTextScrollReveal } from './textreveal.js';
import { initContentRevealScroll } from './contentrevealscroll.js';
import { initBasicGSAPSlider } from './gsap-slider.js';
import { initAccordionCSS } from './accordion.js';
import { initLeadingZero } from './leading-zero.js';
import { initSwiperSlider } from './swipeslider.js';
import { initFlipCounter } from './flip-counter.js';
import { initImageTrail } from './image-trail-following-cursor.js';
import { initYouTubeLightbox } from './youtube-lightbox.js';
import { initLayoutGridFlip } from './layout-grid-flip.js';
import { initCopyEmailClipboard } from './copy-email-to-clipboard-button.js';
import { initNavigation } from './multilevel-navigation.js';
import { initParallaxImages } from './parallax-image.js';
import { initDraggableInfiniteSlider } from './draggable-infinite-slider.js';
import './youtube-player.js';
import './lightbox-setup.js';
import './locale-switch.js';

// Initialize Flodesk privacy policy text customization
function initFlodeskPrivacyText() {
  console.log('Flodesk privacy text script running...');

  const lang = (document.documentElement.lang || '').toLowerCase();
  console.log('Detected language:', lang);

  const strings = {
    he: {
      consentText:
        'בהרשמה אתן מסכימות לקבל את מדיניות הפרטיות שלנו ונותנות את הסכמתכן לקבל עדכונים מהחברה שלנו.',
      privacyText: 'מדיניות פרטיות',
      privacyHref: 'https://cbwigs.co.il/privacy-policy'
    },
    en: {
      consentText:
        'By signing up, you agree to our Privacy Policy and consent to receive updates from our company.',
      privacyText: 'Privacy policy',
      privacyHref: 'https://cbwigs.co.il/en/privacy-policy'
    }
  };

  const t = strings[lang.startsWith('he') ? 'he' : 'en'];

  // Retry function to wait for Flodesk form to load
  function tryUpdatePrivacyText(attempt = 1, maxAttempts = 10) {
    // Target any privacy policy link using attribute selector
    const link = document.querySelector('a[class$="__privacy-policy-link"]');

    if (!link) {
      if (attempt < maxAttempts) {
        console.log(
          `Attempt ${attempt}: Waiting for Flodesk form... retrying in 500ms`
        );
        setTimeout(() => tryUpdatePrivacyText(attempt + 1, maxAttempts), 500);
      } else {
        console.warn(
          'Privacy policy link not found after',
          maxAttempts,
          'attempts - selector: a[class$="__privacy-policy-link"]'
        );
      }
      return;
    }

    console.log('Privacy policy link element:', link);
    console.log('Found link, updating text and href...');

    // Replace link text + href
    link.textContent = t.privacyText;
    link.href = t.privacyHref;
    console.log('Link updated successfully');

    // Replace the text node around the link
    const label = link.closest('.fd-form-check__label');
    console.log('Label element:', label);

    if (!label) {
      console.warn('Label not found - selector: .fd-form-check__label');
      return;
    }

    console.log('Found label, replacing consent text...');

    // Remove text nodes in label, keep the link
    [...label.childNodes].forEach(n => {
      if (n.nodeType === 3) n.remove();
    });

    // Insert localized consent text before the link
    label.insertBefore(document.createTextNode(`${t.consentText} `), link);

    console.log('✓ Flodesk privacy text customization complete!');
  }

  // Start the retry process
  tryUpdatePrivacyText();
}

// Initialize all animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize text reveal animations
  initMaskTextScrollReveal();

  // Initialize content reveal scroll animations
  initContentRevealScroll();

  // Initialize basic GSAP slider
  initBasicGSAPSlider();

  // Initialize accordion functionality
  initAccordionCSS();

  // Initialize leading zero formatter for accordion counts (will only run if count elements exist)
  initLeadingZero();

  // Initialize swiper slider (will only run if swiper elements exist and library is loaded)
  initSwiperSlider();

  // Initialize flip counter effect
  initFlipCounter();

  // Initialize image trail following cursor (will only run if wrapper exists)
  initImageTrail({
    minWidth: 992,
    moveDistance: 15,
    stopDuration: 350,
    trailLength: 8
  });

  // Initialize YouTube lightbox modal (will only run if hero lightbox exists)
  initYouTubeLightbox();

  // Initialize layout grid flip (will only run if layout groups exist)
  initLayoutGridFlip();

  // Initialize copy email to clipboard button (will only run if buttons exist)
  initCopyEmailClipboard();

  // Initialize multilevel navigation (will only run if navigation exists)
  initNavigation();

  // Initialize parallax image effect (will only run if data-parallax-image exists)
  initParallaxImages();

  // Initialize draggable infinite slider (will only run if slider elements exist)
  initDraggableInfiniteSlider();

  // Initialize Flodesk privacy policy text customization
  initFlodeskPrivacyText();
});

// Export all animation functions for potential external access
export {
  initMaskTextScrollReveal,
  initContentRevealScroll,
  initBasicGSAPSlider,
  initAccordionCSS,
  initLeadingZero,
  initSwiperSlider,
  initFlipCounter,
  initImageTrail,
  initYouTubeLightbox,
  initLayoutGridFlip,
  initCopyEmailClipboard,
  initNavigation,
  initParallaxImages,
  initDraggableInfiniteSlider,
  initFlodeskPrivacyText
};
