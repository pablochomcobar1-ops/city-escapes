"use client";

import { useEffect, useRef } from "react";

/**
 * Reveals children when they scroll into view. `variant="image"` unmasks from the
 * bottom; `"text"` rises 24px and fades. The hidden start state only applies when
 * scripting is on and motion is allowed (see globals.css), so content is never lost.
 */
export function Reveal({
  children,
  variant = "text",
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  variant?: "text" | "image";
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.dataset.shown = "";
      el.dataset.done = "";
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.dataset.shown = "";
          io.disconnect();
          // Drop the image clip mask once the reveal has finished.
          if (variant === "image") window.setTimeout(() => (el.dataset.done = ""), 1300 + delay);
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [variant, delay]);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      data-reveal={variant}
      className={className}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
