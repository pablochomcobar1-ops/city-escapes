import { THEME_SCRIPT } from "@/lib/theme";

/** Sets data-theme on <html> before the first paint, so a saved "day" never flashes dark. */
export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />;
}
