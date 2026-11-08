import type { Theme } from "./theme";

const V = "/media/video";

export type HeroSource = { mp4: string; poster: string };

/**
 * Which hero clip to play. There is no vertical day clip, so day on a phone uses the
 * landscape day clip with object-fit: cover.
 */
export function heroSources(theme: Theme, portrait: boolean): HeroSource {
  if (theme === "night") {
    return portrait
      ? { mp4: `${V}/hero-night-vertical.mp4`, poster: `${V}/hero-night-vertical-poster.webp` }
      : { mp4: `${V}/hero-night.mp4`, poster: `${V}/hero-night-poster.webp` };
  }
  return { mp4: `${V}/hero-day.mp4`, poster: `${V}/hero-day-poster.webp` };
}

export const PORTRAIT_QUERY = "(orientation: portrait) and (max-width: 767px)";

export type StoryPanel = {
  time: string;
  room: string;
  line: string;
  body: string;
  img: string;
  alt: string;
};

/** Dawn → Dusk: one day in Residence 12A, in four rooms. */
export const STORY: StoryPanel[] = [
  {
    time: "6:40 am",
    room: "Living room",
    line: "Mornings, unhurried.",
    body: "First light finds the oak floor before the city wakes. Double-height glass, mist on the skyline, a cup going cold on the stone.",
    img: "/media/images/story-living-dawn.webp",
    alt: "Double-height living room at dawn, pale light on an oak floor, misty skyline through tall windows",
  },
  {
    time: "12:10 pm",
    room: "Kitchen",
    line: "Light, from three sides.",
    body: "A long travertine island under soft noon light. Dark oak, a brass tap, and windows that keep the day bright without the glare.",
    img: "/media/images/story-kitchen-noon.webp",
    alt: "Kitchen at noon with a travertine island, dark oak cabinets and a brass tap",
  },
  {
    time: "5:50 pm",
    room: "Master bedroom",
    line: "The day, slowing down.",
    body: "Low amber sun across linen and stone. The window shadows grow long, and the room goes quiet with them.",
    img: "/media/images/story-bedroom-golden.webp",
    alt: "Master bedroom at golden hour, amber light and long window shadows across linen bedding",
  },
  {
    time: "9:00 pm",
    room: "Balcony",
    line: "The city stays outside.",
    body: "Two lounge chairs, a lantern, and Ahmedabad spread out below. Close enough to feel it, far enough to rest.",
    img: "/media/images/story-balcony-night.webp",
    alt: "Balcony at night with two lounge chairs and a lantern above the city lights",
  },
];
