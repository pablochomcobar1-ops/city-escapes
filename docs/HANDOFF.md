# City Escapes — Handoff (end of 7 Nov 2026)

## Where we are
- Stage 1 Brief ✅ · Stage 2 Look ✅ (Linen Noir + Golden Hour scroll, day = light linen theme) · Stage 3 Plan ✅
- Stage 4 Build: Tasks 1–12 ✅ (home, About, Contact, 3D tour, hardening). **Next: Stage 5, security checklist (ask the user first).**
- Task 12: CSP + HSTS + nosniff + DENY framing + Permissions-Policy in `next.config.ts`; styled 404; robots/sitemap from `lib/siteUrl.ts`; share image `app/opengraph-image.jpg` (made by a script from hero-night, 100 KB); `npm audit --omit=dev` = 0. Tests: 69 unit, 105 e2e passed (9 skipped).
- Plan: `docs/superpowers/plans/2026-11-07-city-escapes-site.md` (12 tasks)
- Media: `public/media` is done (15 photos WebP, 5 videos MP4 + posters, watermarks cropped)

## Decisions to remember
- WhatsApp number: placeholder in `.env.example`; real number goes in `.env.local` (never committed). Without a number the button opens WhatsApp's share picker (wa.me/?text=)
- Possession date on timeline: Dec 2028
- Still missing assets: `residence-4bhk` (uses hero-night-poster for now, see lib/home.ts), `about-architecture` (About uses towers-day for now)
- Day→night switch is a code wipe (night photo over blue hour, bottom-up); tower photos re-cropped to one shared frame
- Tests run on port 3005 with a fresh build each time; `npm run dev` stays on 3000

## Lessons so far
- Pointer lock: no drei PointerLockControls (its `selector` binds only to elements present at mount). requestWalk() in lib/tourStore locks the canvas from the button click; ignore >150px mouse spikes; first unadjustedMovement attempt may fail by design
- 3D tour is all code (Kenney/Poly Haven downloads blocked): procedural furniture, own material photos as textures, code sky + city with lit-window texture
- Never import three/drei in files the /tour route chunk includes (HUD, page): Next prefetches /tour from the home page. Progress is reported via lib/tourStore from inside the dynamic TourCanvas
- Glides are clock-timed (not frame-counted); walking keeps clamped dt for collision safety
- 3D e2e tests run serially on the desktop project (software WebGL ~1 fps; parallel 3D pages starve each other)
- Never put clip-path on an IntersectionObserver target: Chrome counts it, a zero-height clip never 'intersects'. Clip the children.
- CSS entrance animations use fill-mode `backwards`, not `both` (finished `both` animations keep GPU layers alive -> paint glitches)
- Grain is a 128px PNG tile, not a live SVG feTurbulence filter
- Screenshots: always test with motion ON too (reduced motion skips reveals and hides bugs)
- Use gsap.matchMedia for reduced motion (useGSAP dependencies do not revert old animations)
- Day hero uses a scrim only behind text (a full linen wash looked foggy)
- Towers night loop video removed: AI clips 'boil' (shimmer), which reads as shaking; night is the still photo
- Towers photo stack reveals only after all 3 layers decode (no day flash at night)
- Never call hooks inside `&&` (React #310 crash)
- Fixed panels inside the transformed header need a portal to `<body>`
- Kill `next-server` processes between runs on my side

- CSP: test with the `securitypolicyviolation` event plus console text; verified it catches a deliberately blocked script. `'unsafe-inline'` scripts stay because Next's static pages inline their payload (nonces would force dynamic rendering).
- Share images: keep under ~300 KB (WhatsApp), so JPEG not PNG.

## Workflow
Each task: a zip of the changed files → extract over the folder → `npm install` if package.json changed → `git add . && git commit -m "..." && git push`
