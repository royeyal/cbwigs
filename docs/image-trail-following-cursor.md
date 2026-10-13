# Image Trail

Images pop up and fade along the mouse path while the cursor moves over a section. Desktop only.

| | |
|---|---|
| Source | `src/js/image-trail-following-cursor.js`, `src/styles/image-trail-following-cursor.css` |
| Loaded by | `main.js` → `initImageTrail({ minWidth: 992, moveDistance: 15, stopDuration: 350, trailLength: 8 })` |
| Used on | `/my-original` (and `/en`) |
| Depends on | GSAP (+ ScrollTrigger to pause when off-screen) (Webflow globals) |
| Demo | `src/image-trail-following-cursor.html` |

## Webflow setup

One trail per page (the script uses `document.querySelector`).

```
section.trail-section [data-trail="wrapper"]
└── .trail-wrap (Collection List)
    └── .trail-list (Collection Item) ×n
        └── .trail-item [data-trail="item"]
            └── img.trail-item__img
```

## Options

Passed from `main.js`:

| Option | Site value | Meaning |
|---|---|---|
| `minWidth` | 992 | Below this viewport width the effect is off |
| `moveDistance` | 15 | A new image appears every `innerWidth / moveDistance` px of movement |
| `stopDuration` | 350 | ms after which an image fades out |
| `trailLength` | 8 | How many images stay visible at once |

## Behavior

The mouse listener only runs while the section is in view (ScrollTrigger enter/leave) and above `minWidth`; resizing across the breakpoint starts or stops it. Without ScrollTrigger the trail never starts.
