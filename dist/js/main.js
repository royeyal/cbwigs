const e = {
  lines: { duration: 0.8, stagger: 0.08 },
  words: { duration: 0.6, stagger: 0.06 },
  chars: { duration: 0.4, stagger: 0.01 }
};
document.addEventListener('DOMContentLoaded', () => {
  (!(function () {
    if ('undefined' == typeof gsap) return;
    if ('undefined' == typeof SplitText) return;
    if ('undefined' == typeof ScrollTrigger) return;
    try {
      gsap.registerPlugin(SplitText, ScrollTrigger);
    } catch (r) {
      return;
    }
    const t = document.querySelectorAll('[data-split="heading"]');
    t.length &&
      t.forEach(t => {
        const r = t.dataset.splitReveal || 'lines',
          a =
            'lines' === r
              ? 'lines'
              : 'words' === r
                ? 'lines, words'
                : 'lines, words, chars';
        SplitText.create(t, {
          type: a,
          mask: 'lines',
          autoSplit: !0,
          linesClass: 'line',
          wordsClass: 'word',
          charsClass: 'letter',
          onSplit(a) {
            const s =
                'lines' === r ? a.lines : 'words' === r ? a.words : a.chars,
              o = e[r];
            return (
              t.classList.add('split-ready'),
              gsap.set(a.original, { visibility: 'visible' }),
              gsap.from(s, {
                yPercent: 110,
                duration: o.duration,
                stagger: o.stagger,
                ease: 'expo.out',
                scrollTrigger:
                  'undefined' != typeof ScrollTrigger
                    ? { trigger: t, start: 'top 80%', once: !0 }
                    : void 0,
                onComplete: () => a.revert()
              })
            );
          }
        });
      });
  })(),
    (function () {
      if ('undefined' == typeof gsap) return;
      if ('undefined' == typeof ScrollTrigger) return;
      try {
        gsap.registerPlugin(ScrollTrigger);
      } catch (r) {
        return;
      }
      const e = window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        t = gsap.context(() => {
          document.querySelectorAll('[data-reveal-group]').forEach(t => {
            const r = (parseFloat(t.getAttribute('data-stagger')) || 100) / 1e3,
              a = t.getAttribute('data-distance') || '2em',
              s = t.getAttribute('data-start') || 'top 80%',
              o = 0.8,
              n = 'power4.inOut';
            if (e)
              return void gsap.set(t, {
                clearProps: 'all',
                y: 0,
                autoAlpha: 1
              });
            const l = Array.from(t.children).filter(e => 1 === e.nodeType);
            if (!l.length)
              return (
                gsap.set(t, { y: a, autoAlpha: 0 }),
                void ScrollTrigger.create({
                  trigger: t,
                  start: s,
                  once: !0,
                  onEnter: () =>
                    gsap.to(t, {
                      y: 0,
                      autoAlpha: 1,
                      duration: o,
                      ease: n,
                      onComplete: () => gsap.set(t, { clearProps: 'all' })
                    })
                })
              );
            const i = [];
            (l.forEach(e => {
              const t = e.matches('[data-reveal-group-nested]')
                ? e
                : e.querySelector(':scope [data-reveal-group-nested]');
              if (t) {
                const r =
                  'false' === e.getAttribute('data-ignore') ||
                  'false' === t.getAttribute('data-ignore');
                i.push({
                  type: 'nested',
                  parentEl: e,
                  nestedEl: t,
                  includeParent: r
                });
              } else i.push({ type: 'item', el: e });
            }),
              i.forEach(e => {
                if ('item' === e.type) {
                  const t = e.el.matches('[data-reveal-group-nested]')
                    ? a
                    : e.el.getAttribute('data-distance') || a;
                  gsap.set(e.el, { y: t, autoAlpha: 0 });
                } else {
                  e.includeParent &&
                    gsap.set(e.parentEl, { y: a, autoAlpha: 0 });
                  const t = e.nestedEl.getAttribute('data-distance') || a;
                  Array.from(e.nestedEl.children).forEach(e =>
                    gsap.set(e, { y: t, autoAlpha: 0 })
                  );
                }
              }),
              i.forEach(e => {
                'nested' === e.type &&
                  e.includeParent &&
                  gsap.set(e.parentEl, { y: a });
              }),
              ScrollTrigger.create({
                trigger: t,
                start: s,
                once: !0,
                onEnter: () => {
                  const e = gsap.timeline();
                  i.forEach((t, a) => {
                    const s = a * r;
                    if ('item' === t.type)
                      e.to(
                        t.el,
                        {
                          y: 0,
                          autoAlpha: 1,
                          duration: o,
                          ease: n,
                          onComplete: () =>
                            gsap.set(t.el, { clearProps: 'all' })
                        },
                        s
                      );
                    else {
                      t.includeParent &&
                        e.to(
                          t.parentEl,
                          {
                            y: 0,
                            autoAlpha: 1,
                            duration: o,
                            ease: n,
                            onComplete: () =>
                              gsap.set(t.parentEl, { clearProps: 'all' })
                          },
                          s
                        );
                      const a = parseFloat(
                          t.nestedEl.getAttribute('data-stagger')
                        ),
                        l = isNaN(a) ? r : a / 1e3;
                      Array.from(t.nestedEl.children).forEach((t, r) => {
                        e.to(
                          t,
                          {
                            y: 0,
                            autoAlpha: 1,
                            duration: o,
                            ease: n,
                            onComplete: () => gsap.set(t, { clearProps: 'all' })
                          },
                          s + r * l
                        );
                      });
                    }
                  });
                }
              }));
          });
        });
    })());
});
