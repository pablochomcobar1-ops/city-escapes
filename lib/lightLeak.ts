import type { Theme } from "./theme";

export type RGB = [number, number, number];
export type Palette = { bg: RGB; a: RGB; b: RGB; c: RGB };

export function hexToRgb(hex: string): RGB {
  const n = parseInt(hex.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

const P = (bg: string, a: string, b: string, c: string): Palette => ({
  bg: hexToRgb(bg),
  a: hexToRgb(a),
  b: hexToRgb(b),
  c: hexToRgb(c),
});

export const THEME_PALETTES: Record<Theme, Palette> = {
  night: P("#0e0d0b", "#b8935a", "#4a2c1a", "#10151d"),
  day: P("#f3ede3", "#e8d3b0", "#efe4d2", "#cdbfa6"),
};

/** Dawn → noon → golden hour → night, used while the Dawn → Dusk story is on screen. */
const STORY_KEYS: Palette[] = [
  P("#0e0d0b", "#c9a27a", "#3a3640", "#1a1d26"), // 6:40 am
  P("#0e0d0b", "#cdbfa6", "#8a7f6f", "#2a2620"), // noon
  P("#0e0d0b", "#d49434", "#4a2c1a", "#2a1c11"), // golden hour
  P("#0e0d0b", "#2c3a52", "#10151d", "#b8935a"), // night (warm lamp stays)
];

const lerp = (x: number, y: number, t: number) => x + (y - x) * t;
const mixRgb = (x: RGB, y: RGB, t: number): RGB => [
  lerp(x[0], y[0], t),
  lerp(x[1], y[1], t),
  lerp(x[2], y[2], t),
];

export function mixPalette(x: Palette, y: Palette, t: number): Palette {
  return { bg: mixRgb(x.bg, y.bg, t), a: mixRgb(x.a, y.a, t), b: mixRgb(x.b, y.b, t), c: mixRgb(x.c, y.c, t) };
}

/** Palette for story progress t in [0, 1]; values outside are clamped. */
export function storyPalette(t: number): Palette {
  const clamped = Math.min(1, Math.max(0, Number.isFinite(t) ? t : 0));
  const pos = clamped * (STORY_KEYS.length - 1);
  const i = Math.min(STORY_KEYS.length - 2, Math.floor(pos));
  return mixPalette(STORY_KEYS[i], STORY_KEYS[i + 1], pos - i);
}

/* Shared state the Dawn → Dusk section writes and the shader reads every frame. */
let storyTime: number | null = null;

/** Pass story progress 0–1 while the story is on screen, or null to return to the theme palette. */
export function setLightLeakTime(t: number | null): void {
  storyTime = t;
}
export function getLightLeakTime(): number | null {
  return storyTime;
}
