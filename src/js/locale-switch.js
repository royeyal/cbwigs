(() => {
  // Edit these labels if you prefer EN/HE etc.
  const LABEL_EN = 'English';
  const LABEL_HE = 'עברית';

  // Selector for your placeholder link block
  const SWITCH_LINK_SELECTOR = '[data-locale-switch="true"]';
  const SWITCH_LABEL_SELECTOR = '.nav-link__label';

  function getCurrentLang() {
    // Webflow typically sets <html lang="he"> or <html lang="en-US"> etc.
    const lang = (
      document.documentElement.getAttribute('lang') || ''
    ).toLowerCase();
    return lang || null;
  }

  function getAlternateLinks() {
    // Webflow usually outputs alternates for locales in the <head>
    return Array.from(
      document.querySelectorAll('link[rel="alternate"][hreflang][href]')
    )
      .map(l => ({
        hreflang: (l.getAttribute('hreflang') || '').toLowerCase(),
        href: l.getAttribute('href')
      }))
      .filter(x => x.hreflang && x.href);
  }

  function pickOtherLocale(alts, currentLang) {
    if (!alts.length) return null;

    // Normalize current language to primary subtag: "en-us" -> "en"
    const currentPrimary = currentLang ? currentLang.split('-')[0] : null;

    // Prefer the link that doesn't match the current primary language
    let other = null;
    if (currentPrimary) {
      other = alts.find(a => !a.hreflang.startsWith(currentPrimary));
    }

    // Fallback: if we couldn't infer, just pick the first non-x-default
    if (!other) other = alts.find(a => a.hreflang !== 'x-default') || alts[0];

    return other;
  }

  function setSwitcher() {
    const link = document.querySelector(SWITCH_LINK_SELECTOR);
    if (!link) {
      console.warn(
        '[Locale Switch] No link found with selector:',
        SWITCH_LINK_SELECTOR
      );
      return;
    }

    const labelEl = link.querySelector(SWITCH_LABEL_SELECTOR);

    const currentLang = getCurrentLang();
    const alts = getAlternateLinks();

    console.log('[Locale Switch] Current lang:', currentLang);
    console.log('[Locale Switch] Found alternates:', alts);

    const other = pickOtherLocale(alts, currentLang);
    console.log('[Locale Switch] Selected alternate:', other);

    if (other && other.href) {
      link.setAttribute('href', other.href);

      // Set label based on target hreflang (show where we're GOING)
      if (labelEl) {
        const isTargetEnglish = other.hreflang.startsWith('en');
        console.log(
          '[Locale Switch] Is target English?',
          isTargetEnglish,
          '- Setting label to:',
          isTargetEnglish ? LABEL_EN : LABEL_HE
        );
        labelEl.textContent = isTargetEnglish ? LABEL_EN : LABEL_HE;
      }
      return;
    }

    // Fallback (if alternates aren't present for some reason):
    console.log('[Locale Switch] Using fallback logic');
    // This assumes your locale path is /en (or /en-us) — update as needed.
    const path = window.location.pathname;
    const isEnglishPath = path.startsWith('/en') || path.startsWith('/en-us');
    console.log(
      '[Locale Switch] Path:',
      path,
      '- Is English path?',
      isEnglishPath
    );

    const toHebrew = path.replace(/^\/(en|en-us)(\/|$)/, '/');
    const toEnglish = `/en${path.startsWith('/') ? path : `/${path}`}`;

    link.setAttribute('href', isEnglishPath ? toHebrew : toEnglish);
    console.log('[Locale Switch] Set href to:', link.getAttribute('href'));

    if (labelEl) {
      const labelText = isEnglishPath ? LABEL_HE : LABEL_EN;
      console.log('[Locale Switch] Setting label to:', labelText);
      labelEl.textContent = labelText;
    }
  }

  // Run once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setSwitcher);
  } else {
    setSwitcher();
  }
})();
