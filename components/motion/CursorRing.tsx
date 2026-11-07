"use client";

import { useEffect, useRef } from "react";
import { useFinePointer, useReducedMotion } from "@/lib/useReducedMotion";

/** A thin ring that trails the mouse and opens up over links and buttons. Mouse only. */
export function CursorRing() {
  const ref = useRef<HTMLDivElement>(null);
  // Call both hooks every render (never inside && — that changes the hook count).
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const enabled = fine && !reduced;

  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;
    let x = -100, y = -100, tx = -100, ty = -100, raf = 0;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      const hover = (e.target as Element | null)?.closest?.("a,button,[data-cursor]");
      el.dataset.hover = hover ? "true" : "false";
      el.style.opacity = "1";
    };
    const onLeave = () => (el.style.opacity = "0");
    const tick = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-hover="false"
      className={[
        "pointer-events-none fixed left-0 top-0 z-[100] size-8 rounded-full opacity-0",
        "border border-brand mix-blend-difference",
        "transition-[width,height,opacity,background-color] duration-300 ease-luxe",
        "data-[hover=true]:size-14 data-[hover=true]:bg-brand/15",
      ].join(" ")}
    />
  );
}
