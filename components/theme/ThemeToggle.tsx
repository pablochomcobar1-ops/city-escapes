"use client";

import { useTheme } from "./useTheme";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const isNight = theme === "night";
  // The spoken name starts with the visible word, so voice control ("click Night") works.
  // It already says the current state, so there is no aria-pressed as well (that would say it twice).
  const label = isNight ? "Night mode, switch to day" : "Day mode, switch to night";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={[
        "group relative inline-flex h-10 items-center gap-2 rounded-pill",
        "border border-border px-3",
        "text-caption02 uppercase tracking-[0.18em] text-foreground-secondary",
        "transition-colors duration-300 hover:border-brand hover:text-foreground",
        className,
      ].join(" ")}
    >
      <span className="relative block size-4" aria-hidden="true">
        {/* Sun */}
        <svg
          viewBox="0 0 24 24"
          className={[
            "absolute inset-0 size-4 transition-all duration-700 ease-luxe",
            isNight ? "rotate-90 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100",
          ].join(" ")}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
        {/* Moon */}
        <svg
          viewBox="0 0 24 24"
          className={[
            "absolute inset-0 size-4 transition-all duration-700 ease-luxe",
            isNight ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-50 opacity-0",
          ].join(" ")}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        >
          <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
        </svg>
      </span>
      <span>{isNight ? "Night" : "Day"}</span>
    </button>
  );
}
