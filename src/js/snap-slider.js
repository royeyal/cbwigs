// Native CSS scroll-snap slider with prev/next arrows (replaces Swiper).
// Uses the existing data-swiper-* attributes so the Webflow markup is unchanged.
// Each arrow scrolls toward the side of the slider it sits on, so it behaves
// correctly in both RTL (Hebrew) and LTR (English) without swapping buttons.

function initSnapSlider() {
  const groups = document.querySelectorAll('[data-swiper-group]');

  if (!groups.length) return;

  const isHebrew = document.documentElement.lang.startsWith('he');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  groups.forEach(group => {
    const wrap = group.querySelector('[data-swiper-wrap]');
    // Webflow Collection List: wrap > [role=list] > items; static markup: wrap > list > items
    const track =
      wrap?.querySelector('[role="list"]') || wrap?.firstElementChild;
    if (!track) {
      console.warn('Snap slider track not found in group:', group);
      return;
    }

    track.setAttribute('data-snap-track', '');

    const buttons = [
      group.querySelector('[data-swiper-prev]'),
      group.querySelector('[data-swiper-next]')
    ].filter(Boolean);

    // -1 if the button sits on the left half of the track, 1 if on the right
    const sideOf = button => {
      const trackBox = track.getBoundingClientRect();
      const buttonBox = button.getBoundingClientRect();
      const buttonCenter = buttonBox.left + buttonBox.width / 2;
      return buttonCenter < trackBox.left + trackBox.width / 2 ? -1 : 1;
    };

    // Distance left to scroll toward each physical side. In RTL, scrollLeft
    // starts at 0 and goes negative as you scroll left.
    const remaining = side => {
      const max = track.scrollWidth - track.clientWidth;
      const rtl = getComputedStyle(track).direction === 'rtl';
      const left = rtl ? max + track.scrollLeft : track.scrollLeft;
      return side < 0 ? left : max - left;
    };

    const updateButtons = () => {
      buttons.forEach(button => {
        button.disabled = remaining(sideOf(button)) <= 1;
      });
    };

    buttons.forEach(button => {
      if (!button.hasAttribute('aria-label')) {
        const isPrev = button.hasAttribute('data-swiper-prev');
        const labels = isHebrew ? ['הקודם', 'הבא'] : ['Previous', 'Next'];
        button.setAttribute('aria-label', labels[isPrev ? 0 : 1]);
      }

      button.addEventListener('click', () => {
        const slide = track.firstElementChild;
        const step = slide ? slide.getBoundingClientRect().width : 0;
        track.scrollBy({
          left: sideOf(button) * (step || track.clientWidth * 0.8),
          behavior: reduceMotion.matches ? 'auto' : 'smooth'
        });
      });
    });

    track.addEventListener('scroll', updateButtons, { passive: true });
    window.addEventListener('resize', updateButtons);
    updateButtons();
  });
}

export { initSnapSlider };
