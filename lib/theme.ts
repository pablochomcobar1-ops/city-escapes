export type Theme = "day" | "night";

export const THEME_KEY = "ce-theme";
export const THEME_EVENT = "ce:theme";
export const DEFAULT_THEME: Theme = "night";

const THEME_COLOR: Record<Theme, string> = { night: "#0e0d0b", day: "#f3ede3" };

export function isTheme(value: unknown): value is Theme {
  return value === "day" || value === "night";
}

/** Reads the saved theme. Anything missing, invalid or unreadable falls back to night. */
export function readStoredTheme(storage?: Pick<Storage, "getItem"> | null): Theme {
  try {
    const s = storage === undefined ? window.localStorage : storage;
    const value = s?.getItem(THEME_KEY);
    return isTheme(value) ? value : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

/** The theme currently on <html>, which the inline head script set before first paint. */
export function currentTheme(): Theme {
  const value = document.documentElement.dataset.theme;
  return isTheme(value) ? value : DEFAULT_THEME;
}

/** Applies a theme everywhere: <html>, storage, browser UI colour, and a `ce:theme` event. */
export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  if (root.dataset.theme === theme) return;
  root.dataset.theme = theme;
  try {
    window.localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* private mode or storage blocked: the theme still applies for this visit */
  }
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", THEME_COLOR[theme]);
  window.dispatchEvent(new CustomEvent<Theme>(THEME_EVENT, { detail: theme }));
}

/** Runs in <head> before paint. Kept tiny and dependency-free on purpose. */
export const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");if(t==="day"||t==="night")document.documentElement.dataset.theme=t}catch(e){}})();`;
