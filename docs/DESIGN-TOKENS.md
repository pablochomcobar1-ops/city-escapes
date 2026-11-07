# City Escapes — Design Tokens (Stage 2, locked)

**Direction:** A + C. Linen Noir's look (near-black, linen text, brass accent, editorial serif) + Golden Hour's signature moment (a pinned scroll through the rooms in which the light moves from dawn to dusk).

## Signature moments
1. **Hero:** full-bleed cinematic video, serif headline revealed word by word.
2. **Dawn → Dusk:** a pinned horizontal scroll through 4 rooms. Each room is a different time of day, and the background shader shifts colour with it.
3. **Walkthrough:** the 3D Residence 12A on `/tour`.

## Background treatment
Film grain over everything (very low opacity) + a slow warm light-leak gradient behind sections. During Dawn → Dusk the gradient follows the time of day. It's a single fragment shader, paused off-screen, with a static gradient under reduced motion.

## Extra components
React Bits Grain/Noise overlay · text scramble on nav hover · image-trail cursor over interiors · magnetic "Book a visit" button · custom cursor ring (desktop only).

## Fonts (both SIL Open Font License, free for commercial use)
- **Display:** Cormorant Garamond 400 + 400 italic (the italic is for emphasis words in brass)
- **Body/UI:** Manrope 400 / 500
Loaded through `next/font/google` (self-hosted at build, no runtime request to Google).

## Tailwind v4 tokens (go in `app/globals.css` at build time)
```css
@theme inline {
  /* Colour */
  --color-background: #0E0D0B;
  --color-background-secondary: #15130F;
  --color-background-tertiary: #1E1B16;
  --color-foreground: #EDE6DA;            /* linen: 15.6:1 on background */
  --color-foreground-secondary: #B9AF9F;  /* 9.1:1 */
  --color-foreground-subtle: #8A7F6F;     /* 4.6:1, captions only */
  --color-brand: #B8935A;                 /* brass: 6.6:1 */
  --color-brand-accent: #D49434;          /* golden hour amber */
  --color-border: rgb(237 230 218 / 0.12);
  --color-border-subtle: rgb(237 230 218 / 0.06);
  --color-focus-ring: #D49434;
  --color-error: #D9796A;

  /* Dawn → Dusk shader stops (also used for section tints) */
  --color-dawn: #3A3640;
  --color-dawn-glow: #C9A27A;
  --color-noon: #CDBFA6;
  --color-golden: #D49434;
  --color-dusk: #4A2C1A;
  --color-night: #10151D;

  /* Type (01 = largest) */
  --font-display: var(--font-cormorant), "Times New Roman", serif;
  --font-sans: var(--font-manrope), system-ui, sans-serif;
  --text-hero01: clamp(3.5rem, 9vw, 8.5rem);
  --text-hero02: clamp(2.75rem, 6vw, 5.5rem);
  --text-heading01: clamp(2.25rem, 4vw, 3.5rem);
  --text-heading02: 1.75rem;
  --text-heading03: 1.25rem;
  --text-body01: 1.0625rem;
  --text-body02: 0.9375rem;
  --text-caption01: 0.8125rem;
  --text-caption02: 0.6875rem;   /* uppercase, tracking 0.18em */

  /* Space */
  --spacing-section: clamp(5rem, 10vw, 9rem);
  --spacing-gutter: clamp(1.25rem, 4vw, 3rem);
  --container-site: 90rem;       /* 1440px */
  --container-prose: 42rem;

  /* Radius: editorial = square images, pill buttons */
  --radius-hair: 2px;
  --radius-pill: 999px;

  /* Motion */
  --ease-luxe: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-cinema: cubic-bezier(0.65, 0, 0.35, 1);
  --duration-fast: 200ms;
  --duration-base: 600ms;
  --duration-slow: 1200ms;
}
```

## Usage rules
- Headlines: `font-display`, sentence case, weight 400. One italic brass word per headline at most.
- Labels: `text-caption02 uppercase tracking-[0.18em] text-foreground-subtle`, numbered (01 / 08).
- One filled button per view (brass pill "Book a visit"); everything else is an outline or a text link.
- Images: square corners, masked reveal on enter, no drop shadows.
- Section rhythm: `py-section` everywhere; the container uses `px-gutter` only.
- Reduced motion: no word reveals or shader animation, fades only, video replaced by its poster.
