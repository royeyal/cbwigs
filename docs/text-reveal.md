# Text Reveal

Masked heading reveal: SplitText breaks a heading into lines, words or characters and slides them up into view.

| | |
|---|---|
| Source | `src/js/textreveal.js`, `src/styles/textreveal.css` |
| Loaded by | `main.js` → `initMaskTextScrollReveal()` |
| Used on | Every page with a display-styled `h2` (automatic); hero `h1` on `/`; opt-in extras on `/about`, `/hair-extensions` (and `/en` versions) |
| Depends on | GSAP + SplitText + ScrollTrigger (Webflow globals) |

## What reveals

**Automatically, with no attribute:** every `h2` with the class `heading-style-h1` or `heading-style-h2`, i.e. section titles. This deliberately leaves out:

- `h3`–`h6`, paragraphs and other text
- `h2`s in other styles: the event card titles (`heading-style-h5`), "לקוחות משתפות" (`heading-style-h3`)
- unstyled `h2`s in rich text (the accessibility statement, event write-ups)
- display-styled `div`s such as the slider's "Follow us" overlay

This is the one module that selects by Webflow class instead of a `data-*` attribute, on purpose: tagging every section title by hand was the problem. If those two classes are renamed in the Designer, auto-reveal stops (the headings show without animation; nothing breaks).

**By attribute:**

| Attribute | Value | Meaning |
|---|---|---|
| `data-split-reveal` | `lines` (default), `words`, `chars` | Opts any element in, or changes the effect on an auto heading |
| `data-split-reveal` | `none` | Opts an auto heading out |
| `data-split` | `heading` | Hides the element in CSS **before first paint**. Only needed for something on screen at load that should animate on load, i.e. a hero `h1`. Below-the-fold headings don't need it |

The Designer and Editor always show the text (`.wf-design-mode`, `.w-editor` overrides).

## Behavior

- Waits for `document.fonts.ready` so line breaks are measured with the real font, then measures each heading once:
  - **On screen at load, with `data-split="heading"`** → animates immediately (the home hero `h1`).
  - **On screen at load, without it** → left alone. Text that's already visible is never hidden.
  - **Below the fold** → split and hidden by JavaScript (the visitor can't see it yet), revealed when its top reaches 90% of the viewport (`clamp()`ed, so headings near the page end still play).
- Timing: lines 0.8s / 0.08s stagger, words 0.6s / 0.06s, chars 0.4s / 0.01s, all `expo.out`.
- After animating, the split is reverted to the original markup, so screen readers and resizing see normal text.
- While split, each element keeps its unsplit width (inline `width`, plus `max-width: 100%` so it can still shrink and re-split), restored after the revert. Split lines are blocks only as wide as their own text, so without this a parent that shrinks to fit its content narrowed and shifted until the revert, then jumped. The `header36_content` blocks on `/hair-extensions` (grid items with `justify-self: end`) jumped up to 32px sideways.
  - The pinned width is the unsplit width rounded up to a whole pixel, plus 1px. Split text is a fraction of a pixel wider than unsplit text (678.20px vs 678.148px for the home `h1` at 1280px), so pinning the exact width wrapped one-line headings ("חיה ברונפמן פאות", "מי אנחנו") onto two lines until the revert, a 0.054 CLS on the home page.
- `autoSplit` re-splits if the layout changes before the animation runs. The `onSplit` callback returns the tween, so SplitText kills the old tween and its ScrollTrigger on each re-split.
- Each line is clipped twice: by SplitText's `.line-mask` wrapper (`overflow: clip`) and by `.line` itself (`overflow: hidden`). Both get `padding-bottom: 0.1em; margin-bottom: -0.1em`, so descenders aren't cut off during the animation and the line spacing doesn't change. These rules are scoped to `.split-ready`, which the script adds to every element it splits, with or without `data-split`.
- `prefers-reduced-motion: reduce` → the script does nothing and the CSS shows every heading.
- Failsafes: if GSAP or a plugin is missing, the script shows every `data-split="heading"` element; if the script never runs at all, a 3s CSS animation makes them visible.

## History

Until October 2026 the reveal was opt-in only (`data-split` + `data-split-reveal` on every heading) and every non-`h1` waited for `top 80%`. A heading in the bottom fifth of the first screen therefore stayed blank until the visitor scrolled; the home "עולם של פאות בעיצוב אישי" `h2` sits at 81% on a 1000×697 viewport. Each re-split also left an extra ScrollTrigger behind.

The existing `data-split` / `data-split-reveal` attributes in the Designer still work, so each one keeps its effect (mostly `chars`). Remove them from section titles to use the default (`lines`).
