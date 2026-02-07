(() => {
  // Adjust if you have a locale attribute / class. Examples:
  // Webflow Localization often sets <html lang="he"> or similar.
  const lang = (document.documentElement.lang || '').toLowerCase();

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
  if (!link) return;

  // Replace link text + href
  link.textContent = t.privacyText;
  link.href = t.privacyHref;

  // Replace the text node around the link (the "I agree..." part)
  const label = link.closest('.fd-form-check__label');
  if (!label) return;

  // Remove text nodes in label, keep the link
  [...label.childNodes].forEach(n => {
    if (n.nodeType === 3) n.remove();
  });

  // Insert localized consent text before the link
  label.insertBefore(document.createTextNode(`${t.consentText} `), link);
})();
