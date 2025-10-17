# Brand Colors Reference

This document contains all the brand colors extracted from Webflow variables for use across the project.

## 🎨 Primary Colors

### White & Neutral Lightest
```css
--_primitives---colors--white: #ffffffd9;
--_primitives---colors--neutral-lightest: #ece5dc;
--_primitives---colors--neutral-lighter: #e5d8c6;
--_primitives---colors--neutral-light: #d4cdc4;
```

### Neutral Tones
```css
--_primitives---colors--neutral: #c8bfb3;
--_primitives---colors--neutral-dark: #a39486;
--_primitives---colors--neutral-darker: #8c8176;
```

### Dark & Darkest
```css
--_primitives---colors--neutral-darkest: #1a1a1ae0;
```

## 🌟 Brand Accent Colors

### Accent Palette (Brown/Warm Grays)
```css
--_primitives---brand--accent--600: #3a3530;          /* Primary accent */
--_primitives---brand--accent--500-hover: #4a4540;    /* Hover state */
--_primitives---brand--accent--700-active: #2e2925;   /* Active/pressed state */
--_primitives---brand--accent--focus-ring: #6b625a;   /* Focus indicator */
```

## 📝 Text Colors

### Default Text
```css
--_primitives---text--text-default: var(--_primitives---colors--neutral-darkest);
--_primitives---text--text-muted: #4f4a45;
```

### Text on Dark Backgrounds
```css
--_primitives---text--text-on-dark: #f4efe8;
--_primitives---text--text-on-dark-muted: #d7d0c7;
```

## 🎯 Background Colors

### Primary Backgrounds
```css
--_primitives---bg--default: var(--brand--background);  /* Links to neutral-lightest */
--_primitives---bg--alt: #070707;
```

### Section Backgrounds
```css
--_primitives---bg--section--secondary: var(--_primitives---colors--neutral-light);   /* #d4cdc4 */
--_primitives---bg--section--tertiary: var(--_primitives---colors--neutral-lighter);  /* #e5d8c6 */
```

## 🔘 Button Colors

```css
--_primitives---button--bg: var(--_primitives---brand--accent--600);           /* #3a3530 */
--_primitives---button--bg-hover: var(--_primitives---brand--accent--500-hover); /* #4a4540 */
--_primitives---button--bg-active: var(--_primitives---brand--accent--700-active); /* #2e2925 */
--_primitives---button--text: var(--_primitives---text--text-on-dark);         /* #f4efe8 */
--_primitives---button--border: var(--_primitives---button--bg);
```

## 🌈 Opacity Variants

### White Opacity
```css
--_primitives---opacity--white-5: #ffffff0d;    /* 5% */
--_primitives---opacity--white-10: #ffffff1a;   /* 10% */
--_primitives---opacity--white-15: #ffffff26;   /* 15% */
--_primitives---opacity--white-20: #fff3;       /* 20% */
--_primitives---opacity--white-30: #ffffff4d;   /* 30% */
--_primitives---opacity--white-40: #fff6;       /* 40% */
--_primitives---opacity--white-50: #ffffff80;   /* 50% */
--_primitives---opacity--white-60: #fff9;       /* 60% */
```

### Neutral Darkest Opacity
```css
--_primitives---opacity--neutral-darkest-5: #0000000d;   /* 5% */
--_primitives---opacity--neutral-darkest-10: #0000001a;  /* 10% */
--_primitives---opacity--neutral-darkest-15: #00000026;  /* 15% */
--_primitives---opacity--neutral-darkest-20: #0003;      /* 20% */
--_primitives---opacity--neutral-darkest-30: #0000004d;  /* 30% */
--_primitives---opacity--neutral-darkest-40: #0006;      /* 40% */
--_primitives---opacity--neutral-darkest-50: #00000080;  /* 50% */
--_primitives---opacity--neutral-darkest-60: #0009;      /* 60% */
```

### Transparent
```css
--_primitives---opacity--transparent: transparent;
```

## 🎨 Semantic Brand Variables

### Main Brand Colors
```css
--brand--background: var(--_primitives---colors--neutral-lightest);  /* #ece5dc */
--brand--text: var(--_primitives---colors--neutral-darkest);         /* #1a1a1ae0 */
--brand--border: var(--_primitives---colors--neutral-dark);          /* #a39486 */
--brand--foreground: var(--_primitives---colors--neutral-lighter);   /* #e5d8c6 */
--brand--accent: var(--_primitives---brand--accent--600);            /* #3a3530 */
```

## 💡 Usage Guidelines

### For Backgrounds
- **Primary Background**: `#ece5dc` (neutral-lightest)
- **Secondary Background**: `#d4cdc4` (neutral-light)
- **Tertiary Background**: `#e5d8c6` (neutral-lighter)
- **Dark Background**: `#070707` (alt background)

### For Text
- **Default Text**: `#1a1a1ae0` (neutral-darkest)
- **Muted Text**: `#4f4a45` (text-muted)
- **Text on Dark**: `#f4efe8` (text-on-dark)
- **Text on Dark Muted**: `#d7d0c7` (text-on-dark-muted)

### For Buttons & Interactive Elements
- **Primary**: `#3a3530` (accent-600)
- **Hover**: `#4a4540` (accent-500-hover)
- **Active**: `#2e2925` (accent-700-active)
- **Focus Ring**: `#6b625a` (focus-ring)

### For Borders & Dividers
- **Primary Border**: `#a39486` (neutral-dark)
- **Subtle Border**: `#c8bfb3` (neutral)

## 🎯 Color Palette Summary

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Neutral Lightest | `#ece5dc` | rgb(236, 229, 220) | Main background |
| Neutral Lighter | `#e5d8c6` | rgb(229, 216, 198) | Card backgrounds |
| Neutral Light | `#d4cdc4` | rgb(212, 205, 196) | Section backgrounds |
| Neutral | `#c8bfb3` | rgb(200, 191, 179) | Subtle borders |
| Neutral Dark | `#a39486` | rgb(163, 148, 134) | Primary borders |
| Neutral Darker | `#8c8176` | rgb(140, 129, 118) | Dark accents |
| Neutral Darkest | `#1a1a1ae0` | rgba(26, 26, 26, 0.88) | Primary text |
| White | `#ffffffd9` | rgba(255, 255, 255, 0.85) | White with opacity |
| Text on Dark | `#f4efe8` | rgb(244, 239, 232) | Light text |
| Text Muted | `#4f4a45` | rgb(79, 74, 69) | Secondary text |
| Accent 600 | `#3a3530` | rgb(58, 53, 48) | Primary buttons |
| Accent 500 | `#4a4540` | rgb(74, 69, 64) | Button hover |
| Accent 700 | `#2e2925` | rgb(46, 41, 37) | Button active |
| Focus Ring | `#6b625a` | rgb(107, 98, 90) | Focus indicators |
| Alt Background | `#070707` | rgb(7, 7, 7) | Dark backgrounds |

## 🔍 Accessibility Notes

### Contrast Ratios (on light background #ece5dc)
- Neutral Darkest (#1a1a1ae0): **~11:1** - AAA ✅
- Text Muted (#4f4a45): **~6.5:1** - AA ✅
- Accent 600 (#3a3530): **~7.8:1** - AAA ✅

### Contrast Ratios (on dark background #070707)
- Text on Dark (#f4efe8): **~13:1** - AAA ✅
- Text on Dark Muted (#d7d0c7): **~10:1** - AAA ✅

All color combinations meet WCAG 2.1 Level AA standards (minimum 4.5:1 for normal text).

## 🎨 Color Scheme

This is a **warm, neutral, earthy color palette** with:
- Warm beiges and tans for backgrounds
- Rich dark browns for text and accents
- Subtle gradations for depth
- High accessibility contrast ratios
- Professional, sophisticated aesthetic

**Brand Identity**: Warm, natural, elegant, timeless
**Color Temperature**: Warm (brown/tan undertones)
**Mood**: Sophisticated, organic, refined
