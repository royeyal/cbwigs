// Flodesk form: localize the privacy/consent text and validation messages.
// The embed loads after DOMContentLoaded, so the link lookup retries (10 x 500ms);
// pages without a Flodesk form stop there and never create an observer.
export function initFlodeskPrivacyText() {
  // Webflow Localization sets <html lang="he"> / <html lang="en">
  const lang = (document.documentElement.lang || '').toLowerCase();

  const strings = {
    he: {
      consentText:
        'בהרשמה אתן מסכימות לקבל את מדיניות הפרטיות שלנו ונותנות את הסכמתכן לקבל עדכונים מהחברה שלנו.',
      privacyText: 'מדיניות פרטיות',
      privacyHref: 'https://cbwigs.co.il/privacy-policy', // <-- your real page
      requiredField: 'זהו שדה חובה',
      marketingConsent: 'עלייך לסמן שאת מאשרת לקבל מאיתנו חומרי שיווק'
    },
    en: {
      consentText:
        'By signing up, you agree to our Privacy Policy and consent to receive updates from our company.',
      privacyText: 'Privacy policy',
      privacyHref: 'https://cbwigs.co.il/en/privacy-policy',
      requiredField: 'This field is required',
      marketingConsent: 'You must agree to receive marketing emails'
    }
  };

  const t = strings[lang.startsWith('he') ? 'he' : 'en'];

  const errorTranslations = {
    'This field is required': t.requiredField,
    'You must agree to receive marketing emails': t.marketingConsent
  };

  // Validation messages appear inside the form after the user submits.
  function translateErrorMessages(form) {
    form.querySelectorAll('.fd-form-feedback').forEach(el => {
      const translated = errorTranslations[el.textContent.trim()];
      if (translated && el.textContent !== translated) {
        el.textContent = translated;
      }
    });
  }

  function localizeConsent(link) {
    link.textContent = t.privacyText;
    link.href = t.privacyHref;

    // Replace the "I agree..." text around the link
    const label = link.closest('.fd-form-check__label');
    if (!label) {
      console.warn('Label not found - selector: .fd-form-check__label');
      return;
    }
    [...label.childNodes].forEach(n => {
      if (n.nodeType === 3) n.remove();
    });
    label.insertBefore(document.createTextNode(`${t.consentText} `), link);
  }

  // The Flodesk embed renders after DOMContentLoaded, so poll for its privacy link.
  function tryLocalizeForms(attempt = 1, maxAttempts = 10) {
    const links = document.querySelectorAll(
      'a[class$="__privacy-policy-link"]'
    );

    if (!links.length) {
      if (attempt < maxAttempts) {
        setTimeout(() => tryLocalizeForms(attempt + 1, maxAttempts), 500);
      }
      // No Flodesk form on this page: nothing to localize or watch
      return;
    }

    links.forEach(link => {
      localizeConsent(link);

      // Watch only this form (not the whole page) for validation messages
      const form = link.closest('form') || link.closest('[data-ff-el="root"]');
      if (!form) return;
      translateErrorMessages(form);
      new MutationObserver(() => translateErrorMessages(form)).observe(form, {
        childList: true,
        subtree: true,
        characterData: true
      });
    });
  }

  tryLocalizeForms();
}
