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
