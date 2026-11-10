# QA report: City Escapes

Tested: 10 Nov 2026 · by Pablo Chomcobar · production build (`npm run build && next start`)

## Coverage

| Check | Browsers / devices | Result |
|---|---|---|
| Automated browser tests | Chrome desktop, Pixel 7 (Chrome), Firefox desktop, iPhone 14 (Safari engine) | 220 passed, 11 skipped (3D tests run on desktop Chrome only) |
| Accessibility (axe, WCAG 2.1 AA) | All 5 pages × night + day × all 4 setups | 0 violations, after 1 fix |
| Lighthouse | All 4 pages × phone + desktop | Accessibility 100, Best Practices 100, SEO 100 everywhere |
| Visual review | Full-page screenshots of every page × theme × Chrome, iPhone, Firefox | 1 bug found and fixed |
| Horizontal overflow | Every page × theme × browser | None |
| Security headers / CSP | All pages, including the 3D tour | No violations (see `SECURITY.md`) |

## Bugs found and fixed

1. **Phones downloaded both hero videos (3.5 MB instead of 1.1 MB).** The first render can't know the screen shape or theme, so it guessed "landscape, night" and started that download before switching. Day-mode visitors also fetched the night clip first. The clip is now chosen only after hydration. Verified: every device and theme combination downloads exactly one clip. Phone home page weight went from 2.9 MB to 1.7 MB.
2. **Day mode: the "Two towers" photo stayed blank for ~3 seconds.** The frame waited for all three photos (day, blue hour, night), but by day the hidden night photo is never lazy-loaded, so only the 3-second safety timer revealed it. It now waits only for the photos the current theme shows, and stays visible when switching to night. Regression test added.
3. **Theme toggle: what it said didn't match what it showed.** It showed "Night" but announced "Switch to day", which breaks voice control ("click Night"). Its name is now "Night mode, switch to day". It already states the current mode, so the redundant pressed state was removed.
4. **No favicon.** Every page logged a 404, and tabs and phone home screens showed a blank icon. Added `icon.svg`, `favicon.ico` and a 180 px Apple home-screen icon from the CE monogram.

## Lighthouse (lab, after fixes)

| Page | Phone perf | Desktop perf | A11y | Best practices | SEO |
|---|---|---|---|---|---|
| Home | 75 | 98 | 100 | 100 | 100 |
| About | 85 | 99 | 100 | 100 | 100 |
| Contact | 78 | 99 | 100 | 100 | 100 |
| Tour | lab can't measure | lab can't measure | 100 | 100 | 100 |

Notes, honestly:
- **Phone performance 75–85** is mostly two things. First, Lighthouse simulates a mid-range phone with a 4× slower CPU, so React, GSAP and the WebGL background take ~0.4 s of main-thread time. Second, the hero text fades in by design, and Chrome doesn't count text as painted until it's visible, so the deliberate entrance pushes "Largest Contentful Paint" to 3–4 s. Starting the fade below 100% opacity would raise the score without making anything faster, so I didn't. Shortening the entrance delay is an option if you'd rather have the score.
- **Tour:** the lab machine has no GPU, so Chrome draws 3D in software on the CPU and every frame counts as "blocking". Those numbers say nothing about real phones; the earlier GPU check stands (49 draw calls, no memory growth).
- **Desktop 98–100** on every regular page. No layout shift anywhere (CLS 0).

## Cross-browser notes

- **Firefox (headless, no WebGL):** the tour correctly falls back to the four room photographs. Real Firefox with a graphics card gets the 3D tour.
- **iPhone (Safari engine):** all pages, both themes, the phone menu and the 3D tour with touch controls all work.
- The Linux build of Safari's engine pre-fills the empty date field with today's date in placeholder style. Real iOS Safari shows its own date picker, so this needs a check on a real iPhone.

## Not covered by this pass (needs a real device)

- Real iPhone and Android phones: touch feel of the tour, video autoplay in Low Power Mode (the poster shows instead, by design), notch and safe areas.
- Real GPUs on low-end Android: frame rate of the WebGL background and the tour.
- Screen readers in use (VoiceOver, TalkBack). The automated scan checks structure, not the experience.

## Test totals

- Unit: 72 passed.
- Browser: 220 passed, 11 skipped, 0 failed (Chrome desktop, Pixel 7, Firefox, iPhone 14).
- Two tests were made sturdier, not weaker: on this 2-core test machine, running four browsers at once made them time out. The residence link now waits for the page to hydrate before tapping, and the full booking flow gets extra time. Both pass repeatedly.

## How to re-run

```
npm run test          # unit tests
npm run test:e2e      # browser tests: Chrome, Pixel 7, Firefox, iPhone (run `npx playwright install` once)
```
