# Flodesk Form

Localizes the Flodesk newsletter form in the footer (consent text, privacy link, validation messages) and restyles it to the site's fonts and RTL layout.

| | |
|---|---|
| Source | `src/js/flodesk.js`, `src/styles/flodesk.css` |
| Loaded by | `main.js` → `initFlodeskPrivacyText()` |
| Used on | Every page (the form is in the footer; the Flodesk loader script is in the site-wide head code) |
| Depends on | The Flodesk embed |

## How it works

- The embed renders after `DOMContentLoaded`, so the script looks for `a[class$="__privacy-policy-link"]` up to 10 times, 500ms apart.
- When found, it replaces the consent label text and the privacy link text and URL with the Hebrew or English strings (by `<html lang>`).
- It then watches **only that form** with a `MutationObserver` and translates Flodesk's English validation messages (`.fd-form-feedback`) as they appear. Don't widen this to `document.body`: the sliders and GSAP mutate the DOM constantly.

## Editing strings

All strings live in the `strings` object at the top of `flodesk.js`:

| Key | Hebrew | English |
|---|---|---|
| `consentText` | consent sentence | consent sentence |
| `privacyText` | `מדיניות פרטיות` | `Privacy policy` |
| `privacyHref` | `https://www.cbwigs.co.il/terms-and-conditions` | `https://www.cbwigs.co.il/en/terms-and-conditions` |
| `requiredField`, `marketingConsent` | validation messages | validation messages |

There is no `/privacy-policy` page yet (it returned 404 as of 2026-10-24), so `privacyHref` points at `/terms-and-conditions`, whose "מדיניות פרטיות" section is the current privacy text. When a dedicated privacy page is published, point both `privacyHref` values at it.

To translate another Flodesk message, add its exact English text to `errorTranslations`.

## Styling

`flodesk.css` forces the Webflow body and heading font variables onto the form, removes the form padding, and in RTL moves the consent checkbox to the inline-start side. Some selectors include Flodesk form IDs (`ff-698722f5…`, `ff-69876c2c…`); if the form is recreated in Flodesk those IDs change, but the generic `[class$='__accepts-gdpr-checkbox']` rule still applies.

The submit button (`[data-ff-el='submit']`) gets the site's button hover: a `neutral-lighter` fill grows from the reading-start edge and the text turns `neutral-darkest`, on hover and `:focus-visible`, with the same `--btn-fill-duration` / `--ease-expo-in-out` timing as the other buttons. Flodesk sets `background: #000` with a higher-specificity selector, so these rules use `!important`.
