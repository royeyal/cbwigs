// Draggable Infinite Slider

/**
 * Initializes the draggable infinite slider
 * @returns {void}
 */
export function initDraggableInfiniteSlider() {
  // Check if GSAP is available globally
  if (
    typeof gsap === 'undefined' ||
    typeof Draggable === 'undefined' ||
    typeof InertiaPlugin === 'undefined'
  ) {
    console.warn(
      '⚠️ GSAP, Draggable, or InertiaPlugin not found. Make sure they are loaded.'
    );
    return;
  }

  gsap.registerPlugin(Draggable, InertiaPlugin);

  function initSlider() {
    const wrapper = document.querySelector('[data-slider="list"]');
    if (!wrapper) return;

    const slides = gsap.utils.toArray('[data-slider="slide"]');
    if (slides.length === 0) return;

    const nextButton = document.querySelector('[data-slider="button-next"]');
    const prevButton = document.querySelector('[data-slider="button-prev"]');

    const totalElement = document.querySelector('[data-slide-count="total"]');
    const stepElement = document.querySelector('[data-slide-count="step"]');
    const stepsParent = stepElement?.parentElement;

    let activeElement;
    const totalSlides = slides.length;

    // Total
    if (totalElement)
      totalElement.textContent =
        totalSlides < 10 ? `0${totalSlides}` : totalSlides;

    // Steps (clone)
    if (stepsParent && stepElement) {
      stepsParent.innerHTML = '';
      slides.forEach((_, index) => {
        const stepClone = stepElement.cloneNode(true);
        stepClone.textContent = index + 1 < 10 ? `0${index + 1}` : index + 1;
        stepsParent.appendChild(stepClone);
      });
    }
    const allSteps = stepsParent
      ? stepsParent.querySelectorAll('[data-slide-count="step"]')
      : [];

    // —— Responsive
    const mq = window.matchMedia('(min-width: 992px)');
    let useNextForActive = mq.matches;
    mq.addEventListener('change', e => {
      useNextForActive = e.matches;
      // Re-apply active to the correct element for this breakpoint
      if (currentEl) {
        applyActive(currentEl, currentIndex, /*animateNumbers=*/ false);
      }
    });

    // —— Keep track of the current element & index from onChange
    let currentEl = null;
    let currentIndex = 0;

    function resolveActive(el) {
      return useNextForActive ? el.nextElementSibling || slides[0] : el;
    }

    function applyActive(el, index, animateNumbers = true) {
      // swap active class
      if (activeElement) activeElement.classList.remove('active');
      const target = resolveActive(el);
      target.classList.add('active');
      activeElement = target;

      // update numbers (animate or snap)
      if (allSteps.length) {
        if (animateNumbers) {
          gsap.to(allSteps, {
            y: `${-100 * index}%`,
            ease: 'power3',
            duration: 0.45
          });
        } else {
          gsap.set(allSteps, { y: `${-100 * index}%` });
        }
      }
    }

    const loop = horizontalLoop(slides, {
      paused: true,
      draggable: true,
      center: false,
      onChange: (element, index) => {
        // remember latest
        currentEl = element;
        currentIndex = index;
        // apply for current breakpoint
        applyActive(element, index, true);
      }
    });

    // Click -> go to index (offset only on desktop offset design)
    function mapClickIndex(i) {
      return useNextForActive ? i - 1 : i;
    }
    slides.forEach((slide, i) => {
      slide.addEventListener('click', () => {
        if (slide.classList.contains('active')) return;
        loop.toIndex(mapClickIndex(i), { ease: 'power3', duration: 0.725 });
      });
    });

    nextButton?.addEventListener('click', () =>
      loop.next({ ease: 'power3', duration: 0.725 })
    );
    prevButton?.addEventListener('click', () =>
      loop.previous({ ease: 'power3', duration: 0.725 })
    );

    if (!currentEl && slides[0]) {
      currentEl = slides[0];
      currentIndex = 0;
      applyActive(currentEl, currentIndex, false);
    }
  }

  function horizontalLoop(items, config) {
    let timeline;
    items = gsap.utils.toArray(items);
    config = config || {};
    gsap.context(() => {
      const onChange = config.onChange;
      let lastIndex = 0;
      const tl = gsap.timeline({
        repeat: config.repeat,
        onUpdate:
          onChange &&
          function () {
            const i = tl.closestIndex();
            if (lastIndex !== i) {
              lastIndex = i;
              onChange(items[i], i);
            }
          },
        paused: config.paused,
        defaults: { ease: 'none' },
        onReverseComplete: () =>
          tl.totalTime(tl.rawTime() + tl.duration() * 100)
      });
      const length = items.length;
      const startX = items[0].offsetLeft;
      const times = [];
      const widths = [];
      const spaceBefore = [];
      const xPercents = [];
      let curIndex = 0;
      let indexIsDirty = false;
      const center = config.center;
      const pixelsPerSecond = (config.speed || 1) * 100;
      const snap =
        config.snap === false ? v => v : gsap.utils.snap(config.snap || 1); // some browsers shift by a pixel to accommodate flex layouts, so for example if width is 20% the first element's width might be 242px, and the next 243px, alternating back and forth. So we snap to 5 percentage points to make things look more natural
      let timeOffset = 0;
      const container =
        center === true
          ? items[0].parentNode
          : gsap.utils.toArray(center)[0] || items[0].parentNode;
      let totalWidth;
      const getTotalWidth = () =>
        items[length - 1].offsetLeft +
        (xPercents[length - 1] / 100) * widths[length - 1] -
        startX +
        spaceBefore[0] +
        items[length - 1].offsetWidth *
          gsap.getProperty(items[length - 1], 'scaleX') +
        (parseFloat(config.paddingRight) || 0);
      const populateWidths = () => {
          let b1 = container.getBoundingClientRect(),
            b2;
          items.forEach((el, i) => {
            widths[i] = parseFloat(gsap.getProperty(el, 'width', 'px'));
            xPercents[i] = snap(
              (parseFloat(gsap.getProperty(el, 'x', 'px')) / widths[i]) * 100 +
                gsap.getProperty(el, 'xPercent')
            );
            b2 = el.getBoundingClientRect();
            spaceBefore[i] = b2.left - (i ? b1.right : b1.left);
            b1 = b2;
          });
          gsap.set(items, {
            // convert "x" to "xPercent" to make things responsive, and populate the widths/xPercents Arrays to make lookups faster.
            xPercent: i => xPercents[i]
          });
          totalWidth = getTotalWidth();
        },
        populateOffsets = () => {
          timeOffset = center
            ? (tl.duration() * (container.offsetWidth / 2)) / totalWidth
            : 0;
          center &&
            times.forEach((t, i) => {
              times[i] = timeWrap(
                tl.labels[`label${i}`] +
                  (tl.duration() * widths[i]) / 2 / totalWidth -
                  timeOffset
              );
            });
        },
        getClosest = (values, value, wrap) => {
          let i = values.length;
          let closest = 1e10;
          let index = 0;
          let d;
          while (i--) {
            d = Math.abs(values[i] - value);
            if (d > wrap / 2) {
              d = wrap - d;
            }
            if (d < closest) {
              closest = d;
              index = i;
            }
          }
          return index;
        },
        populateTimeline = () => {
          let i, item, curX, distanceToStart, distanceToLoop;
          tl.clear();
          for (i = 0; i < length; i++) {
            item = items[i];
            curX = (xPercents[i] / 100) * widths[i];
            distanceToStart = item.offsetLeft + curX - startX + spaceBefore[0];
            distanceToLoop =
              distanceToStart + widths[i] * gsap.getProperty(item, 'scaleX');
            tl.to(
              item,
              {
                xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
                duration: distanceToLoop / pixelsPerSecond
              },
              0
            )
              .fromTo(
                item,
                {
                  xPercent: snap(
                    ((curX - distanceToLoop + totalWidth) / widths[i]) * 100
                  )
                },
                {
                  xPercent: xPercents[i],
                  duration:
                    (curX - distanceToLoop + totalWidth - curX) /
                    pixelsPerSecond,
                  immediateRender: false
                },
                distanceToLoop / pixelsPerSecond
              )
              .add(`label${i}`, distanceToStart / pixelsPerSecond);
            times[i] = distanceToStart / pixelsPerSecond;
          }
          timeWrap = gsap.utils.wrap(0, tl.duration());
        },
        refresh = deep => {
          const progress = tl.progress();
          tl.progress(0, true);
          populateWidths();
          deep && populateTimeline();
          populateOffsets();
          deep && tl.draggable
            ? tl.time(times[curIndex], true)
            : tl.progress(progress, true);
        },
        onResize = () => refresh(true);
      let timeWrap, proxy;
      gsap.set(items, { x: 0 });
      populateWidths();
      populateTimeline();
      populateOffsets();
      window.addEventListener('resize', onResize);
      function toIndex(index, vars) {
        vars = vars || {};
        Math.abs(index - curIndex) > length / 2 &&
          (index += index > curIndex ? -length : length); // always go in the shortest direction
        const newIndex = gsap.utils.wrap(0, length, index);
        let time = times[newIndex];
        if (time > tl.time() !== index > curIndex && index !== curIndex) {
          // if we're wrapping the timeline's playhead, make the proper adjustments
          time += tl.duration() * (index > curIndex ? 1 : -1);
        }
        if (time < 0 || time > tl.duration()) {
          vars.modifiers = { time: timeWrap };
        }
        curIndex = newIndex;
        vars.overwrite = true;
        gsap.killTweensOf(proxy);
        return vars.duration === 0
          ? tl.time(timeWrap(time))
          : tl.tweenTo(time, vars);
      }
      tl.toIndex = (index, vars) => toIndex(index, vars);
      tl.closestIndex = setCurrent => {
        const index = getClosest(times, tl.time(), tl.duration());
        if (setCurrent) {
          curIndex = index;
          indexIsDirty = false;
        }
        return index;
      };
      tl.current = () => (indexIsDirty ? tl.closestIndex(true) : curIndex);
      tl.next = vars => toIndex(tl.current() + 1, vars);
      tl.previous = vars => toIndex(tl.current() - 1, vars);
      tl.times = times;
      tl.progress(1, true).progress(0, true); // pre-render for performance
      if (config.reversed) {
        tl.vars.onReverseComplete();
        tl.reverse();
      }
      if (config.draggable && typeof Draggable === 'function') {
        proxy = document.createElement('div');
        const wrap = gsap.utils.wrap(0, 1);
        let ratio, startProgress, lastSnap, initChangeX, wasPlaying;
        const syncIndex = () => tl.closestIndex(true);
        typeof InertiaPlugin === 'undefined' &&
          console.warn(
            'InertiaPlugin required for momentum-based scrolling and snapping. https://greensock.com/club'
          );
        const draggable = Draggable.create(proxy, {
          trigger: items[0].parentNode,
          type: 'x',
          onPressInit() {
            const x = this.x;
            gsap.killTweensOf(tl);
            wasPlaying = !tl.paused();
            tl.pause();
            startProgress = tl.progress();
            refresh();
            ratio = 1 / totalWidth;
            initChangeX = startProgress / -ratio - x;
            gsap.set(proxy, { x: startProgress / -ratio });
          },
          onDrag() {
            tl.progress(wrap(startProgress + (this.startX - this.x) * ratio));
          },
          onThrowUpdate() {
            tl.progress(wrap(startProgress + (this.startX - this.x) * ratio));
          },
          overshootTolerance: 0,
          inertia: true,
          snap(value) {
            if (Math.abs(startProgress / -ratio - this.x) < 10) {
              return lastSnap + initChangeX;
            }
            const time = -(value * ratio) * tl.duration();
            const wrappedTime = timeWrap(time);
            const snapTime =
              times[getClosest(times, wrappedTime, tl.duration())];
            let dif = snapTime - wrappedTime;
            Math.abs(dif) > tl.duration() / 2 &&
              (dif += dif < 0 ? tl.duration() : -tl.duration());
            lastSnap = (time + dif) / tl.duration() / -ratio;
            return lastSnap;
          },
          onRelease() {
            syncIndex();
            this.isThrowing && (indexIsDirty = true);
          },
          onThrowComplete: () => {
            syncIndex();
            wasPlaying && tl.play();
          }
        })[0];
        tl.draggable = draggable;
      }
      tl.closestIndex(true);
      lastIndex = curIndex;
      onChange && onChange(items[curIndex], curIndex);
      timeline = tl;
      return () => window.removeEventListener('resize', onResize);
    });
    return timeline;
  }

  initSlider();
}
