# City Escapes — Asset Guide (Gemini + Google Flow)

You make the raw images and videos. Send them back to me in chat, and I'll compress them (AVIF/WebP, MP4/WebM, poster frames) and place them in the project. **Don't put raw files in the repo**: they're huge.

## Before you start
1. Make a folder on your PC: `city-escapes-assets-raw/`
2. Name every file exactly as listed below (e.g. `04-story-living-dawn.png`).
3. **Gemini (images):** use the image model in Gemini (Pro). Generate, pick the best of the variations, download the full-size PNG.
4. **Google Flow (videos):** use Text to Video (or Frames to Video when a start image is listed). Choose 16:9 and the highest quality your plan allows, then download the MP4.
5. If a result shows text, logos, people's faces or a visible watermark, regenerate it. Never upload someone else's photos.

## The style anchor (paste this at the START of every prompt)
> Architectural interior photography for a luxury residence in India, shot on a full-frame camera with a 35mm lens, natural light only, deep shadows, warm linen, oak, travertine and brushed brass materials, minimal furniture, quiet and expensive, muted near-black and warm beige palette, no people, no text, no logos, photorealistic, editorial, 8k detail.

Using the same anchor every time keeps all images looking like one shoot.

---

## A. Hero video (Flow) — the most important asset
**File:** `01-hero.mp4` · 16:9 · 8 s
1. First make a still in Gemini, `01-hero-start.png` (16:9):
   > [style anchor] A double-height living room on the 20th floor at dusk, floor-to-ceiling windows, the city lights of Ahmedabad softly glowing far below, warm lamp light inside, a low linen sofa, oak floor, travertine wall, calm and dark, wide shot from the entrance.
2. In Flow, use **Frames to Video** with that image as the first frame:
   > Very slow cinematic dolly forward toward the windows, smooth and steady, city lights twinkle gently, a sheer curtain moves slightly in the breeze, lamp light stays warm, no camera shake, no people, no text. Calm, luxurious, 24fps film look.
3. Make a second version for phones, `01-hero-vertical.mp4`, at **9:16** with the same prompt (and a 9:16 start image).

## B. Tower exterior (Gemini)
**File:** `02-towers.png` · 16:9
> [style anchor] Exterior of two slender modern residential towers, 24 floors each, at blue hour, warm lights glowing in some windows, deep vertical fins in pale stone, landscaped podium with palm and neem trees, wide angle from street level looking up, dark moody sky with a soft amber horizon, Ahmedabad.

Optional video, `02-towers-flyaround.mp4` (Flow, Frames to Video from `02-towers.png`):
> Slow aerial orbit around the two towers at blue hour, drone shot, smooth, windows glowing, no text.

## C. Dawn → Dusk story (Gemini): 4 rooms, 4 times of day
All 16:9. Same flat, so after the first one, start a new prompt with "Same apartment, same materials as before".
| File | Prompt (after the style anchor) |
|---|---|
| `04-story-living-dawn.png` | Living room at dawn, 6:40 am, cool blue-grey light with the first pale gold sun on the oak floor, mist over the distant city through tall windows, a ceramic cup on a stone side table. |
| `05-story-kitchen-noon.png` | Kitchen at noon, bright soft daylight, a long travertine island, matte dark oak cabinets, brass tap, a bowl of lemons, clean and airy. |
| `06-story-bedroom-golden.png` | Master bedroom at golden hour, low amber sun streaming in and casting long window shadows across linen bedding, warm and still. |
| `07-story-balcony-night.png` | Balcony at night, 9 pm, a wide terrace with two lounge chairs and a low lantern, city lights of Ahmedabad spread below, deep navy sky, warm glow from the room behind. |

## D. Residences cards (Gemini) · 4:5
| File | Prompt |
|---|---|
| `08-residence-3bhk.png` | [style anchor] Open living and dining area of a 3 bedroom apartment, round travertine dining table, soft afternoon light, view to a balcony. |
| `09-residence-4bhk.png` | [style anchor] Grand living room of a 4 bedroom penthouse-style apartment, double-height ceiling, a sculptural brass pendant, large windows, evening light. |

## E. Materials close-ups (Gemini) · 1:1
| File | Prompt |
|---|---|
| `10-material-oak.png` | [style anchor] Extreme close-up of wide-plank smoked oak flooring, raking side light showing the grain. |
| `11-material-travertine.png` | [style anchor] Extreme close-up of honed travertine stone with natural pores, soft light. |
| `12-material-brass.png` | [style anchor] Close-up of a brushed brass tap and lever against dark stone, warm reflection. |

## F. About and Contact (Gemini) · 16:9
| File | Prompt |
|---|---|
| `13-about-architecture.png` | [style anchor] Abstract architectural detail: light and shadow falling across pale stone fins on a tower facade at golden hour, minimal. |
| `14-about-construction.png` | Construction site of a modern residential tower at dawn, concrete frame rising, a crane against a soft amber sky, clean and orderly, documentary photography, no people's faces, no text, no logos. |
| `15-contact-lobby.png` | [style anchor] A quiet double-height residential lobby at night, a travertine reception desk, warm wall washers, a single olive tree, dark and welcoming. |

## G. 3D walkthrough
Nothing to generate. I build the flat in code, with free CC0 furniture models and HDRI lighting.

## H. Logo
Nothing to generate. I'll set the wordmark "CITY ESCAPES" in Cormorant Garamond and draw a simple monogram in SVG, so it's sharp at every size and nothing is AI-traced.

---

## Checklist
- [ ] 01-hero-start.png · 01-hero.mp4 · 01-hero-vertical.mp4
- [ ] 02-towers.png (+ optional 02-towers-flyaround.mp4)
- [ ] 04 · 05 · 06 · 07 story images
- [ ] 08 · 09 residences
- [ ] 10 · 11 · 12 materials
- [ ] 13 · 14 · 15 about and contact

You don't need everything before we start building: placeholders hold each spot until your file arrives. The hero video and the 4 story images matter most.
