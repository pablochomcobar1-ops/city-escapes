"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DURATION = 400;

/**
 * Scrambles its text on hover/focus of the closest link or button, then settles.
 * Screen readers always get the real text.
 */
export function TextScramble({ text }: { text: string }) {
  const [shown, setShown] = useState(text);
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const host = ref.current?.closest("a,button");
    if (!host || reduced) return;
    let raf = 0;
    const run = () => {
      cancelAnimationFrame(raf);
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / DURATION);
        const settled = Math.floor(p * text.length);
        setShown(
          text
            .split("")
            .map((c, i) =>
              i < settled || c === " " ? c : CHARS[(Math.random() * CHARS.length) | 0],
            )
            .join(""),
        );
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    host.addEventListener("pointerenter", run);
    host.addEventListener("focus", run);
    return () => {
      cancelAnimationFrame(raf);
      host.removeEventListener("pointerenter", run);
      host.removeEventListener("focus", run);
    };
  }, [text, reduced]);

  return (
    <span ref={ref} className="relative inline-block">
      <span className="sr-only">{text}</span>
      {/* invisible copy reserves width so the scramble never shifts layout */}
      <span aria-hidden="true" className="invisible">{text}</span>
      <span aria-hidden="true" className="absolute inset-0">{shown}</span>
    </span>
  );
}
