// Native CSS scroll-snap slider with prev/next arrows (replaces Swiper).
// Uses the existing data-swiper-* attributes so the Webflow markup is unchanged.
// Each arrow scrolls toward the side of the slider it sits on, so it behaves
// correctly in both RTL (Hebrew) and LTR (English) without swapping buttons.
//
// Looping: the slides are cloned once before and once after the originals.
// Whenever scrolling settles on a clone, the track jumps (instantly, without
// animation) to the matching original, so it scrolls endlessly both ways.
// Opt out with data-swiper-loop="false" on the group.

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

    const originals = [...track.children];
    const loop =
      group.getAttribute('data-swiper-loop') !== 'false' &&
      originals.length > 1;

    if (loop) {
      const cloneSlide = slide => {
        const clone = slide.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        clone.setAttribute('data-snap-clone', '');
        clone.inert = true;
        clone.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
        return clone;
      };
      track.prepend(...originals.map(cloneSlide));
      track.append(...originals.map(cloneSlide));
    }

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

    // The slide whose start edge is closest to the track's start edge
    // (left in LTR, right in RTL), i.e. the one scroll-snap aligns to.
    const startSlide = () => {
      const rtl = getComputedStyle(track).direction === 'rtl';
      const trackBox = track.getBoundingClientRect();
      let best = null;
      let bestDistance = Infinity;
      for (const slide of track.children) {
        const box = slide.getBoundingClientRect();
        const distance = rtl
          ? Math.abs(box.right - trackBox.right)
          : Math.abs(box.left - trackBox.left);
        if (distance < bestDistance) {
          best = slide;
          bestDistance = distance;
        }
      }
      return best;
    };

    // If the view sits on a clone, jump by one full set to the matching
    // original. The offset is measured, so it is exact in RTL and LTR.
    const recenter = () => {
      if (!loop) return;
      const slides = [...track.children];
      const count = originals.length;
      const index = slides.indexOf(startSlide());
      let target = null;
      if (index < count) target = slides[index + count];
      else if (index >= count * 2) target = slides[index - count];
      if (!target) return;
      const delta =
        target.getBoundingClientRect().left -
        slides[index].getBoundingClientRect().left;
      track.scrollBy({ left: delta, behavior: 'instant' });
    };

    const updateButtons = () => {
      if (loop) return;
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
        recenter();
        const slide = track.firstElementChild;
        const step = slide ? slide.getBoundingClientRect().width : 0;
        track.scrollBy({
          left: sideOf(button) * (step || track.clientWidth * 0.8),
          behavior: reduceMotion.matches ? 'auto' : 'smooth'
        });
      });
    });

    // Recenter once scrolling has settled. scrollend where supported,
    // otherwise a short pause in scroll events.
    let settleTimer;
    const onScroll = () => {
      updateButtons();
      if (!loop || 'onscrollend' in window) return;
      clearTimeout(settleTimer);
      settleTimer = setTimeout(recenter, 150);
    };

    track.addEventListener('scroll', onScroll, { passive: true });
    if (loop && 'onscrollend' in window) {
      track.addEventListener('scrollend', recenter);
    }
    window.addEventListener('resize', () => {
      updateButtons();
      recenter();
    });
    recenter();
    updateButtons();
  });
}

export { initSnapSlider };
