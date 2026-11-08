"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { ScrollTrigger } from "@/lib/gsap";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/** Lenis smooth scrolling. Off under reduced motion. Task 7 syncs it to GSAP's ticker. */
export function SmoothScroll() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const lenis = new Lenis({ lerp: 0.1, anchors: true, autoRaf: true });
    window.__lenis = lenis;
    // Keep GSAP ScrollTrigger in step with Lenis' eased scroll position.
    lenis.on("scroll", ScrollTrigger.update);
    return () => {
      lenis.off("scroll", ScrollTrigger.update);
      lenis.destroy();
      delete window.__lenis;
    };
  }, [reduced]);

  return null;
}
