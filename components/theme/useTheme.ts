"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  applyTheme,
  currentTheme,
  DEFAULT_THEME,
  isTheme,
  THEME_EVENT,
  THEME_KEY,
  type Theme,
} from "@/lib/theme";

function subscribe(onChange: () => void) {
  const onStorage = (e: StorageEvent) => {
    // Another tab changed the theme: follow it.
    if (e.key === THEME_KEY && isTheme(e.newValue)) applyTheme(e.newValue);
  };
  window.addEventListener(THEME_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(THEME_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

export function useTheme(): { theme: Theme; setTheme: (t: Theme) => void; toggle: () => void } {
  const theme = useSyncExternalStore(subscribe, currentTheme, () => DEFAULT_THEME);
  const setTheme = useCallback((t: Theme) => applyTheme(t), []);
  const toggle = useCallback(
    () => applyTheme(currentTheme() === "night" ? "day" : "night"),
    [],
  );
  return { theme, setTheme, toggle };
}
