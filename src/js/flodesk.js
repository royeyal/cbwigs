(() => {
  console.log('Flodesk privacy text script running...');

  // Adjust if you have a locale attribute / class. Examples:
  // Webflow Localization often sets <html lang="he"> or similar.
  const lang = (document.documentElement.lang || '').toLowerCase();
  console.log('Detected language:', lang);

  const strings = {
    he: {
      consentText:
        'בהרשמה אתן מסכימות לקבל את מדיניות הפרטיות שלנו ונותנות את הסכמתכן לקבל עדכונים מהחברה שלנו.',
      privacyText: 'מדיניות פרטיות',
      privacyHref: 'https://cbwigs.co.il/privacy-policy' // <-- your real page
    },
    en: {
      consentText:
        'By signing up, you agree to our Privacy Policy and consent to receive updates from our company.',
      privacyText: 'Privacy policy',
      privacyHref: 'https://cbwigs.co.il/en/privacy-policy'
    }
  };

  const t = strings[lang.startsWith('he') ? 'he' : 'en'];

  // Target any privacy policy link using attribute selector
  const link = document.querySelector('a[class$="__privacy-policy-link"]');
  console.log('Privacy policy link element:', link);

  if (!link) {
    console.warn(
      'Privacy policy link not found - selector: a[class$="__privacy-policy-link"]'
    );
    return;
  }

  console.log('Found link, updating text and href...');

  // Replace link text + href
  link.textContent = t.privacyText;
  link.href = t.privacyHref;
  console.log('Link updated successfully');

  // Replace the text node around the link (the "I agree..." part)
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
})();
