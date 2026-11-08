"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/** Counts from 0 to `to` when scrolled into view. Keeps leading zeros ("02"). Static under reduced motion. */
export function CountUp({ to, pad = 2 }: { to: number; pad?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const final = String(to).padStart(pad, "0");

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const obj = { v: 0 };
      el.textContent = "0".padStart(pad, "0");
      gsap.to(obj, {
        v: to,
        duration: 1.6,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
        onUpdate: () => {
          el.textContent = String(Math.round(obj.v)).padStart(pad, "0");
        },
      });
      return () => {
        el.textContent = final; // if motion gets turned off mid-way, show the real number
      };
    });
    return () => mm.revert();
  });

  // Server/no-JS render shows the final number.
  return (
    <span ref={ref} className="tabular-nums">
      {final}
    </span>
  );
}
