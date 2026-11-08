# City Escapes — Handoff (end of 7 Nov 2026)

## Where we are
- Stage 1 Brief ✅ · Stage 2 Look ✅ (Linen Noir + Golden Hour scroll, day = light linen theme) · Stage 3 Plan ✅
- Stage 4 Build: Tasks 1–6 ✅ (scaffold, theme, layout shell, light-leak shader, hero, towers day/night). **Next: Task 7, Dawn → Dusk pinned story.**
- Plan: `docs/superpowers/plans/2026-11-07-city-escapes-site.md` (12 tasks)
- Media: `public/media` is done (15 photos WebP, 5 videos MP4 + posters, watermarks cropped)

## Decisions to remember
- WhatsApp number: placeholder in `.env.example`; real number goes in `.env.local` (never committed)
- Possession date on timeline: Dec 2028
- Still missing assets: `residence-4bhk`, `about-architecture` (placeholders until supplied)
- Day→night switch is a code wipe (night photo over blue hour, bottom-up); tower photos re-cropped to one shared frame
- Tests run on port 3005 with a fresh build each time; `npm run dev` stays on 3000

## Lessons so far
- Use gsap.matchMedia for reduced motion (useGSAP dependencies do not revert old animations)
- Day hero uses a scrim only behind text (a full linen wash looked foggy)
- Towers night loop video removed: AI clips 'boil' (shimmer), which reads as shaking; night is the still photo
- Towers photo stack reveals only after all 3 layers decode (no day flash at night)
- Never call hooks inside `&&` (React #310 crash)
- Fixed panels inside the transformed header need a portal to `<body>`
- Kill `next-server` processes between runs on my side

## Workflow
Each task: a zip of the changed files → extract over the folder → `npm install` if package.json changed → `git add . && git commit -m "..." && git push`
