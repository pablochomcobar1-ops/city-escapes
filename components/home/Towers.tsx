"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/theme/useTheme";
import { gsap, useGSAP } from "@/lib/gsap";
import { CountUp } from "@/components/motion/CountUp";

const M = "/media";
const SIZES = "(min-width: 1440px) 1344px, 100vw";

/*
 * Day ⇄ night is a CSS state machine driven by html[data-theme]. Each layer's
 * transition timing differs per direction:
 *   → night: blue hour fades in (0.6 s), then the night photo wipes up from the
 *            bottom (1.6 s, starts at 0.5 s) so floors light up bottom-up.
 *   → day:   blue hour and night fade out together (0.8 s).
 * (A night loop video was tried and removed: the AI clip "boils", which reads as shaking.)
 * No JS decides what is visible, so the first paint is always right.
 */
const L_BLUE = [
  "opacity-100 [transition:opacity_600ms_var(--ease-cinema)]",
  "day:opacity-0 day:[transition:opacity_800ms_var(--ease-cinema)]",
].join(" ");
const L_NIGHT = [
  "[clip-path:inset(0_0_0_0)] opacity-100",
  "[transition:clip-path_1600ms_var(--ease-cinema)_500ms,opacity_0s]",
  "day:[clip-path:inset(100%_0_0_0)] day:opacity-0",
  "day:[transition:opacity_800ms_var(--ease-cinema),clip-path_0s_800ms]",
].join(" ");

export function Towers() {
  const { theme, toggle } = useTheme();
  const section = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);

  const isNight = theme === "night";

  // Reveal the stack only once every layer is decoded, so a night visitor never sees
  // the day photo flash underneath while the night photo is still decoding.
  const [decoded, setDecoded] = useState(0);
  const ready = decoded >= 3;
  const onLayerLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    (img.decode?.() ?? Promise.resolve())
      .catch(() => {})
      .finally(() => setDecoded((n) => n + 1));
  };
  useEffect(() => {
    const t = setTimeout(() => setDecoded(3), 3000); // safety net: never stay hidden
    return () => clearTimeout(t);
  }, []);

  // Slow settle: the photo eases from 1.15× to 1× as the section scrolls through.
  // gsap.matchMedia runs only when motion is allowed, and reverts itself if that changes.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (!frame.current) return;
        gsap.fromTo(
          frame.current.querySelector("[data-zoom]"),
          { scale: 1.15 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: frame.current, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: section },
  );

  return (
    <section ref={section} aria-labelledby="towers-title" className="py-section">
      <div className="mx-auto max-w-site px-gutter">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-end">
          <div>
            <p className="text-caption02 uppercase tracking-[0.18em] text-foreground-subtle">02 / The towers</p>
            <h2 id="towers-title" className="mt-5 font-display text-heading01 text-foreground">
              Two towers. <em className="text-brand">Twenty-four floors.</em>
            </h2>
          </div>
          <div className="md:pb-2">
            <p className="text-body01 text-foreground-secondary">
              Pale stone fins pull daylight down the facade. After dark the building glows from within,
              floor by floor, quiet and warm.
            </p>
            <button
              type="button"
              onClick={toggle}
              className="group mt-6 inline-flex items-center gap-3 text-caption01 font-medium tracking-[0.06em] text-foreground"
            >
              <span className="relative block size-2 rounded-full bg-brand">
                <span className="absolute inset-0 animate-ping rounded-full bg-brand opacity-60" />
              </span>
              {isNight ? "See it by day" : "See it at night"}
              <span aria-hidden="true" className="transition-transform duration-500 ease-luxe group-hover:translate-x-1">→</span>
            </button>
          </div>
        </div>

        <div
          ref={frame}
          data-testid="towers-frame"
          className="relative mt-14 aspect-[4/5] overflow-hidden bg-background-secondary sm:aspect-[16/10] lg:aspect-[16/9]"
        >
          <div
            data-zoom
            data-ready={ready}
            className={`absolute inset-0 will-change-transform transition-opacity duration-700 ease-cinema ${ready ? "opacity-100" : "opacity-0"}`}
          >
            <Image
              src={`${M}/images/towers-day.webp`}
              alt="City Escapes, two stone towers on SG Highway in morning light"
              fill
              sizes={SIZES}
              className="object-cover"
              data-layer="day"
              onLoad={onLayerLoad}
            />
            <Image
              src={`${M}/images/towers-bluehour.webp`}
              alt=""
              fill
              sizes={SIZES}
              className={`object-cover ${L_BLUE}`}
              data-layer="bluehour"
              onLoad={onLayerLoad}
            />
            <Image
              src={`${M}/images/towers-night.webp`}
              alt=""
              fill
              sizes={SIZES}
              className={`object-cover ${L_NIGHT}`}
              data-layer="night"
              onLoad={onLayerLoad}
            />
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/35 to-transparent" />
        </div>

        <dl className="mt-10 grid grid-cols-2 gap-y-8 border-t border-border pt-8 md:grid-cols-4">
          {[
            { k: "Towers", v: <CountUp to={2} /> },
            { k: "Floors", v: <CountUp to={24} /> },
            { k: "Residences", v: "3 & 4 BHK" },
            { k: "Address", v: "SG Highway" },
          ].map((f) => (
            <div key={f.k}>
              <dt className="text-caption02 uppercase tracking-[0.18em] text-foreground-subtle">{f.k}</dt>
              <dd className="mt-2 font-display text-heading01 text-foreground">{f.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
