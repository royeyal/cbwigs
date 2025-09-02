function initMaskedTextReveal() {
  const heading = document.querySelector('[data-split="heading"]')
  const buttons = document.querySelectorAll('[data-split="button"]')
  let currentTween, currentTargets

  // split your demo heading once
  SplitText.create(heading, {
    type: 'lines, words, chars',
    mask: 'lines',
    autoSplit: true,
    linesClass: 'line',
    wordsClass: 'word',
    charsClass: 'letter'
  })

  function animate(type) {
    if (currentTween) {
      currentTween.kill()
      gsap.set(currentTargets, { yPercent: 0 })
    }

    const cfg = {
      lines:   { duration: 0.8, stagger: 0.08 },
      words:   { duration: 0.6, stagger: 0.06 },
      letters: { duration: 0.4, stagger: 0.008 }
    }[type]

    const className = type === 'lines'
      ? 'line'
      : type === 'words'
        ? 'word'
        : 'letter'

    const targets = heading.querySelectorAll(`.${className}`)
    currentTargets = targets

    currentTween = gsap.fromTo(
      targets,
      { yPercent: 110 },
      { yPercent: 0, duration: cfg.duration, stagger: cfg.stagger, ease: 'expo.out' }
    )
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      animate(btn.dataset.splitType)
    })
  })
}

const splitConfig = {
  lines: { duration: 0.8,  stagger: 0.08 },
  words: { duration: 0.6,  stagger: 0.06 },
  chars:{ duration: 0.4,  stagger: 0.01 }
}

function initMaskTextScrollReveal() {
  
  document.querySelectorAll('[data-split="heading"]').forEach(heading => {
    if (heading.closest('[data-split-demo]')) return
    
    const type = heading.dataset.splitReveal || 'lines'
    const typesToSplit =
      type === 'lines' ? ['lines'] :
      type === 'words' ? ['lines','words'] :
      ['lines','words','chars']

    SplitText.create(heading, {
      type: typesToSplit.join(', '),
      mask: 'lines',
      autoSplit: true,
      linesClass: 'line',
      wordsClass: 'word',
      charsClass: 'letter',
      onSplit: function(instance) {
        animate(instance, heading, type)
      }
    })
  })
  
  function animate(instance, heading, type) {
    const targets = instance[type]
    const config = splitConfig[type]
    
    gsap.from(targets, {
      yPercent: 110,
      duration: config.duration,
      stagger: config.stagger,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: heading,
        start: 'top 80%',
        once: true
      }
    })
    
  }
  
}

// Initialize Masked Text Reveal
document.addEventListener("DOMContentLoaded", () => {
  initMaskedTextReveal();
  initMaskTextScrollReveal()
});
